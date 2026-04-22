"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

export function MobileMenu({
  isAdmin,
  fullName,
}: {
  isAdmin: boolean;
  fullName: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition"
      >
        <Menu className="w-6 h-6" aria-hidden />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-xl flex flex-col border-l border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                {fullName}
              </p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>

            <nav className="flex flex-col p-2 gap-1 flex-1">
              <MenuLink href="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </MenuLink>
              <MenuLink href="/dashboard/add" onClick={() => setOpen(false)}>
                Add Event
              </MenuLink>
              <MenuLink href="/export" onClick={() => setOpen(false)}>
                Export as PDF
              </MenuLink>
              {isAdmin && (
                <>
                  <div className="mt-3 mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Admin
                  </div>
                  <MenuLink href="/admin" onClick={() => setOpen(false)}>
                    Pending approvals
                  </MenuLink>
                  <MenuLink href="/admin/all" onClick={() => setOpen(false)}>
                    All events
                  </MenuLink>
                  <MenuLink
                    href="/admin/members"
                    onClick={() => setOpen(false)}
                  >
                    Members
                  </MenuLink>
                </>
              )}
            </nav>

            <form
              action={signOutAction}
              className="p-3 border-t border-slate-200 dark:border-slate-700"
            >
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-3 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
    >
      {children}
    </Link>
  );
}
