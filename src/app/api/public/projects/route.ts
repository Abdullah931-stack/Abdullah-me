export const revalidate = 86400;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/projects
 * Returns all published projects ordered by `order` field.
 * Public endpoint — no authentication required.
 */
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            where: { isPublished: true },
            include: {
                images: {
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: projects });
    } catch (error) {
        console.error("[API] GET /api/public/projects error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
