"use client";

import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { ProjectImage } from "@/types";

interface ProjectImagesManagerProps {
    images: ProjectImage[];
    onChange: (images: ProjectImage[]) => void;
}

export default function ProjectImagesManager({
    images,
    onChange,
}: ProjectImagesManagerProps) {
    const [newImageUrl, setNewImageUrl] = useState("");

    // Add a new image to list
    function handleAddImage() {
        if (!newImageUrl.trim()) return;

        const isFirst = images.length === 0;
        const newImage: ProjectImage = {
            id: `temp-${Date.now()}-${Math.random()}`,
            url: newImageUrl.trim(),
            altAr: "",
            altEn: "",
            order: images.length,
            isCover: isFirst, // First image is cover by default unless changed
        };

        const updated = [...images, newImage];
        onChange(updated);
        setNewImageUrl("");
    }

    // Toggle single cover image enforcement
    function handleSetCover(targetIndex: number) {
        const updated = images.map((img, idx) => ({
            ...img,
            isCover: idx === targetIndex, // Only targetIndex becomes true
        }));
        onChange(updated);
    }

    // Change custom priority order number
    function handleOrderChange(index: number, newOrder: number) {
        const updated = images.map((img, idx) =>
            idx === index ? { ...img, order: newOrder } : img
        );

        // Sort images by order ascending
        updated.sort((a, b) => a.order - b.order);
        onChange(updated);
    }

    // Remove image
    function handleRemoveImage(index: number) {
        const remaining = images.filter((_, idx) => idx !== index);
        // If removed image was cover and there are remaining images, set first as cover
        if (images[index]?.isCover && remaining.length > 0) {
            remaining[0].isCover = true;
        }
        onChange(remaining);
    }

    return (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h4 className="text-sm font-bold text-white tracking-wide">
                Project Images & Cover Selection
            </h4>
            <p className="text-xs text-zinc-400">
                Upload or add image URLs. Select exactly 1 image as Cover, and assign order numbers for priority.
            </p>

            {/* Add Image Input */}
            <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 w-full">
                    <ImageUpload
                        value={newImageUrl}
                        onChange={(url) => setNewImageUrl(url)}
                        folder="projects"
                        label="Add Project Image"
                    />
                </div>
                {newImageUrl && (
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-black hover:bg-emerald-400 transition-colors shadow-md"
                    >
                        + Add to List
                    </button>
                )}
            </div>

            {/* Images List */}
            {images.length > 0 && (
                <div className="mt-4 space-y-3">
                    {images.map((img, idx) => (
                        <div
                            key={img.id || idx}
                            data-testid={`project-image-item-${idx}`}
                            className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border p-3 transition-all ${
                                img.isCover
                                    ? "border-emerald-500/50 bg-emerald-500/10"
                                    : "border-white/10 bg-white/5"
                            }`}
                        >
                            {/* Preview & Badges */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <img
                                    src={img.url}
                                    alt="Thumb"
                                    className="h-14 w-14 rounded-lg object-cover border border-white/10"
                                />
                                <div>
                                    <p className="text-xs font-mono text-zinc-300 truncate max-w-[200px]">
                                        {img.url}
                                    </p>
                                    {img.isCover && (
                                        <span className="mt-1 inline-block rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                                            ★ Cover Image
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Controls: Single Cover Toggle, Order Number Input, Delete */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                {/* Priority Order Input */}
                                <div className="flex items-center gap-1.5">
                                    <label className="text-[11px] text-zinc-400 font-medium">Order:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={img.order}
                                        data-testid={`order-input-${idx}`}
                                        onChange={(e) =>
                                            handleOrderChange(idx, parseInt(e.target.value) || 0)
                                        }
                                        className="w-14 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-center text-xs text-white focus:border-white/30 focus:outline-none"
                                    />
                                </div>

                                {/* Set Cover Button */}
                                <button
                                    type="button"
                                    data-testid={`set-cover-btn-${idx}`}
                                    onClick={() => handleSetCover(idx)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                        img.isCover
                                            ? "bg-emerald-500 text-black shadow-md"
                                            : "bg-white/10 text-zinc-300 hover:bg-white/20"
                                    }`}
                                >
                                    {img.isCover ? "Cover" : "Set Cover"}
                                </button>

                                {/* Remove Button */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/20 transition-colors"
                                    title="Remove image"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
