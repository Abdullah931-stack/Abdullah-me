import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectImagesManager from "@/components/admin/ProjectImagesManager";
import SkillsManager from "@/components/admin/SkillsManager";

describe("Admin Projects CMS Components Test Suite", () => {
    describe("ProjectImagesManager Component", () => {
        const mockImages = [
            { id: "img-1", url: "https://example.com/cover.jpg", altAr: "غلاف", altEn: "Cover", order: 0, isCover: true },
            { id: "img-2", url: "https://example.com/gallery.jpg", altAr: "معرض", altEn: "Gallery", order: 1, isCover: false },
        ];

        it("should render image items with custom order numbers", () => {
            const onChange = vi.fn();
            render(<ProjectImagesManager images={mockImages} onChange={onChange} />);

            const imageElements = screen.getAllByTestId(/project-image-item-/);
            expect(imageElements).toHaveLength(2);
        });

        it("should enforce single cover selection when cover button is toggled", () => {
            const onChange = vi.fn();
            render(<ProjectImagesManager images={mockImages} onChange={onChange} />);

            const coverButtons = screen.getAllByTestId(/set-cover-btn-/);
            fireEvent.click(coverButtons[1]); // Set second image as cover

            expect(onChange).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ url: "https://example.com/cover.jpg", isCover: false }),
                    expect.objectContaining({ url: "https://example.com/gallery.jpg", isCover: true }),
                ])
            );
        });

        it("should allow changing priority order of images", () => {
            const onChange = vi.fn();
            render(<ProjectImagesManager images={mockImages} onChange={onChange} />);

            const orderInput = screen.getByTestId("order-input-1"); // Order input for second image
            fireEvent.change(orderInput, { target: { value: "0" } });

            expect(onChange).toHaveBeenCalled();
        });
    });

    describe("SkillsManager Component", () => {
        it("should allow adding multiple skills dynamically with clear input readiness", () => {
            const onChange = vi.fn();
            render(<SkillsManager skills={["React"]} onChange={onChange} />);

            const skillInput = screen.getByPlaceholderText(/اسم المهارة|Skill name/i);
            const addButton = screen.getByTestId("add-skill-btn");

            fireEvent.change(skillInput, { target: { value: "Next.js" } });
            fireEvent.click(addButton);

            expect(onChange).toHaveBeenCalledWith(["React", "Next.js"]);
        });

        it("should allow removing a skill from the tag list", () => {
            const onChange = vi.fn();
            render(<SkillsManager skills={["React", "TypeScript"]} onChange={onChange} />);

            const removeBtn = screen.getByTestId("remove-skill-React");
            fireEvent.click(removeBtn);

            expect(onChange).toHaveBeenCalledWith(["TypeScript"]);
        });
    });
});
