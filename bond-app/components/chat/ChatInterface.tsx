"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Languages, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Msg {
  id: string;
  role: "user" | "partner";
  content: string;
  original?: string;
  isTranslated?: boolean;
  patterns?: string[];
  translation?: string;
  timestamp: Date;
}

const PATTERN_COLORS: Record<string, string> = {
  "Criticism":        "bg-red-50 text-red-600",
  "Defensiveness":    "bg-amber-50 text-amber-700",
  "Stonewalling":     "bg-gray-100 text-gray-600",
  "Contempt":         "bg-red-100 text-red-700",
  "Repair attempt":   "bg-green-50 text-green-700",
  "Vulnerability":    "bg-[#eeedfe] text-[#534ab7]",
  "Active listening": "bg-[#eaf3de] text-[#3b6d11]",
};

const DEMO_MSGS: Msg[] = [
  {
    id: "1", role: "partner",
    content: "I just feel like you never actually listen to me.",
    original: "I just feel like you never actually listen to me.",
    translation: "I don't feel heard right now. I need to feel that you're genuinely present with me.",
    patterns: ["Criticism", "Generalization"],
    timestamp: new Date(Date.now() - 120000),
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Msg[]>(DEMO_MSGS);
  const [input, setInput] = useState("");
  const [translateOn, setTranslateOn] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [preview, setPreview] = useState<{ translation: string; patterns: string[] } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const supabase = createClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!translateOn || !input.trim() || input.length < 20) {
      setPreview(null);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
        const data = await res.json();
        setPreview(data);
      } catch {}
      setPreviewLoading(false);
    }, 800);
  }, [input, translateOn]);

  async function send() {
    if (!input.trim()) return;
    const rawContent = input.trim();
    setInput(""); setPreview(null);

    let finalContent = rawContent;
    let translationText = "";
    let patternsList: string[] = [];

    if (translateOn) {
      setTranslating(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: rawContent }),
        });
        const data = await res.json();
        finalContent = data.translation ?? rawContent;
        translationText = data.translation;
        patternsList = data.patterns ?? [];
      } catch {}
      setTranslating(false);
    }

    const msg: Msg = {
      id: Date.now().toString(), role: "user",
      content: finalContent,
      original: translateOn ? rawContent : undefined,
      isTranslated: translateOn && !!translationText,
      patterns: patternsList,
      timestamp: new Date(),
    };
    setMessages((m) => [...m, msg]);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("messages").insert({
        user_id: user.id, role: "user",
        content: finalContent, original_content: rawContent,
        is_translated: translateOn, pattern_tags: patternsList,
      });
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2.5", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-auto",
                msg.role === "user" ? "bg-[#eeedfe] text-[#534ab7]" : "bg-rose-100 text-rose-600")}>
                {msg.role === "user" ? "Y" : "J"}
              </div>
              <div className="flex flex-col gap-1.5 max-w-[72%]">
                {msg.patterns && msg.patterns.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {msg.patterns.map((p) => (
                      <span key={p} className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", PATTERN_COLORS[p] ?? "bg-gray-100 text-gray-600")}>{p}</span>
                    ))}
                  </div>
                )}
                <div className={cn("px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-ink text-white/90 rounded-tr-sm"
                    : "bg-gray-50 border border-gray-100 text-ink rounded-tl-sm")}>
                  {msg.content}
                </div>
                {/* Partner message translation banner */}
                {msg.role === "partner" && msg.translation && (
                  <div className="flex gap-2 items-start bg-rose-50 border border-rose-100 rounded-xl px-3 py-2.5 text-xs">
                    <Languages size={12} className="text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-rose-400 font-medium block mb-0.5">What Jamie means:</span>
                      <span className="text-rose-700 font-serif italic leading-relaxed">{msg.translation}</span>
                    </div>
                  </div>
                )}
                {/* Sent translated note */}
                {msg.isTranslated && (
                  <p className="text-[10px] text-ink-soft flex items-center gap-1">
                    <Languages size={10} className="text-rose-400" /> Translated before sending
                  </p>
                )}
                <span className="text-[10px] text-ink-soft">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          ))}
          {translating && (
            <div className="flex gap-2.5 flex-row-reverse">
              <div className="w-7 h-7 rounded-full bg-[#eeedfe] flex items-center justify-center text-xs">Y</div>
              <div className="px-4 py-2.5 bg-gray-50 rounded-2xl rounded-tr-sm flex items-center gap-2 text-sm text-ink-soft">
                <Loader2 size={12} className="animate-spin" /> Translating…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Translation preview */}
        {(preview || previewLoading) && (
          <div className="mx-4 mb-2 bg-rose-50 border border-rose-100 rounded-xl p-3">
            {previewLoading
              ? <p className="text-xs text-rose-400 flex items-center gap-1.5"><Loader2 size={11} className="animate-spin" /> Preparing translation…</p>
              : preview && (
                <div>
                  <p className="text-[10px] text-rose-400 font-medium uppercase tracking-wider mb-1.5">Translation preview</p>
                  <p className="text-xs text-rose-700 font-serif italic leading-relaxed">"{preview.translation}"</p>
                </div>
              )}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-rose-50 bg-white">
          <div className="border border-gray-200 focus-within:border-rose-300 rounded-2xl overflow-hidden transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
              placeholder="Share how you're feeling…"
              rows={2}
              className="w-full px-4 pt-3 pb-1 text-sm text-ink placeholder-ink-soft/60 resize-none outline-none leading-relaxed"
            />
            <div className="px-3 py-2 flex items-center gap-2">
              <button
                onClick={() => setTranslateOn((v) => !v)}
                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  translateOn ? "bg-rose-100 text-rose-600" : "bg-gray-100 text-ink-soft")}
              >
                <Languages size={12} />
                {translateOn ? "Auto-translate on" : "Auto-translate off"}
              </button>
              <button className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:bg-gray-50 transition-colors">
                <Mic size={16} />
              </button>
              <button
                onClick={send}
                disabled={!input.trim() || translating}
                className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 flex items-center justify-center text-white transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live patterns aside — desktop only */}
      <aside className="hidden lg:flex flex-col w-60 border-l border-rose-50 bg-[#faf8f6] p-4 gap-4">
        <div>
          <p className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-3">Live detection</p>
          <div className="flex flex-col gap-2">
            {[
              { name: "Criticism",        level: "high",  color: "bg-red-500"   },
              { name: "Defensiveness",    level: "low",   color: "bg-amber-400" },
              { name: "Stonewalling",     level: "none",  color: "bg-gray-300"  },
              { name: "Repair attempts",  level: "good",  color: "bg-green-400" },
            ].map(({ name, level, color }) => (
              <div key={name} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-100">
                <div className={cn("w-2 h-2 rounded-full shrink-0", color)} />
                <span className="text-xs text-ink flex-1">{name}</span>
                <span className={cn("text-[10px] font-medium", level === "high" ? "text-red-500" : level === "good" ? "text-green-600" : "text-ink-soft")}>{level}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-ink-soft uppercase tracking-widest mb-3">Suggested</p>
          <div className="flex flex-col gap-2">
            {[
              "\"I hear that you're feeling this way. Can you tell me more?\"",
              "\"I want to understand — what would help most right now?\"",
            ].map((s, i) => (
              <button key={i} onClick={() => setInput(s.replace(/"/g, ""))}
                className="text-left text-xs text-ink-soft bg-white border border-rose-100 border-l-2 border-l-rose-400 rounded-lg px-3 py-2 leading-relaxed hover:bg-rose-50 transition-colors font-serif italic">
                {s}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
