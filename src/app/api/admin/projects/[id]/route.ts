import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProjectImage } from "@/types";

/**
 * Safely extracts relative storage file path from public Supabase Storage URL.
 */
function extractStoragePath(url: string): string | null {
    if (!url) return null;
    const marker = "/uploads/";
    const idx = url.indexOf(marker);
    if (idx !== -1) {
        return url.substring(idx + marker.length);
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return url.replace(/^uploads\//, "");
    }
    return null;
}

/**
 * Admin Project by ID API — CRUD
 * GET    — Get single project by ID with images
 * PUT    — Update project by ID preserving text fields, images, cover selection, and priority ordering
 * DELETE — Delete project by ID with image cleanup
 */

// GET /api/admin/projects/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: { images: { orderBy: { order: "asc" } } },
        });

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/projects/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT /api/admin/projects/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        const body = await request.json();

        // Process images payload with single cover enforcement & priority ordering
        let rawImages: Partial<ProjectImage>[] = body.images || [];
        if (body.coverImage && rawImages.length === 0) {
            rawImages = [{ url: body.coverImage, isCover: true, order: 0 }];
        }

        let coverAssigned = false;
        const processedImages = rawImages.map((img, idx) => {
            let isCover = false;
            if (img.isCover && !coverAssigned) {
                isCover = true;
                coverAssigned = true;
            }
            return {
                url: img.url || "",
                altAr: img.altAr || body.titleAr || null,
                altEn: img.altEn || body.titleEn || null,
                order: typeof img.order === "number" ? img.order : idx,
                isCover,
            };
        });

        if (!coverAssigned && processedImages.length > 0) {
            processedImages[0].isCover = true;
        }

        // Execute update in Prisma transaction to safely sync project and images
        const updatedProject = await prisma.$transaction(async (tx) => {
            // Update project scalar fields preserving all values
            const updated = await tx.project.update({
                where: { id },
                data: {
                    titleAr: body.titleAr,
                    titleEn: body.titleEn,
                    summaryAr: body.summaryAr ?? "",
                    summaryEn: body.summaryEn ?? "",
                    bodyAr: body.bodyAr ?? "",
                    bodyEn: body.bodyEn ?? "",
                    previewUrl: body.previewUrl ?? null,
                    repoUrl: body.repoUrl ?? null,
                    skills: Array.isArray(body.skills) ? body.skills : [],
                    buildTime: body.buildTime ?? null,
                    order: body.order ?? 0,
                    isPublished: body.isPublished ?? false,
                    isFeatured: body.isFeatured ?? false,
                },
            });

            // Sync images if images array was provided
            if (body.images !== undefined || body.coverImage !== undefined) {
                await tx.projectImage.deleteMany({ where: { projectId: id } });
                if (processedImages.length > 0) {
                    await tx.projectImage.createMany({
                        data: processedImages.map((img) => ({
                            ...img,
                            projectId: id,
                        })),
                    });
                }
            }

            return tx.project.findUnique({
                where: { id },
                include: { images: { orderBy: { order: "asc" } } },
            });
        });

        return NextResponse.json({ success: true, data: updatedProject });
    } catch (error) {
        console.error("[Admin API] PUT /api/admin/projects/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;

        // Fetch associated images to purge from Supabase Storage
        const existingImages = await prisma.projectImage.findMany({
            where: { projectId: id },
            select: { url: true },
        });

        // Delete images first (cascade), then project
        await prisma.projectImage.deleteMany({ where: { projectId: id } });
        await prisma.project.delete({ where: { id } });

        // Purge media assets from Supabase Storage bucket asynchronously (safe fail-soft)
        const storagePaths = existingImages
            .map((img) => extractStoragePath(img.url))
            .filter((path): path is string => Boolean(path));

        if (storagePaths.length > 0) {
            try {
                const supabaseAdmin = createAdminClient();
                await supabaseAdmin.storage.from("uploads").remove(storagePaths);
            } catch (storageError) {
                console.error("[Admin API] Failed to purge storage media:", storageError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Admin API] DELETE /api/admin/projects/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
