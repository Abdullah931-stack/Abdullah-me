import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/projects-list
 * Returns the titles of all published projects.
 * Used by ContactForm to populate the project picker (§9.3).
 * Returns only id + titles — no sensitive fields, no authentication required.
 */
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            where: { isPublished: true },
            select: {
                id:      true,
                titleAr: true,
                titleEn: true,
            },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        console.error("[API] GET /api/public/projects-list error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
