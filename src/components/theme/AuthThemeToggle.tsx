"use client";

import { ThemeToggle } from "./ThemeToggle";

/** Absolute-positioned toggle for auth card corner */
export function AuthThemeToggle() {
  return (
    <div className="absolute right-4 top-4 z-10 sm:right-5 sm:top-5">
      <ThemeToggle size="md" />
    </div>
  );
}
