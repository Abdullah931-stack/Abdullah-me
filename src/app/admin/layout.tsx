"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Admin Dashboard Layout — v2.0 "Signal & Growth"
 * 
 * §9.1: Deliberately restrained — color tokens only, NO lava-lamp/Lissajous/card-ripple
 * §9.2: PulseBorder on Save/Publish/Delete buttons only (handled in sub-pages)
 * Flat --bg background per §9.1 explicit guidance
 */

const SIDEBAR_LINKS = [
    { href: "/admin", label: "Overview", icon: "📊" },
    { href: "/admin/projects", label: "Projects", icon: "📁" },
    { href: "/admin/timeline", label: "Timeline", icon: "📅" },
    { href: "/admin/social-links", label: "Social Links", icon: "🔗" },
    { href: "/admin/messages", label: "Messages", icon: "✉️" },
    { href: "/admin/survey", label: "Survey Analytics", icon: "📈" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("sb-access-token");
        if (!token && pathname !== "/admin/login" && pathname !== "/admin/signup") {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [router, pathname]);

    // Don't render layout for login/signup pages
    if (pathname === "/admin/login" || pathname === "/admin/signup") {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-bg)' }}>
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    function handleLogout() {
        localStorage.removeItem("sb-access-token");
        localStorage.removeItem("sb-refresh-token");
        router.push("/admin/login");
    }

    return (
        <div className="flex min-h-screen font-sans" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform backdrop-blur-xl transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ borderRight: '1px solid var(--color-card-border)', background: 'rgba(5, 15, 10, 0.8)' }}
            >
                {/* Logo */}
                <div className="flex h-20 items-center px-6" style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                    <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>Admin<span style={{ color: 'var(--color-muted)' }}>Panel</span></h1>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-4">
                    {SIDEBAR_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                    ? "shadow-sm"
                                    : ""
                                    }`}
                                style={isActive ? {
                                    background: 'rgba(74, 222, 128, 0.1)',
                                    color: 'var(--color-text)',
                                    border: '1px solid var(--color-card-border)',
                                } : {
                                    color: 'var(--color-muted)',
                                }}
                            >
                                <span className="text-lg opacity-80">{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 w-full p-4 space-y-2" style={{ borderTop: '1px solid var(--color-card-border)' }}>
                    {/* Export */}
                    <a
                        href="/api/admin/export"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        <span>💾</span> Export Data
                    </a>

                    {/* Back to Site */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        <span>🌐</span> View Site
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex h-20 items-center justify-between backdrop-blur-md px-6 lg:px-8" style={{ borderBottom: '1px solid var(--color-card-border)', background: 'rgba(5, 15, 10, 0.5)' }}>
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="rounded-lg p-2 md:hidden"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="hidden md:block" />

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium px-4 py-2 rounded-full" style={{ color: 'var(--color-muted)', background: 'var(--color-surface)', border: '1px solid var(--color-card-border)', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ background: 'var(--color-bg)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
