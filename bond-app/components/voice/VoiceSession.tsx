"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Pause, Play, Square, Bookmark, Loader2 } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface TranscriptLine {
  id: string;
  speaker: "you" | "partner";
  text: string;
  tone: string;
  timestamp: number;
  pattern?: string;
}

const TONE_COLORS: Record<string, string> = {
  calm:          "bg-green-50 text-green-700",
  defensive:     "bg-amber-50 text-amber-700",
  vulnerable:    "bg-purple-50 text-purple-700",
  "opening up":  "bg-teal-50 text-teal-700",
  tense:         "bg-red-50 text-red-600",
  warm:          "bg-rose-50 text-rose-600",
};

const DEMO_LINES: TranscriptLine[] = [
  { id: "1", speaker: "you",     text: "I wanted to talk about last week. I felt like we weren't really connecting.", tone: "calm",       timestamp: 62  },
  { id: "2", speaker: "partner", text: "I don't know what you mean. I thought things were fine — I was just tired.", tone: "defensive",  timestamp: 124, pattern: "Defensiveness" },
  { id: "3", speaker: "you",     text: "When you go quiet I wonder if you're pulling away, and it scares me.",        tone: "vulnerable", timestamp: 186 },
  { id: "4", speaker: "partner", text: "I didn't realise that. I get overwhelmed and don't always know how to say it.", tone: "opening up", timestamp: 249 },
];

