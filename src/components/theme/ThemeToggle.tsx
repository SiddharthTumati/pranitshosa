"use client";

import { useTheme } from "./ThemeProvider";

type Props = {
  className?: string;
  /** Larger hit target on mobile auth screens */
  size?: "sm" | "md";
};

export function ThemeToggle({ className = "", size = "sm" }: Props) {
  const { mode, toggle } = useTheme();
  const isDark = mode === "dark";
  const dim = size === "md" ? "h-10 w-10" : "h-9 w-9";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center justify-center rounded-full border border-[var(--border-1)] bg-[var(--surface-1)] text-[color:var(--muted)] hover:text-[color:var(--color-brand-ink)] dark:hover:text-white hover:bg-[var(--surface-2)] ${dim} ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M12 3v1M12 20v1M4.22 4.22l.7.7M18.78 18.78l.7.7M3 12h1M20 12h1M4.22 19.78l.7-.7M18.78 5.22l.7-.7"
          />
          <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.25" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="currentColor"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            opacity="0.9"
          />
        </svg>
      )}
    </button>
  );
}
