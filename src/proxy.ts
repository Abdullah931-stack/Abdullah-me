import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Proxy (formerly Middleware) for Next.js 16:
 * 1. i18n — Detects locale from Accept-Language header (NOT navigator.language)
 *    to prevent Hydration Mismatch.
 * 2. Redirects to /{locale}/... paths automatically.
 *
 * Note: Admin routes (/admin/*) are excluded from i18n
 * and handled separately with Supabase Auth protection.
 */
export const proxy = createMiddleware(routing);
export default proxy;

export const config = {
    // Match all pathnames except:
    // - /api (API routes)
    // - /admin (Admin dashboard — outside i18n)
    // - /_next (Next.js internals)
    // - /images, /favicon.ico (static files)
    matcher: [
        "/",
        "/(ar|en)/:path*",
        "/((?!api|admin|_next|images|favicon.ico).*)",
    ],
};
