import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import ScrollRestoration from "@/components/shared/ScrollRestoration";
import { Analytics } from "@vercel/analytics/next";

// ─────────────────────────────────────────────
// Static Params — SSG for all locales
// ─────────────────────────────────────────────
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// ─────────────────────────────────────────────
// Dynamic Metadata using Next-Intl "common" namespace
// ─────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "common" });

    return {
        title: {
            template: locale === "ar" ? "%s | عبدالله" : "%s | Abdullah",
            default: t("siteTitle"),
        },
        description: t("siteDescription"),
    };
}

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
        <div
            lang={locale}
            dir={dir}
            style={{ fontFamily }}
            className="min-h-screen flex flex-col"
        >
            <NextIntlClientProvider messages={messages}>
                <ScrollRestoration />
                <Navbar />
                <PageTransition>
                    <main className="pt-[72px]">{children}</main>
                </PageTransition>
                <Footer />
                <Analytics />
            </NextIntlClientProvider>
        </div>
    );
}

