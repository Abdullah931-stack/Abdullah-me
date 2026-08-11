"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import LavaBackground from "@/components/shared/LavaBackground";
import LissajousCurve from "@/components/hero/LissajousCurve";
import PulseBorder from "@/components/shared/PulseBorder";

/**
 * HeroSection — v2.0 "Signal & Growth"
 *
 * Implements §5 of UI/UX Spec:
 * - §5.1: Removed ParallaxCharacter, emoji badge, indigo spotlight
 * - §5.2: Lissajous tri-curve visual anchor (P0)
 * - §5.3: No identity nouns — verb-based, evidence-anchored copy
 * - §5.4: Signal & Node motif via Lissajous + eyebrow
 * - §4: LavaBackground ambient background
 * - §7.1: PulseBorder on CTA buttons
 */
export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: `radial-gradient(ellipse at 50% 30%, var(--color-bg-radial-inner), var(--color-bg) 70%)` }}
    >
      {/* §4 — Lava Lamp ambient background */}
      <LavaBackground />

      {/* §5.2 — Lissajous tri-curve visual anchor */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-auto">
        <div className="w-[min(600px,80vw)] h-[min(600px,80vh)] relative">
          <LissajousCurve />
        </div>
      </div>

      {/* Content — layered above background and curves */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
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
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6"
          style={{
            background: `linear-gradient(180deg, var(--color-text) 0%, var(--color-accent-bright) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: "1.2",
          }}
        >
          {t("name")}
        </h1>

        {/* §5.3 — Primary sentence: verb-based, no title nouns */}
        <p
          className="text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-10"
          style={{ color: "var(--color-muted)" }}
        >
          {t("bio")}
        </p>

        {/* CTAs — §7.1: PulseBorder on primary CTA buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href={`/${locale}/contact`}>
            <PulseBorder
              borderRadius="9999px"
              className="cursor-pointer"
            >
              <div
                className="px-8 py-3 font-medium text-sm"
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
            <PulseBorder
              borderRadius="9999px"
              className="cursor-pointer"
            >
              <div
                className="px-8 py-3 font-medium text-sm"
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
    </section>
  );
}
