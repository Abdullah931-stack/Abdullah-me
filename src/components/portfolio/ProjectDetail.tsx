"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { Project } from "@/types";
import PulseBorder from "@/components/shared/PulseBorder";
import ProjectLightbox from "@/components/portfolio/ProjectLightbox";
import { formatBuildTime } from "@/lib/format-build-time";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

/**
 * Project Detail Component — v2.0 "Signal & Growth"
 *
 * Implements §8 of UI/UX Spec:
 * - §8.1: Body content template (Problem → Decision → Outcome)
 * - §8.2: Gallery redesign — PulseBorder arrows, node indicators, green scrim, active node pulse
 * - §8.3: Repository link (conditional on repoUrl field)
 * - §7.1: PulseBorder on GitHub/preview buttons + gallery arrows
 *
 * Supports both route-based and inline (in-grid expand) rendering.
 */

interface ProjectDetailProps {
  project: Project;
  isInline?: boolean; // When true, rendered inside PortfolioList expand panel
}

export default function ProjectDetail({
  project,
  isInline = false,
}: ProjectDetailProps) {
  const t = useTranslations("projects");
  const tUnits = useTranslations("buildTimeUnits");
  const locale = useLocale();

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const summary = locale === "ar" ? project.summaryAr : project.summaryEn;
  const body = locale === "ar" ? project.bodyAr : project.bodyEn;

  return (
    <article className={isInline ? "pt-10 sm:pt-6" : "py-24"}>
      <div className={`mx-auto ${isInline ? "px-2 sm:px-4" : "max-w-4xl px-6"}`}>
        {/* Back Link — only when route-based, not inline */}
        {!isInline && (
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href={`/${locale}/portfolio`}
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{ color: "var(--color-muted)" }}
            >
              ← {t("backToProjects")}
            </Link>
          </motion.div>
        )}

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1
            className="mb-6 text-4xl font-bold md:text-5xl"
            style={{ color: "var(--color-text)", lineHeight: "1.2" }}
          >
            {title}
          </h1>

          {/* §8.2 — Modular Image Gallery & Lightbox — Placed directly below project name */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <ProjectLightbox images={project.images} projectTitle={title} />
            </div>
          )}

          <div className="mb-6">
            <MarkdownRenderer content={summary} className="text-lg" />
          </div>

          {/* Meta: Skills + Build Time */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skillStr) => {
                const parts = skillStr.split("|");
                const skillName = parts[0];
                const skillIcon = parts[1] || null;

                return (
                  <span
                    key={skillStr}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                    style={{
                      background: "var(--color-surface)",
                      color: "var(--color-muted)",
                    }}
                  >
                    {skillIcon && (
                      <img
                        src={skillIcon}
                        alt={skillName}
                        className="h-4 w-4 rounded-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <span>{skillName}</span>
                  </span>
                );
              })}
            </div>

            {project.buildTime && (
              <span
                className="text-sm"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                {t("buildTime")}: {formatBuildTime(project.buildTime, locale, (key: string, vals?: Record<string, any>) => tUnits(key, vals))}
              </span>
            )}
          </div>

          {/* Action Buttons — §7.1: PulseBorder on preview/repo buttons */}
          <div className="flex flex-wrap gap-3">
            {project.previewUrl && (
              <a
                href={project.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PulseBorder borderRadius="0.75rem">
                  <div
                    className="px-5 py-2.5 text-sm font-medium flex items-center gap-2"
                    style={{
                      background: "var(--color-accent)",
                      color: "var(--color-bg)",
                      borderRadius: "0.75rem",
                    }}
                  >
                    {t("preview")} ↗
                  </div>
                </PulseBorder>
              </a>
            )}

            {/* §8.3 — Repository link, conditional on repoUrl */}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PulseBorder borderRadius="0.75rem">
                  <div
                    className="px-5 py-2.5 text-sm font-medium flex items-center gap-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--color-text)",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    {t("repository")}
                  </div>
                </PulseBorder>
              </a>
            )}
          </div>
        </motion.header>

        {/* Story / Body — §8.1 template with Markdown support */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MarkdownRenderer content={body} />
        </motion.section>
      </div>
    </article>
  );
}
