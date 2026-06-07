"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

export function useMessages(limit = 50) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading]   = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("messages").select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(limit);
    setMessages(data ?? []);
    setLoading(false);
  }, [limit]);

  useEffect(() => { load(); }, [load]);

  return { messages, loading, refetch: load };
}
