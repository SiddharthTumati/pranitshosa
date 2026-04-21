import { PT_Sans } from "next/font/google";

/** HOSA brand typography — PT Sans (hosa.org/hosa-brand). */
export const appFont = PT_Sans({
  variable: "--font-app",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
