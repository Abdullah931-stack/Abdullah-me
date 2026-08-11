import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Projects API — CRUD
 * All routes require authentication via Supabase Auth.
 *
 * GET  — List all projects (including unpublished)
 * POST — Create a new project
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
        const slug = body.titleEn
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // Check for slug collision
        const existing = await prisma.project.findUnique({ where: { slug } });
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

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
                skills: body.skills || [],
                buildTime: body.buildTime || null,
                order: body.order || 0,
                isPublished: body.isPublished ?? false,
                isFeatured: body.isFeatured ?? false,
                // Create cover image if provided
                ...(body.coverImage
                    ? {
                        images: {
                            create: {
                                url: body.coverImage,
                                altEn: body.titleEn,
                                altAr: body.titleAr,
                                order: 0,
                            },
                        },
                    }
                    : {}),
            },
            include: { images: true },
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
