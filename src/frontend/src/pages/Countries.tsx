import { createActor } from "@/backend";
import { SEOHead } from "@/components/SEOHead";
import { useContent } from "@/context/ContentContext";
import { countries as fallbackCountries } from "@/data/countries";
import { COUNTRY_IMAGES } from "@/data/countryImages";
import { getSEOData } from "@/data/seo";
import type { Country } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCountries } from "../hooks/useBackendContent";

const SLUG_TO_ADMIN: Record<string, string> = {
  usa: "us",
  canada: "ca",
  uk: "gb",
  australia: "au",
  germany: "de",
  ireland: "ie",
  "new-zealand": "nz",
  dubai: "ae",
  singapore: "sg",
  europe: "eu",
  france: "fr",
};

const bustCache = (url: string) =>
  url && !url.includes("?") ? `${url}?t=${Date.now()}` : url;

export default function Countries() {
  const { heroContent, countriesMap } = useContent();

  // Stable ref: preserve last known hero values so stats never flash empty
  const lastHeroRef = React.useRef(heroContent);
  if (heroContent) lastHeroRef.current = heroContent;
  const stableHero = lastHeroRef.current;
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("countries")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: backendCountries, orderedCountries } = useCountries();
  // Build admin-slug → position map from orderedCountries (admin slugs: us, ca, gb…)
  const adminSlugOrder: Record<string, number> = {};
  (orderedCountries ?? []).forEach((c, i) => {
    adminSlugOrder[c.slug] = i;
  });

  const allCountries: Country[] = fallbackCountries
    .map((c) => {
      const backend = backendCountries?.find((b) => b.slug === c.slug);
      if (!backend) return c;
      return {
        ...c,
        avgTuition: backend.tuition || c.avgTuition,
        popularCourses:
          backend.popularCourses.length > 0
            ? backend.popularCourses
            : c.popularCourses,
        visaSuccessRate: backend.visaSuccessRate || c.visaSuccessRate,
      };
    })
    .sort((a, b) => {
      const aKey = SLUG_TO_ADMIN[a.slug] ?? a.slug;
      const bKey = SLUG_TO_ADMIN[b.slug] ?? b.slug;
      const ai = adminSlugOrder[aKey] ?? 999;
      const bi = adminSlugOrder[bKey] ?? 999;
      return ai - bi;
    });

  const countries = searchQuery.trim()
    ? allCountries.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allCountries;

  return (
    <>
      <SEOHead meta={getSEOData("countries")} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-white lg:py-28">
        {/* Decorative country flag background */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <span className="absolute left-[3%] top-[8%] rotate-12 text-8xl opacity-10">
            🇬🇧
          </span>
          <span className="absolute left-[18%] top-[55%] -rotate-6 text-7xl opacity-10">
            🇺🇸
          </span>
          <span className="absolute left-[32%] top-[12%] rotate-3 text-8xl opacity-[0.08]">
            🇨🇦
          </span>
          <span className="absolute left-[48%] top-[60%] -rotate-12 text-7xl opacity-10">
            🇦🇺
          </span>
          <span className="absolute left-[62%] top-[10%] rotate-6 text-8xl opacity-[0.08]">
            🇩🇪
          </span>
          <span className="absolute left-[75%] top-[50%] -rotate-3 text-7xl opacity-10">
            🇮🇪
          </span>
          <span className="absolute left-[86%] top-[15%] rotate-12 text-8xl opacity-[0.08]">
            🇳🇿
          </span>
          <span className="absolute left-[10%] top-[80%] -rotate-6 text-7xl opacity-10">
            🇫🇷
          </span>
          <span className="absolute left-[55%] top-[80%] rotate-3 text-8xl opacity-[0.08]">
            🇸🇬
          </span>
          <span className="absolute left-[90%] top-[70%] -rotate-12 text-7xl opacity-10">
            🇦🇪
          </span>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-secondary blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {heroData?.headline || "Study Abroad Destinations"}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              Explore top study destinations around the world. From the USA to
              Europe, find the perfect country for your academic journey with
              expert guidance from Valmiki Group.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>
                  {stableHero?.visaSuccessRate ?? ""}
                  {stableHero?.visaSuccessRate ? " Visa Success Rate" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                <span>
                  {stableHero?.universityPartnerships ?? ""}
                  {stableHero?.universityPartnerships
                    ? " University Partners"
                    : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span>
                  {stableHero?.studentsGuided ?? ""}
                  {stableHero?.studentsGuided ? " Students Guided" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Choose Your Destination
            </h2>
            <p className="mt-4 text-muted-foreground">
              Click on any country to explore universities, courses,
              scholarships, and visa details.
            </p>
          </div>

          {/* Search/Filter */}
          <div className="mx-auto mb-10 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by country name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-5 py-3 pl-11 text-sm text-foreground placeholder:text-muted-foreground shadow-subtle outline-none ring-secondary/30 transition-all focus:border-secondary focus:ring-2"
                data-ocid="countries.search_input"
              />
              <ArrowRight className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-180 text-muted-foreground" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  data-ocid="countries.search_clear"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {countries.length === 0
                  ? "No countries found"
                  : `${countries.length} result${countries.length !== 1 ? "s" : ""} for "${searchQuery}"`}
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {countries.map((country) => {
              const adminKey = SLUG_TO_ADMIN[country.slug] ?? country.slug;
              const uploadedHero = countriesMap[adminKey]?.heroImage;
              const localImage = COUNTRY_IMAGES[country.slug];
              const flagSrc = uploadedHero
                ? bustCache(uploadedHero)
                : localImage
                  ? localImage
                  : country.flagCdnCode
                    ? `https://flagcdn.com/w640/${country.flagCdnCode}.png`
                    : null;
              return (
                <Link
                  key={country.slug}
                  to={`/countries/${country.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:ring-1 hover:ring-white/20"
                  style={{ height: "260px" }}
                  data-ocid={`countries.card.${country.slug}`}
                >
                  {/* Cinematic full-bleed flag image */}
                  {flagSrc ? (
                    <img
                      src={flagSrc}
                      alt={country.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                      <span className="text-6xl">{country.flagEmoji}</span>
                    </div>
                  )}

                  {/* Cinematic gradient overlay — dark at bottom, lighter at top */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.12) 100%)",
                    }}
                  />

                  {/* Content anchored to bottom */}
                  <div className="relative z-10 mt-auto p-4">
                    <h3
                      className="font-display text-lg font-bold text-white"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                    >
                      {country.name}
                    </h3>

                    {/* Stats pills */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                        <ShieldCheck className="h-3 w-3 text-green-300" />
                        {country.visaSuccessRate}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                        {country.avgTuition.split(" ")[0]}
                      </span>
                    </div>

                    {/* Explore affordance */}
                    <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-white/80 transition-all duration-200 group-hover:text-white">
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      {/* CTA Banner */}
      <section className="bg-secondary py-14 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            Not sure which country is right for you?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Our expert counselors will assess your profile and recommend the
            best destination for your academic and career goals.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/free-counseling"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-secondary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
              data-ocid="countries.cta.book_counseling"
            >
              Book a Free Counseling Session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
