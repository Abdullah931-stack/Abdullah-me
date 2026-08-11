import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/hero/HeroSection";
import PortfolioList from "@/components/portfolio/PortfolioList";
import { prisma } from "@/lib/prisma";

/**
 * Home Page — v2.0 "Signal & Growth"
 * Per §5 + §6 of UI/UX Spec:
 * - Hero Section: Lissajous tri-curve + LavaBackground + verb-based copy
 * - Project Grid: Uniform grid with shared-element expand (replaces CardShuffle)
 */
interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch featured published projects
  const featuredProjects = await prisma.project.findMany({
    where: { isPublished: true, isFeatured: true },
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <>
      {/* §5 — Hero Section: Lissajous + LavaBackground */}
      <HeroSection />

      {/* §6 — Project Grid: Uniform grid with shared-element expand */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <PortfolioList projects={featuredProjects} />
          </div>
        </section>
      )}
    </>
  );
}
