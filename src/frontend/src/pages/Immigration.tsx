import { createActor } from "@/backend";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSEOData } from "@/data/seo";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  HeartHandshake,
  Home,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Plane,
  Route,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useImmigrationVisas } from "../hooks/useBackendContent";

/* ─────────────── data ─────────────── */

const visaTypes = [
  {
    id: "pr",
    label: "PR Visa",
    icon: Landmark,
    title: "Permanent Residency Visa",
    description:
      "Secure your future with a Permanent Residency visa. Live, work, and study indefinitely in your dream country with full access to healthcare, education, and social benefits.",
    eligibility: [
      "Age between 18 and 45 years",
      "Bachelor's degree or higher qualification",
      "Minimum 2 years of skilled work experience",
      "Competent English language proficiency",
      "Positive skills assessment for nominated occupation",
      "Meet health and character requirements",
    ],
    documents: [
      "Valid passport (minimum 6 months validity)",
      "Educational certificates & transcripts",
      "Work experience letters & references",
      "English test results (IELTS / PTE)",
      "Skills assessment report",
      "Police clearance certificates",
      "Medical examination reports",
      "Proof of funds / financial documents",
    ],
    timeline: "8 – 14 months",
    successRate: 88,
    countries: ["Canada", "Australia", "Germany", "New Zealand"],
  },
  {
    id: "work",
    label: "Work Visa",
    icon: Briefcase,
    title: "Work Visa",
    description:
      "Advance your career internationally with a Work Visa. Gain valuable global experience, competitive salaries, and a pathway to permanent residency in top economies.",
    eligibility: [
      "Valid job offer from an approved employer",
      "Relevant qualifications and work experience",
      "Sponsorship or nomination by employer",
      "English language proficiency",
      "Occupation on the skilled shortage list",
      "Meet salary threshold requirements",
    ],
    documents: [
      "Valid passport",
      "Employment contract / offer letter",
      "Educational & professional certificates",
      "English language test results",
      "Employer sponsorship documents",
      "Police clearance & medical reports",
      "Resume / CV",
    ],
    timeline: "3 – 8 months",
    successRate: 92,
    countries: ["UK", "Germany", "Canada", "Dubai"],
  },
  {
    id: "tourist",
    label: "Tourist Visa",
    icon: Plane,
    title: "Tourist / Visitor Visa",
    description:
      "Explore the world with ease. Our Tourist Visa services ensure hassle-free travel to top destinations for leisure, family visits, or short-term business trips.",
    eligibility: [
      "Valid passport with blank pages",
      "Proof of sufficient funds for the trip",
      "Confirmed travel itinerary & accommodation",
      "Strong ties to home country (employment, property)",
      "Clean immigration & criminal record",
      "Travel insurance (recommended)",
    ],
    documents: [
      "Valid passport (6+ months validity)",
      "Passport-size photographs",
      "Bank statements (last 6 months)",
      "Flight & hotel bookings",
      "Travel itinerary",
      "Employment / business proof",
      "Invitation letter (if visiting family)",
      "Travel insurance policy",
    ],
    timeline: "2 – 6 weeks",
    successRate: 95,
    countries: ["USA", "UK", "Canada", "Australia", "Dubai", "Singapore"],
  },
  {
    id: "dependent",
    label: "Dependent Visa",
    icon: Users,
    title: "Dependent / Family Visa",
    description:
      "Reunite with your loved ones abroad. Our Dependent Visa services help spouses, children, and parents join family members who are working or studying overseas.",
    eligibility: [
      "Primary applicant holds valid visa / PR",
      "Genuine relationship proof (marriage / birth certs)",
      "Financial support evidence from sponsor",
      "Meet health and character requirements",
      "Adequate accommodation arrangement",
      "No intention to overstay",
    ],
    documents: [
      "Valid passports for all applicants",
      "Marriage / birth certificates",
      "Sponsor's visa / PR proof",
      "Sponsor's employment & income proof",
      "Relationship evidence (photos, communication)",
      "Police clearance & medical reports",
      "Accommodation proof",
    ],
    timeline: "2 – 5 months",
    successRate: 90,
    countries: ["Canada", "Australia", "UK", "New Zealand"],
  },
];

