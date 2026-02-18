"use client";

import { useState, useRef } from "react";

/**
 * Reusable Image Upload Component for Admin CMS (Quiet Luxury).
 * Uploads to /api/admin/upload and returns the public URL.
 */
interface ImageUploadProps {
    /** Current image URL (for preview) */
    value: string;
    /** Callback when image is uploaded */
    onChange: (url: string) => void;
    /** Storage folder name */
    folder?: string;
    /** Label text */
    label?: string;
}

export default function ImageUpload({
    value,
    onChange,
    folder = "general",
    label = "Image",
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                onChange(data.data.url);
            } else {
                setError(data.error || "Upload failed");
            }
        } catch {
            setError("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            // Reset file input so same file can be re-selected
            if (fileRef.current) fileRef.current.value = "";
        }
    }

    function handleRemove() {
        onChange("");
    }

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-400">
                {label}
            </label>

            <div className="flex items-start gap-4">
                {/* Preview */}
                {value && (
                    <div className="relative group rounded-xl overflow-hidden border border-white/10 w-32 h-32 flex-shrink-0">
                        <img
                            src={value}
                            alt="Preview"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute inset-0 bg-black/50 z-10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            title="Remove image"
                        >
                            <span className="bg-red-500/80 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">✕</span>
                        </button>
                    </div>
                )}

                <div className="flex-1 space-y-3">
                    {/* Upload Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <label
                            className={`cursor-pointer rounded-xl border border-dashed px-4 py-3 text-sm transition-all duration-200 flex items-center justify-center gap-2 ${isUploading
                                ? "border-zinc-700 text-zinc-500 bg-white/5"
                                : "border-zinc-700 text-zinc-400 hover:border-white/30 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <span>📁</span>
                                    <span>{value ? "Change Image" : "Upload Image"}</span>
                                </>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                onChange={handleUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </label>

                        {/* Or paste URL manually */}
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-xs text-zinc-600 font-medium">OR</span>
                            <input
                                placeholder="Paste image URL..."
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white placeholder-zinc-600 focus:border-white/20 focus:outline-none focus:bg-black/40 transition-all font-mono"
                            />
                        </div>
                    </div>
                    {error && (
                        <p className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded inline-block">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
