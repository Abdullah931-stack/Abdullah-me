"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { TimelineRow } from "@/types";

/**
 * Admin Timeline CMS Page
 * - List all timeline entries
 * - Create / Edit / Delete entries
 */

export default function AdminTimelinePage() {
    const [entries, setEntries] = useState<TimelineRow[]>([]);
    const [projects, setProjects] = useState<{ id: string; slug: string; titleAr: string; titleEn: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<TimelineRow | null>(null);
    const [form, setForm] = useState({
        date: "",
        dateTo: "",
        projectSlug: "",
        age: 0,
        titleAr: "",
        titleEn: "",
        summaryAr: "",
        summaryEn: "",
        storyAr: "",
        storyEn: "",
        imageUrl: "",
        order: 0,
    });

    useEffect(() => {
        fetchEntries();
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const res = await fetch("/api/admin/projects");
            const data = await res.json();
            if (data.success) setProjects(data.data);
        } catch {
            // Handle error silently
        }
    }

    async function fetchEntries() {
        try {
            const res = await fetch("/api/admin/timeline");
            const data = await res.json();
            if (data.success) setEntries(data.data);
        } catch {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editing
            ? `/api/admin/timeline/${editing.id}`
            : "/api/admin/timeline";
        const method = editing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setShowForm(false);
                setEditing(null);
                resetForm();
                fetchEntries();
            }
        } catch {
            // Handle error
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this entry?")) return;
        try {
            await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
            fetchEntries();
        } catch {
            // Handle error
        }
    }

    function editEntry(entry: TimelineRow) {
        setEditing(entry);
        setForm({
            date: entry.date.split("T")[0],
            dateTo: entry.dateTo ? entry.dateTo.split("T")[0] : "",
            projectSlug: entry.projectSlug || "",
            age: entry.age,
            titleAr: entry.titleAr || "",
            titleEn: entry.titleEn || "",
            summaryAr: entry.summaryAr || "",
            summaryEn: entry.summaryEn || "",
            storyAr: entry.storyAr || "",
            storyEn: entry.storyEn || "",
            imageUrl: entry.imageUrl || "",
            order: entry.order,
        });
        setShowForm(true);
    }

    function resetForm() {
        setForm({
            date: "",
            dateTo: "",
            projectSlug: "",
            age: 0,
            titleAr: "",
            titleEn: "",
            summaryAr: "",
            summaryEn: "",
            storyAr: "",
            storyEn: "",
            imageUrl: "",
            order: 0,
        });
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Timeline</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditing(null);
                        resetForm();
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                    {showForm ? "Cancel" : "+ New Entry"}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 space-y-4 rounded-xl p-6"
                    style={{ border: '1px solid var(--color-card-border)', background: 'var(--color-surface)' }}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                            style={{ border: '1px solid var(--color-card-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)' }}
                            required
                        />
                        {/* §9.3 — End of Date Range (optional), directly below Date */}
                        <div>
                            <label className="block text-xs mb-1" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                                End of Date Range (optional)
                            </label>
                            <input
                                type="date"
                                value={form.dateTo}
                                onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                                className="w-full rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                                style={{ border: '1px solid var(--color-card-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)' }}
                            />
                            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)', opacity: 0.7 }}>
                                Leave empty if you know the exact date. Fill in only if this milestone happened sometime between the two dates.
                            </p>
                        </div>
                        <input
                            type="number"
                            placeholder="Age"
                            value={form.age || ""}
                            onChange={(e) =>
                                setForm({ ...form, age: parseInt(e.target.value) || 0 })
                            }
                            className="rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                            style={{ border: '1px solid var(--color-card-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)' }}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Order"
                            value={form.order || ""}
                            onChange={(e) =>
                                setForm({ ...form, order: parseInt(e.target.value) || 0 })
                            }
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                        />
                    </div>
                    {/* Related Project Selection (optional) */}
                    <div>
                        <label className="block text-xs mb-1 font-mono" style={{ color: 'var(--color-muted)' }}>
                            Link to Uploaded Project (optional — §12.7)
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={form.projectSlug}
                                onChange={(e) => setForm({ ...form, projectSlug: e.target.value })}
                                className="flex-1 rounded-lg px-4 py-2.5 focus:outline-none transition-all cursor-pointer"
                                style={{ border: '1px solid var(--color-card-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)' }}
                            >
                                <option value="" className="bg-zinc-900 text-zinc-400">-- None (No Linked Project) --</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.slug} className="bg-zinc-900 text-white">
                                        {p.titleAr} ({p.titleEn}) — [{p.slug}]
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            placeholder="Title (English)"
                            value={form.titleEn}
                            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                            className="rounded-lg px-4 py-2.5 focus:outline-none transition-all"
                            style={{ border: '1px solid var(--color-card-border)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text)' }}
                            required
                        />
                        <input
                            placeholder="العنوان (عربي)"
                            value={form.titleAr}
                            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            dir="rtl"
                            required
                        />
                        <textarea
                            placeholder="Summary Markdown (English — optional)"
                            value={form.summaryEn}
                            onChange={(e) => setForm({ ...form, summaryEn: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none font-mono text-sm"
                            rows={2}
                        />
                        <textarea
                            placeholder="الملخص المنسق Markdown (عربي — اختياري)"
                            value={form.summaryAr}
                            onChange={(e) => setForm({ ...form, summaryAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none font-mono text-sm"
                            rows={2}
                            dir="rtl"
                        />
                        <textarea
                            placeholder="Full Story Markdown (English — optional)"
                            value={form.storyEn}
                            onChange={(e) => setForm({ ...form, storyEn: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none font-mono text-sm"
                            rows={4}
                        />
                        <textarea
                            placeholder="القصة الكاملة Markdown (عربي — اختياري)"
                            value={form.storyAr}
                            onChange={(e) => setForm({ ...form, storyAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none font-mono text-sm"
                            rows={4}
                            dir="rtl"
                        />
                    </div>
                    <ImageUpload
                        value={form.imageUrl}
                        onChange={(url) => setForm({ ...form, imageUrl: url })}
                        folder="timeline"
                        label="Timeline Image"
                    />
                    <button
                        type="submit"
                        className="rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                    >
                        {editing ? "Update Entry" : "Create Entry"}
                    </button>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
                </div>
            ) : entries.length === 0 ? (
                <div className="rounded-xl p-12 text-center" style={{ border: '1px solid var(--color-card-border)', background: 'var(--color-surface)' }}>
                    <p style={{ color: 'var(--color-muted)' }}>No timeline entries yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between rounded-xl p-4"
                            style={{ border: '1px solid var(--color-card-border)', background: 'var(--color-surface)' }}
                        >
                            <div>
                                <p className="font-medium">{entry.titleEn}</p>
                                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                    })}{" "}
                                    — Age: {entry.age}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => editEntry(entry)}
                                    className="text-xs transition-colors"
                                    style={{ color: 'var(--color-accent)' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="text-xs text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
