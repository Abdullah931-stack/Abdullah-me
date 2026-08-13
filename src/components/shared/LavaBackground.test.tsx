import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LavaBackground, {
  BLOB_COUNT,
  BLOB_PAIRS,
  generateBlobConfigs,
} from "./LavaBackground";

describe("LavaBackground — §4 Specification & Algorithm Tests", () => {
  it("should have exactly 11 blobs as specified in §4.3", () => {
    expect(BLOB_COUNT).toBe(11);
    const configs = generateBlobConfigs();
    expect(configs).toHaveLength(11);
  });

  it("should use the 6 fixed gradient color pairs from §2.2", () => {
    expect(BLOB_PAIRS).toEqual([
      ["#86efac", "#22c55e"],
      ["#4ade80", "#16653b"],
      ["#a7f3c4", "#22c55e"],
      ["#22c55e", "#0f3d24"],
      ["#86efac", "#16653b"],
      ["#4ade80", "#22c55e"],
    ]);
  });

  it("should be SSR-safe and deterministic with zero Math.random dependency (§4.2)", () => {
    const run1 = generateBlobConfigs();
    const run2 = generateBlobConfigs();
    expect(run1).toEqual(run2);
  });

  it("should conform to viewport-relative width parameters calc(Xvw + Ypx) (§4.3, §4.5)", () => {
    const configs = generateBlobConfigs();
    configs.forEach((blob) => {
      // Format: calc(Xvw + Ypx)
      const match = blob.w.match(/^calc\(([0-9.]+)vw \+ ([0-9.]+)px\)$/);
      expect(match).not.toBeNull();
      if (match) {
        const xVw = parseFloat(match[1]);
        const yPx = parseFloat(match[2]);

        // Spec §4.3: X ≈ 4–9.8, Y ≈ 30–70
        expect(xVw).toBeGreaterThanOrEqual(4.0);
        expect(xVw).toBeLessThanOrEqual(9.8);
        expect(yPx).toBeGreaterThanOrEqual(30);
        expect(yPx).toBeLessThanOrEqual(70);
      }
    });
  });

  it("should conform to height elongation multiplier width * (2.4–2.9) (§4.3)", () => {
    const configs = generateBlobConfigs();
    configs.forEach((blob) => {
      const wMatch = blob.w.match(/^calc\(([0-9.]+)vw \+ ([0-9.]+)px\)$/);
      const hMatch = blob.h.match(/^calc\(([0-9.]+)vw \+ ([0-9.]+)px\)$/);
      expect(wMatch).not.toBeNull();
      expect(hMatch).not.toBeNull();

      if (wMatch && hMatch) {
        const wVw = parseFloat(wMatch[1]);
        const hVw = parseFloat(hMatch[1]);
        const mult = hVw / wVw;

        // Spec §4.3: height multiplier is strictly within 2.4 to 2.9
        expect(mult).toBeGreaterThanOrEqual(2.4);
        expect(mult).toBeLessThanOrEqual(2.9);
      }
    });
  });

  it("should conform to rise duration range ~20–70s (§4.7)", () => {
    const configs = generateBlobConfigs();
    configs.forEach((blob) => {
      const durSeconds = parseFloat(blob.dur);
      expect(durSeconds).toBeGreaterThanOrEqual(20);
      expect(durSeconds).toBeLessThanOrEqual(70);
    });
  });

  it("should conform to shape breathing morph duration range 8–18s (§4.3)", () => {
    const configs = generateBlobConfigs();
    configs.forEach((blob) => {
      const mdurSeconds = parseFloat(blob.mdur);
      expect(mdurSeconds).toBeGreaterThanOrEqual(8);
      expect(mdurSeconds).toBeLessThanOrEqual(18);
    });
  });

  it("should derive off-screen spawn offset from blob's own height (§4.7)", () => {
    const configs = generateBlobConfigs();
    configs.forEach((blob) => {
      // Must be calc(-1 * <height> - 20vh)
      expect(blob.bottom).toBe(`calc(-1 * ${blob.h} - 20vh)`);
    });
  });

  it("should alternate winding path tilt signs with magnitude in range [40, 130]px (§4.7)", () => {
    const configs = generateBlobConfigs();
    configs.forEach((blob, idx) => {
      const tiltVal = parseFloat(blob.tilt);
      const absTilt = Math.abs(tiltVal);

      // Magnitude check
      expect(absTilt).toBeGreaterThanOrEqual(40);
      expect(absTilt).toBeLessThanOrEqual(130);

      // Sign alternating check
      if (idx % 2 === 0) {
        expect(tiltVal).toBeGreaterThan(0);
      } else {
        expect(tiltVal).toBeLessThan(0);
      }
    });
  });

  it("should render container with 11 blobs and correct CSS classes (§4.3)", () => {
    const { container } = render(<LavaBackground />);
    const field = container.querySelector(".blob-field");
    expect(field).not.toBeNull();

    const blobs = container.querySelectorAll(".blob");
    expect(blobs).toHaveLength(11);
  });
});
