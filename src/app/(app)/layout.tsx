import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/TopNav";
import { ensureProfile } from "@/lib/ensureProfile";

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

  const profile = await ensureProfile(supabase, user);

  const chapterName =
    process.env.NEXT_PUBLIC_CHAPTER_NAME ?? "Marvin Ridge High School HOSA";

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
