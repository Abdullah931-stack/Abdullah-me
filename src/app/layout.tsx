import type { Metadata } from "next";
import "@/app/globals.css";
import { spaceGrotesk, ibmPlexSansArabic, jetbrainsMono } from "@/app/fonts";

/**
 * Root Layout — v2.0 "Signal & Growth"
 * Provides root <html> and <body> tags required by Next.js 16 App Router.
 * Locale-specific attributes (lang/dir) are applied in [locale]/layout.tsx wrapper.
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
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${ibmPlexSansArabic.variable} ${jetbrainsMono.variable}`}
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

