"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { TimelineEntry } from "@/types";

/**
 * Timeline — v2.0 "Signal & Growth" Journey Page
 *
 * Implements §11 of UI/UX Spec:
 * - §11.1: Removed alternating zigzag layout
 * - §11.2: No code/git metaphors — lab notebook register
 * - §11.3: Single rail, reading-direction-leading side (RTL right, LTR left)
 * - §11.4: Spacing algorithm — log-compressed by real elapsed time
 * - §11.5: Uncertainty brackets for ranged dates (dateTo field, §12.2)
 * - §11.6: Per-entry expand — accordion in-place, NOT card-grid pattern
 * - §11.7: Content-duplication rule (brief for projects, full for standalone)
 * - §11.8: Imagery — small 24-32px non-interactive badge
 * - §7.1: NO PulseBorder on timeline entries (explicitly excluded)
 *
 * Timestamps in JetBrains Mono (§11.2, §3)
 */

interface TimelineProps {
  entries: TimelineEntry[];
}

/**
 * §11.4 — Logarithmic spacing algorithm
 * gap(Δt) = base + k · ln(1 + Δt_days / τ)
 */
const SPACING_BASE = 40;  // Minimum readable spacing floor (px)
const SPACING_K = 30;     // Scale factor
const SPACING_TAU = 30;   // Calibration constant (days)

function computeGap(daysDiff: number): number {
  return SPACING_BASE + SPACING_K * Math.log(1 + daysDiff / SPACING_TAU);
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.abs(
    (new Date(d2).getTime() - new Date(d1).getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * §11.5 — For uncertain entries with dateTo, compute effective position
 * as the midpoint of the range
 */
function getEffectiveDate(entry: TimelineEntry): Date {
  if (entry.dateTo) {
    const start = new Date(entry.date).getTime();
    const end = new Date(entry.dateTo).getTime();
    return new Date((start + end) / 2);
  }
  return new Date(entry.date);
}

export default function Timeline({ entries }: TimelineProps) {
  const t = useTranslations("journey");
  const locale = useLocale();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isRTL = locale === "ar";

  // Sort entries chronologically and compute spacing
  const sortedEntries = useMemo(() => {
    return [...entries].sort(
      (a, b) =>
        getEffectiveDate(a).getTime() - getEffectiveDate(b).getTime()
    );
  }, [entries]);

  // Compute gap for each entry pair (§11.4)
  const gaps = useMemo(() => {
    return sortedEntries.map((entry, i) => {
      if (i === 0) return 0;
      const prev = getEffectiveDate(sortedEntries[i - 1]);
      const curr = getEffectiveDate(entry);
      return computeGap(daysBetween(prev, curr));
    });
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
    <div className="relative mx-auto max-w-3xl">
      {/* §11.3 — Single rail line, reading-direction-leading side */}
      <div
        className="absolute top-0 h-full"
        style={{
          width: "2px",
          background: `linear-gradient(to bottom, transparent, var(--color-card-border) 5%, var(--color-card-border) 95%, transparent)`,
          [isRTL ? "right" : "left"]: "20px",
        }}
      />

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

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              // §11.4 — Log-compressed spacing
              style={{ marginTop: index === 0 ? 0 : `${gaps[index]}px` }}
              className="relative"
            >
              {/* Rail point marker */}
              <div
                className="absolute top-3 z-10"
                style={{
                  [isRTL ? "right" : "left"]: "14px",
                }}
              >
                {hasRange ? (
                  // §11.5 — Uncertainty bracket indicator
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "2px",
                      border: "2px solid var(--color-accent)",
                      background: "transparent",
                      opacity: 0.7,
                    }}
                  />
                ) : (
                  // Precise point
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: "var(--color-accent)",
                      boxShadow: "0 0 8px rgba(74, 222, 128, 0.3)",
                    }}
                  />
                )}
              </div>

              {/* §11.8 — Optional image badge (24-32px) */}
              {entry.imageUrl && (
                <div
                  className="absolute top-2"
                  style={{
                    [isRTL ? "right" : "left"]: "38px",
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
                    }}
                  />
                </div>
              )}

              {/* Entry Content — §11.6: accordion in-place expand */}
              <div
                className="cursor-pointer rounded-xl p-5 transition-all duration-300"
                style={{
                  [isRTL ? "marginRight" : "marginLeft"]: entry.imageUrl
                    ? "76px"
                    : "48px",
                  background: isExpanded
                    ? "rgba(255, 255, 255, 0.04)"
                    : "transparent",
                }}
                onClick={() =>
                  setExpandedId(isExpanded ? null : entry.id)
                }
              >
                {/* Date & Age — §11.2: JetBrains Mono timestamps */}
                <div className="flex items-center gap-3 mb-2">
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
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-muted)",
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

                {/* §11.6 — Accordion expand */}
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed preview — first line only */}
                {!isExpanded && (
                  <p
                    className="line-clamp-1 text-sm"
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
