export const revalidate = 86400;
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/public/social-links
 * Returns all active social links ordered by `order` field.
 * Public endpoint — no authentication required.
 */
export async function GET() {
    try {
        const links = await prisma.socialLink.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ success: true, data: links });
    } catch (error) {
        console.error("[API] GET /api/public/social-links error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
