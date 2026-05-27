import { createActor } from "@/backend";
import { Breadcrumb } from "@/components/Breadcrumb";
import { SEOHead } from "@/components/SEOHead";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSEOData } from "@/data/seo";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe,
  GraduationCap,
  Quote,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useHeroContent, useTestimonials } from "../hooks/useBackendContent";

type OutcomeType = "visa" | "university" | "scholarship" | "work";

interface StudentStory {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  country: string;
  flag: string;
  outcome: string;
  outcomeType: OutcomeType;
  program: string;
  quote: string;
  year: number;
}

interface FeaturedStory {
  id: number;
  name: string;
  country: string;
  flag: string;
  university: string;
  program: string;
  quote: string;
  rating: number;
  year: number;
}

const filterTabs: { label: string; value: OutcomeType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Visa Approvals", value: "visa" },
  { label: "University Admits", value: "university" },
  { label: "Scholarships", value: "scholarship" },
  { label: "Work Visa", value: "work" },
];

const outcomeBadgeStyles: Record<OutcomeType, string> = {
  visa: "bg-emerald-100 text-emerald-700 border-emerald-200",
  university: "bg-primary/10 text-primary border-primary/20",
  scholarship: "bg-amber-100 text-amber-700 border-amber-200",
  work: "bg-sky-100 text-sky-700 border-sky-200",
};

const outcomeLabels: Record<OutcomeType, string> = {
  visa: "Visa Approved",
  university: "University Admit",
  scholarship: "Scholarship",
  work: "Work Visa",
};

const staticStudentStories: StudentStory[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    initials: "AS",
    avatarColor: "bg-primary",
    country: "Canada",
    flag: "🇨🇦",
    outcome: "Admitted to University of Toronto",
    outcomeType: "university",
    program: "MSc Computer Science",
    quote:
      "Valmiki Group made my dream of studying in Canada a reality. Their guidance through every step was invaluable.",
    year: 2024,
  },
  {
    id: 2,
    name: "Priya Patel",
    initials: "PP",
    avatarColor: "bg-secondary",
    country: "USA",
    flag: "🇺🇸",
    outcome: "F-1 Visa Approved",
    outcomeType: "visa",
    program: "MBA, Northeastern University",
    quote:
      "The visa interview preparation was exceptional. I felt confident and well-prepared, and my visa was approved in just 3 days.",
    year: 2024,
  },
  {
    id: 3,
    name: "Rohan Iyer",
    initials: "RI",
    avatarColor: "bg-accent",
    country: "UK",
    flag: "🇬🇧",
    outcome: "£15,000 Scholarship Awarded",
    outcomeType: "scholarship",
    program: "BEng Mechanical Engineering",
    quote:
      "I never thought I could get a scholarship. The team helped me craft a winning application that secured £15,000 in funding.",
    year: 2023,
  },
  {
    id: 4,
    name: "Sneha Reddy",
    initials: "SR",
    avatarColor: "bg-emerald-600",
    country: "Australia",
    flag: "🇦🇺",
    outcome: "Student Visa Approved",
    outcomeType: "visa",
    program: "MSc Data Science, UNSW",
    quote:
      "From university shortlisting to visa stamping, Valmiki handled everything professionally. Highly recommended!",
    year: 2024,
  },
  {
    id: 5,
    name: "Karthik Menon",
    initials: "KM",
    avatarColor: "bg-sky-600",
    country: "Germany",
    flag: "🇩🇪",
    outcome: "Admitted to TU Munich",
    outcomeType: "university",
    program: "MSc Automotive Engineering",
    quote:
      "The German admission process is complex, but Valmiki's experts navigated it flawlessly. I'm now at my dream university.",
    year: 2023,
  },
  {
    id: 6,
    name: "Ananya Gupta",
    initials: "AG",
    avatarColor: "bg-rose-500",
    country: "Ireland",
    flag: "🇮🇪",
    outcome: "Post-Study Work Visa",
    outcomeType: "work",
    program: "MSc Biotechnology, UCD",
    quote:
      "After completing my masters, Valmiki helped me secure a 2-year work visa. Now I'm building my career in Dublin's biotech hub.",
    year: 2023,
  },
  {
    id: 7,
    name: "Vikram Rao",
    initials: "VR",
    avatarColor: "bg-violet-600",
    country: "New Zealand",
    flag: "🇳🇿",
    outcome: "Admitted to University of Auckland",
    outcomeType: "university",
    program: "PhD Environmental Science",
    quote:
      "The research proposal guidance was outstanding. I received my admission letter with a full tuition waiver within weeks.",
    year: 2024,
  },
  {
    id: 8,
    name: "Meera Krishnan",
    initials: "MK",
    avatarColor: "bg-teal-600",
    country: "Singapore",
    flag: "🇸🇬",
    outcome: "Student Pass Approved",
    outcomeType: "visa",
    program: "BBA, Singapore Management University",
    quote:
      "Valmiki's Singapore specialists knew exactly what the universities look for. My application stood out and I got in!",
    year: 2024,
  },
  {
    id: 9,
    name: "Arjun Nair",
    initials: "AN",
    avatarColor: "bg-orange-600",
    country: "Dubai",
    flag: "🇦🇪",
    outcome: "Golden Visa Sponsored",
    outcomeType: "work",
    program: "MSc Construction Management",
    quote:
      "The Dubai Golden Visa pathway was explained clearly. I'm now working with a top construction firm in the UAE.",
    year: 2023,
  },
  {
    id: 10,
    name: "Divya Choudhary",
    initials: "DC",
    avatarColor: "bg-pink-600",
    country: "UK",
    flag: "🇬🇧",
    outcome: "Chevening Scholarship",
    outcomeType: "scholarship",
    program: "MSc Public Health, LSHTM",
    quote:
      "Winning the Chevening Scholarship changed my life. Valmiki's essay reviews and interview coaching were game-changers.",
    year: 2024,
  },
  {
    id: 11,
    name: "Nikhil Bansal",
    initials: "NB",
    avatarColor: "bg-indigo-600",
    country: "USA",
    flag: "🇺🇸",
    outcome: "H-1B Work Visa",
    outcomeType: "work",
    program: "MS Electrical Engineering, ASU",
    quote:
      "From OPT to H-1B, Valmiki guided my entire US journey. Their immigration expertise is truly world-class.",
    year: 2023,
  },
  {
    id: 12,
    name: "Lakshmi Prasad",
    initials: "LP",
    avatarColor: "bg-lime-600",
    country: "Canada",
    flag: "🇨🇦",
    outcome: "PGWP + PR Pathway",
    outcomeType: "work",
    program: "MEng Civil Engineering, UBC",
    quote:
      "Valmiki planned my entire Canada pathway — study, work permit, and PR. Their long-term vision saved me years of confusion.",
    year: 2024,
  },
];

