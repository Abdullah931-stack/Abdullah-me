"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Admin Dashboard — Overview Page (Quiet Luxury)
 */

interface Stats {
    projects: number;
    messages: number;
    unreadMessages: number;
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, messagesRes] = await Promise.all([
                    fetch("/api/admin/projects"),
                    fetch("/api/admin/messages"),
                ]);

                const projectsData = await projectsRes.json();
                const messagesData = await messagesRes.json();

                setStats({
                    projects: projectsData.data?.length || 0,
                    messages: messagesData.data?.length || 0,
                    unreadMessages:
                        messagesData.data?.filter((m: { isRead: boolean }) => !m.isRead)
                            .length || 0,
                });
            } catch {
                // Handle errors silently
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Projects",
            value: stats?.projects || 0,
            icon: "📁",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Messages",
            value: stats?.messages || 0,
            icon: "✉️",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            label: "Unread Messages",
            value: stats?.unreadMessages || 0,
            icon: "🔔",
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-zinc-400 mt-1">Overview of your portfolio performance.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {statCards.map((card) => (
                        <motion.div
                            variants={item}
                            key={card.label}
                            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">{card.label}</p>
                                    <h3 className="mt-2 text-3xl font-bold text-white">{card.value}</h3>
                                </div>
                                <div className={`rounded-2xl p-3 ${card.bg}`}>
                                    <span className={`text-xl ${card.color}`}>{card.icon}</span>
                                </div>
                            </div>

                            {/* Decorative gradient blob */}
                            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${card.bg} blur-2xl opacity-20 transition-opacity group-hover:opacity-40`} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
