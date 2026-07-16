export const revalidate = 86400;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/timeline
 * Returns all timeline entries ordered by date (ascending).
 * Public endpoint — no authentication required.
 */
export async function GET() {
    try {
        const entries = await prisma.timelineEntry.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: entries });
    } catch (error) {
        console.error("[API] GET /api/public/timeline error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
