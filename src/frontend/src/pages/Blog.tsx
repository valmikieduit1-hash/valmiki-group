import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HeroData {
  headline: string;
  subheadline: string;
  imageUrl: string;
}

export default function Blog() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("blog")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  return (
    <div className="min-h-screen">
      <section
        className="relative bg-gradient-to-br from-[#0B1F3A] to-[#1a3a6b] py-24 text-white overflow-hidden"
        style={
          heroData?.imageUrl
            ? {
                backgroundImage: `url(${heroData.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {heroData?.imageUrl && (
          <div className="absolute inset-0 bg-[#0B1F3A]/70" />
        )}
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {heroData?.headline || "Valmiki Blog"}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {heroData?.subheadline ||
              "Insights on studying abroad, visa updates, scholarships, and career tips"}
          </p>
        </div>
      </section>
      <section className="py-16 container mx-auto px-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">
            Blog posts coming soon. Stay tuned for the latest updates on
            overseas education.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-[#FF8A00] px-6 py-3 text-white font-semibold hover:bg-[#e67800] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
