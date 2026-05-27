import { SEOHead } from "@/components/SEOHead";
import { useContent } from "@/context/ContentContext";
import { getCountryBySlug } from "@/data/countries";
import { getSEOData } from "@/data/seo";
import { useCountryDetail } from "@/hooks/useBackendContent";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Globe,
  GraduationCap,
  Home,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

function Breadcrumb({ countryName }: { countryName: string }) {
  return (
    <nav className="container mx-auto px-4 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
        <li>
          <Link to="/" className="hover:text-white">
            Home
          </Link>
        </li>
        <li>/</li>
        <li>
          <Link to="/countries" className="hover:text-white">
            Countries
          </Link>
        </li>
        <li>/</li>
        <li className="font-medium text-white">{countryName}</li>
      </ol>
    </nav>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
      {children}
    </h2>
  );
}

function GlassCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card rounded-2xl p-6 shadow-subtle ${className}`}>
      {children}
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
        data-ocid="faq.toggle"
      >
        <span className="pr-4 font-medium text-foreground">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

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
};

const bustCache = (url: string) =>
  url && !url.includes("?") ? `${url}?t=${Date.now()}` : url;

export default function CountryDetail() {
  const { countrySlug } = useParams();
  const { data: backendCountry, isLoading } = useCountryDetail(
    countrySlug ?? "",
  );
  const { countriesMap } = useContent();
  const staticCountry = getCountryBySlug(countrySlug ?? "");

  // Merge backend data over static data (backend wins when non-empty)
  const hasBackend = !!backendCountry?.heroTitle;

  const country = useMemo(() => {
    if (!staticCountry) return null;
    if (!hasBackend || !backendCountry) return staticCountry;
    return {
      ...staticCountry,
      // override individual fields when backend has them
      heroSubheadline:
        backendCountry.heroSubtitle || staticCountry.heroSubheadline,
      whyStudy: backendCountry.whyStudyHere
        ? backendCountry.whyStudyHere.split("\n").filter(Boolean)
        : staticCountry.whyStudy,
      workRights: backendCountry.workRights || staticCountry.workRights,
      prPathway: backendCountry.prOpportunities || staticCountry.prPathway,
      // these pass through as-is for specialized rendering
      _backendData: backendCountry,
    } as typeof staticCountry & { _backendData: typeof backendCountry };
  }, [staticCountry, backendCountry, hasBackend]);

  // Show skeleton while loading
  if (isLoading && !staticCountry) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-md">
          <Globe className="mx-auto h-16 w-16 text-muted-foreground/40" />
          <h1 className="mt-6 font-display text-3xl font-bold text-primary">
            Country Not Found
          </h1>
          <p className="mt-3 text-muted-foreground">
            The country you are looking for does not exist in our database.
          </p>
          <Link
            to="/countries"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
            data-ocid="country_not_found.back_button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  const bc = hasBackend ? backendCountry : null;

  // FAQs: prefer backend (FAQ[]) then static
  const faqs =
    bc?.faqs && bc.faqs.length > 0
      ? bc.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : (country.faqs ?? []);

  // Scholarships: prefer backend (string[]) then static
  const scholarships =
    bc?.scholarships && bc.scholarships.length > 0
      ? bc.scholarships.map((s, i) => ({
          name: s,
          amount: "",
          description: "",
          _idx: i,
        }))
      : (country.scholarships ?? []);

  // Popular courses: prefer backend (string[]) then static
  const popularCourses =
    bc?.popularCourses && bc.popularCourses.length > 0
      ? bc.popularCourses
      : null;

  // Course salaries from static (no backend equivalent)
  const courseSalaries = country.courseSalaries ?? [];

  // Cost of living: prefer backend CostBreakdown then static object
  const costOfLivingBreakdown = bc?.costOfLiving
    ? {
        rent: bc.costOfLiving.accommodation,
        food: bc.costOfLiving.food,
        transport: bc.costOfLiving.transport,
        utilities: bc.costOfLiving.miscellaneous,
        total: bc.costOfLiving.totalMonthly,
      }
    : country.costOfLivingBreakdown;

  // Visa process: prefer backend VisaStep[] then static string[]
  const visaProcessSteps =
    bc?.visaProcess && bc.visaProcess.length > 0
      ? bc.visaProcess
          .slice()
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((s) => s.title + (s.description ? ` — ${s.description}` : ""))
      : (country.visaProcessSteps ?? []);

  // Universities: prefer backend CountryUniversity[] then static string[]
  const backendUniversities =
    bc?.universities && bc.universities.length > 0 ? bc.universities : null;

  const whyIcons = [Star, Lightbulb, ShieldCheck, Users, TrendingUp];

  // Map slug/code to Unsplash fallback hero image
  const heroImageFallbacks: Record<string, string> = {
    usa: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1280&q=85",
    us: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1280&q=85",
    uk: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1280&q=85",
    gb: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1280&q=85",
    canada:
      "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1280&q=85",
    ca: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1280&q=85",
    australia:
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1280&q=85",
    au: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1280&q=85",
    germany:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1280&q=85",
    de: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1280&q=85",
    ireland:
      "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1280&q=85",
    ie: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1280&q=85",
    "new-zealand":
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1280&q=85",
    nz: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1280&q=85",
    dubai:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1280&q=85",
    ae: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1280&q=85",
    singapore:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1280&q=85",
    sg: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1280&q=85",
    france:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&q=85",
    fr: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&q=85",
    europe:
      "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1280&q=85",
    eu: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1280&q=85",
  };

  const adminSlug = SLUG_TO_ADMIN[countrySlug ?? ""] ?? countrySlug ?? "";
  const heroImage =
    (bc?.heroImageUrl?.trim() ? bustCache(bc.heroImageUrl) : null) ??
    (countriesMap[adminSlug]?.heroImage?.trim()
      ? bustCache(countriesMap[adminSlug].heroImage)
      : null) ??
    heroImageFallbacks[(countrySlug ?? "").toLowerCase()] ??
    "";

  return (
    <>
      <SEOHead meta={getSEOData("countries")} />

      {/* Hero */}
      <section
        key={heroImage}
        className="relative min-h-[500px] overflow-hidden py-16 text-white lg:min-h-[580px] lg:py-24"
        style={
          heroImage
            ? {
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Dark overlay gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: heroImage
              ? "linear-gradient(to right, rgba(11,31,58,0.92) 0%, rgba(11,31,58,0.7) 50%, rgba(11,31,58,0.35) 100%)"
              : "linear-gradient(135deg, #0b1f3a 0%, #0b1f3a 100%)",
          }}
        />
        {/* Subtle decorative blobs (only when no image) */}
        {!heroImage && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-secondary blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
          </div>
        )}
        {/* Decorative world flag background — all 10 destinations */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
          aria-hidden="true"
        >
          <span className="absolute right-[3%] top-[8%] rotate-12 text-8xl opacity-[0.12] lg:text-9xl">
            {country.flagEmoji}
          </span>
          <span className="absolute left-[5%] top-[15%] -rotate-6 text-7xl opacity-[0.08]">
            🇬🇧
          </span>
          <span className="absolute left-[20%] top-[65%] rotate-3 text-6xl opacity-[0.07]">
            🇺🇸
          </span>
          <span className="absolute left-[38%] top-[10%] -rotate-3 text-6xl opacity-[0.07]">
            🇨🇦
          </span>
          <span className="absolute left-[55%] top-[70%] rotate-6 text-6xl opacity-[0.07]">
            🇦🇺
          </span>
          <span className="absolute left-[68%] top-[20%] -rotate-12 text-6xl opacity-[0.07]">
            🇩🇪
          </span>
          <span className="absolute left-[80%] top-[60%] rotate-3 text-6xl opacity-[0.07]">
            🇮🇪
          </span>
          <span className="absolute left-[10%] top-[80%] -rotate-6 text-6xl opacity-[0.07]">
            🇫🇷
          </span>
          <span className="absolute left-[45%] top-[80%] rotate-12 text-6xl opacity-[0.07]">
            🇸🇬
          </span>
          <span className="absolute left-[88%] top-[40%] -rotate-3 text-6xl opacity-[0.07]">
            🇦🇪
          </span>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <Breadcrumb countryName={country.name} />
          <div className="mt-6 flex flex-col items-start gap-6 text-left">
            <span className="text-6xl leading-none drop-shadow-lg lg:text-7xl">
              {country.flagEmoji}
            </span>
            <div className="flex-1">
              <h1 className="font-display text-4xl font-bold drop-shadow-sm md:text-5xl lg:text-6xl">
                {bc?.heroTitle?.trim()
                  ? bc.heroTitle
                  : `Study in ${country.name}`}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/85">
                {bc?.heroSubtitle?.trim()
                  ? bc.heroSubtitle
                  : country.heroSubheadline}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  {(countriesMap[adminSlug]?.visaSuccessRate
                    ? countriesMap[adminSlug]?.visaSuccessRate
                    : country.visaSuccessRate) ?? ""}{" "}
                  Visa Success
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-accent" />
                  {country.visaProcessingTime}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-accent" />
                  {country.intakeMonths[0]}
                </span>
              </div>
              <Link
                to="/free-counseling"
                className="mt-6 inline-flex shrink-0 rounded-xl bg-secondary px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl"
                data-ocid="country.hero.book_counseling"
              >
                Book Free Counseling
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-16 lg:col-span-2">
            {/* Why Study Here */}
            <section>
              <SectionTitle>Why Study in {country.name}?</SectionTitle>
              {bc?.whyStudyHere?.trim() ? (
                <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 leading-relaxed text-muted-foreground">
                  {bc.whyStudyHere
                    .split("\n")
                    .filter(Boolean)
                    .map((line) => (
                      <p key={line.slice(0, 30)} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {country.whyStudy.map((point, i) => {
                    const Icon = whyIcons[i % whyIcons.length];
                    return (
                      <GlassCard key={point} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                          <Icon className="h-5 w-5 text-secondary" />
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">
                          {point}
                        </p>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Top Universities */}
            <section>
              <SectionTitle>Top Universities</SectionTitle>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {backendUniversities
                  ? backendUniversities.map((uni) => (
                      <GlassCard
                        key={String(uni.id)}
                        className="flex items-center gap-4"
                      >
                        {uni.logoUrl ? (
                          <img
                            src={uni.logoUrl}
                            alt={uni.name}
                            className="h-10 w-10 shrink-0 rounded-xl object-contain"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {uni.ranking ? `#${uni.ranking} ` : ""}
                            {uni.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Tuition: {uni.tuition || country.avgTuition}
                          </p>
                        </div>
                      </GlassCard>
                    ))
                  : country.topUniversities.slice(0, 6).map((uni) => (
                      <GlassCard key={uni} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {uni}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg. Fees: {country.avgTuition}
                          </p>
                        </div>
                      </GlassCard>
                    ))}
              </div>
            </section>

            {/* Cost of Living */}
            <section>
              <SectionTitle>Cost of Living Breakdown</SectionTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Estimated monthly expenses for students in {country.name}
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-border/60 shadow-subtle">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-foreground">
                        Expense
                      </th>
                      <th className="px-6 py-3 text-right font-semibold text-foreground">
                        Monthly Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    <tr className="bg-card">
                      <td className="flex items-center gap-2 px-6 py-3">
                        <Home className="h-4 w-4 text-primary" /> Rent
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {costOfLivingBreakdown?.rent ?? "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-card">
                      <td className="flex items-center gap-2 px-6 py-3">
                        <DollarSign className="h-4 w-4 text-secondary" /> Food
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {costOfLivingBreakdown?.food ?? "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-card">
                      <td className="flex items-center gap-2 px-6 py-3">
                        <MapPin className="h-4 w-4 text-accent" /> Transport
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {costOfLivingBreakdown?.transport ?? "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-card">
                      <td className="flex items-center gap-2 px-6 py-3">
                        <Lightbulb className="h-4 w-4 text-primary" /> Utilities
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {costOfLivingBreakdown?.utilities ?? "N/A"}
                      </td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="px-6 py-3 font-bold text-primary">
                        Total Estimated
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-primary">
                        {costOfLivingBreakdown?.total ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Visa Process */}
            <section>
              <SectionTitle>Visa Process</SectionTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Typical processing time: {country.visaProcessingTime}
              </p>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                  {visaProcessSteps.map((step, i) => (
                    <div
                      key={step}
                      className="relative mb-6 flex items-start gap-4 last:mb-0"
                    >
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      <GlassCard className="flex-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary" />
                          <span className="font-medium text-foreground">
                            {step}
                          </span>
                        </div>
                      </GlassCard>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Scholarships */}
            <section>
              <SectionTitle>Scholarship Opportunities</SectionTitle>
              {bc?.scholarships && bc.scholarships.length > 0 ? (
                <ul className="mt-6 space-y-2">
                  {bc.scholarships.map((s) => (
                    <li key={s.slice(0, 30)} className="flex items-start gap-3">
                      <Award className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-sm text-foreground">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {scholarships.map((sch) => (
                    <GlassCard key={sch.name} className="flex flex-col">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <h4 className="mt-3 font-display text-base font-bold text-foreground">
                        {sch.name}
                      </h4>
                      <p className="mt-1 text-sm font-semibold text-secondary">
                        {sch.amount}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {sch.description}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>

            {/* Popular Courses */}
            <section>
              <SectionTitle>Popular Courses</SectionTitle>
              {popularCourses ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {popularCourses.map((course) => (
                    <GlassCard key={course} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10">
                        <GraduationCap className="h-4 w-4 text-gold" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {course}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {courseSalaries.map((cs) => (
                    <GlassCard key={cs.course} className="flex flex-col">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                        <GraduationCap className="h-5 w-5 text-gold" />
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-foreground">
                        {cs.course}
                      </h4>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 text-accent" />
                        Avg. Salary:{" "}
                        <span className="font-semibold text-foreground">
                          {cs.avgSalary}
                        </span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </section>

            {/* Work Rights */}
            <section>
              <SectionTitle>Work Rights & PR Pathway</SectionTitle>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <GlassCard className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15">
                    <Briefcase className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">
                      Work Rights
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {bc?.workRights?.trim()
                        ? bc.workRights
                        : country.workRights}
                    </p>
                  </div>
                </GlassCard>
                <GlassCard className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">
                      PR Pathway
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {bc?.prOpportunities?.trim()
                        ? bc.prOpportunities
                        : country.prPathway}
                    </p>
                  </div>
                </GlassCard>
              </div>
            </section>

            {/* FAQs */}
            {faqs.length > 0 && (
              <section>
                <SectionTitle>Frequently Asked Questions</SectionTitle>
                <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-subtle">
                  {faqs.map((faq) => (
                    <FAQItem
                      key={faq.question}
                      question={faq.question}
                      answer={faq.answer}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <GlassCard>
              <h3 className="font-heading text-lg font-bold text-primary">
                Quick Facts
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Average Tuition
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {country.avgTuition}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Home className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Cost of Living
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {country.costOfLiving}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Visa Processing
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {country.visaProcessingTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Work Rights</p>
                    <p className="text-sm font-medium text-foreground">
                      {country.workRights}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">PR Pathway</p>
                    <p className="text-sm font-medium text-foreground">
                      {country.prPathway}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Intake Months
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {country.intakeMonths.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 p-6 text-white shadow-lg">
              <h3 className="font-heading text-lg font-bold">
                Need Help Deciding?
              </h3>
              <p className="mt-2 text-sm text-white/80">
                Our counselors can guide you through every step of studying in{" "}
                {country.name}.
              </p>
              <Link
                to="/free-counseling"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-white/90"
                data-ocid="country.sidebar.book_counseling"
              >
                Book Free Counseling
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/90 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Start Your Journey to {country.name}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Let Valmiki Group guide you from application to arrival. Book your
            free counseling session today.
          </p>
          <Link
            to="/free-counseling"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl"
            data-ocid="country.bottom_cta.book_counseling"
          >
            Book Free Counseling
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </section>
    </>
  );
}
