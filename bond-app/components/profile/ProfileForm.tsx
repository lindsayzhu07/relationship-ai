"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const ATTACHMENT_STYLES = ["Secure", "Anxious", "Avoidant", "Disorganised"];
const EMOTIONAL_STYLES  = ["Feeling-first expresser", "Logical-validator", "Quiet processor", "Deflector with humour"];

export default function ProfileForm({ profile, userId }: { profile: Profile | null; userId: string }) {
  const supabase = createClient();
  const [displayName,    setDisplayName]    = useState(profile?.display_name    ?? "");
  const [partnerName,    setPartnerName]    = useState(profile?.partner_name    ?? "");
  const [attachStyle,    setAttachStyle]    = useState(profile?.attachment_style ?? "");
  const [emotionalStyle, setEmotionalStyle] = useState(profile?.emotional_style  ?? "");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("profiles").upsert({
      user_id: userId,
      display_name: displayName,
      partner_name: partnerName,
      attachment_style: attachStyle,
      emotional_style: emotionalStyle,
    }, { onConflict: "user_id" });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-5">
      <div className="bg-white border border-rose-50 rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="font-medium text-sm text-ink">About you</h2>
        {[
          { label: "Your name",      value: displayName,  set: setDisplayName,  placeholder: "Jamie" },
          { label: "Partner's name", value: partnerName,  set: setPartnerName,  placeholder: "Alex"  },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="text-xs text-ink-soft block mb-1.5">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm text-ink transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="bg-white border border-rose-50 rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="font-medium text-sm text-ink">Communication style</h2>
        <div>
          <label className="text-xs text-ink-soft block mb-2">Your attachment style</label>
          <div className="grid grid-cols-2 gap-2">
            {ATTACHMENT_STYLES.map((s) => (
              <button key={s} type="button" onClick={() => setAttachStyle(s)}
                className={`py-2.5 px-4 rounded-xl border text-sm transition-colors ${attachStyle === s ? "border-rose-400 bg-rose-50 text-rose-700" : "border-gray-200 text-ink-soft hover:border-rose-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-ink-soft block mb-2">Your emotional language style</label>
          <div className="grid grid-cols-1 gap-2">
            {EMOTIONAL_STYLES.map((s) => (
              <button key={s} type="button" onClick={() => setEmotionalStyle(s)}
                className={`py-2.5 px-4 rounded-xl border text-sm text-left transition-colors ${emotionalStyle === s ? "border-rose-400 bg-rose-50 text-rose-700" : "border-gray-200 text-ink-soft hover:border-rose-200"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" disabled={saving}
        className="flex items-center justify-center gap-2 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-full font-medium text-sm transition-colors">
        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : null}
        {saved ? "Saved!" : saving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
