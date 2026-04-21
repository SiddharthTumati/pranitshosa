import { Logo } from "@/components/Logo";
import { AuthThemeToggle } from "@/components/theme/AuthThemeToggle";
import { defaultChapterName, parseChapterMrhsHosa } from "@/lib/mrhsBranding";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function MrhsAuthShell({ title, description, children }: Props) {
  const full = defaultChapterName();
  const { school, hosa } = parseChapterMrhsHosa(full);

  return (
    <div className="relative flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
      <AuthThemeToggle />
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-[0_14px_44px_-14px_rgba(0,68,173,0.28)] border-2 border-brand-navy/25 bg-white dark:border-slate-600 dark:bg-slate-900 dark:shadow-[0_14px_44px_-14px_rgba(0,0,0,0.45)]">
        <div className="px-7 sm:px-9 py-8">
          <div className="flex items-start gap-4 sm:gap-5 mb-8">
            <div className="h-16 rounded-2xl bg-brand-navy flex items-center justify-center shrink-0 shadow-[0_6px_20px_-4px_rgba(0,68,173,0.45)] border border-white/25 px-3">
              <Logo className="h-11" variant="onNavy" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex rounded-md bg-brand-orange px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm ring-1 ring-white/25">
                  MRHS HOSA
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-navy/55 dark:text-slate-400">
                  Mavericks
                </span>
              </div>
              <h1 className="leading-[1.05]">
                <span className="block text-lg sm:text-xl font-extrabold tracking-tight text-brand-navy uppercase dark:text-slate-100">
                  {school}
                </span>
                <span className="block text-[2.65rem] sm:text-5xl font-black tracking-tight text-brand-orange drop-shadow-sm">
                  {hosa.toUpperCase()}
                </span>
              </h1>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-brand-navy mb-1 dark:text-slate-100">
            {title}
          </h2>
          <p className="text-sm text-slate-600 mb-6 dark:text-slate-400">
            {description}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}
