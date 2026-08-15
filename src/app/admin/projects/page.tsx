"use client";

import { useState, useEffect } from "react";
import ProjectImagesManager from "@/components/admin/ProjectImagesManager";
import SkillsManager from "@/components/admin/SkillsManager";
import type { ProjectRow, ProjectImage } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { parseBuildTime, serializeBuildTime, TimeUnit } from "@/lib/format-build-time";

/**
 * Admin Projects CMS Page
 * Fixed: Preserves all project fields during edit, integrates ProjectImagesManager and SkillsManager.
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
        repoUrl: "",
        skills: [] as string[],
        buildTime: "",
        order: 0,
        isPublished: false,
        images: [] as ProjectImage[],
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
            // Handle error silently
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
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setShowForm(false);
                setEditing(null);
                resetForm();
                fetchProjects();
            }
        } catch {
            // Handle error silently
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            fetchProjects();
        } catch {
            // Handle error silently
        }
    }

    async function togglePublish(project: ProjectRow) {
        try {
            await fetch(`/api/admin/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...project,
                    isPublished: !project.isPublished,
                }),
            });
            fetchProjects();
        } catch {
            // Handle error silently
        }
    }

    // FIX: Populate ALL fields when editing project so no data is reset/wiped
    function editProject(project: ProjectRow) {
        setEditing(project);
        setForm({
            titleAr: project.titleAr || "",
            titleEn: project.titleEn || "",
            summaryAr: project.summaryAr || "",
            summaryEn: project.summaryEn || "",
            bodyAr: project.bodyAr || "",
            bodyEn: project.bodyEn || "",
            previewUrl: project.previewUrl || "",
            repoUrl: project.repoUrl || "",
            skills: Array.isArray(project.skills) ? project.skills : [],
            buildTime: project.buildTime || "",
            order: project.order ?? 0,
            isPublished: project.isPublished ?? false,
            images: project.images || [],
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
            repoUrl: "",
            skills: [],
            buildTime: "",
            order: 0,
            isPublished: false,
            images: [],
        });
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Projects</h2>
                    <p className="text-zinc-400 mt-1">Manage portfolio projects, cover images, and skills.</p>
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
                                placeholder="Repository URL"
                                value={form.repoUrl}
                                onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all"
                            />
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                                    <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Build Time:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="10"
                                        value={parseBuildTime(form.buildTime).amount}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            const newAmount = isNaN(val) || val < 1 ? 1 : val;
                                            const currentUnit = parseBuildTime(form.buildTime).unit;
                                            setForm({ ...form, buildTime: serializeBuildTime(newAmount, currentUnit) });
                                        }}
                                        className="w-20 rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-white text-sm font-bold text-center focus:outline-none focus:border-white/30"
                                    />
                                    <select
                                        value={parseBuildTime(form.buildTime).unit}
                                        onChange={(e) => {
                                            const currentAmount = parseBuildTime(form.buildTime).amount;
                                            setForm({ ...form, buildTime: serializeBuildTime(currentAmount, e.target.value as TimeUnit) });
                                        }}
                                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-1 text-white text-sm cursor-pointer focus:outline-none focus:border-white/30"
                                    >
                                        <option value="days" className="bg-zinc-900 text-white">Days</option>
                                        <option value="weeks" className="bg-zinc-900 text-white">Weeks</option>
                                        <option value="months" className="bg-zinc-900 text-white">Months</option>
                                        <option value="years" className="bg-zinc-900 text-white">Years</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Skills Manager Component */}
                        <SkillsManager
                            skills={form.skills}
                            onChange={(skills) => setForm({ ...form, skills })}
                        />

                        {/* Enhanced Project Images Manager Component */}
                        <ProjectImagesManager
                            images={form.images}
                            onChange={(images) => setForm({ ...form, images })}
                        />

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
