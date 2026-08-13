import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { spaceGrotesk, ibmPlexSansArabic, jetbrainsMono } from "@/app/fonts";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import ScrollRestoration from "@/components/shared/ScrollRestoration";
import SurveyPopup from "@/components/survey/SurveyPopup";

// ─────────────────────────────────────────────
// Static Params — SSG for all locales
// ─────────────────────────────────────────────
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────
export const metadata: Metadata = {
    title: {
        template: "%s | Abdullah",
        default: "Abdullah — Advanced Personal Page",
    },
    description:
        "A professional digital identity showcasing projects, career journey, and visitor engagement",
};

// ─────────────────────────────────────────────
// Layout — v2.0 "Signal & Growth"
// Dark-only — ThemeProvider removed per §2
// ─────────────────────────────────────────────
interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;

    // Enable static rendering for this locale
    setRequestLocale(locale);

    // Load all messages for this locale
    const messages = await getMessages();

    // Determine text direction based on locale
    const dir = locale === "ar" ? "rtl" : "ltr";

    // Typography per §3 — Space Grotesk for Latin, IBM Plex Sans Arabic for Arabic
    const fontFamily =
        locale === "ar"
            ? "var(--font-ibm-plex-arabic), sans-serif"
            : "var(--font-space-grotesk), sans-serif";

    return (
        <html
            lang={locale}
            dir={dir}
            className={`${spaceGrotesk.variable} ${ibmPlexSansArabic.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
            <body
                className="antialiased bg-[var(--color-bg)] text-[var(--color-text)] font-sans selection:bg-[var(--color-accent)]/20"
                style={{ fontFamily }}
                suppressHydrationWarning
            >
                <NextIntlClientProvider messages={messages}>
                    <ScrollRestoration />
                    <Navbar />
                    <PageTransition>
                        <main className="pt-[72px]">{children}</main>
                    </PageTransition>
                    <Footer />
                    <SurveyPopup />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
