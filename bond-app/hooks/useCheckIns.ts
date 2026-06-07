"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CheckIn } from "@/types";

export function useCheckIns(limit = 10) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading]   = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("check_ins").select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    setCheckIns(data ?? []);
    setLoading(false);
  }, [limit]);

  useEffect(() => { load(); }, [load]);

  async function addCheckIn(ci: Omit<CheckIn, "id" | "user_id" | "created_at">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("check_ins").insert({ ...ci, user_id: user.id });
    load();
  }

  return { checkIns, loading, refetch: load, addCheckIn };
}
