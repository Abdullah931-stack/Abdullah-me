import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Project by ID API — CRUD
 *
 * GET    — Get single project by ID
 * PUT    — Update project by ID
 * DELETE — Delete project by ID (with orphan image cleanup)
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

        const project = await prisma.project.update({
            where: { id },
            data: {
                titleAr: body.titleAr,
                titleEn: body.titleEn,
                summaryAr: body.summaryAr,
                summaryEn: body.summaryEn,
                bodyAr: body.bodyAr,
                bodyEn: body.bodyEn,
                previewUrl: body.previewUrl,
                repoUrl: body.repoUrl,
                skills: body.skills,
                buildTime: body.buildTime,
                order: body.order,
                isPublished: body.isPublished,
                isFeatured: body.isFeatured,
            },
        });

        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        console.error("[Admin API] PUT /api/admin/projects/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/projects/[id] — with orphan image cleanup
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;

        // Delete images first (cascade), then the project
        await prisma.projectImage.deleteMany({ where: { projectId: id } });
        await prisma.project.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(
            "[Admin API] DELETE /api/admin/projects/[id] error:",
            error
        );
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
