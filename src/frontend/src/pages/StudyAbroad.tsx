import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { countries } from "@/data/countries";
import { COUNTRY_IMAGES } from "@/data/countryImages";
import { getSEOData } from "@/data/seo";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Landmark,
  Languages,
  MapPin,
  Plane,
  School,
  ScrollText,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useStudyAbroadContent } from "../hooks/useBackendContent";

const admissionSteps = [
  {
    num: 1,
    title: "Choose Country",
    desc: "Select your ideal study destination based on goals",
    icon: Globe,
  },
  {
    num: 2,
    title: "Select University",
    desc: "Shortlist universities matching your profile",
    icon: GraduationCap,
  },
  {
    num: 3,
    title: "Application",
    desc: "Submit applications with complete documentation",
    icon: FileText,
  },
  {
    num: 4,
    title: "Language Test",
    desc: "Take IELTS, PTE, or TOEFL as required",
    icon: Languages,
  },
  {
    num: 5,
    title: "Visa Application",
    desc: "Apply for student visa with expert guidance",
    icon: ClipboardCheck,
  },
  {
    num: 6,
    title: "Pre-Departure",
    desc: "Get ready with orientation and travel planning",
    icon: Plane,
  },
];

const eligibilityCards = [
  {
    icon: BookOpen,
    title: "Academic Requirements",
    desc: "Minimum 60% marks in qualifying exams",
  },
  {
    icon: Languages,
    title: "Language Proficiency",
    desc: "IELTS 6.0+ or PTE equivalent score",
  },
  {
    icon: Wallet,
    title: "Financial Proof",
    desc: "Demonstrated proof of funds for tuition & living",
  },
  {
    icon: ScrollText,
    title: "Documents",
    desc: "SOP, LOR, Transcripts, Passport & more",
  },
];

const scholarships = [
  {
    icon: Award,
    title: "Merit-based Scholarships",
    desc: "Awarded to students with outstanding academic records and achievements.",
  },
  {
    icon: Heart,
    title: "Need-based Scholarships",
    desc: "Financial aid for students demonstrating economic need.",
  },
  {
    icon: Landmark,
    title: "Government Scholarships",
    desc: "Funded by national governments for international students.",
  },
  {
    icon: School,
    title: "University Scholarships",
    desc: "Directly offered by universities to attract top talent.",
  },
  {
    icon: MapPin,
    title: "Country-specific Scholarships",
    desc: "Special grants for students targeting specific countries.",
  },
];

const costData = [
  {
    country: "USA",
    tuition: "$25,000 – $55,000",
    living: "$1,000 – $1,500",
    total: "$72,000 – $156,000",
  },
  {
    country: "Canada",
    tuition: "CAD 15,000 – 35,000",
    living: "CAD 800 – 1,200",
    total: "CAD 56,000 – 110,000",
  },
  {
    country: "UK",
    tuition: "£12,000 – £35,000",
    living: "£750 – £1,250",
    total: "£42,000 – £110,000",
  },
  {
    country: "Australia",
    tuition: "AUD 20,000 – 45,000",
    living: "AUD 1,750 – 2,100",
    total: "AUD 62,000 – 130,000",
  },
  {
    country: "Germany",
    tuition: "€0 – €3,000",
    living: "€850 – €1,000",
    total: "€20,000 – €30,000",
  },
  {
    country: "Ireland",
    tuition: "€10,000 – €25,000",
    living: "€850 – €1,150",
    total: "€36,000 – €72,000",
  },
  {
    country: "New Zealand",
    tuition: "NZD 22,000 – 35,000",
    living: "NZD 1,250 – 1,650",
    total: "NZD 64,000 – 100,000",
  },
  {
    country: "Dubai",
    tuition: "AED 40,000 – 90,000",
    living: "AED 2,500 – 4,200",
    total: "AED 220,000 – 400,000",
  },
  {
    country: "Singapore",
    tuition: "SGD 20,000 – 50,000",
    living: "SGD 850 – 1,250",
    total: "SGD 68,000 – 150,000",
  },
  {
    country: "Europe",
    tuition: "€0 – €15,000",
    living: "€650 – €1,250",
    total: "€16,000 – €52,000",
  },
];

