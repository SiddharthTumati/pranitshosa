import { Logo } from "@/components/Logo";
import { AuthThemeToggle } from "@/components/theme/AuthThemeToggle";
import {
  chapterBrandKicker,
  chapterLockup,
  chapterProductTagline,
  chapterTrustBullets,
} from "@/lib/chapterConfig";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function MrhsAuthShell({ title, description, children }: Props) {
  const { school, hosa } = chapterLockup();
  const bullets = chapterTrustBullets();

  return (
    <div className="relative flex-1 px-4 py-10 sm:py-14">
      <AuthThemeToggle />

      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-start">
        {/* Brand column (editorial, asymmetric) */}
        <div className="pt-4 lg:pt-10">
          <div className="flex items-center gap-3">
            <div className="h-10 rounded-xl bg-brand-navy inline-flex items-center justify-center px-2.5 border border-white/15">
              <Logo className="h-7" variant="onNavy" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--muted-2)]">
                {school}
              </p>
              <p className="text-sm font-semibold text-[color:var(--color-brand-ink)] dark:text-slate-100">
                {hosa.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="mt-10 lg:mt-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted-2)]">
              {chapterBrandKicker()}
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.02em] text-[color:var(--color-brand-ink)] dark:text-white leading-[1.02]">
              Service hours,{" "}
              <span className="text-[color:var(--color-brand-navy)] dark:text-slate-100">
                without the spreadsheet.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-[color:var(--muted)] dark:text-slate-300 leading-relaxed">
              {chapterProductTagline()}
            </p>
            <ul className="mt-6 max-w-xl space-y-2.5 text-sm text-[color:var(--muted)] dark:text-slate-300">
              {bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form column */}
        <div className="tracker-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[color:var(--color-brand-ink)] dark:text-white">
                {title}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--muted)] dark:text-slate-300">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
