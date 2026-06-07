import TranslatorScreen from "@/components/translate/TranslatorScreen";
import PageHeader from "@/components/shared/PageHeader";

export default function TranslatePage() {
  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <PageHeader
        label="Emotional translator"
        title="Translate what you feel"
        sub="Type what's on your mind — raw and unfiltered. AI rewrites it into something your partner can truly receive."
      />
      <TranslatorScreen />
    </div>
  );
}