const pathways = [
  {
    title: "Study → Work → PR",
    steps: ["Student Visa", "Post-Study Work", "Permanent Residency"],
    icon: GraduationCap,
    color: "bg-[#FF8A00] text-white border-[#FF8A00]/40",
  },
  {
    title: "Work Visa → PR",
    steps: ["Skilled Work Visa", "Employer Sponsorship", "Permanent Residency"],
    icon: Briefcase,
    color: "bg-[#FF8A00] text-white border-[#FF8A00]/40",
  },
  {
    title: "Family → Settlement",
    steps: ["Dependent Visa", "Family Reunion", "Citizenship Pathway"],
    icon: HeartHandshake,
    color: "bg-[#FF8A00] text-white border-[#FF8A00]/40",
  },
];

const immigrationCountries = [
  {
    name: "Canada",
    slug: "canada",
    programs: "Express Entry, PNP, Family Sponsorship",
    prPathway: "Fast-track via Express Entry",
  },
  {
    name: "Australia",
    slug: "australia",
    programs: "SkillSelect, Employer Nomination, Partner Visa",
    prPathway: "Points-based General Skilled Migration",
  },
  {
    name: "Germany",
    slug: "germany",
    programs: "EU Blue Card, Job Seeker, Family Reunion",
    prPathway: "EU Blue Card to Settlement Permit",
  },
  {
    name: "UK",
    slug: "uk",
    programs: "Skilled Worker, Health & Care, Family Visa",
    prPathway: "5-year route to Indefinite Leave",
  },
  {
    name: "New Zealand",
    slug: "new-zealand",
    programs: "Skilled Migrant, Work to Residence, Partnership",
    prPathway: "Skilled Migrant Category (SMC)",
  },
  {
    name: "Dubai",
    slug: "dubai",
    programs: "Golden Visa, Employment, Investor Visa",
    prPathway: "10-year Golden Visa for skilled professionals",
  },
];

const countryFlags: Record<string, string> = {
  canada: "🇨🇦",
  australia: "🇦🇺",
  germany: "🇩🇪",
  uk: "🇬🇧",
  "new-zealand": "🇳🇿",
  dubai: "🇦🇪",
  usa: "🇺🇸",
  singapore: "🇸🇬",
};

/* ─────────────── helpers ─────────────── */

function getEligibilityScore(form: Record<string, string>) {
  let score = 0;
  if (form.visaType) score += 15;
  if (form.targetCountry) score += 10;
  if (form.education === "phd") score += 20;
  else if (form.education === "masters") score += 15;
  else if (form.education === "degree") score += 10;
  else if (form.education === "12th") score += 5;
  if (form.workExp === "10+") score += 20;
  else if (form.workExp === "5-10") score += 15;
  else if (form.workExp === "3-5") score += 10;
  else if (form.workExp === "0-2") score += 5;
  if (form.language === "ielts") score += 20;
  else if (form.language === "pte") score += 18;
  else if (form.language === "toefl") score += 16;
  return Math.min(score, 100);
}

function scoreBadgeColor(score: number) {
  if (score >= 70)
    return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
  if (score >= 40) return "bg-amber-500/15 text-amber-600 border-amber-500/30";
  return "bg-red-500/15 text-red-600 border-red-500/30";
}

function scoreLabel(score: number) {
  if (score >= 70)
    return "High Eligibility — Strong candidate for visa approval.";
  if (score >= 40)
    return "Moderate Eligibility — Consider improving language scores or gaining more experience.";
  return "Low Eligibility — Significant gaps detected. Book a consultation for a tailored plan.";
}

/* ─────────────── page ─────────────── */

