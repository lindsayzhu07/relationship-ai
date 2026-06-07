"use client";

import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import BondLogo from "@/components/ui/BondLogo";

export default function LandingHero() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 py-20 overflow-hidden">
      {/* Concentric ring bg */}
      {[500, 340, 180].map((size) => (
        <div
          key={size}
          className="absolute rounded-full border border-rose-200/30 pointer-events-none"
          style={{ width: size, height: size,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)" }}
        />
      ))}

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-0 animate-fade-up">
        <BondLogo size={88} className="mb-7" />

        <h1 className="font-serif text-5xl sm:text-6xl font-medium text-ink tracking-tight mb-3">
          Bond
        </h1>

        <p className="text-xs font-medium tracking-[0.2em] uppercase text-rose-600 mb-8">
          Relationship AI &nbsp;·&nbsp; Couple design
        </p>

        <div className="w-10 h-px bg-rose-200 mb-8" />

        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink text-center leading-relaxed max-w-md mb-4">
          Speak the language of{" "}
          <em className="italic text-rose-500">love</em>{" "}
          your partner actually hears
        </h2>

        <p className="text-base text-ink-soft text-center leading-relaxed max-w-sm mb-10">
          AI that listens between the lines — translating what you feel into
          what your partner can truly receive.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <button
            onClick={() => { setAuthMode("signup"); setShowAuth(true); }}
            className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium text-sm transition-colors"
          >
            Begin your journey →
          </button>
          <button
            onClick={() => { setAuthMode("signin"); setShowAuth(true); }}
            className="px-7 py-3.5 bg-transparent border border-rose-200 hover:border-rose-400 text-ink-soft hover:text-rose-600 rounded-full font-normal text-sm transition-colors"
          >
            Sign in
          </button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-5">
          {[
            { icon: "🔒", label: "Private & encrypted" },
            { icon: "💛", label: "Compassionate AI" },
            { icon: "👫", label: "Built for couples" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-ink-soft">
              <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-xs">
                {icon}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onToggleMode={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
        />
      )}
    </section>
  );
}