export default function VoiceSession() {
  const [status, setStatus]         = useState<"idle" | "recording" | "paused" | "ended">("idle");
  const [elapsed, setElapsed]       = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(32).fill(8));
  const [analyzing, setAnalyzing]   = useState(false);
  const [insight, setInsight]       = useState("");
  const [moments, setMoments]       = useState<Array<{ type: string; description: string }>>([]);
  const [aiPatterns, setAiPatterns] = useState<string[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const waveRef     = useRef<ReturnType<typeof setInterval>>();
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const supabase    = createClient();

  const startWave = useCallback(() => {
    waveRef.current = setInterval(() => {
      setWaveHeights(Array(32).fill(0).map(() => 6 + Math.random() * 46));
    }, 100);
  }, []);

  function clearAllTimers() {
    clearInterval(intervalRef.current);
    clearInterval(waveRef.current);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function start() {
    setStatus("recording");
    setElapsed(0);
    setTranscript([]);
    setInsight(""); setMoments([]); setAiPatterns([]);
    startWave();
    intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    DEMO_LINES.forEach((line) => {
      const t = setTimeout(() => setTranscript((prev) => [...prev, line]), line.timestamp * 70);
      timeoutsRef.current.push(t);
    });
  }

  function pause() {
    setStatus("paused");
    clearInterval(intervalRef.current);
    clearInterval(waveRef.current);
    setWaveHeights(Array(32).fill(8));
  }

  function resume() {
    setStatus("recording");
    startWave();
    intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  }

  async function end() {
    setStatus("ended");
    clearAllTimers();
    setWaveHeights(Array(32).fill(8));
    setAnalyzing(true);
    const fullText = transcript
      .map((l) => `${l.speaker === "you" ? "You" : "Partner"}: ${l.text}`)
      .join("\n");
    try {
      const res = await fetch("/api/voice-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: fullText }),
      });
      const data = await res.json();
      setInsight(data.suggestion ?? "");
      setMoments(data.moments ?? []);
      setAiPatterns(data.patterns ?? []);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("voice_sessions").insert({
          user_id: user.id, duration_seconds: elapsed,
          transcript, ai_insight: data.suggestion ?? "",
        });
      }
    } catch {
      setInsight("Focus on slowing down and reflecting before responding.");
    }
    setAnalyzing(false);
  }

  useEffect(() => () => clearAllTimers(), []);

  const toneMetrics = [
    { label: "Calm",       you: 72, partner: 45, color: "#6aaa80" },
    { label: "Tension",    you: 18, partner: 35, color: "#e8697a" },
    { label: "Vulnerable", you: 58, partner: 22, color: "#9b7fd4" },
    { label: "Opening up", you: 30, partner: 40, color: "#3aabaa" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
      {/* Main panel */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Status / waveform */}
        <div className="bg-white border border-rose-50 rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0",
              status === "recording" ? "bg-red-500 animate-pulse" :
              status === "paused"    ? "bg-amber-400" :
              status === "ended"     ? "bg-green-500" : "bg-gray-300")} />
            <div className="flex-1">
              <p className="font-medium text-sm text-ink">
                {status === "idle"      ? "Ready to record" :
                 status === "recording" ? "Recording in progress" :
                 status === "paused"    ? "Session paused" : "Session complete"}
              </p>
              <p className="text-xs text-ink-soft">{status === "idle" ? "Start when ready" : `Duration: ${formatTime(elapsed)}`}</p>
            </div>
            <span className="font-serif text-2xl text-ink-soft">{formatTime(elapsed)}</span>
          </div>

          <div className="flex items-center gap-0.5 h-14" aria-hidden="true">
            {waveHeights.map((h, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all duration-100"
                style={{ height: h, background: i % 2 === 0 ? "#e8697a" : "#c8b4d8", opacity: status === "recording" ? 1 : 0.3 }} />
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            {status === "idle" && (
              <button onClick={start} className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-medium transition-colors">
                <Mic size={15} /> Start session
              </button>
            )}
            {status === "recording" && (
              <>
                <button onClick={pause} className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-full text-sm font-medium transition-colors">
                  <Pause size={15} /> Pause
                </button>
                <button onClick={end} className="flex items-center gap-2 px-5 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full text-sm transition-colors">
                  <Square size={13} /> End
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-ink-soft hover:bg-gray-50 rounded-full text-sm transition-colors ml-auto">
                  <Bookmark size={13} /> Mark
                </button>
              </>
            )}
            {status === "paused" && (
              <>
                <button onClick={resume} className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-medium transition-colors">
                  <Play size={15} /> Resume
                </button>
                <button onClick={end} className="flex items-center gap-2 px-5 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-full text-sm transition-colors">
                  <Square size={13} /> End
                </button>
              </>
            )}
            {status === "ended" && (
              <button onClick={() => { setStatus("idle"); setElapsed(0); setTranscript([]); }}
                className="flex items-center gap-2 px-6 py-2.5 bg-ink hover:bg-ink-mid text-white rounded-full text-sm font-medium transition-colors">
                New session
              </button>
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white border border-rose-50 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-rose-50 flex items-center gap-2">
            <h2 className="font-medium text-sm text-ink">Live transcript</h2>
            {status === "recording" && <span className="text-xs text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Live</span>}
          </div>
          <div className="p-4 flex flex-col gap-3 min-h-40 max-h-72 overflow-y-auto scrollbar-hide">
            {transcript.length === 0
              ? <p className="text-sm text-ink-soft text-center py-6">{status === "idle" ? "Transcript will appear here." : "Listening…"}</p>
              : transcript.map((line) => (
                <div key={line.id} className={cn("flex gap-2.5", line.speaker === "partner" ? "flex-row-reverse" : "")}>
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-1",
                    line.speaker === "you" ? "bg-rose-100 text-rose-600" : "bg-purple-100 text-purple-600")}>
                    {line.speaker === "you" ? "Y" : "P"}
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    {line.pattern && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium w-fit">{line.pattern}</span>}
                    <div className={cn("px-3.5 py-2.5 rounded-xl text-sm leading-relaxed",
                      line.speaker === "you" ? "bg-gray-50 border border-gray-100 text-ink" : "bg-ink text-white/90")}>
                      {line.text}
                    </div>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full w-fit font-medium", TONE_COLORS[line.tone] ?? "bg-gray-100 text-gray-600")}>{line.tone}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Post-session analysis */}
        {status === "ended" && (
          <div className={cn("bg-white border border-rose-50 rounded-2xl p-5", analyzing && "animate-pulse")}>
            {analyzing ? (
              <div className="flex items-center gap-3 text-sm text-ink-soft">
                <Loader2 size={16} className="animate-spin text-rose-400" /> Analysing session…
              </div>
            ) : (
              <>
                <h2 className="font-medium text-sm text-ink mb-3">Session summary</h2>
                {aiPatterns.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {aiPatterns.map((p) => <span key={p} className="text-xs px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-medium">{p}</span>)}
                  </div>
                )}
                {moments.map((m, i) => (
                  <div key={i} className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm shrink-0">{m.type === "repair" ? "❤️" : "⚠️"}</span>
                    <p className="text-sm text-ink-soft leading-relaxed">{m.description}</p>
                  </div>
                ))}
                {insight && (
                  <div className="mt-3 p-4 bg-rose-50 border border-rose-100 rounded-xl">
                    <p className="text-xs text-rose-500 font-medium mb-1">✨ AI suggestion</p>
                    <p className="text-sm text-rose-700 italic font-serif leading-relaxed">"{insight}"</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        {["you", "partner"].map((who) => (
          <div key={who} className="bg-white border border-rose-50 rounded-2xl p-4">
            <h3 className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-3">Tone — {who}</h3>
            <div className="flex flex-col gap-2.5">
              {toneMetrics.map(({ label, you, partner, color }) => {
                const val = who === "you" ? you : partner;
                return (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-xs text-ink-soft min-w-[70px]">{label}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: status !== "idle" ? `${val}%` : "0%", background: color }} />
                    </div>
                    <span className="text-xs font-medium text-ink w-8 text-right">{status !== "idle" ? `${val}%` : "—"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-white border border-rose-50 rounded-2xl p-4">
          <h3 className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-3">Key moments</h3>
          {status === "idle"
            ? <p className="text-xs text-ink-soft">Moments appear during recording.</p>
            : [
                { e: "❤️", t: "Repair attempt — vulnerability detected." },
                { e: "⚠️", t: "Defensiveness spike — slow down." },
                { e: "💡", t: "Opening up — partner disclosed feelings." },
              ].map((m, i) => (
                <div key={i} className="flex gap-2.5 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm shrink-0">{m.e}</span>
                  <p className="text-xs text-ink-soft leading-relaxed">{m.t}</p>
                </div>
              ))}
        </div>

        {status === "recording" && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
            <p className="text-xs font-medium text-rose-500 mb-2">✨ Live suggestion</p>
            <p className="text-sm text-rose-700 font-serif italic leading-relaxed">
              "Reflect what you heard before asking anything new."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
