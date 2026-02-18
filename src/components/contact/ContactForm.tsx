"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

/**
 * Smart Contact Form — Quiet Luxury Redesign
 * 
 * Features:
 * - Deep Zinc 900 background with subtle glass effect
 * - Refined, spacious input fields
 * - High-contrast "Start Project" button
 * - Smooth animations
 */

export default function ContactForm() {
    const t = useTranslations("contact");
    const locale = useLocale();

    const [formData, setFormData] = useState({
        senderName: "",
        senderEmail: "",
        serviceType: "",
        budget: "",
        body: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const services = [
        { id: "MVP", label: t("services.mvp") },
        { id: "SaaS", label: t("services.saas") },
        { id: "AI Integration", label: t("services.ai") },
    ];

    const budgets = [
        { id: "$150-$500", label: t("budgets.low") },
        { id: "$500-$1000", label: t("budgets.mid") },
        { id: "+$1000", label: t("budgets.high") },
    ];

    /**
     * Validates form fields.
     */
    function validate(): boolean {
        const newErrors: Record<string, string> = {};

        if (!formData.senderName.trim()) newErrors.senderName = t("errors.required");
        if (!formData.senderEmail.trim()) {
            newErrors.senderEmail = t("errors.required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.senderEmail)) {
            newErrors.senderEmail = t("errors.email");
        }
        if (!formData.serviceType) newErrors.serviceType = t("errors.required");
        if (!formData.budget) newErrors.budget = t("errors.required");
        if (!formData.body.trim()) newErrors.body = t("errors.required");

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    /**
     * Submits the form data to the API.
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitError("");

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/public/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, locale }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setSubmitError(t("errors.rateLimit"));
                } else {
                    setSubmitError(data.error || t("errors.generic"));
                }
                return;
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
                className="mx-auto max-w-lg rounded-3xl border border-white/10 bg-zinc-900/50 p-12 text-center backdrop-blur-xl"
            >
                <div className="mb-6 text-6xl">🎉</div>
                <h3 className="mb-4 text-3xl font-bold text-white">{t("success.title")}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                    {t("success.message")}
                </p>
            </motion.div>
        );
    }

    // ─── Form ───
    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-zinc-900/50 p-8 md:p-12 backdrop-blur-xl shadow-2xl space-y-8"
        >
            {/* Header inside form for mobile context or emphasis */}
            <div className="text-center md:text-start mb-4">
                <h2 className="text-2xl font-semibold text-white">Let's build something amazing.</h2>
                <p className="text-zinc-400 text-sm mt-1">Fill out the details below.</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">
                    {t("name")}
                </label>
                <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-zinc-500 transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none ${errors.senderName ? "border-red-500/50" : "border-white/10"
                        }`}
                    placeholder={t("name")}
                />
                {errors.senderName && <p className="text-xs text-red-500 ml-1">{errors.senderName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">
                    {t("email")}
                </label>
                <input
                    type="email"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    className={`w-full rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-zinc-500 transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none ${errors.senderEmail ? "border-red-500/50" : "border-white/10"
                        }`}
                    placeholder={t("email")}
                />
                {errors.senderEmail && <p className="text-xs text-red-500 ml-1">{errors.senderEmail}</p>}
            </div>

            {/* Service & Budget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">
                        {t("serviceType")}
                    </label>
                    <div className="relative">
                        <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            className={`w-full appearance-none rounded-xl border bg-white/5 px-4 py-3.5 text-white transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none ${errors.serviceType ? "border-red-500/50" : "border-white/10"
                                }`}
                        >
                            <option value="" className="bg-zinc-900 text-zinc-500">Select...</option>
                            {services.map((s) => (
                                <option key={s.id} value={s.id} className="bg-zinc-900">
                                    {s.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">
                        {t("budget")}
                    </label>
                    <div className="relative">
                        <select
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className={`w-full appearance-none rounded-xl border bg-white/5 px-4 py-3.5 text-white transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none ${errors.budget ? "border-red-500/50" : "border-white/10"
                                }`}
                        >
                            <option value="" className="bg-zinc-900 text-zinc-500">Select...</option>
                            {budgets.map((b) => (
                                <option key={b.id} value={b.id} className="bg-zinc-900">
                                    {b.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 ml-1">
                    {t("message")}
                </label>
                <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={5}
                    className={`w-full resize-none rounded-xl border bg-white/5 px-4 py-3.5 text-white placeholder-zinc-500 transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none ${errors.body ? "border-red-500/50" : "border-white/10"
                        }`}
                    placeholder={t("message")}
                />
                {errors.body && <p className="text-xs text-red-500 ml-1">{errors.body}</p>}
            </div>

            {/* Submit Error */}
            {submitError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                    {submitError}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-white py-4 font-bold text-black transition-all duration-300 hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8V0" fill="currentColor" className="opacity-75" />
                        </svg>
                        {locale === "ar" ? "جاري الإرسال..." : "Sending..."}
                    </span>
                ) : (
                    t("submit") || "Start Project 🚀"
                )}
            </button>
        </motion.form>
    );
}
