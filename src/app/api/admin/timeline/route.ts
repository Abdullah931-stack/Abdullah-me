import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Admin Timeline API — CRUD
 *
 * GET  — List all timeline entries
 * POST — Create a new timeline entry
 */

// GET /api/admin/timeline
export async function GET(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const entries = await prisma.timelineEntry.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: entries });
    } catch (error) {
        console.error("[Admin API] GET /api/admin/timeline error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/admin/timeline
export async function POST(request: NextRequest) {
    const auth = await requireAdmin(request);
    if (!auth.authenticated) return auth.response;

    try {
        const body = await request.json();

        const entry = await prisma.timelineEntry.create({
            data: {
                date: new Date(body.date),
                dateTo: body.dateTo ? new Date(body.dateTo) : null,
                projectSlug: body.projectSlug || null,
                age: body.age,
                titleAr: body.titleAr,
                titleEn: body.titleEn,
                summaryAr: body.summaryAr || null,
                summaryEn: body.summaryEn || null,
                storyAr: body.storyAr || null,
                storyEn: body.storyEn || null,
                imageUrl: body.imageUrl || null,
                order: body.order || 0,
            },
        });

        return NextResponse.json(
            { success: true, data: entry },
            { status: 201 }
        );
    } catch (error) {
        console.error("[Admin API] POST /api/admin/timeline error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
