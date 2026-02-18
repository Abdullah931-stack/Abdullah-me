"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import ParallaxCharacter from "@/components/hero/ParallaxCharacter";


export default function HeroSection() {
    const t = useTranslations("hero");
    const locale = useLocale();

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[var(--background)]">

            {/* 1. Spotlight Effect — Warmer/Richer */}
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
                {/* Text Content */}
                <div className="space-y-6 text-center md:text-start">
                    {/* Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 backdrop-blur-md">
                        🚀 {t("badge") || "Available for new projects"}
                    </div>

                    {/* Huge Name */}
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                        {t("name") || "Abdullah."}
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-md leading-relaxed mx-auto md:mx-0">
                        {t("role") || "Software Engineer building intelligent systems and unforgettable digital experiences."}
                    </p>

                    {/* CTAs */}
                    <div className="flex gap-4 pt-4 justify-center md:justify-start">
                        <Link href={`/${locale}/contact`} className="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
                            {t("cta") || "Contact Me"}
                        </Link>
                        <Link href={`/${locale}/portfolio`} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                            {t("work") || "My Work"}
                        </Link>
                    </div>
                </div>

                {/* Character — Refined Lighting */}
                <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center filter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] brightness-90 contrast-110">
                    <ParallaxCharacter
                        characterSrc="/images/character/character.svg"
                        characterAlt="Abdullah"
                    />
                </div>
            </div>
        </section>
    );
}
