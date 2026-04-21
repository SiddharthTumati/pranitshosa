import Link from "next/link";
import { Logo } from "./Logo";
import { signOutAction } from "@/app/actions/auth";
import { MobileMenu } from "./MobileMenu";

type Props = {
  chapterName: string;
  fullName: string;
  isAdmin: boolean;
};

export function TopNav({ chapterName, fullName, isAdmin }: Props) {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-navy flex items-center justify-center shrink-0">
            <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 hidden xs:block sm:block">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 leading-tight truncate">
              {chapterName}
            </p>
            <p className="text-sm font-bold text-brand-navy leading-tight truncate">
              Service Tracker
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-navy rounded-md hover:bg-slate-100"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/add"
            className="px-3 py-2 text-sm font-semibold text-white bg-brand-navy rounded-md hover:bg-brand-navy-dark"
          >
            + Add Event
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-brand-orange hover:bg-orange-50 rounded-md"
            >
              Admin
            </Link>
          )}
          <form action={signOutAction} className="contents">
            <button
              type="submit"
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              title={fullName}
            >
              Sign out
            </button>
          </form>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/dashboard/add"
            aria-label="Add event"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-brand-navy text-white text-sm font-semibold active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
            Add
          </Link>
          <MobileMenu isAdmin={isAdmin} fullName={fullName} />
        </div>
      </div>
    </header>
  );
}
