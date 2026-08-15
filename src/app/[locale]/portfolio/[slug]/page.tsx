import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/portfolio/ProjectDetail";
import { prisma } from "@/lib/prisma";

/**
 * Project Detail Page — Standalone Project Route
 * Implements §8 of UI/UX Specifications v2.0:
 * - Evidence-grounded narrative template (Problem → Decision → Measurable Outcome)
 * - Multi-image gallery with node indicators and dark-green scrim (§8.2)
 * - Structured build duration badge and independent repo/preview CTAs (§8.3)
 */
interface ProjectPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const project = await prisma.project.findUnique({
        where: { slug, isPublished: true },
        include: { images: { orderBy: { order: "asc" } } },
    });

    if (!project) return {};

    const isAr = locale === "ar";
    const title = isAr ? project.titleAr : project.titleEn;
    const description = isAr ? project.summaryAr : project.summaryEn;
    const cover = project.images.find((img) => img.isCover) || project.images[0];

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://abdullah-me-m.vercel.app").replace(/\/$/, "");

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `${siteUrl}/${locale}/portfolio/${slug}`,
            type: "article",
            images: cover ? [{ url: cover.url, alt: title }] : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: cover ? [cover.url] : undefined,
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const project = await prisma.project.findUnique({
        where: { slug, isPublished: true },
        include: {
            images: { orderBy: { order: "asc" } },
        },
    });

    if (!project) {
        notFound();
    }

    return <ProjectDetail project={project} />;
}

