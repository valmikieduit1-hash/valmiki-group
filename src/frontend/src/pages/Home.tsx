import AnimatedCounter from "@/components/AnimatedCounter";
import { SEOHead } from "@/components/SEOHead";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import UniversityMarquee from "@/components/UniversityMarquee";
import { useContent } from "@/context/ContentContext";
import { countries as staticCountries } from "@/data/countries";
import { COUNTRY_IMAGES } from "@/data/countryImages";
import { getSEOData } from "@/data/seo";
import { services } from "@/data/services";
import {
  useCountries,
  useEvents,
  useServices,
  useTestimonials,
} from "@/hooks/useBackendContent";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { Link } from "react-router-dom";

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

const buildWhyChooseItems = (
  yearsExp: string,
  uniPartners: string,
  visaRate: string,
  students: string,
) => [
  {
    icon: Calendar,
    title: `${yearsExp || "24+"} Years Experience`,
    desc: "Two decades of trusted guidance",
  },
  {
    icon: Users,
    title: "Expert Counselors",
    desc: "Certified professionals worldwide",
  },
  {
    icon: CheckCircle2,
    title: "End-to-End Support",
    desc: "From dream to destination",
  },
  {
    icon: Globe,
    title: "Global University Network",
    desc: `${uniPartners || "350+"} partner institutions`,
  },
  {
    icon: TrendingUp,
    title: "Fast Visa Processing",
    desc: "Streamlined documentation",
  },
  {
    icon: Star,
    title: "Personalized Guidance",
    desc: "Tailored to your profile",
  },
  {
    icon: Award,
    title: "High Visa Success Rate",
    desc: `${visaRate || "93%"} approval record`,
  },
  {
    icon: Phone,
    title: "Trusted by Thousands",
    desc: `${students || "1 Lakh+"} happy students`,
  },
];

const events = [
  {
    title: "USA Education Fair 2024",
    date: "March 15, 2024",
    location: "Secunderabad HQ",
    type: "Education Fair",
  },
  {
    title: "Canada Spot Assessment",
    date: "March 22, 2024",
    location: "Secunderabad HQ",
    type: "Spot Assessment",
  },
  {
    title: "UK University Webinar",
    date: "April 5, 2024",
    location: "Online",
    type: "Webinar",
  },
  {
    title: "Australia Admission Day",
    date: "April 12, 2024",
    location: "Jubilee Hills Branch",
    type: "Admission Event",
  },
];

