"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { ProjectImage } from "@/types";
import PulseBorder from "@/components/shared/PulseBorder";

interface ProjectLightboxProps {
    images: ProjectImage[];
    projectTitle: string;
}

export default function ProjectLightbox({
    images,
    projectTitle,
}: ProjectLightboxProps) {
    const locale = useLocale();
    const t = useTranslations("projects");

    // activeIndex tracks current selected showcase image
    const [activeIndex, setActiveIndex] = useState<number>(() => {
        const coverIdx = images.findIndex((img) => img.isCover);
        return coverIdx !== -1 ? coverIdx : 0;
    });

    // lightboxIndex is non-null when full-screen modal is open
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const isRtl = locale === "ar";

    // Handle embedded showcase navigation
    const handleShowcasePrev = useCallback(() => {
        if (!images || images.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images]);

    const handleShowcaseNext = useCallback(() => {
        if (!images || images.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % images.length);
    }, [images]);

    // Handle full-screen lightbox navigation
    const handleLightboxPrev = useCallback(() => {
        if (lightboxIndex === null || images.length === 0) return;
        setLightboxIndex((prev) =>
            prev === null ? 0 : (prev - 1 + images.length) % images.length
        );
    }, [lightboxIndex, images.length]);

    const handleLightboxNext = useCallback(() => {
        if (lightboxIndex === null || images.length === 0) return;
        setLightboxIndex((prev) =>
            prev === null ? 0 : (prev + 1) % images.length
        );
    }, [lightboxIndex, images.length]);

    // Keyboard navigation (Escape, ArrowLeft, ArrowRight)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (lightboxIndex !== null) {
                    setLightboxIndex(null);
                }
            } else if (e.key === "ArrowLeft") {
                if (lightboxIndex !== null) {
                    if (isRtl) handleLightboxNext();
                    else handleLightboxPrev();
                } else {
                    if (isRtl) handleShowcaseNext();
                    else handleShowcasePrev();
                }
            } else if (e.key === "ArrowRight") {
                if (lightboxIndex !== null) {
                    if (isRtl) handleLightboxPrev();
                    else handleLightboxNext();
                } else {
                    if (isRtl) handleShowcasePrev();
                    else handleShowcaseNext();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        lightboxIndex,
        isRtl,
        handleLightboxPrev,
        handleLightboxNext,
        handleShowcasePrev,
        handleShowcaseNext,
    ]);

    if (!images || images.length === 0) return null;

    const currentActiveImage = images[activeIndex] || images[0];

    return (
        <div className="w-full space-y-4">
            {/* Top Showcase Frame (Placed directly below Project Name) */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[rgba(5,15,10,0.6)] p-3 shadow-2xl backdrop-blur-md">
                {/* Main Active Image View (Click opens Lightbox) */}
                <div
                    className="relative flex items-center justify-center min-h-[260px] max-h-[480px] w-full overflow-hidden rounded-xl bg-black/40 cursor-pointer group"
                    onClick={() => setLightboxIndex(activeIndex)}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentActiveImage.id || activeIndex}
                            src={currentActiveImage.url}
                            alt={
                                (isRtl
                                    ? currentActiveImage.altAr
                                    : currentActiveImage.altEn) || projectTitle
                            }
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="max-h-[460px] w-auto max-w-full object-contain rounded-lg transition-shadow duration-300 group-hover:shadow-[0_0_20px_var(--color-card-border)]"
                        />
                    </AnimatePresence>
                </div>

                {/* Embedded Navigation Arrows on Showcase */}
                {images.length > 1 && (
                    <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                        <PulseBorder borderRadius="9999px">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowcasePrev();
                                }}
                                className="pointer-events-auto rounded-full p-3 font-bold transition-transform hover:scale-110 shadow-lg"
                                style={{
                                    background: "rgba(5, 15, 10, 0.85)",
                                    color: "var(--color-text)",
                                    border: "1px solid var(--color-card-border)",
                                }}
                                aria-label="Previous showcase image"
                            >
                                {isRtl ? "→" : "←"}
                            </button>
                        </PulseBorder>

                        <PulseBorder borderRadius="9999px">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowcaseNext();
                                }}
                                className="pointer-events-auto rounded-full p-3 font-bold transition-transform hover:scale-110 shadow-lg"
                                style={{
                                    background: "rgba(5, 15, 10, 0.85)",
                                    color: "var(--color-text)",
                                    border: "1px solid var(--color-card-border)",
                                }}
                                aria-label="Next showcase image"
                            >
                                {isRtl ? "←" : "→"}
                            </button>
                        </PulseBorder>
                    </div>
                )}
            </div>

            {/* Thumbnails Carousel Bar underneath Showcase */}
            {images.length > 1 && (
                <div className="flex items-center justify-center gap-3 overflow-x-auto py-2">
                    {images.map((image, index) => {
                        const isSelected = index === activeIndex;
                        return (
                            <button
                                key={image.id || index}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`relative cursor-pointer overflow-hidden rounded-xl border p-1 transition-all flex-shrink-0 ${isSelected
                                        ? "border-[var(--color-accent-bright)] ring-2 ring-[var(--color-accent-bright)]/30 scale-105"
                                        : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                                    }`}
                            >
                                <img
                                    src={image.url}
                                    alt={
                                        (isRtl ? image.altAr : image.altEn) ||
                                        projectTitle
                                    }
                                    className="h-16 w-24 object-cover rounded-lg"
                                    loading="lazy"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* §8.2 Full-Screen Lightbox Modal */}
            <AnimatePresence>
                {lightboxIndex !== null && images[lightboxIndex] && (
                    <motion.div
                        key="lightbox-modal"
                        data-testid="lightbox-scrim"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8"
                        style={{
                            background: "rgba(5, 15, 10, 0.92)",
                            backdropFilter: "blur(8px)",
                        }}
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Lightbox Content Window */}
                        <motion.div
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative flex flex-col items-center justify-center max-h-[85vh] w-full max-w-[92vw] xl:max-w-5xl overflow-hidden rounded-2xl p-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Main Expanded Display Image */}
                            <div className="relative overflow-hidden rounded-xl flex items-center justify-center max-h-[72vh]">
                                <img
                                    src={images[lightboxIndex].url}
                                    alt={
                                        (isRtl
                                            ? images[lightboxIndex].altAr
                                            : images[lightboxIndex].altEn) ||
                                        projectTitle
                                    }
                                    className="max-h-[72vh] w-auto object-contain rounded-lg shadow-2xl"
                                />
                                                       {/* Close Button — Disciplined Precision Micro-Interaction */}
                            <motion.button
                                onClick={() => setLightboxIndex(null)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute top-4 right-4 z-50 rounded-full p-2.5 shadow-md flex items-center justify-center transition-all duration-150 border border-[var(--color-card-border)] hover:border-[var(--color-accent-bright)] hover:bg-[rgba(74,222,128,0.12)] text-[var(--color-text)]"
                                style={{
                                    background: "rgba(5, 15, 10, 0.85)",
                                }}
                                aria-label={t("close")}
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
                            </div>

                            {/* §8.2 — PulseBorder Navigation Arrows */}
                            {images.length > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-6 z-20">
                                    <PulseBorder borderRadius="9999px">
                                        <button
                                            onClick={handleLightboxPrev}
                                            className="rounded-full px-4 py-2.5 font-bold transition-transform hover:scale-105"
                                            style={{
                                                background: "rgba(5, 15, 10, 0.8)",
                                                color: "var(--color-text)",
                                                border: "1px solid var(--color-card-border)",
                                            }}
                                            aria-label="Previous image"
                                        >
                                            {isRtl ? "→" : "←"}
                                        </button>
                                    </PulseBorder>

                                    <PulseBorder borderRadius="9999px">
                                        <button
                                            onClick={handleLightboxNext}
                                            className="rounded-full px-4 py-2.5 font-bold transition-transform hover:scale-105"
                                            style={{
                                                background: "rgba(5, 15, 10, 0.8)",
                                                color: "var(--color-text)",
                                                border: "1px solid var(--color-card-border)",
                                            }}
                                            aria-label="Next image"
                                        >
                                            {isRtl ? "←" : "→"}
                                        </button>
                                    </PulseBorder>
                                </div>
                            )}

                            {/* §8.2 — Node Indicators (dots + line) with Gentle Active Pulse */}
                            {images.length > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-0 z-20">
                                    {images.map((_, idx) => {
                                        const isActive = idx === lightboxIndex;
                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-center"
                                            >
                                                <button
                                                    onClick={() =>
                                                        setLightboxIndex(idx)
                                                    }
                                                    data-testid={`node-indicator-${idx}`}
                                                    data-active={
                                                        isActive ? "true" : "false"
                                                    }
                                                    className="relative cursor-pointer focus:outline-none"
                                                    aria-label={`Image node ${idx + 1}`}
                                                >
                                                    {isActive ? (
                                                        <motion.div
                                                            animate={{
                                                                scale: [1, 1.25, 1],
                                                                boxShadow: [
                                                                    "0 0 4px var(--color-accent-bright)",
                                                                    "0 0 12px var(--color-accent-bright)",
                                                                    "0 0 4px var(--color-accent-bright)",
                                                                ],
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                            }}
                                                            style={{
                                                                width: "10px",
                                                                height: "10px",
                                                                borderRadius: "50%",
                                                                background:
                                                                    "var(--color-accent-bright)",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: "8px",
                                                                height: "8px",
                                                                borderRadius: "50%",
                                                                background:
                                                                    "var(--color-muted)",
                                                                opacity: 0.4,
                                                            }}
                                                        />
                                                    )}
                                                </button>

                                                {/* Connecting line between nodes (§5.4 motif) */}
                                                {idx < images.length - 1 && (
                                                    <div
                                                        style={{
                                                            width: "20px",
                                                            height: "1px",
                                                            background:
                                                                "var(--color-muted)",
                                                            opacity: 0.3,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
