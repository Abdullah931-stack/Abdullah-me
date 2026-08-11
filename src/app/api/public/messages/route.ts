import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMessageRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { resend, OWNER_EMAIL } from "@/lib/resend/client";
import { generateContactEmailHtml, generateContactEmailSubject } from "@/lib/resend/templates";
import type { MessageInput, ContactReason } from "@/types";

/**
 * POST /api/public/messages
 * Submits a contact form message.
 * Rate limited: 5 messages per IP per hour.
 * Sends email notification via Resend.
 * Public endpoint — no authentication required.
 *
 * v2.0 (§9): uses `reason` + optional `projectRef` instead of `serviceType` + `budget`.
 */

const VALID_REASONS: ContactReason[] = ["general", "bug-report", "academic", "collaboration"];

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
        const rateLimiter = getMessageRateLimiter();
        const { allowed, retryAfter } = await checkRateLimit(rateLimiter, ip);

        if (!allowed) {
            return NextResponse.json(
                { success: false, error: "Too many requests", retryAfter },
                { status: 429 }
            );
        }

        const body: MessageInput = await request.json();

        // Validate required fields
        if (
            !body.senderName?.trim() ||
            !body.senderEmail?.trim() ||
            !body.reason?.trim() ||
            !body.body?.trim()
        ) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate reason is a known value (§9.2)
        if (!VALID_REASONS.includes(body.reason as ContactReason)) {
            return NextResponse.json(
                { success: false, error: "Invalid reason value" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.senderEmail)) {
            return NextResponse.json(
                { success: false, error: "Invalid email" },
                { status: 400 }
            );
        }

        // Save message to database
        const message = await prisma.message.create({
            data: {
                senderName:  body.senderName.trim(),
                senderEmail: body.senderEmail.trim(),
                reason:      body.reason,
                projectRef:  body.projectRef?.trim() || null, // §9.3 — only for bug-report
                body:        body.body.trim(),
            },
        });

        // Send email notification via Resend
        let emailStatus: "sent" | "failed" = "sent";
        try {
            if (resend && OWNER_EMAIL) {
                await resend.emails.send({
                    from: "Portfolio <onboarding@resend.dev>",
                    to: OWNER_EMAIL,
                    replyTo: `${body.senderName} <${body.senderEmail}>`,
                    subject: generateContactEmailSubject(body),
                    html: generateContactEmailHtml(body),
                });
            }
        } catch (emailError) {
            console.error("[API] Resend email error:", emailError);
            emailStatus = "failed";

            await prisma.message.update({
                where: { id: message.id },
                data: { emailStatus: "failed" },
            });
        }

        return NextResponse.json(
            { success: true, data: { id: message.id, emailStatus } },
            { status: 201 }
        );
    } catch (error) {
        console.error("[API] POST /api/public/messages error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
