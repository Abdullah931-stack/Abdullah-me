import type { MetadataRoute } from "next";

/**
 * Dynamic Robots.txt generator for Next.js App Router
 * Allows search engines to index public localized routes while blocking admin endpoints.
 */
export default function robots(): MetadataRoute.Robots {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://abdullah-me-m.vercel.app").replace(/\/$/, "");

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/ar/", "/en/"],
                disallow: ["/admin/", "/api/admin/", "/api/auth/"],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