const comparisonData = countries.map((c) => ({
  name: c.name,
  slug: c.slug,
  flag: c.flagEmoji,
  tuition: c.avgTuition,
  living: c.costOfLiving,
  work: c.workRights.split(";")[0],
  pr: c.prPathway.split(" → ")[0],
  courses: c.popularCourses.slice(0, 3).join(", "),
}));

export default function StudyAbroad() {
  const [selected, setSelected] = useState<string[]>(["usa", "canada"]);
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
  // Normalise stored order: admin short-codes → page slugs
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
  const sortedCountries = [...countries].sort((a, b) => {
    const ai = storedOrder.indexOf(a.slug);
    const bi = storedOrder.indexOf(b.slug);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
  const { data: backendContent } = useStudyAbroadContent();

  const toggleCountry = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  };

  const compared = comparisonData.filter((c) => selected.includes(c.slug));

  // Resolve headline/intro from backend — show empty while loading, no hardcoded fallbacks
  const heroHeadline = backendContent?.headline ?? "";
  const heroIntro = backendContent?.introduction ?? "";
  const intakeInfo = backendContent?.intakeInfo?.trim()
    ? backendContent.intakeInfo
    : null;
  const heroImageUrl = backendContent?.imageUrl?.trim()
    ? backendContent.imageUrl
    : null;

  // Resolve process steps
  const processStepsFromBackend =
    backendContent?.processSteps && backendContent.processSteps.length > 0
      ? [...backendContent.processSteps].sort(
          (a, b) => Number(a.order) - Number(b.order),
        )
      : null;

  // Resolve scholarships
  const backendScholarships =
    backendContent?.scholarships && backendContent.scholarships.length > 0
      ? backendContent.scholarships
      : null;

  return (
    <>
      <SEOHead meta={getSEOData("studyAbroad")} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        {heroImageUrl && (
          <img
            src={heroImageUrl}
            alt="Study Abroad"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
        )}
        {/* Decorative country flag background */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <span className="absolute left-[2%] top-[10%] rotate-12 text-8xl opacity-[0.08]">
            🇬🇧
          </span>
          <span className="absolute left-[15%] top-[60%] -rotate-6 text-7xl opacity-10">
            🇺🇸
          </span>
          <span className="absolute left-[30%] top-[8%] rotate-3 text-8xl opacity-[0.08]">
            🇨🇦
          </span>
          <span className="absolute left-[47%] top-[65%] -rotate-12 text-7xl opacity-10">
            🇦🇺
          </span>
          <span className="absolute left-[60%] top-[12%] rotate-6 text-8xl opacity-[0.08]">
            🇩🇪
          </span>
          <span className="absolute left-[74%] top-[55%] -rotate-3 text-7xl opacity-10">
            🇮🇪
          </span>
          <span className="absolute left-[85%] top-[8%] rotate-12 text-8xl opacity-[0.08]">
            🇳🇿
          </span>
          <span className="absolute left-[8%] top-[78%] -rotate-6 text-7xl opacity-10">
            🇫🇷
          </span>
          <span className="absolute left-[52%] top-[75%] rotate-3 text-8xl opacity-[0.08]">
            🇸🇬
          </span>
          <span className="absolute left-[92%] top-[68%] -rotate-12 text-7xl opacity-10">
            🇦🇪
          </span>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <nav
            className="mb-6 flex items-center gap-2 text-sm text-primary-foreground/70"
            data-ocid="studyabroad.breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-primary-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary-foreground">Study Abroad</span>
          </nav>
          <h1
            className="font-display text-4xl font-bold text-primary-foreground md:text-5xl lg:text-6xl"
            data-ocid="studyabroad.hero.headline"
          >
            {heroHeadline}
          </h1>
          <p
            className="mt-4 max-w-2xl text-lg text-primary-foreground/80 md:text-xl"
            data-ocid="studyabroad.hero.subtext"
          >
            {heroIntro}
          </p>
          {intakeInfo && (
            <p className="mt-2 max-w-2xl text-sm text-primary-foreground/70">
              {intakeInfo}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-ocid="studyabroad.hero.cta_primary"
            >
              <Link to="/free-counseling">Book Free Counseling</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="btn-outline-themed px-8 py-4"
              style={{
                borderColor: "var(--color-button)",
                color: "var(--color-button)",
              }}
              data-ocid="studyabroad.hero.cta_secondary"
            >
              <Link to="/countries">Explore Countries</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Countries Overview */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Top Study Destinations
            </h2>
            <p className="mt-3 text-muted-foreground">
              Choose from 10+ countries with world-class universities
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedCountries.map((c, i) => (
              <Link
                key={c.slug}
                to={`/countries/${c.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-lg transition-all duration-300 hover:ring-1 hover:ring-white/20"
                style={{ height: "200px" }}
                data-ocid={`studyabroad.country_card.item.${i + 1}`}
              >
                {/* Full-bleed cinematic image — local upload → flagcdn fallback */}
                {COUNTRY_IMAGES[c.slug] || c.flagCdnCode ? (
                  <img
                    src={
                      COUNTRY_IMAGES[c.slug] ||
                      `https://flagcdn.com/w320/${c.flagCdnCode}.png`
                    }
                    srcSet={
                      COUNTRY_IMAGES[c.slug]
                        ? undefined
                        : `https://flagcdn.com/w640/${c.flagCdnCode}.png 2x`
                    }
                    alt={c.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                    <span className="text-5xl">{c.flagEmoji}</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.28) 55%, rgba(0,0,0,0.08) 100%)",
                  }}
                />

                {/* Content anchored bottom */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                  <h3
                    className="font-heading text-lg font-bold text-white"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {c.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/75">{c.avgTuition}</p>
                  <p className="mt-1 text-xs text-white/60">
                    {c.popularCourses.slice(0, 2).join(" · ")}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white/80 transition-all group-hover:text-white">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Admission Process
            </h2>
            <p className="mt-3 text-muted-foreground">
              Your journey to global education in{" "}
              {processStepsFromBackend
                ? processStepsFromBackend.length
                : admissionSteps.length}{" "}
              simple steps
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-border md:block" />
            <div
              className={`grid gap-8 ${processStepsFromBackend ? `md:grid-cols-${Math.min(processStepsFromBackend.length, 6)}` : "md:grid-cols-6"}`}
            >
              {processStepsFromBackend
                ? processStepsFromBackend.map((step, i) => (
                    <div
                      key={step.id?.toString() ?? i}
                      className="relative flex flex-col items-center text-center"
                      data-ocid={`studyabroad.admission_step.item.${i + 1}`}
                    >
                      <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-card shadow-subtle transition-transform duration-300 hover:-translate-y-1">
                        <span className="absolute -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                          {i + 1}
                        </span>
                        <Globe className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  ))
                : admissionSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.num}
                        className="relative flex flex-col items-center text-center"
                        data-ocid={`studyabroad.admission_step.item.${i + 1}`}
                      >
                        <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-card shadow-subtle transition-transform duration-300 hover:-translate-y-1">
                          <span className="absolute -top-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                            {step.num}
                          </span>
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Requirements */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Eligibility Requirements
            </h2>
            <p className="mt-3 text-muted-foreground">
              Key criteria to qualify for studying abroad
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {eligibilityCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  data-ocid={`studyabroad.eligibility_card.item.${i + 1}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8A00]">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Scholarship Opportunities
            </h2>
            <p className="mt-3 text-muted-foreground">
              Funding options to make your dream affordable
            </p>
          </div>
          {backendScholarships ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {backendScholarships.map((s, i) => (
                <div
                  key={s.id?.toString() ?? i}
                  className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  data-ocid={`studyabroad.scholarship_card.item.${i + 1}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8A00]">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-secondary">
                    {s.amount}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Eligibility: {s.eligibility}
                  </p>
                  {s.deadline && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Deadline: {s.deadline}
                    </p>
                  )}
                  <Link
                    to="/free-counseling"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
                    data-ocid={`studyabroad.scholarship_card.learn_more.${i + 1}`}
                  >
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {scholarships.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                    data-ocid={`studyabroad.scholarship_card.item.${i + 1}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8A00]">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {s.desc}
                    </p>
                    <Link
                      to="/free-counseling"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
                      data-ocid={`studyabroad.scholarship_card.learn_more.${i + 1}`}
                    >
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cost Estimation Table */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Cost Estimation
            </h2>
            <p className="mt-3 text-muted-foreground">
              Approximate costs for a 2-year study program
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border shadow-subtle">
            <table
              className="w-full text-left text-sm"
              data-ocid="studyabroad.cost_table"
            >
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-6 py-4 font-display font-semibold">
                    Country
                  </th>
                  <th className="px-6 py-4 font-display font-semibold">
                    Tuition / Year
                  </th>
                  <th className="px-6 py-4 font-display font-semibold">
                    Living / Month
                  </th>
                  <th className="px-6 py-4 font-display font-semibold">
                    Total (2 Years)
                  </th>
                </tr>
              </thead>
              <tbody>
                {costData.map((row, i) => (
                  <tr
                    key={row.country}
                    className="border-b border-border transition-colors duration-200 hover:bg-muted/50"
                    data-ocid={`studyabroad.cost_table.row.${i + 1}`}
                  >
                    <td className="px-6 py-3 font-medium">{row.country}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {row.tuition}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {row.living}
                    </td>
                    <td className="px-6 py-3 font-medium">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Country Comparison Tool */}
      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Country Comparison Tool
            </h2>
            <p className="mt-3 text-muted-foreground">
              Select up to 4 countries to compare side-by-side
            </p>
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {comparisonData.map((c) => {
              const country = countries.find((x) => x.slug === c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggleCountry(c.slug)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    selected.includes(c.slug)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-foreground hover:bg-muted border border-border"
                  }`}
                  data-ocid={`studyabroad.compare.toggle.${c.slug}`}
                >
                  {country?.flagCdnCode ? (
                    <img
                      src={`https://flagcdn.com/w80/${country.flagCdnCode}.png`}
                      alt={c.name}
                      className="h-4 w-6 shrink-0 rounded-[2px] object-cover shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm">{c.flag}</span>
                  )}
                  {c.name}
                </button>
              );
            })}
          </div>

          {compared.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-border shadow-subtle">
              <table
                className="w-full text-sm"
                data-ocid="studyabroad.compare_table"
              >
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-5 py-4 text-left font-display font-semibold">
                      Criteria
                    </th>
                    {compared.map((c) => {
                      const country = countries.find((x) => x.slug === c.slug);
                      return (
                        <th
                          key={c.slug}
                          className="px-5 py-4 text-left font-display font-semibold"
                        >
                          <span className="inline-flex items-center gap-2">
                            {country?.flagCdnCode ? (
                              <img
                                src={`https://flagcdn.com/w80/${country.flagCdnCode}.png`}
                                alt={c.name}
                                className="h-4 w-6 shrink-0 rounded-[2px] object-cover shadow-sm"
                                loading="lazy"
                              />
                            ) : (
                              <span>{c.flag}</span>
                            )}
                            {c.name}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { label: "Avg. Tuition", key: "tuition" as const },
                    { label: "Living Cost", key: "living" as const },
                    { label: "Work Rights", key: "work" as const },
                    { label: "PR Pathway", key: "pr" as const },
                    { label: "Popular Courses", key: "courses" as const },
                  ].map((row) => (
                    <tr
                      key={row.label}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-foreground">
                        {row.label}
                      </td>
                      {compared.map((c) => (
                        <td
                          key={c.slug}
                          className="px-5 py-3 text-muted-foreground"
                        >
                          {c[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Begin Your Global Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Get personalized guidance from our expert counselors — completely
            free.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              data-ocid="studyabroad.cta.book_button"
            >
              <Link to="/free-counseling">Book Free Counseling</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              data-ocid="studyabroad.cta.contact_button"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
