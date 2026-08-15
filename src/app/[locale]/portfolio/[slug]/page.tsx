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

