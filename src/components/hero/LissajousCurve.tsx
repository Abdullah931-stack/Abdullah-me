"use client";

import { useRef, useEffect } from "react";
import {
  CURVES,
  BASE_A,
  BASE_B,
  computeLissajousPoint,
  computeKeplerSpeed,
  generateTrailPoints,
  Point2D,
} from "./lissajousMath";

/**
 * LissajousCurve — Three-Curve Converging Hero Visual Anchor (Revised §5.2)
 *
 * Implements §5.2 of UI/UX Spec v2.0:
 * - Precomputed invisible tracks: NO static continuous curve line rendered (§5.2.1)
 * - Fixed static geometry: Completely deterministic, fixed a/b ratio with zero mouse perturbation
 * - Extended Phosphor Persistence Trail: ~75 points depth (~double length) for long visible trail
 * - Three layered curves at phase offsets (0, 0.6, -0.6) for AI orchestration metaphor (§5.2 P0)
 * - One glowing point per curve (3 total) traveling along its track
 * - Keplerian speed variation: faster near center, slower near periphery (§5.2.1)
 * - prefers-reduced-motion: slow constant angular speed, fading trail retained (§5.2.4)
 */
export default function LissajousCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRefs = useRef<number[]>([0, 0, 0]);
  const historyRefs = useRef<Point2D[][]>([[], [], []]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas DPR resize handling
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const prefersReducedMotion =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const baseSpeed = 0.015;
    const keplerK = 0.55; // Speed reduction factor at apoapsis (periphery)
    const maxTrailLength = 700; // Extended phosphor trail depth (120 points)

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Fixed static geometry ratios
      const a = BASE_A;
      const b = BASE_B;

      const padX = width * 0.15;
      const padY = height * 0.15;
      const drawW = width - padX * 2;
      const drawH = height - padY * 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.sqrt((drawW / 2) ** 2 + (drawH / 2) ** 2);

      // Render 3 orbiting points and fading trails (§5.2 P0 & §5.2.1)
      CURVES.forEach((curveConfig, index) => {
        let t = timeRefs.current[index];

        // 1. Calculate current Lissajous track position
        const { x, y, r } = computeLissajousPoint(
          t,
          a,
          b,
          curveConfig.phaseOffset,
          drawW,
          drawH,
          centerX,
          centerY
        );

        // 2. Compute Keplerian speed variation or constant speed (§5.2.1 & §5.2.4)
        const currentSpeed = prefersReducedMotion
          ? baseSpeed * 0.5
          : computeKeplerSpeed(baseSpeed, keplerK, r, maxRadius);

        // Advance angle parameter t
        t += currentSpeed;
        timeRefs.current[index] = t;

        // 3. Record point history for phosphor trail
        const history = historyRefs.current[index];
        history.unshift({ x, y, speed: currentSpeed });
        if (history.length > maxTrailLength) {
          history.pop();
        }

        // 4. Draw fading phosphor-persistence trail (§5.2.1)
        const trail = generateTrailPoints(history);
        if (trail.length > 1) {
          for (let i = 0; i < trail.length - 1; i++) {
            const p1 = trail[i];
            const p2 = trail[i + 1];
            const alpha = p1.alpha * curveConfig.opacity;

            ctx.beginPath();
            ctx.strokeStyle = curveConfig.color;
            ctx.lineWidth = (1 - i / trail.length) * 2.5 + 0.5;
            ctx.globalAlpha = alpha;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // 5. Draw glowing head orbiting point (§5.2.1)
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = index === 0 ? 14 : 8;
        ctx.shadowColor = curveConfig.color;

        ctx.beginPath();
        ctx.fillStyle = curveConfig.headColor;
        ctx.arc(x, y, curveConfig.pointRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="lissajous-canvas"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
