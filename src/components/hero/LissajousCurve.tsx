"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * LissajousCurve — Three-Curve Converging Hero Visual Anchor
 *
 * Implements §5.2 of UI/UX Spec v2.0:
 * - Parametric Lissajous curve: x = sin(a·t + δ), y = sin(b·t)
 * - P0 treatment: THREE layered curves at different phase offsets,
 *   converging toward one bright central curve (orchestration metaphor)
 * - Interaction: mouse movement slowly perturbs frequency ratio a/b
 *   over slow easing (§5.2), NOT 1:1 tracking
 * - Colors: --accent / --accent-bright (§7.3)
 * - Uses same composed-sine-wave mathematics as background (§4.2)
 * - prefers-reduced-motion: static single curve (§10.5)
 */

// Curve configuration — three curves per §5.2 P0
const CURVES = [
  { phaseOffset: 0, opacity: 1.0, lineWidth: 2.0, color: "#a7f3c4" },   // Central bright curve (--accent-bright)
  { phaseOffset: 0.6, opacity: 0.35, lineWidth: 1.2, color: "#4ade80" }, // Flanking curve 1 (--accent)
  { phaseOffset: -0.6, opacity: 0.35, lineWidth: 1.2, color: "#4ade80" }, // Flanking curve 2 (--accent)
];

// Base Lissajous parameters
const BASE_A = 3;
const BASE_B = 2;
const SAMPLE_COUNT = 600;

export default function LissajousCurve() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseInfluenceRef = useRef({ targetRatio: 0, currentRatio: 0 });
  const timeRef = useRef(0);

  // §5.2 — mouse slowly perturbs frequency ratio a/b (slow easing)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    // Map to a small perturbation range — NOT 1:1 tracking
    mouseInfluenceRef.current.targetRatio = normalizedX * 0.3;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseInfluenceRef.current.targetRatio = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize handling
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse events for §5.2 interaction
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Check reduced motion preference (§10.5)
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Slow easing for mouse influence — §5.2 "over a slow easing"
      const mouse = mouseInfluenceRef.current;
      mouse.currentRatio += (mouse.targetRatio - mouse.currentRatio) * 0.02;

      // Time progression (slow oscillation for organic feel)
      if (!prefersReducedMotion) {
        timeRef.current += 0.003;
      }
      const t = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      // Compute frequency ratio with mouse perturbation
      const a = BASE_A + mouse.currentRatio;
      const b = BASE_B;

      // Drawing area with padding
      const padX = width * 0.15;
      const padY = height * 0.15;
      const drawW = width - padX * 2;
      const drawH = height - padY * 2;

      // §5.2 P0 — render three curves at different phase offsets
      const curvesToRender = prefersReducedMotion ? [CURVES[0]] : CURVES;

      for (const curve of curvesToRender) {
        ctx.beginPath();
        ctx.strokeStyle = curve.color;
        ctx.lineWidth = curve.lineWidth;
        ctx.globalAlpha = curve.opacity;

        // Phase convergence animation — curves slowly converge and diverge
        const convergenceFactor = prefersReducedMotion
          ? 0
          : Math.sin(t * 0.5) * 0.3;
        const effectivePhaseOffset =
          curve.phaseOffset * (1 - convergenceFactor * 0.5);

        for (let i = 0; i <= SAMPLE_COUNT; i++) {
          const param = (i / SAMPLE_COUNT) * Math.PI * 2;
          // Lissajous: x = sin(a·param + δ + phaseOffset), y = sin(b·param)
          const x =
            Math.sin(a * param + t + effectivePhaseOffset) * (drawW / 2) +
            width / 2;
          const y =
            Math.sin(b * param + effectivePhaseOffset * 0.7) * (drawH / 2) +
            height / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Add subtle glow to central curve
      if (!prefersReducedMotion) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#a7f3c4";
        ctx.beginPath();
        ctx.strokeStyle = "rgba(167, 243, 196, 0.15)";
        ctx.lineWidth = 6;
        for (let i = 0; i <= SAMPLE_COUNT; i++) {
          const param = (i / SAMPLE_COUNT) * Math.PI * 2;
          const x = Math.sin(a * param + t) * (drawW / 2) + width / 2;
          const y = Math.sin(b * param) * (drawH / 2) + height / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

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
        pointerEvents: "auto",
      }}
      aria-hidden="true"
    />
  );
}
