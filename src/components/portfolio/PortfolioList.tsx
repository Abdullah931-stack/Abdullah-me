"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { Project } from "@/types";
import PulseBorder from "@/components/shared/PulseBorder";
import ProjectDetail from "@/components/portfolio/ProjectDetail";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

/**
 * PortfolioList — Uniform Grid with Shared-Element Expand Panel
 *
 * Implements §6 of UI/UX Spec v2.0:
 * - §6.1: Uniform grid layout
 * - §6.2: Identical card proportions
 * - §6.3: Click expands in-place via layoutId
 * - §7.1: PulseBorder on project cards
 *
 * Architecture & Safety Fixes:
 * - Reset selectedId on route change or component unmount to prevent overlay leakage.
 * - Single AnimatePresence container for backdrop overlay and modal panel.
 * - Isolated LayoutGroup scope for Framer Motion shared-element calculations.
 * - Keyboard Escape listener and body scroll lock cleanup.
 */

interface PortfolioListProps {
  projects: Project[];
}

export default function PortfolioList({ projects }: PortfolioListProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const pathname = usePathname();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset selected state on component unmount to prevent stuck overlays
  useEffect(() => {
    return () => setSelectedId(null);
  }, []);

  // Lock body scroll when modal is expanded
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  // Keyboard Escape listener to close modal safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute grid positions for distance-based ripple stagger (§6.3)
  const columns = 3; // Desktop grid

  const getGridPos = useCallback(
    (index: number) => ({
      row: Math.floor(index / columns),
      col: index % columns,
    }),
    []
  );

  // §6.3 — Distance-based stagger delays
  const getStaggerDelay = useCallback(
    (cardIndex: number, selectedIndex: number) => {
      const cardPos = getGridPos(cardIndex);
      const selectedPos = getGridPos(selectedIndex);
      const distance = Math.sqrt(
        Math.pow(cardPos.row - selectedPos.row, 2) +
        Math.pow(cardPos.col - selectedPos.col, 2)
      );
      return distance * 0.06; // §6.3 — unitDelay ≈ 60ms
    },
    [getGridPos]
  );

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedId) ?? null,
    [projects, selectedId]
  );

  const selectedIndex = useMemo(
    () => projects.findIndex((p) => p.id === selectedId),
    [projects, selectedId]
  );

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p style={{ color: "var(--color-muted)" }}>{t("noProjects")}</p>
      </div>
    );
  }

  return (
    <LayoutGroup id={`portfolio-grid-${locale}`}>
      <div className="relative">
        {/* Project Grid — §6.2 Uniform grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const title = locale === "ar" ? project.titleAr : project.titleEn;
            const summary =
              locale === "ar" ? project.summaryAr : project.summaryEn;
            const coverImage =
              project.images?.find((img) => img.isCover) ||
              project.images?.[0];
            const isSelected = project.id === selectedId;

            return (
              <motion.div
                key={project.id}
                layoutId={`card-${project.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: selectedId && !isSelected ? 0.3 : 1,
                  y: 0,
                  scale: selectedId && !isSelected ? 0.97 : 1,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay:
                    selectedId && !isSelected
                      ? getStaggerDelay(index, selectedIndex)
                      : 0,
                }}
                onClick={() => !selectedId && setSelectedId(project.id)}
                className={`cursor-pointer ${isSelected ? "z-20" : ""}`}
              >
                <PulseBorder borderRadius="1rem">
                  <article
                    className="overflow-hidden rounded-2xl p-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.035)",
                    }}
                  >
                    {/* Cover Image — Full uncropped aspect ratio with responsive AVIF/WebP optimization */}
                    {coverImage && (
                      <div className="w-full overflow-hidden flex items-center justify-center bg-black/30 p-2 min-h-[180px] max-h-[300px]">
                        <Image
                          src={coverImage.url}
                          alt={
                            locale === "ar"
                              ? coverImage.altAr || title
                              : coverImage.altEn || title
                          }
                          width={600}
                          height={340}
                          priority={index === 0}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="max-h-[280px] w-auto max-w-full object-contain transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-6">
                      <h3
                        className="mb-2 text-lg font-bold transition-colors"
                        style={{ color: "var(--color-text)" }}
                      >
                        {title}
                      </h3>

                      <div className="mb-4 line-clamp-2 text-sm">
                        <MarkdownRenderer content={summary} />
                      </div>

                      {/* Skills — Render logo icon image instead of raw URL string */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.slice(0, 4).map((skillStr) => {
                          const [skillName, skillIcon] = skillStr.split("|");
                          return (
                            <span
                              key={skillStr}
                              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                              style={{
                                background: "var(--color-surface)",
                                color: "var(--color-muted)",
                              }}
                            >
                              {skillIcon && (
                                <img
                                  src={skillIcon}
                                  alt={skillName}
                                  className="h-3.5 w-3.5 rounded-full object-cover"
                                  loading="lazy"
                                />
                              )}
                              <span>{skillName}</span>
                            </span>
                          );
                        })}
                        {project.skills.length > 4 && (
                          <span
                            className="text-xs self-center"
                            style={{ color: "var(--color-muted)" }}
                          >
                            +{project.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </PulseBorder>
              </motion.div>
            );
          })}
        </div>

        {/* Encapsulated Modal & Backdrop Overlay inside single AnimatePresence */}
        <AnimatePresence>
          {selectedProject && (
            <div
              key="portfolio-modal-wrapper"
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8"
            >
              {/* Single Shared Backdrop Overlay */}
              <motion.div
                key="portfolio-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-0"
                style={{
                  background: "rgba(5, 15, 10, 0.88)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
                onClick={() => setSelectedId(null)}
              />

              {/* Expanded Project Detail Panel — Standalone Responsive Closed Rectangle */}
              <motion.div
                key={`expanded-${selectedProject.id}`}
                layoutId={`card-${selectedProject.id}`}
                className="relative z-10 w-full max-w-[92vw] xl:max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl my-auto border border-[var(--color-card-border)] bg-[var(--color-bg)]"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* Close Button — Disciplined Precision Micro-Interaction */}
                <motion.button
                  onClick={() => setSelectedId(null)}
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

                {/* Project Detail Content */}
                <div className="p-6 md:p-10">
                  <ProjectDetail project={selectedProject} isInline />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

