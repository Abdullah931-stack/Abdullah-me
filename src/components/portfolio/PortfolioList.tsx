"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { Project } from "@/types";

/**
 * Portfolio List — Grid of Project Cards
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
 * - Hover effect: subtle scale + shadow
 * - Stagger entrance animation
 */

interface PortfolioListProps {
    projects: Project[];
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const,
        },
    }),
};

export default function PortfolioList({ projects }: PortfolioListProps) {
    const t = useTranslations("projects");
    const locale = useLocale();

    if (projects.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-[var(--color-text-muted)]">{t("noProjects")}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
                const title = locale === "ar" ? project.titleAr : project.titleEn;
                const summary =
                    locale === "ar" ? project.summaryAr : project.summaryEn;
                const coverImage = project.images?.[0];

                return (
                    <motion.div
                        key={project.id}
                        custom={index}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <Link href={`/${locale}/portfolio/${project.slug}`}>
                            <article
                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                            >
                                {/* Cover Image */}
                                {coverImage && (
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={coverImage.url}
                                            alt={
                                                locale === "ar"
                                                    ? coverImage.altAr || title
                                                    : coverImage.altEn || title
                                            }
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                )}

                                {/* Card Body */}
                                <div className="p-6">
                                    <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-[var(--color-primary)]">
                                        {title}
                                    </h3>

                                    <p className="mb-4 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
                                        {summary}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.skills.slice(0, 4).map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-xs text-[var(--color-text-muted)]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {project.skills.length > 4 && (
                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                +{project.skills.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
