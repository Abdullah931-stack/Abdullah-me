"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/routing";

/**
 * ScrollRestoration Component
 *
 * Tracks window.scrollY on scroll events and persists position to sessionStorage.
 * Restores scroll position on page reload, route changes, or locale switches.
 */
export default function ScrollRestoration() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Set browser scroll restoration to manual to prevent erratic browser jumps
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        const storageKey = `scroll_pos_${pathname}`;

        // Restore saved scroll position on mount / pathname change
        const savedPos = sessionStorage.getItem(storageKey);
        if (savedPos !== null) {
            const targetY = parseInt(savedPos, 10);
            if (!isNaN(targetY) && targetY >= 0) {
                // Use requestAnimationFrame to ensure DOM layout paint has finished
                requestAnimationFrame(() => {
                    window.scrollTo({ top: targetY, behavior: "instant" as ScrollBehavior });
                });
            }
        }

        let ticking = false;

        // Track scroll position using requestAnimationFrame for 60fps performance
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    sessionStorage.setItem(storageKey, window.scrollY.toString());
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    return null;
}
