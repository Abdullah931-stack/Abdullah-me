import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ContactForm from "./ContactForm";

// Mock next-intl hooks
vi.mock("next-intl", () => ({
    useLocale: () => "ar",
    useTranslations: (namespace: string) => (key: string) => {
        const translations: Record<string, string> = {
            "title": "تواصل معي",
            "subtitle": "أسعد بقراءة رسالتك",
            "name": "الاسم",
            "email": "البريد الإلكتروني",
            "reason": "سبب التواصل",
            "message": "الرسالة",
            "submit": "إرسال",
            "clearForm": "تفريغ النموذج",
            "reasons.general": "استفسار عام",
            "reasons.bug-report": "الإبلاغ عن مشكلة في مشروع",
        };
        return translations[key] || key;
    },
}));

// Mock i18n routing
vi.mock("@/i18n/routing", () => ({
    Link: ({ children, href, locale, ...props }: any) => (
        <a href={href} data-locale={locale} {...props}>
            {children}
        </a>
    ),
    usePathname: () => "/contact",
}));

// Mock IntersectionObserver for Framer Motion animations
global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
} as unknown as typeof IntersectionObserver;

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe("ContactForm Draft & Expiration Test Suite", () => {
    const DRAFT_KEY = "contact_form_draft";

    beforeEach(() => {
        sessionStorage.clear();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it("should restore active draft inputs if created within 10 minutes", async () => {
        const activeDraft = {
            timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago (valid)
            data: {
                senderName: "عبد الله",
                senderEmail: "test@example.com",
                reason: "general",
                projectRef: "",
                projectOther: "",
                body: "رسالة تجريبية للاختبار",
            },
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(activeDraft));

        render(<ContactForm />);

        const nameInput = (await screen.findByPlaceholderText("الاسم")) as HTMLInputElement;
        const emailInput = screen.getByPlaceholderText("البريد الإلكتروني") as HTMLInputElement;
        const messageInput = screen.getByPlaceholderText("الرسالة") as HTMLTextAreaElement;

        expect(nameInput.value).toBe("عبد الله");
        expect(emailInput.value).toBe("test@example.com");
        expect(messageInput.value).toBe("رسالة تجريبية للاختبار");
    });

    it("should discard draft and render empty inputs if draft is older than 10 minutes", async () => {
        const expiredDraft = {
            timestamp: Date.now() - 11 * 60 * 1000, // 11 minutes ago (expired)
            data: {
                senderName: "اسم قديم",
                senderEmail: "expired@example.com",
                reason: "general",
                projectRef: "",
                projectOther: "",
                body: "رسالة منتهية الصلاحية",
            },
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(expiredDraft));

        render(<ContactForm />);

        const nameInput = (await screen.findByPlaceholderText("الاسم")) as HTMLInputElement;
        const emailInput = screen.getByPlaceholderText("البريد الإلكتروني") as HTMLInputElement;
        const messageInput = screen.getByPlaceholderText("الرسالة") as HTMLTextAreaElement;

        // Expired draft text must not be restored
        expect(nameInput.value).toBe("");
        expect(emailInput.value).toBe("");
        expect(messageInput.value).toBe("");
    });

    it("should auto-save form data and update timestamp in sessionStorage when user types", async () => {
        render(<ContactForm />);

        const nameInput = await screen.findByPlaceholderText("الاسم");
        fireEvent.change(nameInput, { target: { value: "زائر جديد" } });

        await waitFor(() => {
            const stored = sessionStorage.getItem(DRAFT_KEY);
            expect(stored).not.toBeNull();
            if (stored) {
                const parsed = JSON.parse(stored);
                expect(parsed.data.senderName).toBe("زائر جديد");
                expect(typeof parsed.timestamp).toBe("number");
            }
        });
    });

    it("should clear form when clearForm button is clicked", async () => {
        const activeDraft = {
            timestamp: Date.now(),
            data: {
                senderName: "أحمد",
                senderEmail: "ahmed@example.com",
                reason: "general",
                projectRef: "",
                projectOther: "",
                body: "رسالة سيتم مسحها",
            },
        };
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(activeDraft));

        render(<ContactForm />);

        // The clear form button displays t('clearForm') = "تفريغ النموذج"
        const clearButton = await screen.findByText("تفريغ النموذج");
        expect(clearButton).toBeInTheDocument();

        fireEvent.click(clearButton);

        const nameInput = screen.getByPlaceholderText("الاسم") as HTMLInputElement;
        const messageInput = screen.getByPlaceholderText("الرسالة") as HTMLTextAreaElement;

        expect(nameInput.value).toBe("");
        expect(messageInput.value).toBe("");
    });
});
