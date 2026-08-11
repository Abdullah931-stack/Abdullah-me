import { Space_Grotesk, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";

/**
 * Display / Headings (Latin, numerals) — Space Grotesk
 * Geometric, technical character — matches systems/signals identity (§3)
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * Arabic body & headings — IBM Plex Sans Arabic
 * High-quality RTL rendering at all weights (§3)
 */
export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * Technical labels — JetBrains Mono
 * Eyebrow text, timestamps, tags, section markers (§3)
 * Used narrowly, NOT for body copy
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "700"],
});
