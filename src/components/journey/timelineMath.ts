/**
 * Timeline Spacing & Uncertainty Math Library
 *
 * Implements §12 of UI/UX Spec:
 * - Logarithmic spacing formula: gap(Δt) = base + k · ln(1 + Δt_days / τ) (§12.4)
 * - Midpoint effective position calculation for ranged/uncertain dates (§12.5)
 * - Shared-window multi-entry distribution formula (§12.5)
 * - Content-duplication rule helpers (§12.7)
 */

import type { TimelineEntry } from "@/types";

export const SPACING_BASE = 40; // Minimum readable spacing floor (px)
export const SPACING_K = 30; // Scale factor
export const SPACING_TAU = 30; // Calibration constant (days)

/**
 * Computes logarithmic spacing gap between adjacent timeline entries (§12.4).
 * gap(Δt) = base + k · ln(1 + Δt_days / τ)
 */
export function computeGap(daysDiff: number): number {
  if (daysDiff < 0) return SPACING_BASE;
  return SPACING_BASE + SPACING_K * Math.log(1 + daysDiff / SPACING_TAU);
}

/**
 * Calculates absolute difference in days between two dates.
 */
export function daysBetween(d1: Date | string, d2: Date | string): number {
  const t1 = new Date(d1).getTime();
  const t2 = new Date(d2).getTime();
  if (isNaN(t1) || isNaN(t2)) return 0;
  return Math.abs((t2 - t1) / (1000 * 60 * 60 * 24));
}

/**
 * Computes effective date for spacing algorithm (§12.5).
 * For uncertain/ranged entries (with dateTo), position defaults to midpoint of range.
 */
export function getEffectiveDate(entry: TimelineEntry): Date {
  const start = new Date(entry.date).getTime();
  if (entry.dateTo) {
    const end = new Date(entry.dateTo).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      return new Date((start + end) / 2);
    }
  }
  return new Date(start);
}

/**
 * Computes the duration in days for a ranged date entry (§12.5).
 */
export function getRangeDurationDays(entry: TimelineEntry): number {
  if (!entry.dateTo) return 0;
  return daysBetween(entry.date, entry.dateTo);
}

/**
 * Computes spatial distribution offset for overlapping entries sharing an approximate window (§12.5).
 * position = interval_start + (order_index / (count + 1)) * interval_width
 */
export function computeSharedWindowOffset(
  orderIndex: number,
  count: number,
  intervalWidth: number
): number {
  if (count <= 0) return 0;
  return ((orderIndex + 1) / (count + 1)) * intervalWidth;
}

/**
 * Helper to check if a timeline entry links to a portfolio project (§12.7).
 */
export function isProjectLinked(entry: TimelineEntry): boolean {
  return !!(entry.projectSlug && entry.projectSlug.trim().length > 0);
}

export const BRACKET_MIN_HEIGHT = 24; // Base minimum height for uncertainty bracket (px)
export const BRACKET_K = 20; // Scale factor for bracket height

/**
 * Computes dynamic logarithmic height for uncertainty curly bracket (§12.5).
 * bracketHeight = minHeight + k · ln(1 + rangeDays / τ)
 */
export function computeRangeBracketHeight(rangeDays: number): number {
  if (rangeDays <= 0) return BRACKET_MIN_HEIGHT;
  const height = BRACKET_MIN_HEIGHT + BRACKET_K * Math.log(1 + rangeDays / SPACING_TAU);
  return Math.min(120, Math.max(BRACKET_MIN_HEIGHT, Math.round(height)));
}

export interface RailExtensions {
  topExtension: number;
  bottomExtension: number;
}

/**
 * Computes virtual rail launching extensions for the timeline ray (§12.5).
 * Extends the top of the rail ray to the start date of the first entry's uncertainty range,
 * and the bottom of the rail ray to the end date of the last entry's uncertainty range,
 * without affecting card positions or spacing midpoints.
 */
export function computeRailExtensions(entries: TimelineEntry[]): RailExtensions {
  if (entries.length === 0) {
    return { topExtension: 0, bottomExtension: 0 };
  }

  let topExtension = 0;
  let bottomExtension = 0;

  // First entry (earliest / topmost)
  const firstEntry = entries[0];
  if (firstEntry.dateTo) {
    const effectiveDate = getEffectiveDate(firstEntry);
    const startDays = daysBetween(firstEntry.date, effectiveDate);
    topExtension = Math.max(20, Math.round(computeGap(startDays) / 2));
  }

  // Last entry (latest / bottommost)
  const lastEntry = entries[entries.length - 1];
  if (lastEntry.dateTo) {
    const effectiveDate = getEffectiveDate(lastEntry);
    const endDays = daysBetween(effectiveDate, lastEntry.dateTo);
    bottomExtension = Math.max(20, Math.round(computeGap(endDays) / 2));
  }

  return { topExtension, bottomExtension };
}
