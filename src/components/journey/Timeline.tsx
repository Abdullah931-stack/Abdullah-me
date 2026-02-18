"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { TimelineEntry } from "@/types";

/**
 * Timeline Component — Journey Page
 * Per 04-PAGE-SPECIFICATIONS.md & 05-ANIMATION-SPEC.md:
 * - Vertical timeline with alternating sides (desktop)
 * - Single-column on mobile
 * - Scroll-triggered animations (stagger + slide in)
 * - Each entry: date, age, title, story, optional image
 */

interface TimelineProps {
    entries: TimelineEntry[];
}

const entryVariants = {
    hidden: (isEven: boolean) => ({
        opacity: 0,
        x: isEven ? 50 : -50,
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const,
        },
    },
};

export default function Timeline({ entries }: TimelineProps) {
    const t = useTranslations("journey");
    const locale = useLocale();

    if (entries.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-[var(--color-text-muted)]">
                    {locale === "ar" ? "لا توجد إدخالات بعد" : "No entries yet"}
                </p>
            </div>
        );
    }

    return (
        <div className="relative mx-auto max-w-4xl">
            {/* Center line */}
            <div className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-[var(--color-border)] md:block" />
            <div className="absolute top-0 left-6 h-full w-px bg-[var(--color-border)] md:hidden" />

            {/* Timeline Entries */}
            <div className="space-y-12">
                {entries.map((entry, index) => {
                    const isEven = index % 2 === 0;
                    const title = locale === "ar" ? entry.titleAr : entry.titleEn;
                    const story = locale === "ar" ? entry.storyAr : entry.storyEn;
                    const dateStr = new Date(entry.date).toLocaleDateString(
                        locale === "ar" ? "ar-SA" : "en-US",
                        { year: "numeric", month: "long" }
                    );

                    return (
                        <motion.div
                            key={entry.id}
                            custom={isEven}
                            variants={entryVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className={`relative flex items-start gap-6 md:gap-0 ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Dot on timeline */}
                            <div className="absolute top-2 left-6 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--color-primary)] md:left-1/2" />

                            {/* Content Card */}
                            <div
                                className={`group relative rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 ms-12 w-full md:ms-0 md:w-[calc(50%-2rem)] ${isEven ? "md:me-auto md:pe-8" : "md:ms-auto md:ps-8"
                                    }`}
                            >
                                {/* Date & Age */}
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="text-sm font-medium text-[var(--color-primary)]">
                                        {dateStr}
                                    </span>
                                    <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                                        {t("age")}: {entry.age}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="mb-3 text-xl font-bold">{title}</h3>

                                {/* Story */}
                                <p className="leading-relaxed text-[var(--color-text-secondary)]">
                                    {story}
                                </p>

                                {/* Optional Image */}
                                {entry.imageUrl && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        className="mt-4 overflow-hidden rounded-lg"
                                    >
                                        <img
                                            src={entry.imageUrl}
                                            alt={title}
                                            className="h-48 w-full object-cover"
                                            loading="lazy"
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
