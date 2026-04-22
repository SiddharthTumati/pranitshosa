"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { signOutAction } from "@/app/actions/auth";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./theme/ThemeToggle";

type Props = {
  chapterName: string;
  fullName: string;
  isAdmin: boolean;
};

export function TopNav({ chapterName, fullName, isAdmin }: Props) {
  const pathname = usePathname();
  const linkBase =
    "text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-navy dark:hover:text-white";
  const linkActive = "underline underline-offset-4 decoration-2";

  return (
    <header className="no-print bg-[var(--surface-0)] border-b border-[var(--border-2)] sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-baseline gap-3 min-w-0">
          <div className="h-8 sm:h-9 rounded-xl bg-brand-navy flex items-center justify-center shrink-0 px-1.5 border border-white/15">
            <Logo className="h-[1.35rem] sm:h-[1.5rem]" variant="onNavy" />
          </div>
          <div className="min-w-0 hidden xs:block sm:block">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[color:var(--muted-2)] leading-tight truncate">
              {chapterName}
            </p>
            <p className="text-sm font-semibold text-[color:var(--color-brand-ink)] dark:text-slate-100 leading-tight truncate">
              Service Tracker
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`${linkBase} ${
              pathname === "/dashboard" ? linkActive : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/add"
            className={`${linkBase} ${
              pathname?.startsWith("/dashboard/add") ? linkActive : ""
            }`}
          >
            Add
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`${linkBase} ${
                pathname?.startsWith("/admin") ? linkActive : ""
              }`}
            >
              Admin
            </Link>
          )}
          <ThemeToggle
            className="shrink-0"
          />
          <form action={signOutAction} className="contents">
            <button
              type="submit"
              className="text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--color-brand-ink)] dark:hover:text-white underline-offset-4 hover:underline"
              title={fullName}
            >
              Sign out
            </button>
          </form>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle className="shrink-0" />
          <Link
            href="/dashboard/add"
            aria-label="Add event"
            className="inline-flex items-center px-3 py-2 rounded-full border border-[var(--border-1)] bg-[var(--surface-1)] text-sm font-semibold text-[color:var(--color-brand-ink)] dark:text-slate-100 active:scale-95 transition"
          >
            Add
          </Link>
          <MobileMenu isAdmin={isAdmin} fullName={fullName} />
        </div>
      </div>
    </header>
  );
}
