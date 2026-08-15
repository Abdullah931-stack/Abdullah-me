import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import ScrollRestoration from "@/components/shared/ScrollRestoration";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ─────────────────────────────────────────────
// Static Params — SSG for all locales
// ─────────────────────────────────────────────
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// ─────────────────────────────────────────────
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
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://abdullah-me-m.vercel.app").replace(/\/$/, "");

    const isAr = locale === "ar";
    const siteTitle = t("siteTitle");
    const siteDescription = t("siteDescription");

    const keywords = isAr
        ? [
            "عبدالله",
            "مهندس برمجيات",
            "مطور أنظمة",
            "ذكاء اصطناعي",
            "محاكاة فيزيائية",
            "Next.js",
            "React",
            "TypeScript",
            "تطوير ويب",
            "هندسة برمجيات متقدمة",
        ]
        : [
            "Abdullah",
            "Software Engineer",
            "Systems Architect",
            "AI Orchestration",
            "Physical Simulation",
            "Next.js",
            "React",
            "TypeScript",
            "Fullstack Engineering",
            "Clean Code",
        ];

    return {
        metadataBase: new URL(siteUrl),
        title: {
            template: isAr ? "%s | عبدالله" : "%s | Abdullah",
            default: siteTitle,
        },
        description: siteDescription,
        keywords,
        authors: [{ name: "Abdullah", url: siteUrl }],
        creator: "Abdullah",
        publisher: "Abdullah",
        alternates: {
            canonical: `${siteUrl}/${locale}`,
            languages: {
                "ar-SA": `${siteUrl}/ar`,
                "en-US": `${siteUrl}/en`,
                "x-default": `${siteUrl}/ar`,
            },
        },
        openGraph: {
            title: siteTitle,
            description: siteDescription,
            url: `${siteUrl}/${locale}`,
            siteName: isAr ? "عبدالله — الصفحة الشخصية" : "Abdullah — Digital Identity",
            locale: isAr ? "ar_SA" : "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: siteTitle,
            description: siteDescription,
            creator: "@abdullah",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
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

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://abdullah-me-m.vercel.app").replace(/\/$/, "");

    // JSON-LD Structured Data (Schema.org Person & WebSite)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": `${siteUrl}/#person`,
                name: "Abdullah",
                alternateName: "عبدالله",
                url: siteUrl,
                jobTitle: "Senior Software Engineer & Systems Architect",
                description:
                    locale === "ar"
                        ? "مهندس برمجيات متخصص في بناء الأنظمة المعقدة وهندسة حلول الذكاء الاصطناعي والمحاكاة الفيزيائية."
                        : "Software engineer specializing in systems architecture, AI model orchestration, and numerical simulations.",
                knowsAbout: [
                    "Systems Architecture",
                    "AI Orchestration",
                    "Full-Stack Development",
                    "Next.js",
                    "TypeScript",
                    "Clean Code",
                ],
                sameAs: [
                    "https://github.com",
                    "https://linkedin.com",
                ],
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                url: siteUrl,
                name: "Abdullah Portfolio",
                publisher: {
                    "@id": `${siteUrl}/#person`,
                },
                inLanguage: [locale === "ar" ? "ar-SA" : "en-US"],
            },
        ],
    };

    return (
        <div
            lang={locale}
            dir={dir}
            style={{ fontFamily }}
            className="min-h-screen flex flex-col"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NextIntlClientProvider messages={messages}>
                <ScrollRestoration />
                <Navbar />
                <PageTransition>
                    <main className="pt-[72px]">{children}</main>
                </PageTransition>
                <Footer />
                <Analytics />
                <SpeedInsights />
            </NextIntlClientProvider>
        </div>
    );
}

