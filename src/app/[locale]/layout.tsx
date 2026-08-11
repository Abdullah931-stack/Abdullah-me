import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
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
        <>
            {/* Set lang, dir, and font on the html/body from root layout */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        document.documentElement.lang="${locale}";
                        document.documentElement.dir="${dir}";
                        document.body.style.fontFamily="${fontFamily}";
                    `,
                }}
            />
            <NextIntlClientProvider messages={messages}>
                <Navbar />
                <PageTransition>
                    <main className="pt-[72px]">{children}</main>
                </PageTransition>
                <Footer />
                <SurveyPopup />
            </NextIntlClientProvider>
        </>
    );
}
