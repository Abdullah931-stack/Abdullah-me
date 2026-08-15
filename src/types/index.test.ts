import { describe, it, expect } from "vitest";
import type {
    Locale,
    ContactReason,
    EmailStatus,
    MessageInput,
    ApiResponse,
} from "@/types";

// ─────────────────────────────────────────────
// TDD: Type safety and contract verification tests
// ─────────────────────────────────────────────

describe("Type Definitions", () => {
    describe("Locale", () => {
        it("should accept valid locale values", () => {
            const ar: Locale = "ar";
            const en: Locale = "en";
            expect(ar).toBe("ar");
            expect(en).toBe("en");
        });
    });

    describe("ContactReason", () => {
        it("should accept all four contact reason values", () => {
            const reasons: ContactReason[] = ["general", "bug-report", "academic", "collaboration"];
            expect(reasons).toHaveLength(4);
        });
    });

    describe("EmailStatus", () => {
        it("should accept valid email status values", () => {
            const statuses: EmailStatus[] = ["pending", "sent", "failed"];
            expect(statuses).toHaveLength(3);
        });
    });


    describe("MessageInput", () => {
        it("should create a valid message input object", () => {
            const message: MessageInput = {
                senderName:  "Test User",
                senderEmail: "test@example.com",
                reason:      "general",
                body:        "Test message body",
                locale:      "ar",
            };

            expect(message.senderName).toBe("Test User");
            expect(message.reason).toBe("general");
            expect(message.locale).toBe("ar");
        });

        it("should allow projectRef for bug-report reason", () => {
            const message: MessageInput = {
                senderName:  "Test User",
                senderEmail: "test@example.com",
                reason:      "bug-report",
                projectRef:  "Portfolio Website",
                body:        "Button is broken",
                locale:      "en",
            };

            expect(message.reason).toBe("bug-report");
            expect(message.projectRef).toBe("Portfolio Website");
        });
    });

    describe("ApiResponse", () => {
        it("should create a success response", () => {
            const response: ApiResponse<{ id: string }> = {
                success: true,
                data: { id: "test-id" },
            };

            expect(response.success).toBe(true);
            expect(response.data?.id).toBe("test-id");
        });

        it("should create an error response", () => {
            const response: ApiResponse = {
                success: false,
                error: "Something went wrong",
            };

            expect(response.success).toBe(false);
            expect(response.error).toBe("Something went wrong");
        });
    });
});
