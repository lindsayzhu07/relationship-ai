import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppSidebar from "@/components/ui/AppSidebar";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
  return (
    <div className="flex min-h-screen bg-[#faf8f6]">
      <AppSidebar profile={profile} userId={user.id} />
      <main className="flex-1 min-h-screen overflow-auto">{children}</main>
    </div>
  );
}
