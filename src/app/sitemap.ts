import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { routing } from "@/i18n/routing";

/**
 * Dynamic Sitemap Generator for Next.js App Router
 * Outputs /sitemap.xml with localized routes, alternates, and published project slugs.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://abdullah-me-m.vercel.app").replace(/\/$/, "");

    // Core static routes across both locales
    const routes = ["", "/portfolio", "/journey", "/contact"];

    const staticEntries: MetadataRoute.Sitemap = [];

    routes.forEach((route) => {
        routing.locales.forEach((locale) => {
            const isHome = route === "";
            const priority = isHome ? 1.0 : route === "/portfolio" ? 0.9 : 0.8;
            const changeFrequency: "daily" | "weekly" | "monthly" = isHome ? "daily" : "weekly";

            staticEntries.push({
                url: `${siteUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency,
                priority,
                alternates: {
                    languages: {
                        ar: `${siteUrl}/ar${route}`,
                        en: `${siteUrl}/en${route}`,
                    },
                },
            });
        });
    });

    // Dynamic project routes
    try {
        const projects = await prisma.project.findMany({
            where: { isPublished: true },
            select: { slug: true, updatedAt: true },
        });

        const projectEntries: MetadataRoute.Sitemap = [];

        projects.forEach((project) => {
            routing.locales.forEach((locale) => {
                projectEntries.push({
                    url: `${siteUrl}/${locale}/portfolio/${project.slug}`,
                    lastModified: project.updatedAt,
                    changeFrequency: "weekly",
                    priority: 0.85,
                    alternates: {
                        languages: {
                            ar: `${siteUrl}/ar/portfolio/${project.slug}`,
                            en: `${siteUrl}/en/portfolio/${project.slug}`,
                        },
                    },
                });
            });
        });

        return [...staticEntries, ...projectEntries];
    } catch (error) {
        console.error("[Sitemap Generator] Failed to fetch dynamic projects:", error);
        return staticEntries;
    }
}
