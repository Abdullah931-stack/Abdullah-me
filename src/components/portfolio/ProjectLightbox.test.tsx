import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectLightbox from "@/components/portfolio/ProjectLightbox";

// Mock next-intl hooks
vi.mock("next-intl", () => ({
    useLocale: () => "ar",
    useTranslations: () => (key: string) => key,
}));

// Mock PulseBorder component
vi.mock("@/components/shared/PulseBorder", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="pulse-border">{children}</div>,
}));

describe("ProjectLightbox Component Test Suite (§8.2)", () => {
    const mockImages = [
        { id: "1", url: "https://example.com/img1.jpg", altAr: "صورة 1", altEn: "Image 1", order: 0, isCover: true },
        { id: "2", url: "https://example.com/img2.jpg", altAr: "صورة 2", altEn: "Image 2", order: 1, isCover: false },
        { id: "3", url: "https://example.com/img3.jpg", altAr: "صورة 3", altEn: "Image 3", order: 2, isCover: false },
    ];

    it("should render thumbnail grid with correct image sources", () => {
        render(<ProjectLightbox images={mockImages} projectTitle="Test Project" />);
        
        const thumbnails = screen.getAllByRole("img");
        expect(thumbnails.length).toBeGreaterThanOrEqual(3);
        expect(thumbnails[0]).toHaveAttribute("src", "https://example.com/img1.jpg");
    });

    it("should open Lightbox modal with dark green scrim when thumbnail is clicked", () => {
        render(<ProjectLightbox images={mockImages} projectTitle="Test Project" />);

        const thumbnails = screen.getAllByRole("img");
        fireEvent.click(thumbnails[0]); // Click showcase image

        const modalOverlay = screen.getByTestId("lightbox-scrim");
        expect(modalOverlay).toBeInTheDocument();
        expect(modalOverlay).toHaveStyle({ background: "rgba(5, 15, 10, 0.92)" });
    });

    it("should render PulseBorder wrapper around navigation arrows in Lightbox", () => {
        render(<ProjectLightbox images={mockImages} projectTitle="Test Project" />);

        const thumbnails = screen.getAllByRole("img");
        fireEvent.click(thumbnails[0]);

        const pulseBorders = screen.getAllByTestId("pulse-border");
        expect(pulseBorders.length).toBeGreaterThanOrEqual(2);
    });

    it("should render connected node indicators matching the number of images", () => {
        render(<ProjectLightbox images={mockImages} projectTitle="Test Project" />);

        const thumbnails = screen.getAllByRole("img");
        fireEvent.click(thumbnails[0]);

        const nodeIndicators = screen.getAllByTestId(/node-indicator-/);
        expect(nodeIndicators).toHaveLength(3);
    });

    it("should apply active pulse animation/styles to active node indicator", () => {
        render(<ProjectLightbox images={mockImages} projectTitle="Test Project" />);

        const thumbnails = screen.getAllByRole("img");
        fireEvent.click(thumbnails[0]); // Active index = 0

        const activeNode = screen.getByTestId("node-indicator-0");
        expect(activeNode).toHaveAttribute("data-active", "true");
    });

    it("should support keyboard shortcuts (Escape to close, ArrowLeft/ArrowRight to navigate)", async () => {
        render(<ProjectLightbox images={mockImages} projectTitle="Test Project" />);

        const thumbnails = screen.getAllByRole("img");
        fireEvent.click(thumbnails[0]); // Open at index 0

        expect(screen.getByTestId("lightbox-scrim")).toBeInTheDocument();

        // In RTL mode, ArrowLeft navigates next (index 0 -> index 1)
        fireEvent.keyDown(window, { key: "ArrowLeft" });
        const activeNode1 = screen.getByTestId("node-indicator-1");
        expect(activeNode1).toHaveAttribute("data-active", "true");

        // Press Escape -> Close lightbox
        fireEvent.keyDown(window, { key: "Escape" });
        await waitFor(() => {
            expect(screen.queryByTestId("lightbox-scrim")).not.toBeInTheDocument();
        });
    });
});

