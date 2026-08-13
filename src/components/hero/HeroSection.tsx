"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LavaBackground from "@/components/shared/LavaBackground";
import LissajousCurve from "@/components/hero/LissajousCurve";
import PulseBorder from "@/components/shared/PulseBorder";
import { isTabletOrDesktop } from "@/components/hero/lissajousMath";

/**
 * HeroSection — v2.0 "Signal & Growth"
 *
 * Implements §5 of UI/UX Spec:
 * - §5.1: Removed ParallaxCharacter, emoji badge, indigo spotlight
 * - §5.2: Lissajous tri-curve visual anchor (P0) with Keplerian orbiting points
 * - §5.2.2: Two-column non-overlapping lateral layout (LTR: Text Left/Curve Right, RTL: Text Right/Curve Left)
 * - §5.2.3: Responsive visibility — LissajousCurve unmounted entirely on mobile (< 768px)
 * - §5.3: No identity nouns — verb-based, evidence-anchored copy
 * - §5.4: Signal & Node motif via Lissajous + eyebrow
 * - §4: LavaBackground ambient background
 * - §7.1: PulseBorder on CTA buttons
 */
export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // §5.2.3 — Responsive check gating LissajousCurve mounting
  const [showCurve, setShowCurve] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setShowCurve(isTabletOrDesktop(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-16 md:py-0"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, var(--color-bg-radial-inner), var(--color-bg) 70%)`,
      }}
    >
      {/* §4 — Lava Lamp ambient background */}
      <LavaBackground />

      {/* Hero Container — §5.2.2 Two-column layout (Text & Curve, non-overlapping) */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col items-center justify-between gap-12 min-h-[80vh]">
        <div
          className={`w-full flex items-center justify-between gap-8 md:gap-12 my-auto ${isRtl ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
            }`}
        >
          {/* Column 1: Text Content */}
          <div
            className={`flex-1 max-w-2xl text-center ${isRtl ? "md:text-right" : "md:text-left"
              }`}
          >
            {/* §5.3 — Eyebrow line: JetBrains Mono, neutral vocabulary */}
            <p
              className="text-sm tracking-[0.25em] uppercase mb-6"
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                color: "var(--color-muted)",
              }}
            >
              {t("eyebrow")}
            </p>

            {/* §5.3 — Primary heading: name */}
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6"
              style={{
                background: `linear-gradient(180deg, var(--color-text) 0%, var(--color-accent-bright) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: "1.15",
              }}
            >
              {t("name")}
            </h1>

            {/* §5.3 — Primary sentence: verb-based, no title nouns */}
            <p
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto md:mx-0"
              style={{ color: "var(--color-muted)" }}
            >
              {t("bio")}
            </p>

            {/* CTAs — §7.1: PulseBorder on primary CTA buttons */}
            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <Link href={`/${locale}/contact`}>
                <PulseBorder borderRadius="9999px" className="cursor-pointer">
                  <div
                    className="px-8 py-3.5 font-medium text-sm transition-transform duration-200 hover:scale-105"
                    style={{
                      background: "var(--color-accent)",
                      color: "var(--color-bg)",
                      borderRadius: "9999px",
                    }}
                  >
                    {t("cta")}
                  </div>
                </PulseBorder>
              </Link>

              <Link href={`/${locale}/portfolio`}>
                <PulseBorder borderRadius="9999px" className="cursor-pointer">
                  <div
                    className="px-8 py-3.5 font-medium text-sm transition-transform duration-200 hover:scale-105"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      color: "var(--color-text)",
                      borderRadius: "9999px",
                    }}
                  >
                    {t("work")}
                  </div>
                </PulseBorder>
              </Link>
            </div>
          </div>

          {/* Column 2: Lissajous Curve Visual Anchor (§5.2.2 & §5.2.3) */}
          {showCurve && (
            <div
              className={`flex-1 w-full max-w-[500px] aspect-square relative flex items-center justify-center transition-transform duration-300 ${isRtl ? "md:-translate-x-[8%] lg:-translate-x-[10%]" : ""
                }`}
            >
              <div className="w-full h-full relative">
                <LissajousCurve />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
