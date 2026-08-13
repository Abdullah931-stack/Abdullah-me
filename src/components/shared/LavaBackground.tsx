"use client";

/**
 * LavaBackground — Ambient "Lava Lamp" Background System
 *
 * Implements §4 of UI/UX Spec v2.0:
 * - 11 blobs, viewport-relative sizing (§4.3, §4.5)
 * - Composed sine wave motion — deterministic, SSR-safe (§4.2)
 * - Separate rise + morph animations (§4.7, §4.8)
 * - Off-screen spawn derived from blob's own height (§4.7)
 * - Winding tilt path with drift overlay (§4.7)
 * - filter: blur(145px) on container (§4.3)
 * - inset: -20% -20% (§4.3)
 * - prefers-reduced-motion: hidden (§10.5)
 *
 * CRITICAL RULES (§4.8, §10.2):
 * - rise keyframes: translateX/translateY ONLY — never add scale/skew/rotate
 * - morph keyframes: border-radius ONLY — independently timed via --mdur
 * - Never stack two blur stages on the same layer (§4.4, §10.4)
 */

export const BLOB_COUNT = 11;

// §2.2 — Six fixed gradient pairs, cycled across blobs
export const BLOB_PAIRS: [string, string][] = [
  ["#86efac", "#22c55e"],
  ["#4ade80", "#16653b"],
  ["#a7f3c4", "#22c55e"],
  ["#22c55e", "#0f3d24"],
  ["#86efac", "#16653b"],
  ["#4ade80", "#22c55e"],
];

export interface BlobConfig {
  x: string;
  w: string;
  h: string;
  dur: string;
  mdur: string;
  delay: string;
  tilt: string;
  drift1: string;
  drift2: string;
  c1: string;
  c2: string;
  bottom: string;
}

/**
 * Generate deterministic per-blob parameters — index-derived, NOT Math.random (§4.2)
 * Reference implementation from §4.9
 */
export function generateBlobConfigs(): BlobConfig[] {
  const configs: BlobConfig[] = [];
  for (let i = 0; i < BLOB_COUNT; i++) {
    const wVw = 4 + (i % 5) * 1.45;
    const wPx = 30 + ((i * 11) % 41);
    const mult = 2.4 + (i % 3) * 0.25;
    const pair = BLOB_PAIRS[i % BLOB_PAIRS.length];
    const w = `calc(${wVw}vw + ${wPx}px)`;
    const h = `calc(${wVw * mult}vw + ${wPx * mult}px)`;

    configs.push({
      x: `${8 + ((i * 13) % 72)}%`,
      w,
      h,
      dur: `${22 + ((i * 17) % 47)}s`,
      mdur: `${8 + ((i * 7) % 11)}s`,
      delay: `${-(i * 3.4)}s`,
      tilt: `${(i % 2 === 0 ? 1 : -1) * (40 + ((i * 17) % 91))}px`,
      drift1: `${(i % 2 === 0 ? 1 : -1) * (35 + i * 5)}px`,
      drift2: `${(i % 2 === 0 ? -1 : 1) * (28 + i * 4)}px`,
      c1: pair[0],
      c2: pair[1],
      bottom: `calc(-1 * ${h} - 20vh)`,
    });
  }
  return configs;
}

// Pre-compute configs at module level — deterministic, SSR-safe
const BLOB_CONFIGS = generateBlobConfigs();

export default function LavaBackground() {
  return (
    <div className="blob-field" aria-hidden="true">
      {BLOB_CONFIGS.map((blob, i) => (
        <div
          key={i}
          className="blob"
          style={
            {
              "--x": blob.x,
              "--w": blob.w,
              "--h": blob.h,
              "--dur": blob.dur,
              "--mdur": blob.mdur,
              "--delay": blob.delay,
              "--tilt": blob.tilt,
              "--drift1": blob.drift1,
              "--drift2": blob.drift2,
              "--c1": blob.c1,
              "--c2": blob.c2,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
