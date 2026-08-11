"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/**
 * Navbar — v2.0 "Signal & Growth"
 *
 * Updated per §2 + §7.1 + §9:
 * - Color tokens: --bg, --text, --muted, --accent, --card-border
 * - §7.1: NO PulseBorder on navbar links (explicitly excluded)
 * - Dark-only — no theme toggle (§2)
 * - Glassmorphism updated to green-tinted palette
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
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        borderBottom: "1px solid var(--color-card-border)",
        background: "rgba(5, 15, 10, 0.6)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / Name */}
        <Link
          href={`/${locale}`}
          className="text-xl font-bold transition-colors"
          style={{
            color: "var(--color-text)",
            fontFamily: "var(--font-space-grotesk), sans-serif",
          }}
        >
          Abdullah
        </Link>

        {/* Desktop Navigation — §7.1: NO PulseBorder here */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-muted)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions: Language + Mobile Menu — no theme toggle (§2 dark-only) */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <Link
            href={`/${otherLocale}`}
            className="group flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{ color: "var(--color-muted)" }}
            title={tLang("switch")}
          >
            <span className="hidden md:inline-block opacity-0 lg:opacity-100 transition-opacity">
              {locale === "ar" ? "English" : "Arabic"}
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border transition-all group-hover:border-[var(--color-accent)]"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--color-card-border)",
              }}
            >
              {locale === "ar" ? "EN" : "AR"}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 transition-all md:hidden"
            style={{
              border: "1px solid var(--color-card-border)",
              color: "var(--color-text)",
            }}
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
            className="overflow-hidden md:hidden"
            style={{ borderTop: "1px solid var(--color-card-border)" }}
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
                  style={{ color: "var(--color-muted)" }}
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
