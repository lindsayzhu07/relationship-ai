import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MoodConfig, Mood } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MOODS: MoodConfig[] = [
  { id: "content",    name: "Content",     sub: "peaceful",     icon: "☀️", bg: "#eaf3de", iconColor: "#3b6d11", textColor: "#27500a", borderColor: "#97c459" },
  { id: "frustrated", name: "Frustrated",  sub: "irritated",    icon: "🔥", bg: "#faeeda", iconColor: "#854f0b", textColor: "#633806", borderColor: "#fac775" },
  { id: "hurt",       name: "Hurt",        sub: "wounded",      icon: "💔", bg: "#fbeaf0", iconColor: "#993556", textColor: "#72243e", borderColor: "#f4c0d1" },
  { id: "anxious",    name: "Anxious",     sub: "worried",      icon: "🌧️", bg: "#eeedfe", iconColor: "#534ab7", textColor: "#3c3489", borderColor: "#afa9ec" },
  { id: "numb",       name: "Numb",        sub: "disconnected", icon: "🌑", bg: "#f1efe8", iconColor: "#5f5e5a", textColor: "#444441", borderColor: "#b4b2a9" },
  { id: "grateful",   name: "Grateful",    sub: "appreciative", icon: "❤️", bg: "#eaf3de", iconColor: "#3b6d11", textColor: "#27500a", borderColor: "#97c459" },
  { id: "angry",      name: "Angry",       sub: "furious",      icon: "⛈️", bg: "#fcebeb", iconColor: "#a32d2d", textColor: "#791f1f", borderColor: "#f09595" },
  { id: "vulnerable", name: "Vulnerable",  sub: "exposed",      icon: "🛡️", bg: "#eeedfe", iconColor: "#534ab7", textColor: "#3c3489", borderColor: "#afa9ec" },
  { id: "invisible",  name: "Invisible",   sub: "overlooked",   icon: "👁️", bg: "#faeeda", iconColor: "#854f0b", textColor: "#633806", borderColor: "#fac775" },
  { id: "loving",     name: "Loving",      sub: "connected",    icon: "💝", bg: "#fbeaf0", iconColor: "#993556", textColor: "#72243e", borderColor: "#f4c0d1" },
];

export const getMood = (id: Mood) => MOODS.find((m) => m.id === id)!;

export const TRIGGERS = [
  "A recent argument",
  "Feeling ignored",
  "Not feeling appreciated",
  "Work stress spilling in",
  "Feeling disconnected",
  "Unmet expectations",
  "Not enough quality time",
  "Feeling like a low priority",
];

export const NEEDS = [
  "To feel truly heard",
  "Reassurance I am loved",
  "Physical closeness",
  "Space to process alone",
  "A genuine acknowledgment",
  "Quality time together",
  "Help with something",
  "Words of affirmation",
];

export const INT_DESCRIPTORS: Record<number, string> = {
  1:  "A gentle background feeling — present but easy to carry.",
  2:  "Noticeable, but you can still function well.",
  3:  "Starting to colour your mood and interactions.",
  4:  "Clearly present — difficult to push to the background.",
  5:  "Moderately strong and taking up mental space.",
  6:  "Quite strong — influencing how you show up.",
  7:  "Intense. Hard to focus on much else.",
  8:  "Very intense — dominating your thoughts.",
  9:  "Overwhelming. This needs to be expressed.",
  10: "Completely consuming. You need support right now.",
};

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
