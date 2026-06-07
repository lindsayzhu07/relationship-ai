import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Heart, MessageCircle, BarChart3, Mic, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("user_id", user!.id).single();

  const { data: recentCheckIns } = await supabase
    .from("check_ins").select("*").eq("user_id", user!.id)
    .order("created_at", { ascending: false }).limit(3);

  const { data: recentMessages } = await supabase
    .from("messages").select("*").eq("user_id", user!.id)
    .order("created_at", { ascending: false }).limit(1);

  const name = profile?.display_name || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const QUICK_ACTIONS = [
    { href: "/feeling-check", icon: Heart,          color: "bg-rose-50 border-rose-100 text-rose-600", label: "Feeling check",  desc: "How are you feeling right now?" },
    { href: "/chat",          icon: MessageCircle,  color: "bg-[#eeedfe] border-[#afa9ec]/30 text-[#534ab7]", label: "Chat",  desc: "Talk with AI translation on" },
    { href: "/insights",      icon: BarChart3,      color: "bg-[#eaf3de] border-[#97c459]/30 text-[#3b6d11]", label: "Insights", desc: "See your weekly patterns" },
    { href: "/voice",         icon: Mic,            color: "bg-[#faeeda] border-[#fac775]/30 text-[#854f0b]", label: "Voice session", desc: "Record and analyze a conversation" },
  ];

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-rose-500 mb-2">
          {greeting}
        </p>
        <h1 className="font-serif text-3xl text-ink font-normal">
          {greeting}, {name} 👋
        </h1>
        {profile?.partner_name && (
          <p className="text-ink-soft mt-2 text-sm">
            Your relationship with <span className="text-ink font-medium">{profile.partner_name}</span> is worth tending to.
          </p>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {QUICK_ACTIONS.map(({ href, icon: Icon, color, label, desc }) => (
          <Link
            key={href}
            href={href}
            className={`${color} border rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-shadow group`}
          >
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shrink-0">
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-ink mb-0.5">{label}</p>
              <p className="text-xs text-ink-soft leading-relaxed">{desc}</p>
            </div>
            <ArrowRight size={14} className="text-ink-soft/50 mt-1 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recent check-ins */}
      {recentCheckIns && recentCheckIns.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-sm text-ink">Recent check-ins</h2>
            <Link href="/feeling-check" className="text-xs text-rose-500 hover:underline">New check-in →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentCheckIns.map((ci) => (
              <div key={ci.id} className="bg-white border border-rose-50 rounded-xl px-4 py-3 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-sm">
                  {ci.intensity >= 7 ? "🌊" : ci.intensity >= 4 ? "🌤" : "☀️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink capitalize">{ci.mood}</p>
                  <p className="text-xs text-ink-soft">Intensity {ci.intensity}/10 · {new Date(ci.created_at).toLocaleDateString()}</p>
                </div>
                {ci.sent_to_partner && (
                  <span className="text-xs bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">Sent</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!recentCheckIns || recentCheckIns.length === 0) && (
        <div className="text-center py-12 bg-white border border-dashed border-rose-100 rounded-2xl">
          <div className="text-3xl mb-3">💞</div>
          <h3 className="font-serif text-lg text-ink mb-2">Welcome to Bond</h3>
          <p className="text-sm text-ink-soft mb-6 max-w-xs mx-auto leading-relaxed">
            Start with a feeling check to let Bond understand your emotional landscape.
          </p>
          <Link
            href="/feeling-check"
            className="px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            Start first check-in →
          </Link>
        </div>
      )}
    </div>
  );
}
