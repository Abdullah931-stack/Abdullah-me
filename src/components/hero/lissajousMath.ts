/**
 * Lissajous Curve Mathematical Logic & Keplerian Orbit Utilities
 *
 * Implements §5.2 of UI/UX Spec v2.0:
 * - Parametric equations: x = sin(a·t + δ), y = sin(b·t)
 * - P0 treatment: Three layered curves at phase offsets (0, 0.6, -0.6)
 * - Keplerian orbital speed: speed = baseSpeed * (1 - k * (r / maxRadius))
 * - Phosphor persistence trail sampling & opacity calculation
 * - Responsive breakpoint check (md >= 768px)
 */

export interface CurveConfig {
  phaseOffset: number;
  color: string; // Tail/base color (--accent or --accent-bright)
  headColor: string; // Head glowing point color
  opacity: number;
  pointRadius: number;
}

export interface Point2D {
  x: number;
  y: number;
  speed: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

/**
 * Three layered curves for orchestration metaphor (§5.2 P0)
 */
export const CURVES: CurveConfig[] = [
  {
    phaseOffset: 0,
    color: "#a7f3c4", // --accent-bright
    headColor: "#ffffff",
    opacity: 1.0,
    pointRadius: 4,
  },
  {
    phaseOffset: 0.6,
    color: "#4ade80", // --accent
    headColor: "#a7f3c4",
    opacity: 0.7,
    pointRadius: 3,
  },
  {
    phaseOffset: -0.6,
    color: "#4ade80", // --accent
    headColor: "#a7f3c4",
    opacity: 0.7,
    pointRadius: 3,
  },
];

export const BASE_A = 3;
export const BASE_B = 2;
export const TABLET_BREAKPOINT = 768;

/**
 * Computes a single point on a Lissajous curve track.
 */
export function computeLissajousPoint(
  t: number,
  a: number,
  b: number,
  phaseOffset: number,
  drawW: number,
  drawH: number,
  centerX: number,
  centerY: number
): { x: number; y: number; r: number } {
  const xRel = Math.sin(a * t + phaseOffset) * (drawW / 2);
  const yRel = Math.sin(b * t) * (drawH / 2);
  const x = xRel + centerX;
  const y = yRel + centerY;
  const r = Math.sqrt(xRel * xRel + yRel * yRel);

  return { x, y, r };
}

/**
 * Computes Keplerian orbital speed based on distance r from center.
 * speed = baseSpeed * (1 - k * (r / maxRadius))
 * Faster near center (periapsis), slower near periphery (apoapsis).
 */
export function computeKeplerSpeed(
  baseSpeed: number,
  k: number,
  r: number,
  maxRadius: number
): number {
  if (maxRadius <= 0) return baseSpeed;
  const normalizedR = Math.min(1, Math.max(0, r / maxRadius));
  return baseSpeed * (1 - k * normalizedR);
}

/**
 * Computes fading trail points from a history of positions.
 * Head of trail is at index 0 (alpha = 1.0), fading down to 0 at the tail.
 */
export function generateTrailPoints(history: Point2D[]): TrailPoint[] {
  const count = history.length;
  if (count === 0) return [];

  return history.map((pt, idx) => {
    // Linear decay from 1.0 at head (idx=0) to 0 at tail (idx=count-1)
    const alpha = count > 1 ? 1 - idx / (count - 1) : 1;
    return {
      x: pt.x,
      y: pt.y,
      alpha,
    };
  });
}

/**
 * Utility check for tablet/desktop viewport (>= 768px).
 */
export function isTabletOrDesktop(width: number): boolean {
  return width >= TABLET_BREAKPOINT;
}
