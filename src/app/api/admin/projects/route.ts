import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { ProjectImage } from "@/types";

/**
 * Admin Projects API — CRUD
 * GET  — List all projects (including unpublished) with images
 * POST — Create a new project with images, single cover enforcement, and custom ordering
 */

// GET /api/admin/projects — List all projects
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const projects = await prisma.project.findMany({
            include: { images: { orderBy: { order: "asc" } } },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/projects error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/admin/projects — Create a new project
export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const body = await request.json();

        // Generate slug from English title
        const slug = (body.titleEn || "project")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // Check for slug collision
        const existing = await prisma.project.findUnique({ where: { slug } });
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

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
            } else if (!img.isCover && idx === 0 && !coverAssigned && rawImages.some((i) => i.isCover)) {
                isCover = false;
            }
            return {
                url: img.url || "",
                altAr: img.altAr || body.titleAr || null,
                altEn: img.altEn || body.titleEn || null,
                order: typeof img.order === "number" ? img.order : idx,
                isCover,
            };
        });

        // Ensure at least 1 image is cover if images exist
        if (!coverAssigned && processedImages.length > 0) {
            processedImages[0].isCover = true;
        }

        const project = await prisma.project.create({
            data: {
                slug: finalSlug,
                titleAr: body.titleAr,
                titleEn: body.titleEn,
                summaryAr: body.summaryAr || "",
                summaryEn: body.summaryEn || "",
                bodyAr: body.bodyAr || "",
                bodyEn: body.bodyEn || "",
                previewUrl: body.previewUrl || null,
                repoUrl: body.repoUrl || null,
                skills: Array.isArray(body.skills) ? body.skills : [],
                buildTime: body.buildTime || null,
                order: body.order || 0,
                isPublished: body.isPublished ?? false,
                isFeatured: body.isFeatured ?? false,
                images: {
                    create: processedImages,
                },
            },
            include: { images: { orderBy: { order: "asc" } } },
        });

        return NextResponse.json(
            { success: true, data: project },
            { status: 201 }
        );
    } catch (error) {
        console.error("[Admin API] POST /api/admin/projects error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
