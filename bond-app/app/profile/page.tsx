import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/profile/ProfileForm";
import PageHeader from "@/components/shared/PageHeader";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
  return (
    <div className="p-6 md:p-10 pb-24 md:pb-10 max-w-xl">
      <PageHeader label="Profile" title="Your relationship profile" sub="Help Bond understand you and your partner better." />
      <ProfileForm profile={profile} userId={user!.id} />
    </div>
  );
}
