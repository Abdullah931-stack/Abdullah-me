import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";

/**
 * Contact Page — Multi-Intent Smart Contact Form
 * Implements §9 of UI/UX Specifications v2.0:
 * - Neutral framing with 4 structured intent pathways (General, Issue Report, Academic, Collaboration)
 * - Dynamic project issue picker with custom text fallback
 * - Client-side draft persistence with 500ms debounce and 10-minute TTL
 * - PulseBorder-wrapped primary action and clear form button
 */
interface ContactPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: ContactPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "contact" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("contact");

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Page Header */}
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("title")}</h1>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Contact Form */}
                <ContactForm />
            </div>
        </section>
    );
}
