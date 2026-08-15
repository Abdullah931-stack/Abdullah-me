"use client";

import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

interface SkillsManagerProps {
    skills: string[];
    onChange: (skills: string[]) => void;
}

export default function SkillsManager({
    skills,
    onChange,
}: SkillsManagerProps) {
    const [skillName, setSkillName] = useState("");
    const [skillIcon, setSkillIcon] = useState("");

    function handleAddSkill() {
        if (!skillName.trim()) return;

        const trimmed = skillName.trim();
        // Format skill as name or name|icon if icon is provided
        const skillPayload = skillIcon ? `${trimmed}|${skillIcon}` : trimmed;

        if (!skills.includes(skillPayload)) {
            onChange([...skills, skillPayload]);
        }

        // Reset inputs for sequential skill addition
        setSkillName("");
        setSkillIcon("");
    }

    function handleRemoveSkill(skillToRemove: string) {
        onChange(skills.filter((s) => s !== skillToRemove));
    }

    // Helper to parse name and icon
    function parseSkill(skillStr: string) {
        const parts = skillStr.split("|");
        return {
            name: parts[0],
            icon: parts[1] || null,
        };
    }

    return (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h4 className="text-sm font-bold text-white tracking-wide">
                Project Skills & Technology Badges
            </h4>
            <p className="text-xs text-zinc-400">
                Add skills incrementally. You can optionally attach a logo/icon for each skill badge.
            </p>

            {/* Input Row */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        placeholder="Skill name (e.g. Next.js, PyTorch)..."
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSkill();
                            }
                        }}
                        className="w-full sm:flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-white/20 focus:outline-none"
                    />

                    <button
                        type="button"
                        data-testid="add-skill-btn"
                        onClick={handleAddSkill}
                        className="w-full sm:w-auto rounded-xl bg-white px-5 py-3 text-xs font-bold text-black hover:bg-zinc-200 transition-colors shadow-md"
                    >
                        + Add Skill
                    </button>
                </div>

                {/* Optional Skill Logo Upload */}
                <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                    <ImageUpload
                        value={skillIcon}
                        onChange={(url) => setSkillIcon(url)}
                        folder="skill-icons"
                        label="Optional Skill Logo / Badge Icon"
                    />
                </div>
            </div>

            {/* Added Skills Tag Cloud */}
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skillStr) => {
                        const parsed = parseSkill(skillStr);
                        return (
                            <span
                                key={skillStr}
                                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-sm"
                            >
                                {parsed.icon && (
                                    <img
                                        src={parsed.icon}
                                        alt={parsed.name}
                                        className="h-4 w-4 rounded-full object-cover"
                                    />
                                )}
                                <span>{parsed.name}</span>
                                <button
                                    type="button"
                                    data-testid={`remove-skill-${parsed.name}`}
                                    onClick={() => handleRemoveSkill(skillStr)}
                                    className="ml-1 rounded-full text-zinc-400 hover:text-red-400 transition-colors"
                                >
                                    ✕
                                </button>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
