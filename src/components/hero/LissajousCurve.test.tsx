import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LissajousCurve from "./LissajousCurve";
import {
  computeLissajousPoint,
  computeKeplerSpeed,
  generateTrailPoints,
  isTabletOrDesktop,
  CURVES,
  BASE_A,
  BASE_B,
  TABLET_BREAKPOINT,
  Point2D,
} from "./lissajousMath";

describe("LissajousCurve — §5.2 Specification & Algorithm Tests", () => {
  it("should have exactly 3 layered curves for orchestration metaphor (§5.2 P0)", () => {
    expect(CURVES).toHaveLength(3);
    expect(CURVES[0].phaseOffset).toBe(0);
    expect(CURVES[1].phaseOffset).toBe(0.6);
    expect(CURVES[2].phaseOffset).toBe(-0.6);
  });

  it("should use correct colors for central bright curve and flanking curves (§5.2, §2.1)", () => {
    expect(CURVES[0].color).toBe("#a7f3c4"); // --accent-bright
    expect(CURVES[1].color).toBe("#4ade80"); // --accent
    expect(CURVES[2].color).toBe("#4ade80"); // --accent
  });

  it("should compute parametric Lissajous coordinates accurately", () => {
    const drawW = 400;
    const drawH = 400;
    const centerX = 200;
    const centerY = 200;

    // At t=0, x = sin(a*0 + 0)*(200) + 200 = 200, y = sin(b*0)*(200) + 200 = 200
    const ptCenter = computeLissajousPoint(
      0,
      BASE_A,
      BASE_B,
      0,
      drawW,
      drawH,
      centerX,
      centerY
    );
    expect(ptCenter.x).toBeCloseTo(200);
    expect(ptCenter.y).toBeCloseTo(200);
    expect(ptCenter.r).toBeCloseTo(0);

    // At t = PI / (2*a) and phaseOffset = 0, sin(a*t) = sin(PI/2) = 1 => x = 400
    const ptMaxX = computeLissajousPoint(
      Math.PI / (2 * BASE_A),
      BASE_A,
      BASE_B,
      0,
      drawW,
      drawH,
      centerX,
      centerY
    );
    expect(ptMaxX.x).toBeCloseTo(400);
  });

  it("should exhibit Keplerian orbital speed variation: faster near center, slower at periphery (§5.2.1)", () => {
    const baseSpeed = 0.05;
    const k = 0.5; // Speed drop coefficient
    const maxRadius = 200;

    const speedAtCenter = computeKeplerSpeed(baseSpeed, k, 0, maxRadius);
    const speedAtMid = computeKeplerSpeed(baseSpeed, k, 100, maxRadius);
    const speedAtPeriphery = computeKeplerSpeed(baseSpeed, k, 200, maxRadius);

    // Speed at center (r=0) must equal baseSpeed
    expect(speedAtCenter).toBe(baseSpeed);

    // Speed must decrease monotonically as r increases
    expect(speedAtCenter).toBeGreaterThan(speedAtMid);
    expect(speedAtMid).toBeGreaterThan(speedAtPeriphery);

    // Speed at periphery (r=maxRadius) must equal baseSpeed * (1 - k)
    expect(speedAtPeriphery).toBeCloseTo(baseSpeed * (1 - k));
  });

  it("should generate a fading phosphor trail with alpha 1.0 at head fading to 0 at tail (§5.2.1)", () => {
    const history: Point2D[] = [
      { x: 100, y: 100, speed: 0.05 },
      { x: 95, y: 95, speed: 0.04 },
      { x: 90, y: 90, speed: 0.03 },
      { x: 85, y: 85, speed: 0.02 },
      { x: 80, y: 80, speed: 0.01 },
    ];

    const trail = generateTrailPoints(history);
    expect(trail).toHaveLength(5);

    // Head (index 0) must be fully opaque (alpha = 1.0)
    expect(trail[0].alpha).toBe(1.0);

    // Tail (last index) must be fully transparent (alpha = 0.0)
    expect(trail[4].alpha).toBe(0.0);

    // Monotonically decreasing opacity from head to tail
    for (let i = 0; i < trail.length - 1; i++) {
      expect(trail[i].alpha).toBeGreaterThan(trail[i + 1].alpha);
    }
  });

  it("should correctly identify tablet/desktop breakpoint >= 768px (§5.2.3)", () => {
    expect(isTabletOrDesktop(375)).toBe(false);
    expect(isTabletOrDesktop(640)).toBe(false);
    expect(isTabletOrDesktop(767)).toBe(false);
    expect(isTabletOrDesktop(768)).toBe(true);
    expect(isTabletOrDesktop(1024)).toBe(true);
    expect(isTabletOrDesktop(1440)).toBe(true);
  });

  it("should render canvas element correctly", () => {
    // Mock HTMLCanvasElement context
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      scale: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
    });

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
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

    const { container } = render(<LissajousCurve />);
    const canvas = container.querySelector("canvas.lissajous-canvas");
    expect(canvas).not.toBeNull();
  });
});
