import { createActor } from "@/backend";
import { SEOHead } from "@/components/SEOHead";
import { getSEOData } from "@/data/seo";
import { services as fallbackServices } from "@/data/services";
import type { Service } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  MessageCircle,
  Phone,
  Plane,
  Search,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHeroContent, useServices } from "../hooks/useBackendContent";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Globe,
  FileCheck,
  BookOpen,
  Award,
  CreditCard,
  FileText,
  Briefcase,
};

// highlights defined inside component using dynamic heroContentData

const processSteps = [
  {
    number: "01",
    title: "Initial Consultation",
    description:
      "Free one-on-one session to understand your goals, academic background, and career aspirations.",
    icon: MessageCircle,
  },
  {
    number: "02",
    title: "Profile Assessment",
    description:
      "Comprehensive evaluation of your academics, finances, and preferences to create a tailored roadmap.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "University Selection",
    description:
      "Curated shortlist of universities and courses that match your profile, budget, and ambitions.",
    icon: Search,
  },
  {
    number: "04",
    title: "Application & Visa",
    description:
      "End-to-end support for applications, documentation, SOPs, and visa filing with mock interviews.",
    icon: Send,
  },
  {
    number: "05",
    title: "Pre-Departure",
    description:
      "Orientation sessions, travel arrangements, accommodation guidance, and alumni network access.",
    icon: Plane,
  },
];

function ServiceCard({
  service,
}: {
  service: Service;
}) {
  const Icon = iconMap[service.icon] || GraduationCap;

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-subtle transition-all duration-500 hover:-translate-y-2 hover:shadow-3d"
      data-ocid={`services.card.${service.id}`}
    >
      {/* Orange accent top border */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary opacity-80 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#FF8A00] text-white transition-all duration-300 group-hover:bg-[#e07a00] group-hover:shadow-lg">
          <Icon className="h-7 w-7" />
        </div>

        {/* Title */}
        <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
          {service.title}
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
          {service.shortDescription}
        </p>

        {/* Features */}
        <ul className="mt-4 space-y-2.5">
          {service.features.slice(0, 4).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <Link
            to={`/services/${service.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-secondary/90 hover:shadow-md"
            data-ocid={`services.card.${service.id}.cta_primary`}
          >
            Explore Service
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-primary"
            data-ocid={`services.card.${service.id}.cta_secondary`}
          >
            Inquire Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("services")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const { data: heroContentData } = useHeroContent();

  // Stable ref: preserve last known hero values so stats never flash empty
  const lastHeroRef = React.useRef(heroContentData);
  if (heroContentData) lastHeroRef.current = heroContentData;
  const stableHero = lastHeroRef.current;

  const highlights = [
    {
      value: stableHero?.yearsExperience ?? "",
      label: "Years Experience",
      icon: TrendingUp,
    },
    {
      value: stableHero?.universityPartnerships ?? "",
      label: "University Partners",
      icon: Globe,
    },
    {
      value: stableHero?.visaSuccessRate ?? "",
      label: "Visa Success Rate",
      icon: Award,
    },
    {
      value: stableHero?.studentsGuided ?? "",
      label: "Students Guided",
      icon: Users,
    },
  ];
  const { data: backendServices } = useServices();
  const services: Service[] =
    backendServices && backendServices.length > 0
      ? backendServices.map((s) => ({
          id: String(s.id),
          title: s.name,
          shortDescription: s.description,
          fullDescription: s.description,
          icon: s.icon,
          features: s.features,
          ctaText: "Learn More",
          ctaLink: s.ctaLink,
        }))
      : fallbackServices;

  return (
    <>
      <SEOHead meta={getSEOData("services")} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 sm:py-24 lg:py-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="container relative mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">Services</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {heroData?.headline ?? "Our Services"}
            </h1>
            <p className="mt-5 text-lg text-white/80 sm:text-xl">
              {heroData?.subheadline ?? "Complete Overseas Education Support"}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
              From the moment you dream of studying abroad to the day you land
              at your destination, Valmiki Group provides end-to-end support at
              every step. Our comprehensive services cover counseling,
              admissions, visas, test prep, scholarships, and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Go Global
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore our full range of services designed to make your overseas
              education journey seamless and successful.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted/30 py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              How We Help You
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our proven 5-step process ensures a smooth and stress-free journey
              from dream to destination.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative flex flex-col items-center text-center"
                  data-ocid={`services.process.step.${index + 1}`}
                >
                  {/* Connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-x-0 bg-border lg:block" />
                  )}

                  {/* Number badge */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <span className="font-display text-xl font-bold">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Valmiki Highlights */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose Valmiki
            </h2>
            <p className="mt-4 text-muted-foreground">
              Numbers that reflect our commitment to your success.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="group flex flex-col items-center rounded-2xl border border-border/60 bg-card p-8 text-center shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-3d"
                  data-ocid={`services.highlight.${index + 1}`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/8 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="mt-5 font-heading text-4xl font-bold text-accent">
                    {item.value}
                  </span>
                  <span className="mt-2 text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Start Your Journey Today
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
              Take the first step toward your global education dreams. Book a
              free counseling session with our expert advisors and get
              personalized guidance tailored to your goals.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/free-counseling"
                className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl hover:-translate-y-0.5"
                data-ocid="services.cta.book_counseling"
              >
                <Phone className="h-5 w-5" />
                Book Free Counseling
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                data-ocid="services.cta.contact"
              >
                <MessageCircle className="h-5 w-5" />
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
