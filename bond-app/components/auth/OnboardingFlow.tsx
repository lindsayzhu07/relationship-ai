"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import BondLogo from "@/components/ui/BondLogo";

const STEPS = ["Welcome", "Your name", "Partner", "Style"];
const ATTACHMENT = ["Secure", "Anxious", "Avoidant", "Not sure yet"];

export default function OnboardingFlow() {
  const router  = useRouter();
  const supabase = createClient();
  const [step, setStep]     = useState(0);
  const [name, setName]     = useState("");
  const [partner, setPartner] = useState("");
  const [attach, setAttach] = useState("");
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({
        user_id: user.id,
        display_name: name,
        partner_name: partner,
        attachment_style: attach,
      }, { onConflict: "user_id" });
    }
    router.push("/dashboard");
  }

  return (
    <div className="bg-white border border-rose-50 rounded-3xl p-8 w-full max-w-sm shadow-sm">
      {/* Logo + progress */}
      <div className="flex flex-col items-center mb-6">
        <BondLogo size={48} className="mb-3" />
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? "bg-rose-400 w-6" : "bg-gray-100 w-3"}`} />
          ))}
        </div>
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div className="text-center">
          <h2 className="font-serif text-2xl text-ink mb-2">Welcome to Bond</h2>
          <p className="text-sm text-ink-soft leading-relaxed mb-8">
            Let's set up your relationship profile so Bond can personalise your experience.
          </p>
          <button onClick={() => setStep(1)} className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium text-sm transition-colors">
            Get started →
          </button>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h2 className="font-serif text-xl text-ink mb-1">What's your name?</h2>
          <p className="text-sm text-ink-soft mb-5">This is how Bond will address you.</p>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm text-ink mb-4 transition-colors"
          />
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm text-ink-soft hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={() => setStep(2)} disabled={!name.trim()}
              className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white rounded-full text-sm font-medium transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h2 className="font-serif text-xl text-ink mb-1">Your partner's name</h2>
          <p className="text-sm text-ink-soft mb-5">Bond will personalise translations and insights for your relationship.</p>
          <input
            type="text" value={partner} onChange={(e) => setPartner(e.target.value)}
            placeholder="Partner's first name"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-rose-400 outline-none text-sm text-ink mb-4 transition-colors"
          />
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm text-ink-soft hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={() => setStep(3)} disabled={!partner.trim()}
              className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white rounded-full text-sm font-medium transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <h2 className="font-serif text-xl text-ink mb-1">Attachment style</h2>
          <p className="text-sm text-ink-soft mb-4">Helps Bond personalise your communication insights.</p>
          <div className="flex flex-col gap-2 mb-5">
            {ATTACHMENT.map((a) => (
              <button key={a} onClick={() => setAttach(a)}
                className={`py-2.5 px-4 rounded-xl border text-sm text-left transition-colors ${attach === a ? "border-rose-400 bg-rose-50 text-rose-700" : "border-gray-200 text-ink-soft hover:border-rose-200"}`}>
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm text-ink-soft hover:bg-gray-50 transition-colors">Back</button>
            <button onClick={finish} disabled={saving || !attach}
              className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 text-white rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? "Setting up…" : "Let's go 💞"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
