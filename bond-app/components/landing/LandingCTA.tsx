"use client";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function LandingCTA() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <section className="px-6 py-20">
      <div className="max-w-xl mx-auto text-center bg-white border border-rose-100 rounded-3xl p-10 sm:p-14">
        <div className="text-3xl mb-5">💞</div>
        <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mb-4">
          Ready to be truly understood?
        </h2>
        <p className="text-ink-soft leading-relaxed mb-8 text-sm sm:text-base">
          Join couples who are learning to speak each other's emotional language — and building something that lasts.
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium text-sm transition-colors"
        >
          Start for free →
        </button>
        <p className="text-xs text-ink-soft mt-5">No credit card required · Private by default</p>
      </div>

      <p className="text-center text-xs text-ink-soft mt-10">
        © {new Date().getFullYear()} Bond · Built with compassion
      </p>

      {showAuth && (
        <AuthModal
          mode="signup"
          onClose={() => setShowAuth(false)}
          onToggleMode={() => {}}
        />
      )}
    </section>
  );
}
