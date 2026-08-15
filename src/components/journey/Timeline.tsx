"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { TimelineEntry, Project } from "@/types";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import PulseBorder from "@/components/shared/PulseBorder";
import ProjectDetail from "@/components/portfolio/ProjectDetail";
import {
  computeGap,
  daysBetween,
  getEffectiveDate,
  getRangeDurationDays,
  computeRangeBracketHeight,
  computeRailExtensions,
} from "./timelineMath";

interface TimelineProps {
  entries: TimelineEntry[];
}

export default function Timeline({ entries }: TimelineProps) {
  const t = useTranslations("journey");
  const locale = useLocale();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // In-place modal state for viewing linked project detail without losing scroll position
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const isRTL = locale === "ar";

  // Sort entries chronologically by effective date
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

  // Compute virtual rail launching extensions (§12.5)
  const { topExtension, bottomExtension } = useMemo(() => {
    return computeRailExtensions(sortedEntries);
  }, [sortedEntries]);

  // Fetch project details for in-place modal display without changing scroll position (§12.7)
  async function openProjectModal(slug: string, e?: React.MouseEvent) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setLoadingSlug(slug);
    setIsLoadingProject(true);
    try {
      const res = await fetch(`/api/public/projects/${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSelectedProject(data.data);
      }
    } catch {
      // Handle error silently
    } finally {
      setIsLoadingProject(false);
      setLoadingSlug(null);
    }
  }

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <p style={{ color: "var(--color-muted)" }}>
          {t("noEntries")}
        </p>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative mx-auto max-w-3xl px-4 sm:px-6"
    >
      {/* §12.3 — Single measurement rail line */}
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
        {/* Topmost Virtual Rail Launching Node */}
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

      {/* Timeline entries list */}
      <div className="relative">
        {sortedEntries.map((entry, index) => {
          const gap = gaps[index];
          const isExpanded = expandedId === entry.id;
          const hasRange = Boolean(entry.dateTo);

          const title = locale === "ar" ? entry.titleAr : entry.titleEn;
          const summary =
            locale === "ar"
              ? entry.summaryAr || entry.storyAr || ""
              : entry.summaryEn || entry.storyEn || "";
          const fullStory =
            locale === "ar" ? entry.storyAr || "" : entry.storyEn || "";

          const hasFullStory = Boolean(fullStory && fullStory.trim());
          const hasProjectLink = Boolean(
            entry.projectSlug && entry.projectSlug.trim()
          );

          // Card is expandable ONLY if full story is provided by Admin
          const isExpandable = hasFullStory;

          // Format Date
          const dateObj = new Date(entry.date);
          const dateStr = dateObj.toLocaleDateString(
            locale === "ar" ? "ar-SA" : "en-US",
            { year: "numeric", month: "long" }
          );

          // Compute Bracket Height for range entries (§12.5)
          const durationDays = hasRange
            ? getRangeDurationDays(entry)
            : 0;
          const bracketHeight = hasRange
            ? computeRangeBracketHeight(durationDays)
            : 0;

          const isCurrentLoading = isLoadingProject && loadingSlug === entry.projectSlug;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative"
              style={{
                marginTop: index === 0 ? "0px" : `${gap}px`,
              }}
            >
              {/* Measurement Point Node on the rail */}
              <div
                className="absolute top-4 -left-[5px] z-10 rounded-full border-2 transition-transform duration-300 hover:scale-125"
                style={{
                  width: "12px",
                  height: "12px",
                  borderColor: "var(--color-accent)",
                  background: isExpanded
                    ? "var(--color-accent)"
                    : "var(--color-bg)",
                  boxShadow: isExpanded
                    ? "0 0 10px var(--color-accent)"
                    : "none",
                  insetInlineStart: "calc(var(--rail-offset, 1.5rem) - 5px)",
                }}
              />

              {/* Range Interval Curly Bracket '{' / '}' (§12.5) */}
              {hasRange && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    insetInlineStart: "0px",
                    top: `calc(1rem + 6px - ${bracketHeight / 2}px)`,
                    height: `${bracketHeight}px`,
                    width: "20px",
                  }}
                  title={t("rangeTooltip", { days: durationDays })}
                >
                  <svg
                    width="20"
                    height={bracketHeight}
                    viewBox={`0 0 20 ${bracketHeight}`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    {isRTL ? (
                      <path
                        d={`M 18 2 C 8 2, 8 ${bracketHeight / 4}, 8 ${bracketHeight / 2 - 5} C 8 ${bracketHeight / 2 - 2}, 5 ${bracketHeight / 2}, 5 ${bracketHeight / 2} C 5 ${bracketHeight / 2}, 8 ${bracketHeight / 2 + 2}, 8 ${bracketHeight / 2 + 5} C 8 ${bracketHeight * 0.75}, 8 ${bracketHeight - 2}, 18 ${bracketHeight - 2}`}
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    ) : (
                      <path
                        d={`M 2 2 C 12 2, 12 ${bracketHeight / 4}, 12 ${bracketHeight / 2 - 5} C 12 ${bracketHeight / 2 - 2}, 15 ${bracketHeight / 2}, 15 ${bracketHeight / 2} C 15 ${bracketHeight / 2}, 12 ${bracketHeight / 2 + 2}, 12 ${bracketHeight / 2 + 5} C 12 ${bracketHeight * 0.75}, 12 ${bracketHeight - 2}, 2 ${bracketHeight - 2}`}
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

              {/* Logo/Badge beside measurement node (§12.8) */}
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

              {/* Entry Content Card */}
              <div
                className={`group rounded-xl p-5 transition-all duration-300 ${isExpandable ? "cursor-pointer" : "cursor-default"
                  }`}
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
                onClick={() => {
                  if (isExpandable) {
                    setExpandedId(isExpanded ? null : entry.id);
                  }
                }}
              >
                {/* Date & Age Timestamps (§12.2) */}
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
                  className="text-lg font-bold mb-2 transition-colors group-hover:text-[var(--color-accent-bright)]"
                  style={{ color: "var(--color-text)" }}
                >
                  {title}
                </h3>

                {/* Normal State: Display Summary via MarkdownRenderer (Disappears when expanded) */}
                {!isExpanded && summary && (
                  <div className="text-sm leading-relaxed">
                    <MarkdownRenderer content={summary} />
                  </div>
                )}

                {/* Non-Expandable Card (No full story) with Linked Project Button */}
                {!isExpandable && hasProjectLink && (
                  <div className="mt-4 pt-3 border-t border-[var(--color-card-border)]/60">
                    <PulseBorder
                      as="button"
                      borderRadius="0.75rem"
                      className="cursor-pointer inline-block"
                      onClick={() => openProjectModal(entry.projectSlug!)}
                    >
                      <div
                        className="px-5 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] rounded-[0.75rem]"
                        style={{
                          background: "rgba(74, 222, 128, 0.08)",
                          color: "var(--color-accent-bright)",
                          border: "1px solid rgba(74, 222, 128, 0.2)",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                        }}
                      >
                        {isCurrentLoading ? (
                          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-accent-bright)]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        )}
                        <span>{t("fullProjectDetails")}</span>
                      </div>
                    </PulseBorder>
                  </div>
                )}

                {/* Expanded Accordion State: Full Story + PulseBorder Project Button */}
                {isExpandable && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden mt-3 pt-3 border-t border-[var(--color-card-border)]/50"
                      >
                        <MarkdownRenderer content={fullStory} />

                        {/* Linked Project Button with PulseBorder inside Expanded Section */}
                        {hasProjectLink && (
                          <div className="mt-4 pt-3 border-t border-[var(--color-card-border)]/60">
                            <PulseBorder
                              as="button"
                              borderRadius="0.75rem"
                              className="cursor-pointer inline-block"
                              onClick={() =>
                                openProjectModal(entry.projectSlug!)
                              }
                            >
                              <div
                                className="px-5 py-2.5 text-xs font-bold flex items-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] rounded-[0.75rem]"
                                style={{
                                  background: "rgba(74, 222, 128, 0.08)",
                                  color: "var(--color-accent-bright)",
                                  border: "1px solid rgba(74, 222, 128, 0.2)",
                                  fontFamily:
                                    "var(--font-jetbrains-mono), monospace",
                                }}
                              >
                                {isCurrentLoading ? (
                                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
                                ) : (
                                  <svg
                                    className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-accent-bright)]"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                  </svg>
                                )}
                                <span>{t("fullProjectDetails")}</span>
                              </div>
                            </PulseBorder>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* In-Place Project Card Modal Overlay (Maintains exact scroll position) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8"
            style={{
              background: "rgba(5, 15, 10, 0.92)",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative max-h-[90vh] w-full max-w-[92vw] xl:max-w-6xl overflow-y-auto rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl border border-[var(--color-card-border)] bg-[var(--color-bg)] my-auto"
              onClick={(e) => e.stopPropagation()}
            >
                 {/* Close Button — Disciplined Precision Micro-Interaction */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-4 right-4 z-50 rounded-full p-2.5 shadow-md flex items-center justify-center transition-all duration-150 border border-[var(--color-card-border)] hover:border-[var(--color-accent-bright)] hover:bg-[rgba(74,222,128,0.12)] text-[var(--color-text)]"
                style={{
                  background: "rgba(5, 15, 10, 0.85)",
                }}
                aria-label="Close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
              <ProjectDetail project={selectedProject} isInline={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
