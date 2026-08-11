import type { Metadata } from "next";
import "@/app/globals.css";
import { spaceGrotesk, ibmPlexSansArabic, jetbrainsMono } from "@/app/fonts";

/**
 * Root Layout — v2.0 "Signal & Growth"
 * - Dark-only (§2 — no theme toggle)
 * - Fonts: Space Grotesk (EN), IBM Plex Sans Arabic (AR), JetBrains Mono (labels)
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Abdullah",
    default: "Abdullah — Advanced Personal Page",
  },
  description:
    "A professional digital identity showcasing projects, career journey, and visitor engagement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${spaceGrotesk.variable} ${ibmPlexSansArabic.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-[var(--color-bg)] text-[var(--color-text)] font-sans selection:bg-[var(--color-accent)]/20"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
