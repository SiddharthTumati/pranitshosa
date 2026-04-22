import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
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
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();

  if (!profile?.is_admin) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10 tracker-card border-l-[3px] border-l-brand-navy">
        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
          MRHS HOSA
        </p>
        <h2 className="mt-2 font-semibold text-lg text-[color:var(--color-brand-ink)] dark:text-white">
          Admin access only
        </h2>
        <p className="text-sm text-[color:var(--muted)] dark:text-slate-300 mt-2">
          This section is restricted to chapter officers and advisors. If you
          think you should have access, ask the existing admin to add your
          email to the admin list.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block px-4 py-2 rounded-[var(--radius-sm)] border border-brand-navy-dark bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-dark"
        >
          Back to my dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
            MRHS HOSA
          </p>
          <h1 className="text-2xl font-bold text-brand-navy dark:text-white mt-0.5">
            Admin panel
          </h1>
          <p className="text-sm text-[color:var(--muted)] dark:text-slate-300">
            Review student submissions and manage the chapter roster.
          </p>
        </div>
        <AdminTabs />
      </div>
      {children}
    </div>
  );
}
