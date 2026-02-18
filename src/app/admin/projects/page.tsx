"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ProjectRow } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Admin Projects CMS Page (Quiet Luxury)
 */

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<ProjectRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<ProjectRow | null>(null);
    const [form, setForm] = useState({
        titleAr: "",
        titleEn: "",
        summaryAr: "",
        summaryEn: "",
        bodyAr: "",
        bodyEn: "",
        previewUrl: "",
        skills: "",
        buildTime: "",
        order: 0,
        isPublished: false,
        isFeatured: false,
        coverImage: "",
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const res = await fetch("/api/admin/projects");
            const data = await res.json();
            if (data.success) setProjects(data.data);
        } catch {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editing
            ? `/api/admin/projects/${editing.id}`
            : "/api/admin/projects";
        const method = editing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    skills: form.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    coverImage: form.coverImage || undefined,
                }),
            });

            if (res.ok) {
                setShowForm(false);
                setEditing(null);
                resetForm();
                fetchProjects();
            }
        } catch {
            // Handle error
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            fetchProjects();
        } catch {
            // Handle error
        }
    }

    async function togglePublish(project: ProjectRow) {
        try {
            await fetch(`/api/admin/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !project.isPublished }),
            });
            fetchProjects();
        } catch {
            // Handle error
        }
    }

    function editProject(project: ProjectRow) {
        setEditing(project);
        setForm({
            titleAr: project.titleAr || "",
            titleEn: project.titleEn || "",
            summaryAr: "",
            summaryEn: "",
            bodyAr: "",
            bodyEn: "",
            previewUrl: "",
            skills: "",
            buildTime: "",
            order: project.order,
            isPublished: project.isPublished,
            isFeatured: project.isFeatured,
            coverImage: "",
        });
        setShowForm(true);
    }

    function resetForm() {
        setForm({
            titleAr: "",
            titleEn: "",
            summaryAr: "",
            summaryEn: "",
            bodyAr: "",
            bodyEn: "",
            previewUrl: "",
            skills: "",
            buildTime: "",
            order: 0,
            isPublished: false,
            isFeatured: false,
            coverImage: "",
        });
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Projects</h2>
                    <p className="text-zinc-400 mt-1">Manage your portfolio showcase.</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditing(null);
                        resetForm();
                    }}
                    className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                >
                    {showForm ? "Cancel" : "+ New Project"}
                </button>
            </div>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mb-8 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md overflow-hidden"
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <input
                                placeholder="Title (English)"
                                value={form.titleEn}
                                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                                required
                            />
                            <input
                                placeholder="العنوان (عربي)"
                                value={form.titleAr}
                                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                                dir="rtl"
                                required
                            />
                            <textarea
                                placeholder="Summary (English)"
                                value={form.summaryEn}
                                onChange={(e) => setForm({ ...form, summaryEn: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                                rows={2}
                            />
                            <textarea
                                placeholder="الملخص (عربي)"
                                value={form.summaryAr}
                                onChange={(e) => setForm({ ...form, summaryAr: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                                rows={2}
                                dir="rtl"
                            />
                            <textarea
                                placeholder="Full Story (English)"
                                value={form.bodyEn}
                                onChange={(e) => setForm({ ...form, bodyEn: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                                rows={4}
                            />
                            <textarea
                                placeholder="القصة الكاملة (عربي)"
                                value={form.bodyAr}
                                onChange={(e) => setForm({ ...form, bodyAr: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                                rows={4}
                                dir="rtl"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <input
                                placeholder="Preview URL"
                                value={form.previewUrl}
                                onChange={(e) => setForm({ ...form, previewUrl: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                            />
                            <input
                                placeholder="Skills (comma separated)"
                                value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                            />
                            <input
                                placeholder="Build Time"
                                value={form.buildTime}
                                onChange={(e) => setForm({ ...form, buildTime: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                            />
                        </div>

                        {/* Project Cover Image Upload */}
                        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                            <ImageUpload
                                value={form.coverImage}
                                onChange={(url) => setForm({ ...form, coverImage: url })}
                                folder="projects"
                                label="Project Cover Image"
                            />
                        </div>

                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 text-sm text-zinc-300 font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isPublished}
                                    onChange={(e) =>
                                        setForm({ ...form, isPublished: e.target.checked })
                                    }
                                    className="rounded border-white/20 bg-white/5 text-white focus:ring-0 checked:bg-white checked:border-white"
                                />
                                Published
                            </label>
                            <label className="flex items-center gap-2 text-sm text-zinc-300 font-medium cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isFeatured}
                                    onChange={(e) =>
                                        setForm({ ...form, isFeatured: e.target.checked })
                                    }
                                    className="rounded border-white/20 bg-white/5 text-white focus:ring-0 checked:bg-white checked:border-white"
                                />
                                Featured
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-black hover:bg-zinc-200 transition-colors"
                        >
                            {editing ? "Update Project" : "Create Project"}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Projects List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
            ) : projects.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
                    <p className="text-zinc-400 text-lg">No projects yet. Create your first project!</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-zinc-300">
                                    Title
                                </th>
                                <th className="px-6 py-4 text-left font-semibold text-zinc-300">
                                    Slug
                                </th>
                                <th className="px-6 py-4 text-center font-semibold text-zinc-300">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right font-semibold text-zinc-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-white text-base">{project.titleEn}</p>
                                            <p className="text-xs text-zinc-500 mt-1" dir="rtl">
                                                {project.titleAr}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{project.slug}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => togglePublish(project)}
                                            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${project.isPublished
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                                                }`}
                                        >
                                            {project.isPublished ? "Published" : "Draft"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => editProject(project)}
                                            className="mr-3 text-zinc-300 hover:text-white font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
