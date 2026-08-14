"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { Project } from "@/types";
import PulseBorder from "@/components/shared/PulseBorder";
import ProjectDetail from "@/components/portfolio/ProjectDetail";

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

  // Reset selected state on route change or component unmount to prevent stuck overlays
  useEffect(() => {
    setSelectedId(null);
    return () => setSelectedId(null);
  }, [pathname]);

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
            const coverImage = project.images?.[0];
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
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
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

                      <p
                        className="mb-4 line-clamp-2 text-sm"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {summary}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full px-2.5 py-0.5 text-xs"
                            style={{
                              background: "var(--color-surface)",
                              color: "var(--color-muted)",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skills.length > 4 && (
                          <span
                            className="text-xs"
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
              className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 lg:p-16"
            >
              {/* Single Shared Backdrop Overlay */}
              <motion.div
                key="portfolio-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-0"
                style={{
                  background: "rgba(5, 15, 10, 0.85)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                }}
                onClick={() => setSelectedId(null)}
              />

              {/* Expanded Project Detail Panel */}
              <motion.div
                key={`expanded-${selectedProject.id}`}
                layoutId={`card-${selectedProject.id}`}
                className="relative z-10 w-full h-full max-w-5xl overflow-y-auto rounded-2xl"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-card-border)",
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 z-50 rounded-full p-2 transition-colors hover:bg-[rgba(255,255,255,0.2)]"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "var(--color-text)",
                  }}
                  aria-label="Close"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

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