const staticFeaturedStories: FeaturedStory[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    country: "Canada",
    flag: "🇨🇦",
    university: "University of Toronto",
    program: "MSc Computer Science",
    quote:
      "I had almost given up on my Canadian dream after a visa rejection. Valmiki Group not only identified the gaps in my previous application but also rebuilt my entire profile from scratch. Their counselor spent hours with me, refining my SOP and preparing me for the interview. When my visa was approved, I couldn't believe it. Today, I'm pursuing my master's at one of the world's top universities, and I owe it all to Valmiki's relentless support.",
    rating: 5,
    year: 2024,
  },
  {
    id: 2,
    name: "Priya Patel",
    country: "USA",
    flag: "🇺🇸",
    university: "Northeastern University",
    program: "MBA",
    quote:
      "The MBA admission process in the US is incredibly competitive. Valmiki's team helped me shortlist universities that matched my profile perfectly, crafted compelling essays, and prepared me for interviews with alumni. Their mock interview sessions were so realistic that the actual interview felt like a breeze. I got into Northeastern with a partial scholarship — something I never imagined possible.",
    rating: 5,
    year: 2024,
  },
  {
    id: 3,
    name: "Rohan Iyer",
    country: "UK",
    flag: "🇬🇧",
    university: "Imperial College London",
    program: "BEng Mechanical Engineering",
    quote:
      "As a first-generation student, I had no idea how to navigate the UK education system. Valmiki held my hand through every step — from UCAS applications to scholarship essays. When I received the £15,000 scholarship notification, my family was in tears. Valmiki didn't just help me get admission; they gave me the confidence to dream bigger than I ever had before.",
    rating: 5,
    year: 2023,
  },
];

const avatarColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-rose-500",
  "bg-violet-600",
  "bg-teal-600",
  "bg-orange-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-lime-600",
];

