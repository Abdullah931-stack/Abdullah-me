"use client";

import { useState, useEffect } from "react";
import type { MessageRow, ContactReason } from "@/types";

// Human-readable labels for the inbox column (§9.2)
const REASON_LABELS: Record<ContactReason, string> = {
    general:       "General Inquiry",
    "bug-report":  "Issue Report",
    academic:      "Academic / Research",
    collaboration: "Collaboration / Hiring",
};

/**
 * Admin Messages Inbox Page
 * - List all messages (newest first)
 * - Mark as read / Delete
 */

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<MessageRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
        try {
            const res = await fetch("/api/admin/messages");
            const data = await res.json();
            if (data.success) setMessages(data.data);
        } catch {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    }

    async function toggleRead(msg: MessageRow) {
        try {
            await fetch(`/api/admin/messages/${msg.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: !msg.isRead }),
            });
            fetchMessages();
        } catch {
            // Handle error
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this message?")) return;
        try {
            await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
            fetchMessages();
        } catch {
            // Handle error
        }
    }

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Messages Inbox</h2>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
            ) : messages.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-12 text-center">
                    <p className="text-gray-400">No messages yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`rounded-xl border bg-[#0D1117] p-4 transition-all ${msg.isRead
                                ? "border-gray-800"
                                : "border-teal-500/30 bg-teal-500/5"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() =>
                                        setExpanded(expanded === msg.id ? null : msg.id)
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        {!msg.isRead && (
                                            <span className="h-2 w-2 rounded-full bg-teal-400" />
                                        )}
                                        <span className="font-medium">{msg.senderName}</span>
                                        <span className="text-sm text-gray-400">
                                            {msg.senderEmail}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                        <span>{REASON_LABELS[msg.reason as ContactReason] ?? msg.reason}</span>
                                        {msg.projectRef && <span>• {msg.projectRef}</span>}
                                        <span>
                                            •{" "}
                                            {new Date(msg.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        {msg.emailStatus === "failed" && (
                                            <span className="rounded bg-red-500/10 px-2 py-0.5 text-red-400">
                                                Email Failed
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleRead(msg)}
                                        className="text-xs text-gray-400 hover:text-white"
                                    >
                                        {msg.isRead ? "Unread" : "Read"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {expanded === msg.id && (
                                <div className="mt-4 border-t border-gray-800 pt-4 text-sm text-gray-300">
                                    {msg.body}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
