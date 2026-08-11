import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Timeline from "@/components/journey/Timeline";
import { prisma } from "@/lib/prisma";

/**
 * Journey Page — "My Story"
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Page header with title + subtitle
 * - Timeline with scroll-triggered animations
 */
interface JourneyPageProps {
    params: Promise<{ locale: string }>;
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