export default function Home() {
  const { heroContent, homeSections: ctxHomeSections } = useContent();
  const { data: backendServices } = useServices();
  const { data: backendTestimonials } = useTestimonials();
  const { data: backendEvents } = useEvents();
  const { data: backendCountries } = useCountries();
  // Sort countries by admin-configured order stored in localStorage
  const DEFAULT_SLUG_ORDER = [
    "us",
    "ca",
    "gb",
    "au",
    "de",
    "ie",
    "nz",
    "ae",
    "sg",
    "eu",
    "fr",
  ];
  const rawStoredOrder: string[] = (() => {
    try {
      return (
        JSON.parse(localStorage.getItem("valmikiCountryOrder") || "null") ||
        DEFAULT_SLUG_ORDER
      );
    } catch {
      return DEFAULT_SLUG_ORDER;
    }
  })();

  // Map admin short-codes → page slugs so ordering works regardless of which form is stored
  const adminCodeToSlug: Record<string, string> = {
    us: "usa",
    ca: "canada",
    gb: "uk",
    au: "australia",
    de: "germany",
    ie: "ireland",
    ae: "dubai",
    nz: "new-zealand",
    sg: "singapore",
    fr: "france",
    eu: "europe",
  };
  const storedOrder: string[] = rawStoredOrder.map(
    (code) => adminCodeToSlug[code] ?? code,
  );

  // Stable refs: never fall back to empty string — keep last known good value
  const lastHeroRef = React.useRef(heroContent);
  if (heroContent) lastHeroRef.current = heroContent;
  const stableHero = lastHeroRef.current;

  const whyChooseItems = buildWhyChooseItems(
    stableHero?.yearsExperience ?? "",
    stableHero?.universityPartnerships ?? "",
    stableHero?.visaSuccessRate ?? "",
    stableHero?.studentsGuided ?? "",
  );

  const heroSubheadline = stableHero?.subheadline ?? "";

  const heroStats = [
    {
      value: stableHero?.studentsGuided ?? "",
      label: "Students Guided",
      icon: Users,
    },
    {
      value: stableHero?.universityPartnerships ?? "",
      label: "University Partners",
      icon: GraduationCap,
    },
    {
      value: stableHero?.yearsExperience ?? "",
      label: "Years Experience",
      icon: Calendar,
    },
    {
      value: stableHero?.visaSuccessRate ?? "",
      label: "Visa Success Rate",
      icon: TrendingUp,
    },
  ];

  const displayServices: Array<{
    id: string;
    title: string;
    shortDescription: string;
    icon: string;
    ctaLink: string;
    ctaText: string;
  }> =
    backendServices && backendServices.length > 0
      ? backendServices.map((s) => ({
          id: String(s.id),
          title: s.name,
          shortDescription: s.description,
          icon: s.icon,
          ctaLink: s.ctaLink,
          ctaText: "Learn More",
        }))
      : services.map((s) => ({
          id: s.id,
          title: s.title,
          shortDescription: s.shortDescription,
          icon: s.icon,
          ctaLink: s.ctaLink,
          ctaText: s.ctaText,
        }));

  const displayEvents: Array<{
    title: string;
    date: string;
    location: string;
    type: string;
  }> =
    backendEvents && backendEvents.length > 0
      ? backendEvents.map((e) => ({
          title: e.title,
          date: e.date,
          location: e.location,
          type: "Event",
        }))
      : events;

  const serviceColors = [
    "from-[#FF8A00] to-[#FFC247]",
    "from-[#0B1F3A] to-[#1a4080]",
    "from-[#FFC247] to-[#FF8A00]",
    "from-[#1a4080] to-[#0B1F3A]",
    "from-[#FF8A00] to-[#e65c00]",
    "from-[#FFC247] to-[#FF8A00]",
    "from-[#0B1F3A] to-[#2d5fa6]",
    "from-[#FF8A00] to-[#FFC247]",
  ];

  return (
    <>
      <SEOHead meta={getSEOData("home")} />

      {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Full-screen background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-main1.png"
            alt="Global Education"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Subtle left-side gradient overlay for text readability */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(11,31,58,0.82) 0%, rgba(11,31,58,0.55) 40%, rgba(11,31,58,0.15) 65%, transparent 100%)",
          }}
        />

        {/* Bottom gradient for stat badges area */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[1] h-48"
          style={{
            background:
              "linear-gradient(to top, rgba(11,31,58,0.75) 0%, transparent 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 py-24">
          <div className="w-full lg:w-3/5 xl:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="section-badge"
                style={{ background: "rgba(255,138,0,0.22)", color: "#FFC247" }}
              >
                <Globe className="h-3 w-3" />
                Overseas Education & Immigration Experts
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display leading-tight text-white"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.25rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              Transform Your <span className="text-[#FF8A00]">Future</span> with
              <br className="hidden sm:block" /> Global{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#FFC247,#FF8A00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Education
              </span>{" "}
              Opportunities
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 font-body leading-relaxed text-white/85"
              style={{
                fontWeight: 300,
                fontSize: "1.125rem",
                maxWidth: "560px",
                textShadow: "0 1px 10px rgba(0,0,0,0.25)",
              }}
            >
              {heroSubheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/free-counseling"
                className="btn-primary animate-glow-pulse"
                data-ocid="home.hero.book_counseling"
              >
                <Phone className="h-4 w-4" />
                Book Free Counseling
              </Link>
              <Link
                to="/countries"
                className="btn-outline"
                data-ocid="home.hero.explore_countries"
              >
                <Globe className="h-4 w-4" />
                Explore Countries
              </Link>
            </motion.div>
          </div>

          {/* Floating stat badges — positioned at bottom of hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-auto pt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 w-full max-w-4xl"
          >
            {heroStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="floating-card p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <div className="flex justify-center mb-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(255,138,0,0.25)" }}
                    >
                      <Icon className="h-4 w-4 text-[#FFC247]" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-3xl font-bold text-white md:text-4xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm font-medium text-white/70">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ SERVICES ═══════════════════════════════ */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <span className="section-badge">Our Services</span>
            <h2 className="section-heading">
              Comprehensive <span className="gradient-text">Support</span> for
              Your Journey
            </h2>
            <p className="section-subheading text-center mx-auto">
              End-to-end guidance for every step of your global education
              adventure
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayServices.map((service, index) => {
              const Icon = iconMap[service.icon] || GraduationCap;
              const colorClass = serviceColors[index % serviceColors.length];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="premium-card group flex flex-col overflow-hidden"
                  data-ocid={`home.services.card.${index + 1}`}
                >
                  {/* Colored top bar */}
                  <div
                    className={`h-1 w-full bg-gradient-to-r ${colorClass}`}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ background: "rgba(255,138,0,0.1)" }}
                    >
                      <Icon className="h-6 w-6 text-[#FF8A00]" />
                    </div>
                    <h3
                      className="mt-4 font-heading"
                      style={{
                        fontSize: "1.0625rem",
                        fontWeight: 700,
                        color: "#0B1F3A",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#333333] line-clamp-3">
                      {service.shortDescription}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link
                        to={service.ctaLink}
                        className="btn-outline-navy"
                        data-ocid={`home.services.card.${index + 1}.cta`}
                      >
                        Learn More
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ COUNTRIES ═══════════════════════════════ */}
      <section style={{ background: "#f8f9fc" }} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <span className="section-badge">Study Destinations</span>
            <h2 className="section-heading">
              Your Dream <span className="gradient-text">Country</span> Awaits
            </h2>
            <p className="section-subheading text-center mx-auto">
              Explore top global destinations for world-class education and
              career opportunities
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {(backendCountries && backendCountries.length > 0
              ? backendCountries.map((country) => {
                  const staticData = staticCountries.find(
                    (s) => s.slug === country.slug,
                  );
                  return {
                    slug: country.slug,
                    name: staticData?.name ?? country.slug,
                    flagCdnCode: staticData?.flagCdnCode ?? null,
                    flagEmoji: staticData?.flagEmoji ?? "🌍",
                    visaSuccessRate: country.visaSuccessRate,
                    tuition: country.tuition,
                  };
                })
              : staticCountries.map((country) => ({
                  slug: country.slug,
                  name: country.name,
                  flagCdnCode: country.flagCdnCode ?? null,
                  flagEmoji: country.flagEmoji,
                  visaSuccessRate: country.visaSuccessRate,
                  tuition: country.avgTuition,
                }))
            )
              .sort((a, b) => {
                const ai = storedOrder.indexOf(a.slug);
                const bi = storedOrder.indexOf(b.slug);
                return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
              })

              .map((country, index) => (
                <motion.div
                  key={country.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                >
                  <Link
                    to={`/countries/${country.slug}`}
                    className="group relative block overflow-hidden rounded-xl border border-white/10 shadow-lg transition-all duration-300 hover:ring-1 hover:ring-white/20"
                    style={{ height: "220px" }}
                    data-ocid={`home.country.card.${country.slug}`}
                  >
                    {/* Cinematic full-bleed image — local upload → flagcdn fallback */}
                    {COUNTRY_IMAGES[country.slug] || country.flagCdnCode ? (
                      <img
                        src={
                          COUNTRY_IMAGES[country.slug] ||
                          `https://flagcdn.com/w640/${country.flagCdnCode}.png`
                        }
                        alt={country.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0B1F3A]">
                        <span className="text-6xl">{country.flagEmoji}</span>
                      </div>
                    )}

                    {/* Cinematic gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.10) 100%)",
                      }}
                    />

                    {/* Content anchored to bottom */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
                      <h3
                        className="font-display text-base font-bold text-white"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
                      >
                        {country.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                          <TrendingUp className="h-2.5 w-2.5 text-green-300" />
                          {country.visaSuccessRate}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] font-medium text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        Explore →
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ WHY CHOOSE US ═══════════════════════════════ */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-heading">
              Why <span className="gradient-text">Valmiki Group</span> Leads the
              Way
            </h2>
            <p className="section-subheading text-center mx-auto">
              {heroContent?.yearsExperience ?? ""} years of excellence,
              thousands of student success stories, and a global network
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(() => {
              const displayWhyChooseItems = whyChooseItems.map((item, idx) => ({
                ...item,
                title:
                  ctxHomeSections?.whyChooseUsPoints?.[idx]?.title ||
                  item.title,
                desc:
                  ctxHomeSections?.whyChooseUsPoints?.[idx]?.description ||
                  item.desc,
              }));
              return displayWhyChooseItems;
            })().map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group relative flex flex-col rounded-2xl bg-white p-7 shadow-subtle border border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-b-2 overflow-hidden"
                  style={{
                    boxShadow: "0 2px 12px rgba(11,31,58,0.06)",
                    borderBottomColor: "transparent",
                  }}
                  data-ocid={`home.why.item.${index + 1}`}
                >
                  {/* Bottom orange border on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF8A00] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF8A00]">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3
                    className="mt-5 font-heading"
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#0B1F3A",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#333333]">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
      <section style={{ background: "#f8f9fc" }} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <span className="section-badge">Success Stories</span>
            <h2 className="section-heading">
              Students Who{" "}
              <span className="gradient-text">Changed Their Lives</span>
            </h2>
            <p className="section-subheading text-center mx-auto">
              Real students, real results — hear from those who trusted us with
              their future
            </p>
          </motion.div>
          <div className="mt-14">
            <TestimonialCarousel items={backendTestimonials} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 text-center"
          >
            <Link
              to="/success-stories"
              className="btn-primary"
              data-ocid="home.testimonials.more_stories"
            >
              Read More Stories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ UNIVERSITY PARTNERS ═══════════════════════════════ */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <span className="section-badge">Our Partners</span>
            <h2 className="section-heading">
              Trusted at{" "}
              <span className="gradient-text">350+ Universities</span>
            </h2>
            <p className="section-subheading text-center mx-auto">
              Our students are accepted at the world's most prestigious
              institutions
            </p>
          </motion.div>
          <UniversityMarquee />
        </div>
      </section>

      {/* ═══════════════════════════════ EVENTS ═══════════════════════════════ */}
      <section style={{ background: "#f8f9fc" }} className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center flex flex-col items-center"
          >
            <span className="section-badge">Events & Webinars</span>
            <h2 className="section-heading">
              Upcoming <span className="gradient-text">Education Events</span>
            </h2>
            <p className="section-subheading text-center mx-auto">
              Join our education fairs, spot assessments, and university
              webinars
            </p>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="premium-card p-6 flex flex-col"
                data-ocid={`home.event.${index + 1}.card`}
              >
                <span
                  className="self-start rounded-full px-3 py-1 text-xs font-bold"
                  style={
                    index % 2 === 0
                      ? { background: "rgba(255,138,0,0.12)", color: "#FF8A00" }
                      : {
                          background: "rgba(255,194,71,0.18)",
                          color: "#c67e00",
                        }
                  }
                >
                  {event.type}
                </span>
                <h3
                  className="mt-4 font-heading"
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#0B1F3A",
                  }}
                >
                  {event.title}
                </h3>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#555555]">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-[#FF8A00]" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#555555]">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-[#FF8A00]" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-auto pt-5">
                  <Link
                    to="/contact"
                    className="btn-primary"
                    style={{ padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}
                    data-ocid={`home.event.${index + 1}.register`}
                  >
                    Register Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ CTA BANNER ═══════════════════════════════ */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{
          background:
            "linear-gradient(135deg, #0B1F3A 0%, #1a3366 45%, #FF8A00 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -left-20 h-80 w-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "#FFC247" }}
        />
        <div
          className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "#FF8A00" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "#ffffff" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="section-badge"
              style={{ background: "rgba(255,255,255,0.15)", color: "#FFC247" }}
            >
              Get Started Today
            </span>
            <h2
              className="mt-5 font-display text-white"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Your Global Career{" "}
              <span className="text-[#FFC247]">Starts Here</span>
            </h2>
            <p
              className="mx-auto mt-5 font-body text-white/80 leading-relaxed"
              style={{ fontSize: "1.125rem", maxWidth: "540px" }}
            >
              Take the first step toward your global education dreams. Book a
              free counseling session with our expert advisors today.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/free-counseling"
                className="btn-ghost"
                data-ocid="home.cta.book_counseling"
              >
                <Phone className="h-5 w-5" />
                {ctxHomeSections?.ctaBannerButtonText ??
                  "Book Your Free Counseling Session"}
              </Link>
              <Link
                to="/contact"
                className="btn-outline"
                data-ocid="home.cta.contact"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
