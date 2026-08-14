"use client";

import { useContext, useRef, type ReactNode } from "react";
// ⚠️ Internal Next.js API — not a stable public export. Re-verify this import
// path after any Next.js version upgrade; it may move or be removed.
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * FrozenRouter — Prevents Next.js App Router context tearing during Framer Motion exit animations.
 * When AnimatePresence mode="wait" animates out an old route, FrozenRouter preserves the route context
 * so that translation messages, server props, and component state do not freeze or go blank.
 */
function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

/**
 * Page Transition — Smooth Route Transitions
 * Wraps page content with a seamless fade transition on route changes,
 * using FrozenRouter to maintain translation and component state stability.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}

