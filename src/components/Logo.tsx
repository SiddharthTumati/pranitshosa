export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="14" y="10" width="36" height="48" rx="6" fill="#fff" />
      <rect x="22" y="6" width="20" height="8" rx="3" fill="var(--color-brand-navy)" />
      <circle cx="24" cy="24" r="2.4" fill="var(--color-brand-navy)" />
      <circle cx="24" cy="34" r="2.4" fill="var(--color-brand-navy)" />
      <circle cx="24" cy="44" r="2.4" fill="var(--color-brand-navy)" />
      <path
        d="M30 22.5l3 3 6-6"
        stroke="var(--color-brand-orange)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M30 32.5l3 3 6-6"
        stroke="var(--color-brand-orange)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M30 42.5l3 3 6-6"
        stroke="var(--color-brand-orange)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
