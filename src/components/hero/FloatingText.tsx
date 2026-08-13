"use client";

import { motion } from "framer-motion";

/**
 * Floating Text Component — Hero Section
 * Text "floats" with a subtle Y-axis animation (per 05-ANIMATION-SPEC.md)
 *
 * Separates entrance animation (whileInView) on the outer container from continuous 
 * floating animation (animate) on the inner container to eliminate Vercel production 
 * race conditions and controls override bugs.
 */
interface FloatingTextProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function FloatingText({
    children,
    delay = 0,
    className = "",
}: FloatingTextProps) {
    return (
        // Outer wrapper: Handles entrance opacity and scroll trigger exclusively
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: delay * 0.2 }}
            className={className}
        >
            {/* Inner wrapper: Handles continuous Y-axis floating loop exclusively */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                    delay,
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
