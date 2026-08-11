import { AdminTabs } from "@/components/admin/AdminTabs";
import { chapterBrandKicker } from "@/lib/chapterConfig";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-orange">
            {chapterBrandKicker()}
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
