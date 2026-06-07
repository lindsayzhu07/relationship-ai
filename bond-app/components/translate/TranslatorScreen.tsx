"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Send, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranslateResult {
  translation: string;
  patterns: string[];
  coreNeed: string;
  partnerHears: string;
}

const PATTERN_COLORS: Record<string, string> = {
  "Criticism":       "bg-red-50 text-red-600 border-red-100",
  "Blame language":  "bg-amber-50 text-amber-700 border-amber-100",
  "Defensiveness":   "bg-orange-50 text-orange-600 border-orange-100",
  "Stonewalling":    "bg-gray-100 text-gray-600 border-gray-200",
  "Generalization":  "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Contempt":        "bg-red-100 text-red-700 border-red-200",
  "Vulnerability":   "bg-purple-50 text-purple-700 border-purple-100",
};

const EMOTION_METERS = [
  { label: "Frustration", color: "#e8697a" },
  { label: "Loneliness",  color: "#9b7fd4" },
  { label: "Unheard",     color: "#e8a030" },
  { label: "Fear",        color: "#d85a30" },
];

export default function TranslatorScreen() {
  const [raw, setRaw]             = useState("Why don't you ever listen to me? You always make everything about yourself.");
  const [result, setResult]       = useState<TranslateResult | null>(null);
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [sent, setSent]           = useState(false);
  const [editText, setEditText]   = useState("");
  const [editing, setEditing]     = useState(false);

  async function translate() {
    if (!raw.trim()) return;
    setLoading(true); setResult(null); setSent(false); setEditing(false);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: raw }),
      });
      const data: TranslateResult = await res.json();
      setResult(data);
      setEditText(data.translation);
    } catch {
      setResult({
        translation: "I'm feeling overwhelmed and I need to feel heard right now. Can we talk?",
        patterns: ["Criticism", "Generalization"],
        coreNeed: "To feel listened to and understood.",
        partnerHears: "You're a bad partner and this is your fault.",
      });
      setEditText("I'm feeling overwhelmed and I need to feel heard right now. Can we talk?");
    }
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(editing ? editText : result?.translation ?? "");
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  const intensities = result
    ? [0.82, 0.71, 0.88, 0.44]
    : [0, 0, 0, 0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
      {/* Left — input */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-2">What you want to say</p>
          <div className={cn("border rounded-2xl overflow-hidden transition-colors", "border-gray-200 focus-within:border-rose-300")}>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="Type what's on your mind — raw and unfiltered…"
              rows={5}
              className="w-full px-4 py-4 text-sm text-ink placeholder-ink-soft/60 resize-none outline-none leading-relaxed"
            />
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2">
              <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-ink-soft hover:bg-gray-50 transition-colors">
                🎙️ Voice
              </button>
              <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-ink-soft hover:bg-gray-50 transition-colors">
                📓 Paste journal
              </button>
              <button
                onClick={translate}
                disabled={loading || !raw.trim()}
                className="ml-auto flex items-center gap-2 px-5 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white rounded-full text-xs font-medium transition-colors"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : "✨"}
                {loading ? "Translating…" : "Translate now"}
              </button>
            </div>
          </div>
        </div>

        {/* Patterns detected */}
        {result && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-3">Patterns detected</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {result.patterns.map((p) => (
                <span key={p} className={cn("text-xs px-3 py-1 rounded-full font-medium border", PATTERN_COLORS[p] ?? "bg-gray-100 text-gray-600 border-gray-200")}>{p}</span>
              ))}
            </div>
            <p className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-2">Emotion intensity</p>
            <div className="flex flex-col gap-2">
              {EMOTION_METERS.map(({ label, color }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-ink-soft min-w-[80px]">{label}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.round(intensities[i] * 100)}%`, background: color }} />
                  </div>
                  <span className="text-xs font-medium text-ink w-8 text-right">{Math.round(intensities[i] * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What partner hears */}
        {result && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-medium text-amber-700 mb-2">⚠️ What your partner may hear</p>
            <p className="text-sm text-amber-800 font-serif italic leading-relaxed">"{result.partnerHears}"</p>
          </div>
        )}
      </div>

      {/* Right — output */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-2">Original message</p>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <p className="text-sm text-ink-soft font-serif italic leading-relaxed">
              {raw || "Your message will appear here."}
            </p>
          </div>
        </div>

        {result && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <div className="flex flex-col items-center gap-1">
                <ArrowDown size={14} className="text-rose-400" />
                <span className="text-[10px] text-ink-soft uppercase tracking-wider">emotional translation</span>
              </div>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Translated card */}
            <div className="border border-green-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-center gap-2">
                <span className="text-xs font-medium text-green-700 uppercase tracking-widest">✨ Translated message</span>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Safe to send</span>
              </div>
              <div className="p-4 bg-green-50/40">
                {editing ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full text-sm text-green-900 font-serif italic leading-relaxed bg-transparent border-b border-dashed border-green-300 outline-none resize-none"
                  />
                ) : (
                  <p className="text-sm text-green-900 font-serif italic leading-relaxed">"{result.translation}"</p>
                )}
              </div>
              <div className="px-4 py-3 border-t border-green-100 flex items-center gap-2">
                {sent
                  ? <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><Check size={14} /> Sent to Jamie</span>
                  : <button onClick={() => setSent(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-medium transition-colors">
                      <Send size={12} /> Send to Jamie ↗
                    </button>}
                <button onClick={() => setEditing(!editing)} className="px-3 py-2 border border-green-200 text-green-700 rounded-full text-xs hover:bg-green-50 transition-colors">
                  ✏️ {editing ? "Done" : "Edit"}
                </button>
                <button onClick={copy} className="px-3 py-2 border border-green-200 text-green-700 rounded-full text-xs hover:bg-green-50 transition-colors ml-auto flex items-center gap-1">
                  {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
            </div>

            {/* Core need */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-ink-soft mb-2">Core need</p>
                <p className="text-sm text-ink leading-relaxed">{result.coreNeed}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-ink-soft mb-2">Alternative phrasing</p>
                <p className="text-sm text-ink leading-relaxed font-serif italic">
                  "I've been feeling invisible and I need to feel that I matter to you."
                </p>
              </div>
            </div>
          </>
        )}

        {!result && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-2xl mb-4">✨</div>
            <p className="text-sm text-ink-soft max-w-xs leading-relaxed">
              Type your message on the left and tap <strong>Translate now</strong> to see the emotional translation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