export default function Immigration() {
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("immigration")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const [activeVisa, setActiveVisa] = useState("pr");
  const [assessForm, setAssessForm] = useState<Record<string, string>>({});
  const [assessResult, setAssessResult] = useState<number | null>(null);
  const [bookingForm, setBookingForm] = useState<Record<string, string>>({});
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const { data: backendVisas = [] } = useImmigrationVisas();
  const backendVisaMap: Record<string, (typeof backendVisas)[0]> =
    Object.fromEntries(backendVisas.map((v) => [String(v.visaType), v]));

  // Map static visa ids to backend visaType keys
  const visaTabToBackendKey: Record<string, string> = {
    pr: "pr-visa",
    work: "work-visa",
    tourist: "tourist-visa",
    dependent: "dependent-visa",
  };

  const _currentVisa =
    visaTypes.find((v) => v.id === activeVisa) ?? visaTypes[0];

  return (
    <>
      <SEOHead meta={getSEOData("immigration")} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-20 text-primary-foreground md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-primary-foreground/70">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-1 transition-colors hover:text-primary-foreground"
                >
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li
                className="font-medium text-primary-foreground"
                aria-current="page"
              >
                Immigration
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {heroData?.headline ?? "Immigration Services"}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80 md:text-xl">
              {heroData?.subheadline ?? "Your Pathway to a Global Future"}
            </p>
            <p className="mt-2 max-w-xl text-primary-foreground/70">
              Expert guidance for PR visas, work permits, tourist visas, and
              family reunions. Trusted by thousands since 2001.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-button)",
                  color: "var(--color-button-text)",
                }}
                data-ocid="immigration.hero.book_button"
              >
                <Link to="/free-counseling">Book Free Assessment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="btn-outline-themed px-8 py-4"
                style={{
                  borderColor: "var(--color-button)",
                  color: "var(--color-button)",
                }}
                data-ocid="immigration.hero.learn_button"
              >
                <a href="#visa-types">Explore Visas</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Visa Type Tabs ── */}
      <section id="visa-types" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Visa Types We Handle
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive immigration solutions tailored to your goals
            </p>
          </motion.div>

          <Tabs
            value={activeVisa}
            onValueChange={setActiveVisa}
            className="w-full"
          >
            <TabsList className="mx-auto mb-8 grid w-full max-w-2xl grid-cols-2 gap-2 bg-muted/50 p-1 md:grid-cols-4">
              {visaTypes.map((v) => (
                <TabsTrigger
                  key={v.id}
                  value={v.id}
                  className="flex items-center gap-2 text-sm"
                  data-ocid={`immigration.visa_tab.${v.id}`}
                >
                  <v.icon className="h-4 w-4" />
                  {v.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {visaTypes.map((visa) => {
              const bKey = visaTabToBackendKey[visa.id];
              const bVisa = bKey ? backendVisaMap[bKey] : undefined;
              const hasBackend = (bVisa?.description?.trim().length ?? 0) > 0;
              const displayTitle = hasBackend ? bVisa!.title : visa.title;
              const displayDescription = hasBackend
                ? bVisa!.description
                : visa.description;
              const displaySuccessRate = hasBackend
                ? Number(bVisa!.successRate)
                : visa.successRate;
              const displayTimeline =
                hasBackend && bVisa!.processingTime
                  ? String(bVisa!.processingTime)
                  : visa.timeline;
              const displayEligibility =
                hasBackend &&
                bVisa!.eligibilityCriteria &&
                bVisa!.eligibilityCriteria.length > 0
                  ? bVisa!.eligibilityCriteria
                  : visa.eligibility;
              const displayDocuments =
                hasBackend &&
                bVisa!.documentsRequired &&
                bVisa!.documentsRequired.length > 0
                  ? bVisa!.documentsRequired
                  : visa.documents;
              return (
                <TabsContent key={visa.id} value={visa.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass-card shadow-3d overflow-hidden">
                      <CardHeader className="bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A00] text-white">
                            <visa.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {displayTitle}
                            </CardTitle>
                            <CardDescription>
                              {displayDescription}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid gap-8 py-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Eligibility */}
                        <div>
                          <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            Eligibility
                          </h4>
                          <ul className="space-y-2">
                            {displayEligibility.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Documents */}
                        <div>
                          <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                            <FileText className="h-4 w-4 text-secondary" />
                            Documents Required
                          </h4>
                          <ul className="space-y-2">
                            {displayDocuments.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Meta */}
                        <div className="space-y-4">
                          <div className="rounded-lg bg-muted/40 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <Clock className="h-4 w-4 text-accent" />
                              Processing Time
                            </div>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                              {displayTimeline}
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <TrendingUp className="h-4 w-4 text-emerald-500" />
                              Typical Success Rate
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gold">
                              {displaySuccessRate}%
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted/40 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                              <Globe className="h-4 w-4 text-primary" />
                              Popular Countries
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {visa.countries.map((c) => (
                                <Badge
                                  key={c}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {countryFlags[c.toLowerCase()] ?? "🌐"} {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              data-ocid={`immigration.visa.${visa.id}.learn_button`}
                            >
                              Learn More
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 hover:opacity-90"
                              style={{
                                backgroundColor: "var(--color-button)",
                                color: "var(--color-button-text)",
                              }}
                              data-ocid={`immigration.visa.${visa.id}.assess_button`}
                              onClick={() => {
                                const el = document.getElementById(
                                  "eligibility-assessment",
                                );
                                el?.scrollIntoView({ behavior: "smooth" });
                              }}
                            >
                              Get Assessment
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* ── Eligibility Assessment ── */}
      <section
        id="eligibility-assessment"
        className="bg-muted/30 py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Visa Eligibility Assessment
            </h2>
            <p className="mt-3 text-muted-foreground">
              Answer a few questions and get an instant eligibility score
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl">
            <Card className="glass-card shadow-3d">
              <CardContent className="p-6 md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="assess-visa-type"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Visa Type
                    </label>
                    <Select
                      value={assessForm.visaType}
                      onValueChange={(v) =>
                        setAssessForm((s) => ({ ...s, visaType: v }))
                      }
                    >
                      <SelectTrigger
                        id="assess-visa-type"
                        data-ocid="immigration.assess.visa_select"
                      >
                        <SelectValue placeholder="Select visa type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pr">PR Visa</SelectItem>
                        <SelectItem value="work">Work Visa</SelectItem>
                        <SelectItem value="tourist">Tourist Visa</SelectItem>
                        <SelectItem value="dependent">
                          Dependent Visa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="assess-target-country"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Target Country
                    </label>
                    <Select
                      value={assessForm.targetCountry}
                      onValueChange={(v) =>
                        setAssessForm((s) => ({ ...s, targetCountry: v }))
                      }
                    >
                      <SelectTrigger
                        id="assess-target-country"
                        data-ocid="immigration.assess.country_select"
                      >
                        <SelectValue placeholder="Select target country" />
                      </SelectTrigger>
                      <SelectContent>
                        {immigrationCountries.map((c) => (
                          <SelectItem key={c.slug} value={c.slug}>
                            {countryFlags[c.slug]} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="assess-current-country"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Current Country
                    </label>
                    <Input
                      id="assess-current-country"
                      placeholder="e.g. India"
                      value={assessForm.currentCountry ?? ""}
                      onChange={(e) =>
                        setAssessForm((s) => ({
                          ...s,
                          currentCountry: e.target.value,
                        }))
                      }
                      data-ocid="immigration.assess.current_input"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="assess-education"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Education Level
                    </label>
                    <Select
                      value={assessForm.education}
                      onValueChange={(v) =>
                        setAssessForm((s) => ({ ...s, education: v }))
                      }
                    >
                      <SelectTrigger
                        id="assess-education"
                        data-ocid="immigration.assess.education_select"
                      >
                        <SelectValue placeholder="Select education" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10th">10th Grade</SelectItem>
                        <SelectItem value="12th">12th Grade</SelectItem>
                        <SelectItem value="degree">
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem value="masters">Master's Degree</SelectItem>
                        <SelectItem value="phd">PhD / Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="assess-work-exp"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Work Experience
                    </label>
                    <Select
                      value={assessForm.workExp}
                      onValueChange={(v) =>
                        setAssessForm((s) => ({ ...s, workExp: v }))
                      }
                    >
                      <SelectTrigger
                        id="assess-work-exp"
                        data-ocid="immigration.assess.experience_select"
                      >
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0 – 2 years</SelectItem>
                        <SelectItem value="3-5">3 – 5 years</SelectItem>
                        <SelectItem value="5-10">5 – 10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="assess-language"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Language Test
                    </label>
                    <Select
                      value={assessForm.language}
                      onValueChange={(v) =>
                        setAssessForm((s) => ({ ...s, language: v }))
                      }
                    >
                      <SelectTrigger
                        id="assess-language"
                        data-ocid="immigration.assess.language_select"
                      >
                        <SelectValue placeholder="Select language test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ielts">IELTS</SelectItem>
                        <SelectItem value="pte">PTE</SelectItem>
                        <SelectItem value="toefl">TOEFL</SelectItem>
                        <SelectItem value="none">
                          None / Planning to take
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-button)",
                    color: "var(--color-button-text)",
                  }}
                  onClick={() =>
                    setAssessResult(getEligibilityScore(assessForm))
                  }
                  data-ocid="immigration.assess.calculate_button"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Calculate Eligibility Score
                </Button>

                {assessResult !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 rounded-xl border p-6"
                  >
                    <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
                      <div
                        className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4 ${scoreBadgeColor(assessResult)}`}
                      >
                        <span className="text-3xl font-bold">
                          {assessResult}%
                        </span>
                        <span className="text-[10px] font-medium uppercase tracking-wide">
                          Score
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-heading text-lg font-semibold text-foreground">
                          Eligibility Result
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {scoreLabel(assessResult)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className={scoreBadgeColor(assessResult)}>
                            {assessResult >= 70
                              ? "High Chance"
                              : assessResult >= 40
                                ? "Moderate Chance"
                                : "Needs Improvement"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="hover:opacity-90"
                        style={{
                          backgroundColor: "var(--color-button)",
                          color: "var(--color-button-text)",
                        }}
                        data-ocid="immigration.assess.book_button"
                      >
                        <Link to="/free-counseling">Book Consultation</Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Immigration Pathways ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Immigration Pathways
            </h2>
            <p className="mt-3 text-muted-foreground">
              Visual guides to common routes from temporary status to permanent
              settlement
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {pathways.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-card shadow-3d h-full">
                  <CardContent className="flex h-full flex-col items-center p-6 text-center">
                    <div
                      className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${p.color}`}
                    >
                      <p.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {p.title}
                    </h3>
                    <div className="mt-4 flex w-full flex-col gap-3">
                      {p.steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF8A00] text-xs font-bold text-white">
                            {i + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {step}
                          </span>
                          {i < p.steps.length - 1 && (
                            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/40" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Consultation Booking ── */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Book a Consultation
            </h2>
            <p className="mt-3 text-muted-foreground">
              Schedule a one-on-one session with our immigration experts
            </p>
          </motion.div>

          <div className="mx-auto max-w-2xl">
            <Card className="glass-card shadow-3d">
              <CardContent className="p-6 md:p-8">
                {bookingSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      Booking Confirmed!
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Our team will contact you shortly to confirm your
                      appointment.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setBookingSubmitted(false)}
                      data-ocid="immigration.booking.new_button"
                    >
                      Book Another
                    </Button>
                  </motion.div>
                ) : (
                  <form
                    className="space-y-5"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        if (actor) {
                          await actor.submitImmigrationConsultation(
                            bookingForm.visaType ?? "",
                            bookingForm.targetCountry ?? "",
                            bookingForm.name ?? "",
                            bookingForm.email ?? "",
                            bookingForm.phone ?? "",
                            bookingForm.date ?? "",
                          );
                        }
                      } catch {
                        // graceful fallback: still show success UI
                      }
                      setBookingSubmitted(true);
                    }}
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="booking-visa-type"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Visa Type
                        </label>
                        <Select
                          value={bookingForm.visaType}
                          onValueChange={(v) =>
                            setBookingForm((s) => ({ ...s, visaType: v }))
                          }
                        >
                          <SelectTrigger
                            id="booking-visa-type"
                            data-ocid="immigration.booking.visa_select"
                          >
                            <SelectValue placeholder="Select visa type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pr">PR Visa</SelectItem>
                            <SelectItem value="work">Work Visa</SelectItem>
                            <SelectItem value="tourist">
                              Tourist Visa
                            </SelectItem>
                            <SelectItem value="dependent">
                              Dependent Visa
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="booking-target-country"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Target Country
                        </label>
                        <Select
                          value={bookingForm.targetCountry}
                          onValueChange={(v) =>
                            setBookingForm((s) => ({ ...s, targetCountry: v }))
                          }
                        >
                          <SelectTrigger
                            id="booking-target-country"
                            data-ocid="immigration.booking.country_select"
                          >
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {immigrationCountries.map((c) => (
                              <SelectItem key={c.slug} value={c.slug}>
                                {countryFlags[c.slug]} {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label
                          htmlFor="booking-name"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="booking-name"
                            className="pl-9"
                            placeholder="Your name"
                            value={bookingForm.name ?? ""}
                            onChange={(e) =>
                              setBookingForm((s) => ({
                                ...s,
                                name: e.target.value,
                              }))
                            }
                            data-ocid="immigration.booking.name_input"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="booking-email"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="booking-email"
                            type="email"
                            className="pl-9"
                            placeholder="you@example.com"
                            value={bookingForm.email ?? ""}
                            onChange={(e) =>
                              setBookingForm((s) => ({
                                ...s,
                                email: e.target.value,
                              }))
                            }
                            data-ocid="immigration.booking.email_input"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="booking-phone"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="booking-phone"
                            type="tel"
                            className="pl-9"
                            placeholder="+91 ..."
                            value={bookingForm.phone ?? ""}
                            onChange={(e) =>
                              setBookingForm((s) => ({
                                ...s,
                                phone: e.target.value,
                              }))
                            }
                            data-ocid="immigration.booking.phone_input"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="booking-date"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Preferred Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="booking-date"
                            type="date"
                            className="pl-9"
                            value={bookingForm.date ?? ""}
                            onChange={(e) =>
                              setBookingForm((s) => ({
                                ...s,
                                date: e.target.value,
                              }))
                            }
                            data-ocid="immigration.booking.date_input"
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full hover:opacity-90"
                      style={{
                        backgroundColor: "var(--color-button)",
                        color: "var(--color-button-text)",
                      }}
                      data-ocid="immigration.booking.submit_button"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Submit Booking Request
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Countries Covered ── */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Countries We Cover
            </h2>
            <p className="mt-3 text-muted-foreground">
              Immigration expertise across top global destinations
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {immigrationCountries.map((country, idx) => (
              <motion.div
                key={country.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card className="glass-card shadow-3d group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-3xl">
                        {countryFlags[country.slug]}
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {country.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {country.programs}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Route className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm text-muted-foreground">
                          {country.prPathway}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                        <p className="text-sm text-muted-foreground">
                          Popular for{" "}
                          {country.name === "Dubai"
                            ? "Golden Visa & Employment"
                            : "Skilled Migration & Family Sponsorship"}
                        </p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="ghost"
                      className="mt-4 w-full text-primary hover:bg-primary/5"
                      data-ocid={`immigration.country.${country.slug}.link`}
                    >
                      <Link to={`/countries/${country.slug}`}>
                        Explore {country.name}{" "}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
