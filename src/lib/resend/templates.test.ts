import { describe, it, expect } from "vitest";
import {
    generateContactEmailHtml,
    generateContactEmailSubject,
} from "@/lib/resend/templates";
import type { MessageInput } from "@/types";

// ─────────────────────────────────────────────
// Email template tests — updated for §9 (reason replaces serviceType/budget)
// ─────────────────────────────────────────────

describe("generateContactEmailHtml", () => {
    const arabicMessage: MessageInput = {
        senderName:  "أحمد",
        senderEmail: "ahmed@example.com",
        reason:      "academic",
        body:        "أريد الاستفسار عن بحث مشترك",
        locale:      "ar",
    };

    const englishMessage: MessageInput = {
        senderName:  "John",
        senderEmail: "john@example.com",
        reason:      "general",
        body:        "I have a general question about your work",
        locale:      "en",
    };

    const bugReportMessage: MessageInput = {
        senderName:  "Sara",
        senderEmail: "sara@example.com",
        reason:      "bug-report",
        projectRef:  "Portfolio Website",
        body:        "The contact form is broken",
        locale:      "en",
    };

    it("should generate valid HTML email content", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain("<!DOCTYPE html>");
        expect(html).toContain("</html>");
    });

    it("should include sender name, email, and body", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain(arabicMessage.senderName);
        expect(html).toContain(arabicMessage.senderEmail);
        expect(html).toContain(arabicMessage.body);
    });

    it("should include human-readable reason label (Arabic)", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain("استفسار أكاديمي");
    });

    it("should include human-readable reason label (English)", () => {
        const html = generateContactEmailHtml(englishMessage);
        expect(html).toContain("General Inquiry");
    });

    it("should include projectRef when reason = bug-report", () => {
        const html = generateContactEmailHtml(bugReportMessage);
        expect(html).toContain("Portfolio Website");
        expect(html).toContain("Project Issue Report");
    });

    it("should set RTL direction for Arabic locale", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain('dir="rtl"');
        expect(html).toContain('lang="ar"');
    });

    it("should set LTR direction for English locale", () => {
        const html = generateContactEmailHtml(englishMessage);
        expect(html).toContain('dir="ltr"');
        expect(html).toContain('lang="en"');
    });

    it("should use Arabic field labels for Arabic locale", () => {
        const html = generateContactEmailHtml(arabicMessage);
        expect(html).toContain("الاسم");
        expect(html).toContain("البريد الإلكتروني");
        expect(html).toContain("سبب التواصل");
    });

    it("should use English field labels for English locale", () => {
        const html = generateContactEmailHtml(englishMessage);
        expect(html).toContain("Name");
        expect(html).toContain("Email");
        expect(html).toContain("Reason");
    });
});

describe("generateContactEmailSubject", () => {
    it("should include reason label and sender name — neutral framing (§9.1)", () => {
        const message: MessageInput = {
            senderName:  "Ahmed",
            senderEmail: "ahmed@test.com",
            reason:      "collaboration",
            body:        "I'd like to collaborate",
            locale:      "en",
        };

        const subject = generateContactEmailSubject(message);
        expect(subject).toContain("Collaboration or Hiring Opportunity");
        expect(subject).toContain("Ahmed");
        // Ensure old freelance framing is gone
        expect(subject).not.toContain("🚀");
        expect(subject).not.toContain("Project Request");
    });
});
