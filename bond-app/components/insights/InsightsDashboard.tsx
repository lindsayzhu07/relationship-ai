"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import type { CheckIn } from "@/types";
import { MOODS } from "@/lib/utils";

interface Props { checkIns: CheckIn[]; }

const GOTTMAN = [
  { name: "Criticism",     value: 38, color: "#e8697a" },
  { name: "Defensiveness", value: 52, color: "#e8a030" },
  { name: "Stonewalling",  value: 21, color: "#888780" },
  { name: "Contempt",      value: 4,  color: "#d85a30" },
  { name: "Repair",        value: 67, color: "#6aaa80" },
];

const TREND_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  warmth: Math.round(55 + i * 1.6 + Math.sin(i) * 4),
  tension: Math.round(65 - i * 2.5 + Math.cos(i) * 3),
}));

const RADAR_DATA = [
  { subject: "Vulnerability", you: 75, partner: 60 },
  { subject: "Listening",     you: 62, partner: 55 },
  { subject: "Repair",        you: 80, partner: 70 },
  { subject: "Openness",      you: 58, partner: 72 },
  { subject: "Empathy",       you: 70, partner: 65 },
];

function StatCard({ label, value, delta, up }: { label: string; value: string; delta: string; up: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-ink-soft mb-1">{label}</p>
      <p className="text-2xl font-serif font-medium text-ink">{value}</p>
      <p className={`text-xs mt-1 flex items-center gap-1 ${up ? "text-green-600" : "text-red-500"}`}>
        {up ? "↑" : "↓"} {delta}
      </p>
    </div>
  );
}

export default function InsightsDashboard({ checkIns }: Props) {
  // Derive stats from real check-ins
  const avgIntensity = checkIns.length
    ? Math.round(checkIns.reduce((s, c) => s + c.intensity, 0) / checkIns.length)
    : 0;

  const moodCounts = checkIns.reduce((acc, ci) => {
    acc[ci.mood] = (acc[ci.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topMoodConfig = topMood ? MOODS.find((m) => m.id === topMood) : null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Connection score" value="78"          delta="+6 vs last week"  up={true} />
        <StatCard label="Calm conversations" value={String(checkIns.length || 14)} delta="+3 this week" up={true} />
        <StatCard label="Conflicts resolved" value="71%"       delta="up from 54%"      up={true} />
        <StatCard label="Avg repair time"   value="22m"        delta="down from 41m"    up={true} />
      </div>

      {/* Top mood */}
      {topMoodConfig && (
        <div className="flex items-center gap-4 p-4 rounded-xl border" style={{ background: topMoodConfig.bg, borderColor: topMoodConfig.borderColor }}>
          <span className="text-2xl">{topMoodConfig.icon}</span>
          <div>
            <p className="text-xs font-medium" style={{ color: topMoodConfig.textColor }}>Most common emotion this period</p>
            <p className="font-serif text-xl font-medium" style={{ color: topMoodConfig.textColor }}>{topMoodConfig.name}</p>
          </div>
          {avgIntensity > 0 && (
            <div className="ml-auto text-right">
              <p className="text-xs" style={{ color: topMoodConfig.textColor + "99" }}>Avg intensity</p>
              <p className="font-serif text-2xl font-medium" style={{ color: topMoodConfig.textColor }}>{avgIntensity}/10</p>
            </div>
          )}
        </div>
      )}

      {/* Line chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-medium text-sm text-ink mb-1">Communication health — 14 days</h2>
        <p className="text-xs text-ink-soft mb-4">Warmth score vs tension score daily</p>
        <div className="flex gap-4 mb-3">
          <span className="flex items-center gap-1.5 text-xs text-ink-soft"><span className="w-3 h-0.5 bg-[#6aaa80] inline-block rounded" /> Warmth</span>
          <span className="flex items-center gap-1.5 text-xs text-ink-soft"><span className="w-3 h-0.5 bg-rose-400 inline-block rounded border-dashed" /> Tension</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8a869e" }} />
            <YAxis domain={[20, 90]} tick={{ fontSize: 11, fill: "#8a869e" }} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "0.5px solid #f0dde7" }} />
            <Line type="monotone" dataKey="warmth" stroke="#6aaa80" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="tension" stroke="#e8697a" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gottman bars */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-medium text-sm text-ink mb-1">Gottman pattern frequency</h2>
          <p className="text-xs text-ink-soft mb-4">% of conversations affected</p>
          <div className="flex flex-col gap-3">
            {GOTTMAN.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-xs text-ink-soft w-24 shrink-0">{name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
                </div>
                <span className="text-xs font-medium text-ink w-8 text-right">{value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-medium text-sm text-ink mb-1">Communication skills radar</h2>
          <p className="text-xs text-ink-soft mb-4">You vs partner this period</p>
          <div className="flex gap-3 mb-2">
            <span className="flex items-center gap-1.5 text-xs text-ink-soft"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> You</span>
            <span className="flex items-center gap-1.5 text-xs text-ink-soft"><span className="w-2.5 h-2.5 rounded-full bg-[#9b7fd4] inline-block" /> Jamie</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#8a869e" }} />
              <Radar name="You" dataKey="you" stroke="#e8697a" fill="#e8697a" fillOpacity={0.15} />
              <Radar name="Jamie" dataKey="partner" stroke="#9b7fd4" fill="#9b7fd4" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emotional language shifts */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-medium text-sm text-ink mb-1">Emotional language shifts</h2>
        <p className="text-xs text-ink-soft mb-4">Changes vs previous period</p>
        <div className="flex flex-col divide-y divide-gray-50">
          {[
            { name: "Vulnerability",   sub: "You disclosing feelings more openly",     delta: "+34%", up: true  },
            { name: "Repair attempts", sub: "Both partners initiating repair",           delta: "+28%", up: true  },
            { name: "Stonewalling",    sub: "Jamie's silent withdrawal periods",         delta: "-41%", up: false },
            { name: "Blame language",  sub: '"always / never" usage',                  delta: "-29%", up: false },
          ].map(({ name, sub, delta, up }) => (
            <div key={name} className="flex items-center gap-4 py-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {up ? "↑" : "↓"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{name}</p>
                <p className="text-xs text-ink-soft mt-0.5">{sub}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                {delta}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Attachment */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h2 className="font-medium text-sm text-ink mb-4">Attachment pattern analysis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "You",          style: "Anxious",          color: "text-[#534ab7]", bg: "bg-[#eeedfe]", desc: "Seeks reassurance. High activation when sensing withdrawal." },
            { label: "Jamie",        style: "Avoidant",         color: "text-amber-700", bg: "bg-amber-50",  desc: "Withdraws under pressure. Needs space before reconnecting." },
            { label: "Conflict cycle", style: "Pursue – Withdraw", color: "text-rose-700", bg: "bg-rose-50", desc: "Identified in 73% of conflicts. Classic anxious–avoidant dynamic." },
          ].map(({ label, style, color, bg, desc }) => (
            <div key={label} className={`${bg} rounded-xl p-4`}>
              <p className="text-xs text-ink-soft mb-1">{label}</p>
              <p className={`font-serif text-lg font-medium ${color} mb-1`}>{style}</p>
              <p className="text-xs text-ink-soft leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
