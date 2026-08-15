"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

/**
 * Reusable Markdown Renderer Component
 * Renders Markdown content with custom Dark-Theme typography styling,
 * table support (remarkGfm), automatic newline preservation (remarkBreaks),
 * safe element rendering, and RTL alignment.
 */
export default function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    if (!content) return null;

    return (
        <div className={`markdown-content space-y-3 ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    h1: ({ children }) => (
                        <h1
                            className="mt-6 mb-3 text-2xl font-bold md:text-3xl"
                            style={{ color: "var(--color-text)", lineHeight: "1.25" }}
                        >
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2
                            className="mt-5 mb-2.5 text-xl font-bold md:text-2xl"
                            style={{ color: "var(--color-text)", lineHeight: "1.3" }}
                        >
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3
                            className="mt-4 mb-2 text-lg font-bold md:text-xl"
                            style={{ color: "var(--color-text)" }}
                        >
                            {children}
                        </h3>
                    ),
                    p: ({ children }) => (
                        <p
                            className="mb-2 text-base leading-relaxed whitespace-pre-line"
                            style={{ color: "var(--color-muted)" }}
                        >
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul
                            className="mb-3 list-disc space-y-1.5 ps-5"
                            style={{ color: "var(--color-muted)" }}
                        >
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol
                            className="mb-3 list-decimal space-y-1.5 ps-5"
                            style={{ color: "var(--color-muted)" }}
                        >
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote
                            className="my-3 border-s-4 p-3 ps-4 italic rounded-r-lg"
                            style={{
                                borderColor: "var(--color-accent)",
                                background: "rgba(255, 255, 255, 0.03)",
                                color: "var(--color-text)",
                            }}
                        >
                            {children}
                        </blockquote>
                    ),
                    code: ({ children, className: codeClassName }) => {
                        const isBlock = codeClassName?.includes("language-");
                        if (isBlock) {
                            return (
                                <pre
                                    className="my-3 overflow-x-auto rounded-xl p-4 text-xs md:text-sm font-mono border"
                                    style={{
                                        background: "rgba(5, 15, 10, 0.85)",
                                        borderColor: "var(--color-card-border)",
                                        color: "var(--color-text)",
                                        fontFamily:
                                            "var(--font-jetbrains-mono), monospace",
                                    }}
                                >
                                    <code>{children}</code>
                                </pre>
                            );
                        }
                        return (
                            <code
                                className="rounded px-1.5 py-0.5 text-xs font-mono border"
                                style={{
                                    background: "rgba(255, 255, 255, 0.08)",
                                    borderColor: "var(--color-card-border)",
                                    color: "var(--color-accent-bright)",
                                    fontFamily:
                                        "var(--font-jetbrains-mono), monospace",
                                }}
                            >
                                {children}
                            </code>
                        );
                    },
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline underline-offset-4 transition-colors hover:opacity-80"
                            style={{ color: "var(--color-accent)" }}
                        >
                            {children}
                        </a>
                    ),
                    table: ({ children }) => (
                        <div className="my-3 overflow-x-auto rounded-xl border border-[var(--color-card-border)] bg-[rgba(255,255,255,0.02)]">
                            <table className="w-full text-start text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th
                            className="border-b border-[var(--color-card-border)] p-3 text-start font-bold"
                            style={{
                                color: "var(--color-text)",
                                background: "rgba(255, 255, 255, 0.04)",
                            }}
                        >
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td
                            className="border-b border-[var(--color-card-border)]/40 p-3 text-start"
                            style={{ color: "var(--color-muted)" }}
                        >
                            {children}
                        </td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
