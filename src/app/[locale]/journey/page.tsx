import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Timeline from "@/components/journey/Timeline";
import { prisma } from "@/lib/prisma";

/**
 * Journey Page — Scientific Milestone Log
 * Implements §12 of UI/UX Specifications v2.0:
 * - Single-rail reading layout aligned to locale reading direction (§12.3)
 * - Logarithmic time compression between entries (§12.4)
 * - Uncertainty interval brackets (`dateTo`) and in-place project detail modals (§12.5, §12.7)
 */
interface JourneyPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: JourneyPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "journey" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default async function JourneyPage({ params }: JourneyPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("journey");

    // Fetch timeline entries from DB (server component)
    const timelineEntries = await prisma.timelineEntry.findMany({
        orderBy: { order: "asc" },
    });

    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Page Header */}
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("title")}</h1>
                    <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
                        {t("subtitle")}
                    </p>
                </div>

                {/* Timeline */}
                <Timeline entries={timelineEntries} />
            </div>
        </section>
    );
}