const countryFlagMap: Record<string, string> = {
  Canada: "🇨🇦",
  USA: "🇺🇸",
  UK: "🇬🇧",
  Australia: "🇦🇺",
  Germany: "🇩🇪",
  Ireland: "🇮🇪",
  "New Zealand": "🇳🇿",
  Dubai: "🇦🇪",
  Singapore: "🇸🇬",
  Europe: "🇪🇺",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function SuccessStories() {
  const { data: heroContentData } = useHeroContent();

  // Stable ref: preserve last known hero values so stats never flash empty
  const lastHeroRef = React.useRef(heroContentData);
  if (heroContentData) lastHeroRef.current = heroContentData;
  const stableHero = lastHeroRef.current;

  const stats = [
    {
      value: stableHero?.studentsGuided ?? "",
      label: "Students Guided",
      icon: Users,
    },
    {
      value: stableHero?.visaSuccessRate ?? "",
      label: "Visa Success Rate",
      icon: ShieldCheck,
    },
    {
      value: stableHero?.universityPartnerships ?? "",
      label: "Partner Universities",
      icon: GraduationCap,
    },
    {
      value: stableHero?.yearsExperience ?? "",
      label: "Years of Excellence",
      icon: Globe,
    },
  ];
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("success-stories")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const [activeFilter, setActiveFilter] = useState<OutcomeType | "all">("all");

  const { data: backendTestimonials } = useTestimonials();
  const visibleBackend = backendTestimonials?.filter((t) => t.isVisible) ?? [];

  const studentStories: StudentStory[] =
    visibleBackend.length > 0
      ? visibleBackend.map((t, i) => ({
          id: Number(t.id),
          name: t.name,
          initials: getInitials(t.name),
          avatarColor: avatarColors[i % avatarColors.length],
          country: t.country,
          flag: countryFlagMap[t.country] || "🌍",
          outcome: `Admitted to ${t.university}`,
          outcomeType: "university" as const,
          program: t.course,
          quote: t.text,
          year: 2024,
        }))
      : staticStudentStories;

  const featuredStories: FeaturedStory[] =
    visibleBackend.length > 0
      ? visibleBackend.slice(0, 3).map((t) => ({
          id: Number(t.id),
          name: t.name,
          country: t.country,
          flag: countryFlagMap[t.country] || "🌍",
          university: t.university,
          program: t.course,
          quote: t.text,
          rating: Number(t.rating),
          year: 2024,
        }))
      : staticFeaturedStories;

  const filteredStories = useMemo(() => {
    if (activeFilter === "all") return studentStories;
    return studentStories.filter((s) => s.outcomeType === activeFilter);
  }, [activeFilter, studentStories]);

  return (
    <>
      <SEOHead meta={getSEOData("successStories")} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <Breadcrumb />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl"
          >
            {heroData?.headline || "Student Success Stories"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80 md:text-xl"
          >
            {heroData?.subheadline || "Real Stories from Real Students"}
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border/50 bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <stat.icon className="h-8 w-8 text-primary" />
                <p className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          <div
            className="flex flex-wrap justify-center gap-2"
            data-ocid="stories.filter.tabs"
          >
            {filterTabs.map((tab) => (
              <button
                type="button"
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-smooth ${
                  activeFilter === tab.value
                    ? "bg-secondary text-white shadow-subtle"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
                data-ocid={`stories.filter.tab.${tab.value}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Story Cards Grid */}
      <section className="bg-background pb-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card group relative rounded-2xl p-6 shadow-3d transition-smooth hover:-translate-y-1 hover:shadow-lg"
                  data-ocid={`stories.card.${index + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${story.avatarColor}`}
                    >
                      {story.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-base font-semibold text-foreground">
                        {story.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span>{story.flag}</span>
                        <span>{story.country}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${outcomeBadgeStyles[story.outcomeType]}`}
                    >
                      {outcomeLabels[story.outcomeType]}
                    </Badge>
                    <p className="mt-2 font-medium text-foreground">
                      {story.outcome}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      {story.program}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-border/50 pt-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>{story.year}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredStories.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="stories.empty_state"
            >
              <Quote className="h-12 w-12 text-muted" />
              <p className="mt-4 text-lg font-medium text-foreground">
                No stories found
              </p>
              <p className="text-muted-foreground">
                Try selecting a different filter.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Testimonials Carousel */}
      <section className="border-t border-border/50 bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Featured Testimonials
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Hear from students whose lives were transformed by global
              education opportunities.
            </p>
          </motion.div>

          <div className="mt-12">
            <TestimonialCarousel
              items={featuredStories.map((story) => ({
                id: BigInt(story.id),
                country: story.country,
                name: story.name,
                text: story.quote,
                university: story.university,
                imageUrl: "",
                isVisible: true,
                rating: BigInt(story.rating),
                course: story.program,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card relative overflow-hidden rounded-3xl p-8 text-center shadow-3d md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Write Your Own Success Story
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join thousands of students who turned their global education
                dreams into reality with Valmiki Group.
              </p>
              <div className="mt-8">
                <Link to="/free-counseling">
                  <Button
                    size="lg"
                    className="gap-2 rounded-full px-8 py-6 text-base shadow-subtle"
                    data-ocid="stories.cta.primary_button"
                  >
                    Book Free Counseling
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
