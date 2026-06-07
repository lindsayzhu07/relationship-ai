import FeelingCheckFlow from "@/components/feeling-check/FeelingCheckFlow";

export default function FeelingCheckPage() {
  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-rose-500 mb-2">Feeling check</p>
        <h1 className="font-serif text-3xl text-ink font-normal">How are you feeling?</h1>
        <p className="text-ink-soft mt-2 text-sm leading-relaxed">
          A guided 4-step intake. Your journal is private — your partner only sees the translated message you choose to send.
        </p>
      </div>
      <FeelingCheckFlow />
    </div>
  );
}
