import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Timeline by ID API
 *
 * PUT    — Update timeline entry
 * DELETE — Delete timeline entry
 */

// PUT /api/admin/timeline/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        const body = await request.json();

        const entry = await prisma.timelineEntry.update({
            where: { id },
            data: {
                date: body.date ? new Date(body.date) : undefined,
                dateTo: body.dateTo ? new Date(body.dateTo) : null,
                projectSlug: body.projectSlug !== undefined ? body.projectSlug || null : undefined,
                age: body.age,
                titleAr: body.titleAr,
                titleEn: body.titleEn,
                summaryAr: body.summaryAr !== undefined ? body.summaryAr || null : undefined,
                summaryEn: body.summaryEn !== undefined ? body.summaryEn || null : undefined,
                storyAr: body.storyAr !== undefined ? body.storyAr || null : undefined,
                storyEn: body.storyEn !== undefined ? body.storyEn || null : undefined,
                imageUrl: body.imageUrl,
                order: body.order,
            },
        });

        return NextResponse.json({ success: true, data: entry });
    } catch (error) {
        console.error("[Admin API] PUT /api/admin/timeline/[id] error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/timeline/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const { id } = await params;
        await prisma.timelineEntry.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(
            "[Admin API] DELETE /api/admin/timeline/[id] error:",
            error
        );
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
