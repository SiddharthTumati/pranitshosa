import Link from "next/link";
import { redirect } from "next/navigation";
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
      <div className="max-w-md mx-auto p-6 mt-10 tracker-card">
        <h2 className="font-bold text-lg dark:text-slate-100">
          Admin access only
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          This section is restricted to chapter officers and advisors. If you
          think you should have access, ask the existing admin to add your
          email to the admin list.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-brand-navy text-white font-semibold"
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
          <h1 className="text-2xl font-bold text-brand-navy dark:text-slate-100">
            Admin panel
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Review student submissions and manage the chapter roster.
          </p>
        </div>
        <nav className="flex gap-1 bg-white dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200 dark:border-slate-600 shadow-sm">
          <AdminTab href="/admin" label="Pending" />
          <AdminTab href="/admin/all" label="All events" />
          <AdminTab href="/admin/members" label="Members" />
        </nav>
      </div>
      {children}
    </div>
  );
}

function AdminTab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {label}
    </Link>
  );
}
