"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { Project } from "@/types";
import { useState } from "react";
import PulseBorder from "@/components/shared/PulseBorder";

/**
 * Project Detail Component — v2.0 "Signal & Growth"
 *
 * Implements §8 of UI/UX Spec:
 * - §8.1: Body content template (Problem → Decision → Outcome)
 * - §8.2: Gallery redesign — PulseBorder arrows, node indicators, green scrim
 * - §8.3: Repository link (conditional on repoUrl field, blocked on §12.1)
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
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const summary = locale === "ar" ? project.summaryAr : project.summaryEn;
  const body = locale === "ar" ? project.bodyAr : project.bodyEn;

  // §8.2 — Active node indicator for gallery
  const activeNodeStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "var(--color-accent-bright)",
    boxShadow: "0 0 8px var(--color-accent-bright)",
  };

  const inactiveNodeStyle = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "var(--color-muted)",
    opacity: 0.4,
  };

  return (
    <article className={isInline ? "" : "py-24"}>
      <div className={`mx-auto ${isInline ? "" : "max-w-4xl px-6"}`}>
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
              ← {locale === "ar" ? "العودة للمشاريع" : "Back to Portfolio"}
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
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ color: "var(--color-text)", lineHeight: "1.2" }}
          >
            {title}
          </h1>
          <p
            className="mb-6 text-lg leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {summary}
          </p>

          {/* Meta: Skills + Build Time */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full px-3 py-1 text-sm font-medium"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-muted)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {project.buildTime && (
              <span
                className="text-sm"
                style={{
                  color: "var(--color-muted)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                }}
              >
                {t("buildTime")}: {project.buildTime}
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

            {/* §8.3 — Repository link, conditional on repoUrl (§12.1) */}
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
                    {locale === "ar" ? "المستودع" : "Repository"}
                  </div>
                </PulseBorder>
              </a>
            )}
          </div>
        </motion.header>

        {/* §8.2 — Image Gallery — Visual Redesign */}
        {project.images.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {project.images.map((image, index) => (
                <motion.div
                  key={image.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={image.url}
                    alt={
                      locale === "ar"
                        ? image.altAr || title
                        : image.altEn || title
                    }
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Story / Body — §8.1 template */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg max-w-none"
        >
          <div
            className="leading-relaxed"
            style={{
              color: "var(--color-muted)",
              whiteSpace: "pre-wrap",
            }}
          >
            {body}
          </div>
        </motion.section>

        {/* §8.2 — Lightbox with green-tinted scrim + PulseBorder arrows + node indicators */}
        {lightboxIndex !== null && project.images[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              // §8.2 — Dark-green-tinted scrim (NOT generic black)
              background: "rgba(5, 15, 10, 0.92)",
            }}
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-h-[80vh] max-w-4xl overflow-hidden rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={project.images[lightboxIndex].url}
                alt={title}
                className="max-h-[80vh] w-auto object-contain"
              />

              {/* §8.2 — PulseBorder navigation arrows */}
              {project.images.length > 1 && (
                <div className="absolute inset-x-0 bottom-16 flex justify-center gap-4">
                  <PulseBorder borderRadius="9999px">
                    <button
                      onClick={() =>
                        setLightboxIndex(
                          (lightboxIndex - 1 + project.images.length) %
                            project.images.length
                        )
                      }
                      className="rounded-full p-3"
                      style={{
                        background: "rgba(5, 15, 10, 0.7)",
                        color: "var(--color-text)",
                      }}
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                  </PulseBorder>

                  <PulseBorder borderRadius="9999px">
                    <button
                      onClick={() =>
                        setLightboxIndex(
                          (lightboxIndex + 1) % project.images.length
                        )
                      }
                      className="rounded-full p-3"
                      style={{
                        background: "rgba(5, 15, 10, 0.7)",
                        color: "var(--color-text)",
                      }}
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </PulseBorder>
                </div>
              )}

              {/* §8.2 — Node indicators (dots + line), replacing numeric counter */}
              {project.images.length > 1 && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center items-center gap-0">
                  {project.images.map((_, idx) => (
                    <div key={idx} className="flex items-center">
                      <button
                        onClick={() => setLightboxIndex(idx)}
                        style={
                          idx === lightboxIndex
                            ? activeNodeStyle
                            : inactiveNodeStyle
                        }
                        aria-label={`Image ${idx + 1}`}
                      />
                      {/* Connecting line between nodes */}
                      {idx < project.images.length - 1 && (
                        <div
                          style={{
                            width: "20px",
                            height: "1px",
                            background: "var(--color-muted)",
                            opacity: 0.3,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 rounded-full p-2"
                style={{
                  background: "rgba(5, 15, 10, 0.7)",
                  color: "var(--color-text)",
                }}
                aria-label="Close lightbox"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </article>
  );
}
