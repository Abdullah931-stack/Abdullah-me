"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { ContactReason } from "@/types";
import PulseBorder from "@/components/shared/PulseBorder";

/**
 * ContactForm — v2.0 §9 "Signal & Growth"
 *
 * §9.1 — Neutral framing: no "Start Project" / emoji copy, no budget field
 * §9.2 — reason selector replaces serviceType (4 options, default: general)
 * §9.3 — Conditional project picker shown when reason = "bug-report"
 * §9.4 — Surfaces use §2.1 glass tokens (var(--color-surface) / var(--color-card-border))
 * §7.1 — Submit button is PulseBorder-eligible (primary CTA)
 */

interface ProjectOption {
    id: string;
    titleAr: string;
    titleEn: string;
}

const REASONS: ContactReason[] = ["general", "bug-report", "academic", "collaboration"];

// §9.4 — Shared input styles using §2.1 glass tokens (no zinc-900 / white/10)
const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3.5 text-[var(--color-text)] placeholder-[var(--color-muted)] transition-all focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] ${
        hasError
            ? "border-red-500/50 bg-red-500/5"
            : "border-[var(--color-card-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 focus:border-[var(--color-accent)]"
    }`;

export default function ContactForm() {
    const t = useTranslations("contact");
    const locale = useLocale();
    const isRtl = locale === "ar";

    const DRAFT_KEY = "contact_form_draft";
    const MAX_DRAFT_AGE = 10 * 60 * 1000; // 10 minutes TTL from last edit

    const defaultState = {
        senderName:   "",
        senderEmail:  "",
        reason:       "general" as ContactReason,
        projectRef:   "",     // Used when reason = "bug-report"
        projectOther: "",     // Used when project picker = "other"
        body:         "",
    };

    // Synchronously initialize form data from sessionStorage draft on mount
    const [formData, setFormData] = useState(() => {
        if (typeof window === "undefined") return defaultState;

        try {
            const saved = sessionStorage.getItem(DRAFT_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") {
                    const timestamp = typeof parsed.timestamp === "number" ? parsed.timestamp : 0;
                    const isExpired = Date.now() - timestamp > MAX_DRAFT_AGE;

                    if (isExpired) {
                        sessionStorage.removeItem(DRAFT_KEY);
                        return defaultState;
                    }

                    const data = parsed.data || parsed;
                    return {
                        ...defaultState,
                        ...data,
                    };
                }
            }
        } catch {
            // Ignore storage parse errors
        }

        return defaultState;
    });

    const [errors, setErrors]           = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess]     = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isMounted, setIsMounted]     = useState(false);

    // Track client hydration completion to prevent SSR/client mismatch warnings
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Debounced auto-save (500ms idle pause) to update sessionStorage and last-edited timestamp
    useEffect(() => {
        if (typeof window === "undefined") return;

        const timer = setTimeout(() => {
            try {
                const payload = {
                    timestamp: Date.now(), // Updated after 500ms idle pause from last edit
                    data: formData,
                };
                sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
            } catch {
                // Ignore storage errors
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData]);

    // Check if form has any user draft input to display reset button
    const isDirty = Boolean(
        formData.senderName.trim() ||
        formData.senderEmail.trim() ||
        formData.body.trim() ||
        formData.projectRef ||
        formData.projectOther.trim() ||
        formData.reason !== "general"
    );

    function handleReset() {
        setFormData(defaultState);
        setErrors({});
        setSubmitError("");
        if (typeof window !== "undefined") {
            try {
                sessionStorage.removeItem(DRAFT_KEY);
            } catch {
                // Ignore storage errors
            }
        }
    }

    // §9.3 — project list for the bug-report picker
    const [projects, setProjects]     = useState<ProjectOption[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    // Fetch published projects once, lazily, when reason switches to bug-report
    useEffect(() => {
        if (formData.reason === "bug-report" && projects.length === 0) {
            setLoadingProjects(true);
            fetch("/api/public/projects-list")
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) setProjects(data.data);
                })
                .catch(() => {/* silently fail — "other" option still available */})
                .finally(() => setLoadingProjects(false));
        }
    }, [formData.reason, projects.length]);

    // Derive the final projectRef to send: either the picker value or the typed "other" name
    function resolvedProjectRef(): string | undefined {
        if (formData.reason !== "bug-report") return undefined;
        if (formData.projectRef === "other") return formData.projectOther.trim() || undefined;
        return formData.projectRef || undefined;
    }

    function validate(): boolean {
        const newErrors: Record<string, string> = {};

        if (!formData.senderName.trim())  newErrors.senderName  = t("errors.required");
        if (!formData.senderEmail.trim()) {
            newErrors.senderEmail = t("errors.required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
            newErrors.senderEmail = t("errors.email");
        }
        if (!formData.reason)             newErrors.reason       = t("errors.required");
        if (!formData.body.trim())        newErrors.body         = t("errors.required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError("");
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                senderName:  formData.senderName.trim(),
                senderEmail: formData.senderEmail.trim(),
                reason:      formData.reason,
                projectRef:  resolvedProjectRef(),
                body:        formData.body.trim(),
                locale,
            };

            const response = await fetch("/api/public/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                setSubmitError(
                    response.status === 429 ? t("errors.rateLimit") : (data.error || t("errors.generic"))
                );
                return;
            }

            if (typeof window !== "undefined") {
                try {
                    sessionStorage.removeItem(DRAFT_KEY);
                } catch {
                    // Ignore storage errors
                }
            }
            setIsSuccess(true);
        } catch {
            setSubmitError(t("errors.generic"));
        } finally {
            setIsSubmitting(false);
        }
    }

    // ─── Success State ───
    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-lg rounded-3xl p-12 text-center"
                style={{
                    border: "1px solid var(--color-card-border)",
                    background: "var(--color-surface)",
                    backdropFilter: "blur(24px)",
                }}
            >
                <div className="mb-6 text-5xl">✓</div>
                <h3
                    className="mb-4 text-2xl font-semibold"
                    style={{ color: "var(--color-accent-bright)" }}
                >
                    {t("success.title")}
                </h3>
                <p className="leading-relaxed" style={{ color: "var(--color-muted)" }}>
                    {t("success.message")}
                </p>
            </motion.div>
        );
    }

    // ─── Form ───
    return (
        <motion.form
            onSubmit={handleSubmit}
            dir={isRtl ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl rounded-3xl p-8 md:p-12 space-y-8"
            style={{
                border: "1px solid var(--color-card-border)",
                background: "var(--color-surface)",
                backdropFilter: "blur(24px)",
            }}
        >
            {/* §9.1 — Neutral heading with optional clear form button */}
            <div className="flex items-start justify-between gap-4">
                <div className={isRtl ? "text-right" : "text-left"}>
                    <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
                        {t("title")}
                    </h2>
                    <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
                        {t("subtitle")}
                    </p>
                </div>
                {isMounted && isDirty && (
                    <PulseBorder
                        as="button"
                        borderRadius="0.5rem"
                        onClick={handleReset}
                        className="text-xs font-medium px-3 py-1.5 transition-all"
                    >
                        <span style={{ color: "var(--color-muted)" }}>
                            {t("clearForm")}
                        </span>
                    </PulseBorder>
                )}
            </div>

            {/* Name */}
            <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {t("name")}
                </label>
                <input
                    id="contact-name"
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className={inputClass(!!errors.senderName)}
                    placeholder={t("name")}
                    autoComplete="name"
                />
                {errors.senderName && (
                    <p className="text-xs text-red-400">{errors.senderName}</p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {t("email")}
                </label>
                <input
                    id="contact-email"
                    type="email"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    className={inputClass(!!errors.senderEmail)}
                    placeholder={t("email")}
                    autoComplete="email"
                />
                {errors.senderEmail && (
                    <p className="text-xs text-red-400">{errors.senderEmail}</p>
                )}
            </div>

            {/* §9.2 — Contact Reason Selector */}
            <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {t("reason")}
                </label>
                <div className="relative">
                    <select
                        id="contact-reason"
                        value={formData.reason}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                reason:      e.target.value as ContactReason,
                                projectRef:  "", // Reset picker when reason changes
                                projectOther: "",
                            })
                        }
                        className={`${inputClass(!!errors.reason)} appearance-none cursor-pointer`}
                        style={{ background: "var(--color-surface)" }}
                    >
                        {REASONS.map((r) => (
                            <option
                                key={r}
                                value={r}
                                style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
                            >
                                {t(`reasons.${r}`)}
                            </option>
                        ))}
                    </select>
                    {/* Chevron icon */}
                    <div
                        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                        style={{ [isRtl ? "left" : "right"]: "1rem", color: "var(--color-muted)" }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </div>
                </div>
                {errors.reason && <p className="text-xs text-red-400">{errors.reason}</p>}
            </div>

            {/* §9.3 — Conditional project picker (only for bug-report) */}
            <AnimatePresence>
                {formData.reason === "bug-report" && (
                    <motion.div
                        key="project-picker"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden space-y-2"
                    >
                        <label className="block text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                            {t("projectPicker")}
                        </label>
                        {loadingProjects ? (
                            <div className="flex items-center gap-2 py-3" style={{ color: "var(--color-muted)" }}>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                    <path d="M4 12a8 8 0 018-8V0" fill="currentColor" className="opacity-75" />
                                </svg>
                                <span className="text-sm">...</span>
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    id="contact-project"
                                    value={formData.projectRef}
                                    onChange={(e) =>
                                        setFormData({ ...formData, projectRef: e.target.value, projectOther: "" })
                                    }
                                    className={`${inputClass(false)} appearance-none cursor-pointer`}
                                    style={{ background: "var(--color-surface)" }}
                                >
                                    <option value="" style={{ background: "var(--color-bg)", color: "var(--color-muted)" }}>
                                        {t("projectPicker")}
                                    </option>
                                    {projects.map((p) => (
                                        <option
                                            key={p.id}
                                            value={locale === "ar" ? p.titleAr : p.titleEn}
                                            style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
                                        >
                                            {locale === "ar" ? p.titleAr : p.titleEn}
                                        </option>
                                    ))}
                                    {/* §9.3 — "Other (not listed)" always last */}
                                    <option
                                        value="other"
                                        style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
                                    >
                                        {t("projectPickerOther")}
                                    </option>
                                </select>
                                <div
                                    className="pointer-events-none absolute top-1/2 -translate-y-1/2"
                                    style={{ [isRtl ? "left" : "right"]: "1rem", color: "var(--color-muted)" }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* §9.3 — Text input revealed when "other" is selected */}
                        <AnimatePresence>
                            {formData.projectRef === "other" && (
                                <motion.div
                                    key="project-other-input"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <input
                                        id="contact-project-other"
                                        type="text"
                                        value={formData.projectOther}
                                        onChange={(e) => setFormData({ ...formData, projectOther: e.target.value })}
                                        className={inputClass(false)}
                                        placeholder={t("projectPickerOtherInput")}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Body */}
            <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: "var(--color-muted)" }}>
                    {t("message")}
                </label>
                <textarea
                    id="contact-message"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={5}
                    className={`${inputClass(!!errors.body)} resize-none`}
                    placeholder={t("message")}
                />
                {errors.body && <p className="text-xs text-red-400">{errors.body}</p>}
            </div>

            {/* Submit Error */}
            {submitError && (
                <div
                    className="rounded-xl p-3 text-sm text-center"
                    style={{
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        color: "#f87171",
                    }}
                >
                    {submitError}
                </div>
            )}

            {/* §9.4 / §7.1 — Submit: --accent fill, PulseBorder-eligible primary CTA */}
            <button
                id="contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl py-4 font-semibold transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                    background: "var(--color-accent)",
                    color: "var(--color-bg)",
                }}
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8V0" fill="currentColor" className="opacity-75" />
                        </svg>
                        {isRtl ? "جاري الإرسال..." : "Sending..."}
                    </span>
                ) : (
                    t("submit")
                )}
            </button>
        </motion.form>
    );
}
