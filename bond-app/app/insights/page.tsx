import { createClient } from "@/lib/supabase/server";
import InsightsDashboard from "@/components/insights/InsightsDashboard";

export default async function InsightsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user!.id)
    .gte("created_at", since30d)
    .order("created_at", { ascending: true });

  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10">
      <div className="mb-8">
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-rose-500 mb-2">Insights</p>
        <h1 className="font-serif text-3xl text-ink font-normal">Weekly patterns</h1>
        <p className="text-ink-soft mt-2 text-sm">Based on your check-ins and conversation history.</p>
      </div>
      <InsightsDashboard checkIns={checkIns ?? []} />
    </div>
  );
}
