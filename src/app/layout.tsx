import type { Metadata } from "next";
import "@/app/globals.css";
import { IBM_Plex_Sans_Arabic, Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "500", "700"],
  variable: "--font-ibm",
});

/**
 * Root layout — "Quiet Luxury" Edition
 * - Enforces Dark Mode (Zinc 950)
 * - Fonts: Geist (EN), IBM Plex Sans Arabic (AR)
 * - Required <html> & <body> tags for Next.js 16
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
    <html lang="ar" dir="rtl" className="dark" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${ibmArabic.variable} antialiased bg-background text-foreground font-sans selection:bg-white/20`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
