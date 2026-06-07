"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BondLogo from "./BondLogo";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";
import {
  LayoutDashboard, MessageCircle, Heart, BarChart3,
  Mic, Upload, Languages, User, LogOut,
} from "lucide-react";

const NAV = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard"    },
  { href: "/chat",          icon: MessageCircle,   label: "Chat"         },
  { href: "/translate",     icon: Languages,       label: "Translator"   },
  { href: "/feeling-check", icon: Heart,           label: "Feeling check"},
  { href: "/insights",      icon: BarChart3,       label: "Insights"     },
  { href: "/voice",         icon: Mic,             label: "Voice"        },
  { href: "/upload",        icon: Upload,          label: "Upload"       },
];

interface Props { profile: Profile | null; userId: string; }

export default function AppSidebar({ profile }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/"); router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-16 lg:w-56 bg-[#18162a] min-h-screen shrink-0 py-5 transition-all duration-200">
        <div className="flex items-center gap-3 px-4 mb-8">
          <BondLogo size={36} />
          <span className="hidden lg:block font-serif text-white text-lg font-medium">Bond</span>
        </div>

        <nav className="flex flex-col gap-0.5 px-2 flex-1">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                  active ? "bg-rose-500/20 text-rose-300" : "text-white/40 hover:text-white/80 hover:bg-white/5")}>
                <Icon size={17} className="shrink-0" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 pt-2 border-t border-white/8 flex flex-col gap-0.5">
          <Link href="/profile"
            className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm",
              pathname.startsWith("/profile") ? "bg-rose-500/20 text-rose-300" : "text-white/40 hover:text-white/80 hover:bg-white/5")}>
            <User size={17} className="shrink-0" />
            <span className="hidden lg:block">Profile</span>
          </Link>
          {profile && (
            <div className="hidden lg:flex items-center gap-2.5 px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-rose-500/30 flex items-center justify-center shrink-0 text-xs text-rose-300">
                {(profile.display_name || "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-xs font-medium truncate">{profile.display_name}</p>
                {profile.partner_name && <p className="text-white/35 text-[10px] truncate">+ {profile.partner_name}</p>}
              </div>
            </div>
          )}
          <button onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/35 hover:text-white/70 hover:bg-white/5 transition-colors text-sm w-full">
            <LogOut size={16} className="shrink-0" />
            <span className="hidden lg:block">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#18162a] border-t border-white/10 flex" aria-label="Main navigation">
        {NAV.slice(0, 5).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}
              className={cn("flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors",
                active ? "text-rose-400" : "text-white/35")}>
              <Icon size={19} />
              <span className="text-[9px] font-medium leading-none">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
