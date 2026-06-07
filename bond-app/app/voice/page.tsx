import VoiceSession from "@/components/voice/VoiceSession";
import PageHeader from "@/components/shared/PageHeader";

export default function VoicePage() {
  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <PageHeader
        label="Voice session"
        title="Live voice analysis"
        sub="Record a conversation and get real-time tone analysis, Gottman pattern detection, and AI-powered suggestions."
      />
      <VoiceSession />
    </div>
  );
}
