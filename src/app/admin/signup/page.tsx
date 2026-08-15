"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Admin Signup Page — v2.0 "Signal & Growth"
 *
 * Guarded by ENABLE_ADMIN_SIGNUP feature flag.
 * If signup is disabled, displays an informational disabled state with a direct link to /admin/login.
 * Can be enabled at any time by setting ENABLE_ADMIN_SIGNUP=true in .env.local without code deletion.
 */
export default function AdminSignupPage() {
    const router = useRouter();
    const [isSignupEnabled, setIsSignupEnabled] = useState<boolean | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if signup is enabled on server
        async function checkSignupStatus() {
            try {
                const res = await fetch("/api/auth/signup");
                const data = await res.json();
                setIsSignupEnabled(Boolean(data.enabled));
            } catch {
                setIsSignupEnabled(false);
            }
        }
        checkSignupStatus();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed");
                return;
            }

            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    if (isSignupEnabled === null) {
        return (
            <div
                className="flex min-h-screen items-center justify-center"
                style={{ background: "var(--color-bg)" }}
            >
                <div
                    className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                    style={{
                        borderColor: "var(--color-accent)",
                        borderTopColor: "transparent",
                    }}
                />
            </div>
        );
    }

    return (
        <div
            className="flex min-h-screen items-center justify-center px-4"
            style={{ background: "var(--color-bg)" }}
        >
            <div className="w-full max-w-sm">
                {/* Logo & Header */}
                <h1
                    className="mb-2 text-center text-3xl font-bold tracking-tight"
                    style={{
                        color: "var(--color-text)",
                        fontFamily: "var(--font-space-grotesk), sans-serif",
                    }}
                >
                    Admin <span style={{ color: "var(--color-accent)" }}>Signup</span>
                </h1>
                <p
                    className="mb-8 text-center text-sm"
                    style={{ color: "var(--color-muted)" }}
                >
                    {isSignupEnabled
                        ? "Set up your admin credentials"
                        : "Account registration status"}
                </p>

                {!isSignupEnabled ? (
                    // Disabled State
                    <div
                        className="rounded-2xl border p-6 text-center space-y-4"
                        style={{
                            borderColor: "var(--color-card-border)",
                            background: "rgba(255, 255, 255, 0.035)",
                        }}
                    >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 text-2xl">
                            🔒
                        </div>
                        <h2
                            className="text-lg font-bold"
                            style={{ color: "var(--color-text)" }}
                        >
                            Registration Disabled
                        </h2>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                            Public admin registration is currently disabled to safeguard CMS access.
                            If you need to create an initial account, set <code className="px-1.5 py-0.5 rounded bg-white/10 text-[var(--color-accent-bright)] font-mono">ENABLE_ADMIN_SIGNUP=true</code> in your environment variables.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/admin/login"
                                className="block w-full rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90"
                                style={{
                                    background: "var(--color-accent)",
                                    color: "var(--color-bg)",
                                }}
                            >
                                Go to Admin Login →
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Active Signup Form
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 rounded-2xl border p-6"
                        style={{
                            borderColor: "var(--color-card-border)",
                            background: "rgba(255, 255, 255, 0.035)",
                        }}
                    >
                        <div>
                            <label
                                className="mb-2 block text-sm font-medium"
                                style={{ color: "var(--color-text)" }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border px-4 py-3 text-sm placeholder-[var(--color-muted)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                                style={{
                                    borderColor: "var(--color-card-border)",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    color: "var(--color-text)",
                                }}
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium"
                                style={{ color: "var(--color-text)" }}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-xl border px-4 py-3 text-sm placeholder-[var(--color-muted)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                                style={{
                                    borderColor: "var(--color-card-border)",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    color: "var(--color-text)",
                                }}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label
                                className="mb-2 block text-sm font-medium"
                                style={{ color: "var(--color-text)" }}
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-xl border px-4 py-3 text-sm placeholder-[var(--color-muted)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                                style={{
                                    borderColor: "var(--color-card-border)",
                                    background: "rgba(255, 255, 255, 0.03)",
                                    color: "var(--color-text)",
                                }}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl py-3 text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                                background: "var(--color-accent)",
                                color: "var(--color-bg)",
                            }}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>

                        <p
                            className="text-center text-xs"
                            style={{ color: "var(--color-muted)" }}
                        >
                            Already have an account?{" "}
                            <Link
                                href="/admin/login"
                                className="font-semibold underline transition-colors hover:text-[var(--color-accent-bright)]"
                                style={{ color: "var(--color-accent)" }}
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
