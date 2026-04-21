"use client";

export function PrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 rounded-lg bg-brand-navy text-white font-semibold text-sm hover:bg-brand-navy-dark"
    >
      Print / Save as PDF
    </button>
  );
}
