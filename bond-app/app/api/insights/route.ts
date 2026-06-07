import { NextRequest, NextResponse } from "next/server";
import { generateWeeklyInsight } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("mood, intensity, created_at")
    .eq("user_id", user.id)
    .gte("created_at", since);

  const insight = await generateWeeklyInsight(checkIns ?? []);
  return NextResponse.json({ insight });
}
