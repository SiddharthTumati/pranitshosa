import type { ReactNode } from "react";

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[color:var(--muted)] dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-600 dark:text-red-400">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block text-xs text-[color:var(--muted-2)] dark:text-slate-400 mt-1">
          {hint}
        </span>
      )}
    </label>
  );
}
