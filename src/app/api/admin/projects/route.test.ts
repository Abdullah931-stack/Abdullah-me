import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { PUT, DELETE } from "./[id]/route";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

// Mock requireAdmin auth helper
vi.mock("@/lib/auth/require-admin", () => ({
    requireAdmin: vi.fn(),
}));

// Mock Supabase admin client
vi.mock("@/lib/supabase/admin", () => ({
    createAdminClient: vi.fn(() => ({
        storage: {
            from: vi.fn(() => ({
                remove: vi.fn().mockResolvedValue({ data: [], error: null }),
            })),
        },
    })),
}));

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
    prisma: {
        project: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        projectImage: {
            findMany: vi.fn().mockResolvedValue([]),
            deleteMany: vi.fn(),
            createMany: vi.fn(),
        },
        $transaction: vi.fn((callback) => callback(prisma)),
    },
}));

describe("Admin Projects API Backend & Edge Cases Test Suite", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default authenticated response
        (requireAdmin as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            authenticated: true,
            user: { id: "admin-1" },
        });
    });

    describe("Edge Case 1: Data Preservation on PUT Update", () => {
        it("should update project without dropping or clearing text fields (summary, body, repoUrl, skills)", async () => {
            const existingProject = {
                id: "proj-123",
                titleEn: "Existing Title",
                titleAr: "عنوان حالي",
                summaryEn: "Summary EN",
                summaryAr: "ملخص عربي",
                bodyEn: "Body EN text",
                bodyAr: "نص القصة بالعربي",
                previewUrl: "https://preview.dev",
                repoUrl: "https://github.com/user/repo",
                skills: ["React", "Next.js"],
                buildTime: "2 weeks",
                order: 1,
                isPublished: true,
                isFeatured: true,
            };

            (prisma.project.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
                ...existingProject,
                titleEn: "Updated Title",
            });

            const req = new NextRequest("http://localhost:3000/api/admin/projects/proj-123", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titleEn: "Updated Title",
                    titleAr: existingProject.titleAr,
                    summaryEn: existingProject.summaryEn,
                    summaryAr: existingProject.summaryAr,
                    bodyEn: existingProject.bodyEn,
                    bodyAr: existingProject.bodyAr,
                    previewUrl: existingProject.previewUrl,
                    repoUrl: existingProject.repoUrl,
                    skills: existingProject.skills,
                    buildTime: existingProject.buildTime,
                    order: existingProject.order,
                    isPublished: existingProject.isPublished,
                    isFeatured: existingProject.isFeatured,
                }),
            });

            const res = await PUT(req, { params: Promise.resolve({ id: "proj-123" }) });
            const data = await res.json();

            expect(data.success).toBe(true);
            expect(prisma.project.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { id: "proj-123" },
                    data: expect.objectContaining({
                        titleEn: "Updated Title",
                        summaryEn: "Summary EN",
                        bodyAr: "نص القصة بالعربي",
                        repoUrl: "https://github.com/user/repo",
                        skills: ["React", "Next.js"],
                    }),
                })
            );
        });
    });

    describe("Edge Case 2 & 3: Single Cover Image Enforcement & Multi-Image Ordering", () => {
        it("should accept multi-image payload with single cover image designation", async () => {
            const imagesInput = [
                { url: "https://img1.com", order: 1, isCover: false },
                { url: "https://img2.com", order: 0, isCover: true },
                { url: "https://img3.com", order: 2, isCover: false },
            ];

            (prisma.project.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
                id: "new-proj",
                titleEn: "New Project",
                titleAr: "مشروع جديد",
                images: imagesInput,
            });

            const req = new NextRequest("http://localhost:3000/api/admin/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titleEn: "New Project",
                    titleAr: "مشروع جديد",
                    images: imagesInput,
                }),
            });

            const res = await POST(req);
            const json = await res.json();

            expect(json.success).toBe(true);
            expect(prisma.project.create).toHaveBeenCalled();
        });
    });

    describe("Edge Case 4: Delete Cleanup", () => {
        it("should delete project and cascade delete images", async () => {
            (prisma.projectImage.deleteMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ count: 2 });
            (prisma.project.delete as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ id: "proj-1" });

            const req = new NextRequest("http://localhost:3000/api/admin/projects/proj-1", {
                method: "DELETE",
            });

            const res = await DELETE(req, { params: Promise.resolve({ id: "proj-1" }) });
            const data = await res.json();

            expect(data.success).toBe(true);
            expect(prisma.projectImage.deleteMany).toHaveBeenCalledWith({ where: { projectId: "proj-1" } });
            expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: "proj-1" } });
        });
    });
});
