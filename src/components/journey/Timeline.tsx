"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { TimelineEntry } from "@/types";
import {
  computeGap,
  daysBetween,
  getEffectiveDate,
  getRangeDurationDays,
  computeRangeBracketHeight,
  computeRailExtensions,
  isProjectLinked,
} from "./timelineMath";

/**
 * Timeline — v2.0 "Lab Notebook / Signal & Growth" Journey Page
 *
 * Implements §12 of UI/UX Spec:
 * - §12.1: Single rail layout (removed alternating zigzag)
 * - §12.2: Lab notebook measurement log register with JetBrains Mono timestamps
 * - §12.3: Single rail on reading-direction-leading side (RTL right, LTR left) using CSS Logical Properties
 * - §12.4: Logarithmic spacing formula gap(Δt) = base + k · ln(1 + Δt_days / τ)
 * - §12.5: Translucent SVG curly bracket '{' / '}' on outer margin edge, log-scaled height, centered on node
 * - §12.6: Per-entry accordion expand in-place (no PulseBorder)
 * - §12.7: Content-duplication rule (brief context + "Full details →" for projects)
 * - §12.8: Small 28px non-interactive logo/badge beside measurement point
 */

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  const t = useTranslations("journey");
  const locale = useLocale();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isRTL = locale === "ar";

  // Sort entries chronologically by effective date (midpoint for ranged dates)
  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) =>
        getEffectiveDate(a).getTime() - getEffectiveDate(b).getTime()
    );
  }, [entries]);

  // Compute log-compressed gap for each entry pair (§12.4)
  const gaps = useMemo(() => {
    return sortedEntries.map((entry, i) => {
      if (i === 0) return 0;
      const prev = getEffectiveDate(sortedEntries[i - 1]);
      const curr = getEffectiveDate(entry);
      return computeGap(daysBetween(prev, curr));
    });
  }, [sortedEntries]);

  // Compute virtual rail launching extensions to encompass first/last range intervals (§12.5)
  const { topExtension, bottomExtension } = useMemo(() => {
    return computeRailExtensions(sortedEntries);
  }, [sortedEntries]);

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <p style={{ color: "var(--color-muted)" }}>
          {locale === "ar" ? "لا توجد إدخالات بعد" : "No entries yet"}
        </p>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative mx-auto max-w-3xl px-4 sm:px-6"
    >
      {/* §12.3 — Single measurement rail line with virtual epoch top-down glowing ray using CSS Logical Properties */}
      <div
        className="absolute"
        style={{
          top: `-${topExtension}px`,
          height: `calc(100% + ${topExtension + bottomExtension}px)`,
          width: "2px",
          background: `linear-gradient(to bottom, var(--color-accent) 0%, rgba(74, 222, 128, 0.6) 20%, var(--color-card-border) 70%, rgba(255, 255, 255, 0.05) 100%)`,
          insetInlineStart: "var(--rail-offset, 1.5rem)",
        }}
      >
        {/* Topmost Virtual Rail Launching Node (virtual epoch start date) */}
        <div
          className="absolute -top-1 -left-[3px] rounded-full"
          style={{
            width: "8px",
            height: "8px",
            background: "var(--color-accent)",
            boxShadow:
              "0 0 12px var(--color-accent), 0 0 20px rgba(74, 222, 128, 0.8)",
          }}
        />
      </div>

      {/* Timeline Entries */}
      <div className="flex flex-col">
        {sortedEntries.map((entry, index) => {
          const title = locale === "ar" ? entry.titleAr : entry.titleEn;
          const story = locale === "ar" ? entry.storyAr : entry.storyEn;
          const dateStr = new Date(entry.date).toLocaleDateString(
            locale === "ar" ? "ar-SA" : "en-US",
            { year: "numeric", month: "long" }
          );
          const isExpanded = expandedId === entry.id;
          const hasRange = !!entry.dateTo;
          const rangeDays = getRangeDurationDays(entry);
          const bracketHeight = computeRangeBracketHeight(rangeDays);
          const hasProjectLink = isProjectLinked(entry);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              // §12.4 — Log-compressed spacing
              style={{ marginTop: index === 0 ? 0 : `${gaps[index]}px` }}
              className="relative"
            >
              {/* Rail measurement marker (§12.5) */}
              <div
                className="absolute top-3 z-10 flex flex-col items-center justify-center"
                style={{
                  insetInlineStart:
                    "calc(var(--rail-offset, 1.5rem) - 0.3125rem)",
                  width: "12px",
                }}
              >
                {/* Precise Measurement Node on the rail line */}
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    boxShadow: "0 0 10px rgba(74, 222, 128, 0.5)",
                  }}
                />
              </div>

              {/* §12.5 — Uncertainty Curly Bracket '{' / '}' centered on measurement node, on outer margin edge */}
              {hasRange && (
                <div
                  className="absolute z-10 flex items-center justify-center pointer-events-none"
                  style={{
                    top: "17px",
                    transform: "translateY(-50%)",
                    // Dynamic outer margin edge using CSS Logical Property
                    insetInlineStart:
                      "calc(var(--rail-offset, 1.5rem) - 1.125rem)",
                    height: `${bracketHeight}px`,
                  }}
                  title={
                    locale === "ar"
                      ? `نطاق زمني مقدر (${Math.round(rangeDays)} يوم)`
                      : `Estimated range interval (${Math.round(rangeDays)} days)`
                  }
                >
                  <svg
                    viewBox="0 0 16 100"
                    preserveAspectRatio="none"
                    style={{
                      height: `${bracketHeight}px`,
                      width: "14px",
                      filter: "drop-shadow(0 0 4px rgba(74, 222, 128, 0.5))",
                    }}
                  >
                    {isRTL ? (
                      // RTL: Bracket at outer right edge, curved back at x=14, tips pointing left towards rail & text card
                      <path
                        d="M 14 2 C 4 2, 4 25, 4 45 C 4 48, 1 50, 1 50 C 1 50, 4 52, 4 55 C 4 75, 4 98, 14 98"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    ) : (
                      // LTR: Bracket at outer left edge, curved back at x=2, tips pointing right towards rail & text card
                      <path
                        d="M 2 2 C 12 2, 12 25, 12 45 C 12 48, 15 50, 15 50 C 15 50, 12 52, 12 55 C 12 75, 12 98, 2 98"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    )}
                  </svg>
                </div>
              )}

              {/* §12.8 — Small non-interactive logo/badge (28px) */}
              {entry.imageUrl && (
                <div
                  className="absolute top-2"
                  style={{
                    insetInlineStart:
                      "calc(var(--rail-offset, 1.5rem) + 1rem)",
                  }}
                >
                  <img
                    src={entry.imageUrl}
                    alt={title}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      objectFit: "cover",
                      border: "1px solid var(--color-card-border)",
                    }}
                  />
                </div>
              )}

              {/* Entry Content Card — §12.6: in-place accordion expand using dynamic CSS Logical Property */}
              <div
                className="cursor-pointer rounded-xl p-5 transition-all duration-300"
                style={{
                  marginInlineStart: entry.imageUrl
                    ? "calc(var(--rail-offset, 1.5rem) + 3.25rem)"
                    : "calc(var(--rail-offset, 1.5rem) + 1.75rem)",
                  background: isExpanded
                    ? "rgba(255, 255, 255, 0.04)"
                    : "rgba(255, 255, 255, 0.015)",
                  border: "1px solid var(--color-card-border)",
                  textAlign: "start",
                }}
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                {/* Date & Age — §12.2: JetBrains Mono timestamps */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: "var(--color-accent)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    {dateStr}
                    {hasRange &&
                      entry.dateTo &&
                      ` — ${new Date(entry.dateTo).toLocaleDateString(
                        locale === "ar" ? "ar-SA" : "en-US",
                        { year: "numeric", month: "long" }
                      )}`}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-mono"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-muted)",
                      border: "1px solid var(--color-card-border)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                    }}
                  >
                    {t("age")}: {entry.age}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: "var(--color-text)" }}
                >
                  {title}
                </h3>

                {/* §12.6 & §12.7 — Accordion expand with Content Duplication Rule */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="mt-3 leading-relaxed text-sm"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {story}
                      </p>

                      {/* §12.7 — Project link when timeline entry corresponds to portfolio project */}
                      {hasProjectLink && entry.projectSlug && (
                        <div className="mt-4 pt-3 border-t border-[var(--color-card-border)]">
                          <Link
                            href={`/${locale}/projects/${entry.projectSlug}`}
                            className="inline-flex items-center text-xs font-medium transition-colors"
                            style={{
                              color: "var(--color-accent)",
                              fontFamily:
                                "var(--font-jetbrains-mono), monospace",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {locale === "ar"
                              ? "التفاصيل الكاملة للمشروع ←"
                              : "Full project details →"}
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed preview — first line only */}
                {!isExpanded && (
                  <p
                    className="line-clamp-1 text-sm mt-1"
                    style={{ color: "var(--color-muted)", opacity: 0.7 }}
                  >
                    {story}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
