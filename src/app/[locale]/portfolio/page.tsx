import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import PortfolioList from "@/components/portfolio/PortfolioList";
import { prisma } from "@/lib/prisma";

/**
 * Portfolio Page — Projects Catalog
 * Implements §6 of UI/UX Specifications v2.0:
 * - Uniform symmetrical card grid (replaces legacy Card Shuffle)
 * - In-place shared-element expansion via Framer Motion layoutId
 * - Distance-based ripple stagger transition
 */
interface PortfolioPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({
    params,
}: PortfolioPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "projects" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    const t = await getTranslations("projects");

    // Fetch published projects directly from DB (server component)
    const projects = await prisma.project.findMany({
        where: { isPublished: true },
        include: {
            images: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
    });

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

                {/* Projects Grid */}
                <PortfolioList projects={projects} />
            </div>
        </section>
    );
}

