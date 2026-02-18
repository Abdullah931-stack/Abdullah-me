"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { Project } from "@/types";

/**
 * Card Shuffle Component — Homepage Projects Showcase
 * Per 04-PAGE-SPECIFICATIONS.md & 05-ANIMATION-SPEC.md:
 * - Stacked cards with shuffle animation
 * - Top card shows project preview
 * - Click/swipe to shuffle to next card
 * - Max 5 featured projects
 *
 * Animation: Cards rotate slightly and overlap.
 * Front card animates out, next card scales up.
 */

interface CardShuffleProps {
    projects: Project[];
}

export default function CardShuffle({ projects }: CardShuffleProps) {
    const t = useTranslations("projects");
    const locale = useLocale();
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-shuffle every 5 seconds
    useEffect(() => {
        if (projects.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % projects.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [projects.length]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % projects.length);
    };

    const handlePrev = () => {
        setActiveIndex(
            (prev) => (prev - 1 + projects.length) % projects.length
        );
    };

    if (projects.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="text-[var(--color-text-muted)]">{t("noProjects")}</p>
            </div>
        );
    }

    return (
        <section id="projects" className="py-24">
            <div className="mx-auto max-w-7xl px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("title")}</h2>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                        {t("subtitle")}
                    </p>
                </motion.div>

                {/* Card Stack */}
                <div className="relative mx-auto h-[450px] max-w-lg">
                    <AnimatePresence mode="popLayout">
                        {projects.map((project, index) => {
                            const isActive = index === activeIndex;
                            const offset = (index - activeIndex + projects.length) % projects.length;

                            // Only show top 3 cards
                            if (offset > 2) return null;

                            return (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ scale: 0.9, opacity: 0, y: 40 }}
                                    animate={{
                                        scale: 1 - offset * 0.05,
                                        opacity: 1 - offset * 0.2,
                                        y: offset * -15,
                                        rotateZ: offset * (index % 2 === 0 ? 1.5 : -1.5),
                                        zIndex: projects.length - offset,
                                    }}
                                    exit={{
                                        scale: 0.8,
                                        opacity: 0,
                                        y: -100,
                                        rotateZ: 10,
                                        transition: { duration: 0.4 },
                                    }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="absolute inset-0 cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md"
                                    style={{
                                        boxShadow:
                                            offset === 0
                                                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                                                : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                    }}
                                    onClick={isActive ? undefined : handleNext}
                                >
                                    {/* Card Content — only render details for active */}
                                    <div className="flex h-full flex-col p-8">
                                        {/* Project Title */}
                                        <h3 className="mb-3 text-2xl font-bold">
                                            {locale === "ar" ? project.titleAr : project.titleEn}
                                        </h3>

                                        {/* Project Summary */}
                                        <p className="mb-6 line-clamp-3 flex-1 text-[var(--color-text-secondary)]">
                                            {locale === "ar"
                                                ? project.summaryAr
                                                : project.summaryEn}
                                        </p>

                                        {/* Skills Tags */}
                                        <div className="mb-6 flex flex-wrap gap-2">
                                            {project.skills.slice(0, 5).map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* View Project Link */}
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <Link
                                                    href={`/${locale}/portfolio/${project.slug}`}
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
                                                >
                                                    {t("viewProject")} →
                                                </Link>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Navigation Dots + Arrows */}
                {projects.length > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            onClick={handlePrev}
                            className="rounded-[12px] border border-[var(--color-border)] p-2 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            aria-label="Previous project"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        <div className="flex gap-2">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? "w-8 bg-[var(--color-primary)]"
                                        : "w-2 bg-[var(--color-text-muted)]"
                                        }`}
                                    aria-label={`Go to project ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="rounded-[12px] border border-[var(--color-border)] p-2 transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            aria-label="Next project"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
