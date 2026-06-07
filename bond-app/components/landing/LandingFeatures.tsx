const FEATURES = [
  {
    emoji: "✨",
    title: "Emotional translator",
    desc: "Like Grammarly for relationships. Type what you feel — AI rewrites it into something your partner can actually receive.",
    color: "bg-rose-50 border-rose-100",
  },
  {
    emoji: "🎙️",
    title: "Voice session analysis",
    desc: "Record conversations and get real-time tone analysis, Gottman pattern detection, and repair suggestions.",
    color: "bg-[#eeedfe] border-[#afa9ec]/30",
  },
  {
    emoji: "💭",
    title: "Feeling check",
    desc: "A 4-step guided intake that transforms raw emotions into a translated message your partner can understand.",
    color: "bg-[#eaf3de] border-[#97c459]/30",
  },
  {
    emoji: "📊",
    title: "Insights dashboard",
    desc: "Weekly patterns, communication trends, Gottman horsemen tracking, and attachment style analysis.",
    color: "bg-[#faeeda] border-[#fac775]/30",
  },
  {
    emoji: "💬",
    title: "Live chat with AI",
    desc: "Every message gets an AI translation layer. Auto-translate mode rewrites before sending, bridging emotional language gaps.",
    color: "bg-rose-50 border-rose-100",
  },
  {
    emoji: "📓",
    title: "Private journal",
    desc: "Upload conversations, voice notes, and journal entries. AI finds patterns you can't see from inside the relationship.",
    color: "bg-[#eeedfe] border-[#afa9ec]/30",
  },
];

export default function LandingFeatures() {
  return (
    <section className="px-6 py-20 max-w-5xl mx-auto w-full">
      <div className="text-center mb-14">
        <p className="text-xs font-medium tracking-[0.18em] uppercase text-rose-500 mb-4">
          How Bond works
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink mb-4">
          Every feature built around connection
        </h2>
        <p className="text-ink-soft max-w-md mx-auto leading-relaxed">
          Grounded in Gottman Method, Nonviolent Communication, and attachment theory.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`${f.color} border rounded-2xl p-6 flex flex-col gap-3`}
          >
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-xl">
              {f.emoji}
            </div>
            <h3 className="font-medium text-ink text-base">{f.title}</h3>
            <p className="text-sm text-ink-soft leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
