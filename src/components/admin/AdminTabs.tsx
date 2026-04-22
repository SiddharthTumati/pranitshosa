"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Pending" },
  { href: "/admin/all", label: "All events" },
  { href: "/admin/members", label: "Members" },
] as const;

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-0.5 bg-[var(--surface-1)] p-1 border border-[var(--border-1)] rounded-[var(--radius-sm)]">
      {tabs.map(({ href, label }) => {
        const active =
          href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-[calc(var(--radius-sm)-2px)] text-sm font-medium transition-colors ${
              active
                ? "bg-brand-navy text-white"
                : "text-[color:var(--muted)] hover:text-[color:var(--color-brand-ink)] dark:hover:text-white hover:bg-[var(--surface-2)]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
