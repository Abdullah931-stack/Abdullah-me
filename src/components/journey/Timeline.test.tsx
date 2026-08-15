import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Timeline from "./Timeline";
import {
  computeGap,
  daysBetween,
  getEffectiveDate,
  getRangeDurationDays,
  computeSharedWindowOffset,
  isProjectLinked,
  computeRangeBracketHeight,
  computeRailExtensions,
  BRACKET_MIN_HEIGHT,
  SPACING_BASE,
  SPACING_K,
  SPACING_TAU,
} from "./timelineMath";
import type { TimelineEntry } from "@/types";

// Mock next-intl hooks
vi.mock("next-intl", () => ({
  useLocale: () => "ar",
  useTranslations: () => (key: string) => (key === "age" ? "العمر" : key),
}));

// Mock IntersectionObserver for Framer Motion whileInView
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;

describe("Timeline Math & Algorithm Suite — §12 Specifications", () => {
  it("should compute base spacing floor when days difference is 0 (§12.4)", () => {
    const gap = computeGap(0);
    expect(gap).toBe(SPACING_BASE); // 40px
  });

  it("should compute logarithmic spacing correctly for short and multi-year gaps (§12.4)", () => {
    // At Δt = 30 days (τ): gap = 40 + 30 * ln(1 + 1) = 40 + 30 * ln(2) ≈ 60.79px
    const gap30Days = computeGap(30);
    expect(gap30Days).toBeCloseTo(SPACING_BASE + SPACING_K * Math.log(2), 2);

    // At Δt = 365 days (~1 year): gap = 40 + 30 * ln(1 + 365/30) ≈ 117.29px
    const gap1Year = computeGap(365);
    expect(gap1Year).toBeGreaterThan(gap30Days);

    // Multi-year gap (1000 days): compressed logarithmically, not growing linearly
    const gap1000Days = computeGap(1000);
    expect(gap1000Days).toBeLessThan(SPACING_BASE + SPACING_K * 1000);
  });

  it("should compute midpoint of date range for uncertain dates (§12.5)", () => {
    const start = "2024-01-01T00:00:00.000Z";
    const end = "2024-01-31T00:00:00.000Z";
    const entry: TimelineEntry = {
      id: "1",
      date: new Date(start),
      dateTo: new Date(end),
      age: 20,
      titleAr: "عنوان",
      titleEn: "Title",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };

    const effectiveDate = getEffectiveDate(entry);
    const expectedMidpoint = new Date("2024-01-16T00:00:00.000Z").getTime();
    expect(effectiveDate.getTime()).toBeCloseTo(expectedMidpoint, -4);
  });

  it("should calculate exact range duration in days (§12.5)", () => {
    const entrySingle: TimelineEntry = {
      id: "1",
      date: new Date("2024-01-01"),
      dateTo: null,
      age: 20,
      titleAr: "عنوان",
      titleEn: "Title",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };
    expect(getRangeDurationDays(entrySingle)).toBe(0);

    const entryRanged: TimelineEntry = {
      id: "2",
      date: new Date("2024-01-01"),
      dateTo: new Date("2024-01-11"),
      age: 20,
      titleAr: "عنوان",
      titleEn: "Title",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };
    expect(getRangeDurationDays(entryRanged)).toBeCloseTo(10, 1);
  });

  it("should calculate shared-window distribution for overlapping uncertain entries (§12.5)", () => {
    const width = 100;
    const count = 3;
    // position = interval_start + ((order_index + 1) / (count + 1)) * interval_width
    const offset0 = computeSharedWindowOffset(0, count, width);
    const offset1 = computeSharedWindowOffset(1, count, width);
    const offset2 = computeSharedWindowOffset(2, count, width);

    expect(offset0).toBe(25); // 1/4 * 100
    expect(offset1).toBe(50); // 2/4 * 100
    expect(offset2).toBe(75); // 3/4 * 100
  });

  it("should identify project-linked entries correctly (§12.7)", () => {
    const unlinked: TimelineEntry = {
      id: "1",
      date: new Date(),
      dateTo: null,
      projectSlug: null,
      age: 18,
      titleAr: "عنوان",
      titleEn: "Title",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };
    expect(isProjectLinked(unlinked)).toBe(false);

    const linked: TimelineEntry = {
      id: "2",
      date: new Date(),
      dateTo: null,
      projectSlug: "quantum-sim",
      age: 21,
      titleAr: "مشروع",
      titleEn: "Project",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };
    expect(isProjectLinked(linked)).toBe(true);
  });

  it("should compute dynamic logarithmic bracket height based on range duration (§12.5)", () => {
    // 0 days range => minimum base height (24px)
    expect(computeRangeBracketHeight(0)).toBe(BRACKET_MIN_HEIGHT);

    // 30 days range => 24 + 20 * ln(2) ≈ 38px
    const h30 = computeRangeBracketHeight(30);
    expect(h30).toBeGreaterThan(BRACKET_MIN_HEIGHT);
    expect(h30).toBe(38);

    // 365 days range => logarithmically larger
    const h365 = computeRangeBracketHeight(365);
    expect(h365).toBeGreaterThan(h30);
    expect(h365).toBeLessThanOrEqual(120);
  });

  it("should compute virtual rail epoch extensions for first and last ranged entries (§12.5)", () => {
    const singleDateEntry: TimelineEntry = {
      id: "1",
      date: new Date("2023-01-01"),
      dateTo: null,
      age: 20,
      titleAr: "عنوان",
      titleEn: "Title",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };
    const extSingle = computeRailExtensions([singleDateEntry]);
    expect(extSingle.topExtension).toBe(0);
    expect(extSingle.bottomExtension).toBe(0);

    const rangedEntry: TimelineEntry = {
      id: "2",
      date: new Date("2023-01-01"),
      dateTo: new Date("2023-06-01"),
      age: 20,
      titleAr: "عنوان",
      titleEn: "Title",
      storyAr: "قصة",
      storyEn: "Story",
      imageUrl: null,
      order: 0,
    };
    const extRanged = computeRailExtensions([rangedEntry]);
    expect(extRanged.topExtension).toBeGreaterThan(0);
    expect(extRanged.bottomExtension).toBeGreaterThan(0);
  });

  it("should render timeline component with single rail and entries", () => {
    const entries: TimelineEntry[] = [
      {
        id: "1",
        date: new Date("2023-01-01"),
        dateTo: new Date("2023-06-01"),
        projectSlug: "quantum-sim",
        age: 20,
        titleAr: "مشروع المحاكاة",
        titleEn: "Quantum Sim",
        storyAr: "تفاصيل الملاحظة المختبرية للمشروع",
        storyEn: "Lab notebook context for project",
        imageUrl: "/badge.png",
        order: 0,
      },
    ];

    render(<Timeline entries={entries} />);
    expect(screen.getByText("مشروع المحاكاة")).toBeInTheDocument();
  });

  it("should fetch project details from public API endpoint /api/public/projects/[slug]", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          id: "p1",
          slug: "quantum-sim",
          titleAr: "مشروع",
          titleEn: "Project",
          summaryAr: "ملخص",
          summaryEn: "Summary",
          bodyAr: "محتوى",
          bodyEn: "Body",
          skills: ["React"],
          order: 0,
          isPublished: true,
          isFeatured: true,
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    } as unknown as Response);

    const entries: TimelineEntry[] = [
      {
        id: "1",
        date: new Date("2023-01-01"),
        dateTo: null,
        projectSlug: "quantum-sim",
        age: 20,
        titleAr: "محطة",
        titleEn: "Milestone",
        storyAr: "",
        storyEn: "",
        imageUrl: null,
        order: 0,
      },
    ];

    render(<Timeline entries={entries} />);
    const btn = screen.getByText("fullProjectDetails");
    btn.click();

    expect(fetchSpy).toHaveBeenCalledWith("/api/public/projects/quantum-sim");
    fetchSpy.mockRestore();
  });
});
