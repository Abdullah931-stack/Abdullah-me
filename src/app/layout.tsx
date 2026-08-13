import type { Metadata } from "next";
import "@/app/globals.css";

/**
 * Root Layout — v2.0 "Signal & Growth"
 * Delegated to [locale]/layout.tsx for native SSR lang and dir attributes.
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
  return children;
}
