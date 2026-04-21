import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/TopNav";
import type { Profile } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  // Self-heal missing profile rows (e.g. user created before trigger existed).
  if (!profile) {
    const email = user.email ?? "";
    const { data: isAdmin, error: rpcErr } = await supabase.rpc(
      "email_is_admin",
      { p_email: email }
    );

    if (!rpcErr) {
      await supabase.from("profiles").insert({
        id: user.id,
        full_name:
          (user.user_metadata?.full_name as string | undefined) ??
          user.user_metadata?.name ??
          "",
        is_admin: Boolean(isAdmin),
      });

      const { data: refetched } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle<Profile>();

      profile = refetched;
    }
  }

  const chapterName = process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "HOSA Chapter";

  return (
    <>
      <TopNav
        chapterName={chapterName}
        fullName={profile?.full_name || user.email || ""}
        isAdmin={profile?.is_admin ?? false}
      />
      <main className="flex-1">{children}</main>
    </>
  );
}
