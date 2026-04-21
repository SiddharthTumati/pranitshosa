import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { appFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOSA Service Tracker",
  description: "MRHS HOSA — log service events and hours.",
  manifest: "/manifest.webmanifest",
  applicationName: "HOSA Tracker",
  appleWebApp: {
    capable: true,
    title: "HOSA Tracker",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0044ad",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${appFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
