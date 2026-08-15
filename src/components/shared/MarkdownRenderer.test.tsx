import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MarkdownRenderer from "./MarkdownRenderer";

describe("MarkdownRenderer Component Test Suite", () => {
    it("should render plain markdown paragraph text", () => {
        render(<MarkdownRenderer content="Hello **World**" />);
        expect(screen.getByText("World")).toBeInTheDocument();
        expect(screen.getByText("World").tagName).toBe("STRONG");
    });

    it("should render markdown headings correctly", () => {
        render(<MarkdownRenderer content="# Heading 1" />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent("Heading 1");
    });

    it("should render unordered list items", () => {
        render(<MarkdownRenderer content={`- Item 1
- Item 2`} />);
        const listItems = screen.getAllByRole("listitem");
        expect(listItems).toHaveLength(2);
        expect(listItems[0]).toHaveTextContent("Item 1");
    });

    it("should render inline code blocks with custom styling", () => {
        render(<MarkdownRenderer content="Use `npm run dev` to start" />);
        const code = screen.getByText("npm run dev");
        expect(code).toBeInTheDocument();
        expect(code.tagName).toBe("CODE");
    });

    it("should handle null or empty content gracefully", () => {
        const { container } = render(<MarkdownRenderer content="" />);
        expect(container.firstChild).toBeNull();
    });
});
