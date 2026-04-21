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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

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
