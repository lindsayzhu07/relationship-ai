"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X, Loader2 } from "lucide-react";
import BondLogo from "@/components/ui/BondLogo";

interface AuthModalProps {
  mode: "signin" | "signup";
  onClose: () => void;
  onToggleMode: () => void;
}

export default function AuthModal({ mode, onClose, onToggleMode }: AuthModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      });
      if (err) { setError(err.message); setLoading(false); return; }
      setSuccess("Check your email to confirm your account!");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-rose-100 p-8 w-full max-w-sm shadow-xl relative animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink-soft hover:text-ink transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <BondLogo size={48} className="mb-3" />
          <h2 className="font-serif text-xl text-ink font-medium">
            {mode === "signup" ? "Begin your journey" : "Welcome back"}
          </h2>
          <p className="text-xs text-ink-soft mt-1">
            {mode === "signup" ? "Create your Bond account" : "Sign in to Bond"}
          </p>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-3">💌</div>
            <p className="text-sm text-ink-soft leading-relaxed">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === "signup" && (
              <div>
                <label className="text-xs text-ink-soft block mb-1">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jamie"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm text-ink placeholder-ink-soft/60 focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-ink-soft block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm text-ink placeholder-ink-soft/60 focus:outline-none focus:border-rose-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-ink-soft block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-rose-100 bg-rose-50/30 text-sm text-ink placeholder-ink-soft/60 focus:outline-none focus:border-rose-400 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white rounded-full font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-1"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center text-xs text-ink-soft mt-5">
            {mode === "signup" ? "Already have an account?" : "New to Bond?"}{" "}
            <button onClick={onToggleMode} className="text-rose-500 hover:underline font-medium">
              {mode === "signup" ? "Sign in" : "Create account"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
