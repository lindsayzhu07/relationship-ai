"use client";

import { useState } from "react";
import { MOODS, TRIGGERS, NEEDS, INT_DESCRIPTORS, getMood, cn } from "@/lib/utils";
import type { Mood } from "@/types";
import { Loader2, Lock, Copy, Check, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STEPS = ["Emotion", "Intensity", "Journal", "Summary"];

export default function FeelingCheckFlow() {
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [intensity, setIntensity] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<Set<string>>(new Set());
  const [needs, setNeeds] = useState<Set<string>>(new Set());
  const [journal, setJournal] = useState("");
  const [translation, setTranslation] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const moodConfig = mood ? getMood(mood) : null;

  function toggleSet(set: Set<string>, setFn: (s: Set<string>) => void, val: string) {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setFn(next);
  }

  async function buildSummary() {
    setLoading(true);
    try {
      const res = await fetch("/api/feeling-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, intensity, triggers: Array.from(triggers), needs: Array.from(needs), journal }),
      });
      const data = await res.json();
      setTranslation(data.translation);
      setInsight(data.insight);
    } catch {
      setTranslation("I'm feeling this deeply and I wanted to share it with you, because you matter to me.");
    }
    setLoading(false);
    setStep(3);
  }

  async function sendToPartner() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

  await supabase.from("check_ins").insert({
    user_id: user.id,
    mood,
    intensity,
    triggers: Array.from(triggers),
    needs: Array.from(needs),
    journal,
    translation,
    sent_to_partner: true,
  });

  async function copyTranslation() {
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setStep(0); setMood(null); setIntensity(null);
    setTriggers(new Set()); setNeeds(new Set());
    setJournal(""); setTranslation(""); setInsight(""); setSent(false);
  }

  return (
    <div className="bg-white border border-rose-50 rounded-2xl overflow-hidden">
      {/* Progress tabs */}
      <div className="flex border-b border-rose-50">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => i < step && setStep(i)}
            className={cn(
              "flex-1 py-3 text-xs font-medium transition-colors border-b-2 -mb-px",
              i === step ? "border-rose-400 text-rose-600 bg-rose-50/40" :
              i < step   ? "border-rose-200 text-rose-400 cursor-pointer" :
                           "border-transparent text-ink-soft cursor-default"
            )}
          >
            <span className={cn("inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-1.5",
              i < step ? "bg-rose-500 text-white" : i === step ? "border border-rose-400 text-rose-500" : "border border-ink-soft/30 text-ink-soft")}>
              {i < step ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">

        {/* ── Step 0: Mood ── */}
        {step === 0 && (
          <div className="animate-fade-up">
            <h2 className="font-serif text-xl text-ink mb-1">How are you feeling right now?</h2>
            <p className="text-sm text-ink-soft mb-6">Tap the emotion that fits best.</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  style={mood === m.id ? { background: m.bg, borderColor: m.borderColor } : {}}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl border border-transparent transition-all",
                    mood === m.id ? "scale-[1.03] shadow-sm" : "hover:bg-rose-50/60 hover:border-rose-100"
                  )}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: m.bg }}>{m.icon}</div>
                  <span className="text-xs font-medium text-ink text-center leading-tight">{m.name}</span>
                  <span className="text-[10px] text-ink-soft">{m.sub}</span>
                </button>
              ))}
            </div>
            {mood && (
              <div className="mb-6 px-4 py-3 bg-rose-50 rounded-xl text-sm text-rose-700">
                You selected <strong>{getMood(mood).name}</strong>
              </div>
            )}
            <button
              disabled={!mood}
              onClick={() => setStep(1)}
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 disabled:cursor-not-allowed text-white rounded-full text-sm font-medium transition-colors"
            >
              Next →
            </button>
          </div>
        )}

        {/* ── Step 1: Intensity + triggers ── */}
        {step === 1 && (
          <div className="animate-fade-up">
            <h2 className="font-serif text-xl text-ink mb-1">How intense is this feeling?</h2>
            <p className="text-sm text-ink-soft mb-6">1 is a gentle undercurrent, 10 is completely consuming.</p>

            <div className="flex items-end gap-4 mb-3">
              <span className="font-serif text-5xl text-rose-500 font-medium leading-none">
                {intensity ?? "—"}
              </span>
              <span className="text-sm text-ink-soft mb-1.5">/ 10</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setIntensity(n)}
                  className={cn(
                    "w-10 h-10 rounded-full border text-sm font-medium transition-all",
                    intensity === n ? "bg-rose-500 border-rose-500 text-white scale-110" :
                    (intensity ?? 0) > n ? "bg-rose-100 border-rose-200 text-rose-500" :
                    "border-gray-200 text-ink-soft hover:border-rose-300 hover:bg-rose-50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            {intensity && (
              <p className="text-sm text-ink-soft bg-gray-50 rounded-xl px-4 py-3 mb-6">{INT_DESCRIPTORS[intensity]}</p>
            )}

            <div className="mb-6">
              <h3 className="font-medium text-sm text-ink mb-1">What is triggering this feeling?</h3>
              <p className="text-xs text-ink-soft mb-3">Select everything that applies.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TRIGGERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleSet(triggers, setTriggers, t)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all",
                      triggers.has(t) ? "border-rose-400 bg-rose-50 text-rose-700" : "border-gray-100 hover:border-rose-200 hover:bg-rose-50/40 text-ink-soft"
                    )}
                  >
                    <span className={cn("w-4 h-4 rounded flex items-center justify-center border text-xs shrink-0",
                      triggers.has(t) ? "bg-rose-500 border-rose-500 text-white" : "border-gray-300")}>
                      {triggers.has(t) ? "✓" : ""}
                    </span>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="px-5 py-2.5 border border-gray-200 rounded-full text-sm text-ink-soft hover:bg-gray-50 transition-colors">Back</button>
              <button
                disabled={!intensity}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 disabled:cursor-not-allowed text-white rounded-full text-sm font-medium transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Journal + needs ── */}
        {step === 2 && (
          <div className="animate-fade-up">
            <h2 className="font-serif text-xl text-ink mb-1">Tell me more</h2>
            <p className="text-sm text-ink-soft mb-4">This is private — your partner never sees raw text, only the translated message you choose to send.</p>

            <div className="border border-gray-200 focus-within:border-rose-400 rounded-xl overflow-hidden mb-4 transition-colors">
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value.slice(0, 1000))}
                placeholder="What happened? What's been on your mind? How would you like things to feel differently…"
                rows={5}
                className="w-full px-4 py-4 text-sm text-ink placeholder-ink-soft/60 resize-none outline-none leading-relaxed"
              />
              <div className="px-4 py-2 border-t border-gray-100 flex items-center gap-3">
                <div className="flex gap-2">
                  {["I feel this way because...", "What I need is...", "What scares me..."].map((p) => (
                    <button key={p} onClick={() => setJournal((j) => (j ? j + "\n" : "") + p)}
                      className="text-xs px-3 py-1 rounded-full border border-gray-200 text-ink-soft hover:bg-gray-50 transition-colors">
                      + {p.split(" ")[0]}…
                    </button>
                  ))}
                </div>
                <span className={cn("ml-auto text-xs", journal.length > 900 ? "text-red-400" : "text-ink-soft")}>{journal.length}/1000</span>
              </div>
            </div>

            <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-6 text-xs text-ink-soft">
              <Lock size={13} className="shrink-0 mt-0.5" />
              End-to-end encrypted. Used only to improve your personal AI translation over time.
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-sm text-ink mb-1">What do you need right now?</h3>
              <p className="text-xs text-ink-soft mb-3">This shapes the translated message your partner receives.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NEEDS.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggleSet(needs, setNeeds, n)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all",
                      needs.has(n) ? "border-rose-400 bg-rose-50 text-rose-700" : "border-gray-100 hover:border-rose-200 hover:bg-rose-50/40 text-ink-soft"
                    )}
                  >
                    <span className={cn("w-4 h-4 rounded flex items-center justify-center border text-xs shrink-0",
                      needs.has(n) ? "bg-rose-500 border-rose-500 text-white" : "border-gray-300")}>
                      {needs.has(n) ? "✓" : ""}
                    </span>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 rounded-full text-sm text-ink-soft hover:bg-gray-50 transition-colors">Back</button>
              <button
                onClick={buildSummary}
                disabled={loading}
                className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? "Generating…" : "See my summary ✨"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Summary ── */}
        {step === 3 && moodConfig && (
          <div className="animate-fade-up">
            <h2 className="font-serif text-xl text-ink mb-4">Your check-in summary</h2>

            {/* Hero */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border mb-4" style={{ background: moodConfig.bg, borderColor: moodConfig.borderColor }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ background: "rgba(255,255,255,0.6)" }}>
                {moodConfig.icon}
              </div>
              <div className="flex-1">
                <p className="font-serif text-2xl font-medium" style={{ color: moodConfig.textColor }}>{moodConfig.name}</p>
                <p className="text-sm mt-0.5" style={{ color: moodConfig.textColor + "99" }}>Intensity {intensity}/10</p>
                <div className="flex gap-1 mt-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="h-1.5 w-5 rounded-full" style={{ background: i < (intensity ?? 0) ? "#e8697a" : "rgba(0,0,0,0.1)" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Triggers & needs */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Triggered by", items: [...triggers], icon: "🔥" },
                { label: "You need",     items: [...needs],    icon: "🤝" },
              ].map(({ label, items, icon }) => (
                <div key={label} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-ink-soft mb-2">{icon} {label}</p>
                  {items.length > 0
                    ? <div className="flex flex-wrap gap-1">
                        {items.map((i) => <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: moodConfig.bg, color: moodConfig.textColor }}>{i}</span>)}
                      </div>
                    : <span className="text-xs text-ink-soft">None selected</span>}
                </div>
              ))}
            </div>

            {/* AI insight */}
            {insight && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 text-sm text-ink-soft leading-relaxed">
                <p className="text-xs font-medium text-ink mb-1">💡 Pattern insight</p>
                {insight}
              </div>
            )}

            {/* Translation card */}
            <div className="border border-rose-200 rounded-2xl overflow-hidden mb-5">
              <div className="px-4 py-3 border-b border-rose-100 bg-rose-50 flex items-center gap-2">
                <span className="text-xs font-medium text-rose-600 uppercase tracking-widest">✨ AI emotional translation</span>
                <span className="ml-auto text-xs text-rose-400">→ Jamie</span>
              </div>
              <div className="p-5 bg-rose-50/40">
                <p className="font-serif italic text-sm text-rose-800 leading-relaxed">"{translation}"</p>
              </div>
              <div className="px-4 py-3 border-t border-rose-100 flex items-center gap-2 bg-rose-50/20">
                {sent ? (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><Check size={14} /> Sent to Jamie</span>
                ) : (
                  <button onClick={sendToPartner} className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-medium transition-colors">
                    <Send size={12} /> Send to Jamie ↗
                  </button>
                )}
                <button onClick={copyTranslation} className="flex items-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-600 rounded-full text-xs hover:bg-rose-50 transition-colors ml-auto">
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-gray-200 rounded-full text-sm text-ink-soft hover:bg-gray-50 transition-colors">Revise</button>
              <button onClick={reset} className="px-6 py-2.5 bg-ink hover:bg-ink-mid text-white rounded-full text-sm font-medium transition-colors">New check-in</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
