import Image from "next/image";

/**
 * Official HOSA horizontal mark (`/hosa-official-logo.png`).
 * `onNavy`: padded white plate for MRHS blue tiles.
 * `onLight`: framed for white / light panels (asset includes white).
 */
type LogoVariant = "onNavy" | "onLight";

export function Logo({
  className = "",
  variant = "onLight",
}: {
  className?: string;
  variant?: LogoVariant;
}) {
  const frame =
    variant === "onNavy"
      ? "rounded-lg bg-white p-[5px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-slate-900/[0.06]"
      : "rounded-xl overflow-hidden ring-1 ring-slate-900/[0.05] dark:ring-white/[0.07]";

  const imgClass = "object-contain object-center";

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden ${frame} aspect-[568/362] ${className}`.trim()}
    >
      <Image
        src="/hosa-official-logo.png"
        alt="HOSA — Future Health Professionals"
        fill
        quality={92}
        className={imgClass}
        sizes="(max-width: 640px) 92vw, 360px"
      />
    </span>
  );
}
