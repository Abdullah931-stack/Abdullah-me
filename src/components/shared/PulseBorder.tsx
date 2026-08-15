"use client";

import { useRef, useCallback, useEffect, useState } from "react";

/**
 * PulseBorder — Shared Directional-Reveal Micro-Interaction
 *
 * Implements §7 of UI/UX Spec v2.0:
 * - On pointerenter: border reveals from contact point, sweeping outward (§7.2)
 * - While hovered: border stays fully lit, static (§7.2)
 * - On pointerleave: plain opacity fade-out (§7.2)
 * - Implementation: mask-image conic gradient animated via --progress (§7.3)
 * - Color: --accent-bright leading edge → --accent once fully lit (§7.3)
 * - prefers-reduced-motion: plain opacity fade (§10.5)
 *
 * Scope (§7.1):
 * ✅ Project cards, Primary CTA buttons, GitHub/preview buttons, Gallery arrows
 * ❌ Navbar links, Skill tags, Contact form fields, Journey entries
 */

interface PulseBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
  as?: "div" | "button" | "a";
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

export default function PulseBorder({
  children,
  className = "",
  borderRadius = "1rem",
  as: Component = "div",
  onClick,
  href,
  target,
  rel,
  ariaLabel,
}: PulseBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [contactAngle, setContactAngle] = useState(0);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number>(0);
  const progressRef = useRef(0);

  // Calculate angle from contact point to element center
  const calculateAngle = useCallback((e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
  }, []);

  // §7.2 — Directional reveal from contact point
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent) => {
      setIsHovered(true);
      setContactAngle(calculateAngle(e));

      // Animate --progress from 0 to 1 (~300ms)
      progressRef.current = 0;
      const startTime = performance.now();
      const duration = 300;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const p = Math.min(elapsed / duration, 1);
        // Ease-out curve for smooth reveal
        const eased = 1 - Math.pow(1 - p, 3);
        progressRef.current = eased;
        setProgress(eased);
        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      };
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    },
    [calculateAngle]
  );

  // §7.2 — Plain opacity fade-out on release
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    cancelAnimationFrame(animFrameRef.current);
    // Progress resets, opacity fade handles the visual exit
    setProgress(0);
    progressRef.current = 0;
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Check reduced motion (§11.6)
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      setReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    }
  }, []);

  // §7.3 — Mask: conic gradient from contact angle, revealing border
  const maskValue = reducedMotion
    ? "none"
    : `conic-gradient(from ${contactAngle}deg, black ${progress * 50}%, transparent ${progress * 50}%, transparent ${100 - progress * 50}%, black ${100 - progress * 50}%)`;

  // Build props for the wrapper element
  const wrapperProps: Record<string, unknown> = {
    ref: containerRef,
    className: `pulse-border-wrapper relative ${className}`,
    style: { borderRadius, position: "relative" as const } as React.CSSProperties,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: handlePointerLeave,
    onClick,
    "aria-label": ariaLabel,
  };

  if (Component === "a") {
    wrapperProps.href = href;
    wrapperProps.target = target;
    wrapperProps.rel = rel;
  }

  return (
    <Component {...(wrapperProps as Record<string, never>)}>
      {/* Static border layer — always fully lit, masked by progress */}
      <div
        ref={borderRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          // §7.3 — accent-bright leading, settling to accent
          border: `1.5px solid ${progress > 0.8 ? "var(--color-accent)" : "var(--color-accent-bright)"}`,
          boxShadow: isHovered
            ? "0 0 15px rgba(74, 222, 128, 0.15), inset 0 0 15px rgba(74, 222, 128, 0.05)"
            : "none",
          // Mask for directional reveal (§7.3)
          WebkitMaskImage: reducedMotion ? "none" : maskValue,
          maskImage: reducedMotion ? "none" : maskValue,
          // Opacity transition for entry/exit
          opacity: reducedMotion ? (isHovered ? 1 : 0) : isHovered ? 1 : 0,
          transition: isHovered
            ? "opacity 100ms ease-in, box-shadow 300ms ease"
            : "opacity 250ms ease-out, box-shadow 300ms ease",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      {/* Default border — visible when not hovered */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          border: "1px solid var(--color-card-border)",
          opacity: isHovered ? 0 : 1,
          transition: "opacity 200ms ease",
          pointerEvents: "none",
          zIndex: 9,
        }}
      />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 5 }}>{children}</div>
    </Component>
  );
}
