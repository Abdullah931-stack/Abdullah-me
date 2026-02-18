"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


/**
 * Navbar — Shared Navigation Component
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Logo/Name (left)
 * - Navigation links (center)
 * - Language Switcher + Theme Switcher (right)
 * - Glassmorphism background with blur
 * - Fixed position, visible on scroll
 */
export default function Navbar() {
    const t = useTranslations("nav");
    const tLang = useTranslations("language");
    const locale = useLocale();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const otherLocale = locale === "ar" ? "en" : "ar";

    const navLinks = [
        { href: `/${locale}`, label: t("home") },
        { href: `/${locale}/portfolio`, label: t("portfolio") },
        { href: `/${locale}/journey`, label: t("journey") },
        { href: `/${locale}/contact`, label: t("contact") },
    ];

    return (
        <nav
            className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/20"
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo / Name */}
                <Link
                    href={`/${locale}`}
                    className="text-xl font-bold transition-colors hover:text-[var(--color-primary)]"
                >
                    Abdullah
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Actions: Language + Theme + Mobile Menu */}
                <div className="flex items-center gap-3">
                    {/* Language Switcher */}
                    {/* Language Switcher */}
                    <Link
                        href={`/${otherLocale}`}
                        className="group flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                        title={tLang("switch")}
                    >
                        <span className="hidden md:inline-block opacity-0 lg:opacity-100 transition-opacity -translate-x-2 lg:translate-x-0 group-hover:translate-x-0">
                            {locale === "ar" ? "English" : "Arabic"}
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all group-hover:bg-white/10 group-hover:ring-white/20">
                            {locale === "ar" ? "EN" : "AR"}
                        </span>
                    </Link>


                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-lg border border-white/10 p-2 transition-all hover:bg-white/5 hover:border-white/20 md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            {mobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-[var(--color-border)] md:hidden"
                    >
                        <div className="flex flex-col gap-4 px-6 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text)]"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
