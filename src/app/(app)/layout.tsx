import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/TopNav";
import { AUTH_OPEN, demoDisplayName } from "@/lib/access";
import { ensureProfile } from "@/lib/ensureProfile";
import { chapterName } from "@/lib/chapterConfig";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !AUTH_OPEN) redirect("/login");

  let profile = user ? await ensureProfile(supabase, user) : null;

  // Open mode: ensure everyone is admin in DB + UI
  if (user && profile && !profile.is_admin) {
    await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("id", user.id);
    profile = { ...profile, is_admin: true };
  }

  const displayName =
    profile?.full_name?.trim() ||
    user?.email ||
    (AUTH_OPEN ? demoDisplayName() : "");

  return (
    <>
      <TopNav
        chapterName={chapterName()}
        fullName={displayName}
        isAdmin={AUTH_OPEN ? true : (profile?.is_admin ?? false)}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
