import { SEOHead } from "@/components/SEOHead";
import { countries } from "@/data/countries";
import { getSEOData } from "@/data/seo";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Plane,
  RotateCcw,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type VisaType = "pr" | "work" | "tourist" | "dependent";
type LanguageTest = "ielts" | "pte" | "none";
type EducationLevel =
  | "high-school"
  | "diploma"
  | "bachelors"
  | "masters"
  | "phd";

interface EligibilityResult {
  score: number;
  status: "highly-eligible" | "borderline" | "needs-improvement";
  message: string;
  recommendations: string[];
  nextSteps: string[];
}

const visaTypes: {
  value: VisaType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    value: "pr",
    label: "PR Visa",
    icon: Globe,
    description: "Permanent Residency pathway",
  },
  {
    value: "work",
    label: "Work Visa",
    icon: Briefcase,
    description: "Skilled employment abroad",
  },
  {
    value: "tourist",
    label: "Tourist Visa",
    icon: Plane,
    description: "Short-term travel & visits",
  },
  {
    value: "dependent",
    label: "Dependent Visa",
    icon: Users,
    description: "Join family overseas",
  },
];

const educationOptions: {
  value: EducationLevel;
  label: string;
  score: number;
}[] = [
  { value: "high-school", label: "High School", score: 5 },
  { value: "diploma", label: "Diploma", score: 10 },
  { value: "bachelors", label: "Bachelor's Degree", score: 20 },
  { value: "masters", label: "Master's Degree", score: 30 },
  { value: "phd", label: "PhD", score: 35 },
];

const experienceOptions = [
  { value: "0", label: "No experience", score: 0 },
  { value: "1", label: "1 year", score: 10 },
  { value: "2", label: "2 years", score: 15 },
  { value: "3", label: "3 years", score: 20 },
  { value: "5", label: "5+ years", score: 25 },
  { value: "10", label: "10+ years", score: 30 },
];

const languageOptions: { value: LanguageTest; label: string; score: number }[] =
  [
    { value: "none", label: "No test yet", score: 0 },
    { value: "pte", label: "PTE Score 50+", score: 15 },
    { value: "ielts", label: "IELTS Band 6.5+", score: 20 },
  ];

function WizardProgress({
  currentStep,
  totalSteps,
}: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s, idx) => (
          <div key={s} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  currentStep > s
                    ? "bg-secondary text-white"
                    : currentStep === s
                      ? "bg-secondary text-white ring-4 ring-secondary/20"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  currentStep >= s ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s === 1 && "Visa Type"}
                {s === 2 && "Country"}
                {s === 3 && "Details"}
                {s === 4 && "Review"}
              </span>
            </div>
            {idx < totalSteps - 1 && (
              <div className="mx-2 h-1 flex-1 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-secondary transition-all duration-500"
                  style={{ width: currentStep > s ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepTransition({
  children,
  stepKey,
}: { children: React.ReactNode; stepKey: number }) {
  return (
    <div
      key={stepKey}
      className="animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {children}
    </div>
  );
}

export default function VisaChecker() {
  const [step, setStep] = useState(1);
  const [visaType, setVisaType] = useState<VisaType | "">("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState<EducationLevel | "">("");
  const [experience, setExperience] = useState("");
  const [languageTest, setLanguageTest] = useState<LanguageTest | "">("");
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const calculateEligibility = (): EligibilityResult => {
    let score = 0;
    const recommendations: string[] = [];
    const nextSteps: string[] = [];

    // Education score
    const edu = educationOptions.find((e) => e.value === education);
    if (edu) {
      score += edu.score;
      if (edu.score < 20) {
        recommendations.push(
          "Consider pursuing a Bachelor's or Master's degree to improve eligibility.",
        );
      }
    }

    // Experience score
    const exp = experienceOptions.find((e) => e.value === experience);
    if (exp) {
      score += exp.score;
      if (exp.score < 15) {
        recommendations.push(
          "Gaining 2+ years of relevant work experience will significantly boost your score.",
        );
      }
    }

    // Language score
    const lang = languageOptions.find((l) => l.value === languageTest);
    if (lang) {
      score += lang.score;
      if (lang.score === 0) {
        recommendations.push(
          "Take an IELTS or PTE test — language proficiency is crucial for most visa types.",
        );
        nextSteps.push("Book a free IELTS/PTE assessment with our experts");
      }
    }

    // Age factor
    const ageNum = Number.parseInt(age);
    if (ageNum >= 18 && ageNum <= 29) {
      score += 15;
    } else if (ageNum >= 30 && ageNum <= 39) {
      score += 10;
    } else if (ageNum >= 40 && ageNum <= 44) {
      score += 5;
      recommendations.push(
        "Age factor slightly reduces points — strengthen other areas.",
      );
    } else {
      recommendations.push(
        "Age is a significant factor — consult our experts for alternative pathways.",
      );
    }

    // Country bonus
    if (["canada", "australia", "new-zealand"].includes(country)) {
      score += 10;
    }

    // Visa type adjustment
    if (visaType === "tourist") {
      score = Math.min(score + 20, 100);
    } else if (visaType === "dependent") {
      score = Math.min(score + 15, 100);
    }

    score = Math.min(score, 100);

    let status: EligibilityResult["status"];
    let message: string;

    if (score >= 70) {
      status = "highly-eligible";
      message = `Excellent! Your profile is highly competitive for a ${visaTypes.find((v) => v.value === visaType)?.label} to ${countries.find((c) => c.slug === country)?.name}.`;
    } else if (score >= 40) {
      status = "borderline";
      message = `Your profile shows potential for a ${visaTypes.find((v) => v.value === visaType)?.label}. With some improvements, you can strengthen your application.`;
    } else {
      status = "needs-improvement";
      message = `Your current profile needs significant strengthening for a ${visaTypes.find((v) => v.value === visaType)?.label}. Our counselors can help you build a competitive application.`;
    }

    nextSteps.push("Schedule a detailed consultation with our visa experts");
    nextSteps.push("Prepare required documentation checklist");
    if (score < 70) {
      nextSteps.push("Enroll in our IELTS/PTE coaching program");
    }
    if (!["canada", "australia", "new-zealand"].includes(country)) {
      nextSteps.push(
        "Explore alternative destination countries with favorable policies",
      );
    }

    return { score, status, message, recommendations, nextSteps };
  };

  const handleCheck = () => {
    setResult(calculateEligibility());
    setStep(5);
  };

  const resetWizard = () => {
    setStep(1);
    setVisaType("");
    setCountry("");
    setAge("");
    setEducation("");
    setExperience("");
    setLanguageTest("");
    setResult(null);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!visaType;
      case 2:
        return !!country;
      case 3:
        return !!age && !!education && !!experience && !!languageTest;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 4) {
      handleCheck();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const selectedCountry = countries.find((c) => c.slug === country);
  const selectedVisa = visaTypes.find((v) => v.value === visaType);
  const selectedEducation = educationOptions.find((e) => e.value === education);
  const selectedExperience = experienceOptions.find(
    (e) => e.value === experience,
  );
  const selectedLanguage = languageOptions.find(
    (l) => l.value === languageTest,
  );

  return (
    <>
      <SEOHead meta={getSEOData("visaChecker")} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy/90 py-16 text-white md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            Visa Eligibility Checker
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
            Check your visa eligibility instantly. Free assessment for PR, work,
            tourist & dependent visas.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          {step <= 4 && <WizardProgress currentStep={step} totalSteps={4} />}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-3d md:p-10">
            {/* Step 1: Visa Type */}
            {step === 1 && (
              <StepTransition stepKey={1}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Select Visa Type
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      What type of visa are you applying for?
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {visaTypes.map((vt) => {
                      const Icon = vt.icon;
                      return (
                        <button
                          type="button"
                          key={vt.value}
                          onClick={() => setVisaType(vt.value)}
                          className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all duration-300 ${
                            visaType === vt.value
                              ? "border-secondary bg-secondary/5 shadow-lg"
                              : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                          }`}
                          data-ocid={`visa.checker.type.${vt.value}`}
                        >
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                              visaType === vt.value
                                ? "bg-secondary text-white"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                            }`}
                          >
                            <Icon className="h-7 w-7" />
                          </div>
                          <div>
                            <span className="block font-display text-base font-semibold text-foreground">
                              {vt.label}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                              {vt.description}
                            </span>
                          </div>
                          {visaType === vt.value && (
                            <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-secondary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Step 2: Country */}
            {step === 2 && (
              <StepTransition stepKey={2}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Select Target Country
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Which country do you want to migrate to?
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {countries.map((c) => (
                      <button
                        type="button"
                        key={c.slug}
                        onClick={() => setCountry(c.slug)}
                        className={`group flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-300 ${
                          country === c.slug
                            ? "border-secondary bg-secondary/5 shadow-md"
                            : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                        }`}
                        data-ocid={`visa.checker.country.${c.slug}`}
                      >
                        <span className="text-3xl">{c.flagEmoji}</span>
                        <span className="font-medium text-foreground">
                          {c.name}
                        </span>
                        {country === c.slug && (
                          <CheckCircle className="ml-auto h-4 w-4 text-secondary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Step 3: Personal Details */}
            {step === 3 && (
              <StepTransition stepKey={3}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Personal Details
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Tell us about your background for an accurate assessment.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="age-input"
                        className="mb-2 block text-sm font-semibold text-foreground"
                      >
                        Age
                      </label>
                      <input
                        id="age-input"
                        type="number"
                        min="16"
                        max="65"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        data-ocid="visa.checker.age"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="education-select"
                        className="mb-2 block text-sm font-semibold text-foreground"
                      >
                        Highest Education
                      </label>
                      <select
                        id="education-select"
                        value={education}
                        onChange={(e) =>
                          setEducation(e.target.value as EducationLevel)
                        }
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        data-ocid="visa.checker.education"
                      >
                        <option value="">Select education level</option>
                        {educationOptions.map((e) => (
                          <option key={e.value} value={e.value}>
                            {e.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="experience-select"
                        className="mb-2 block text-sm font-semibold text-foreground"
                      >
                        Work Experience
                      </label>
                      <select
                        id="experience-select"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        data-ocid="visa.checker.experience"
                      >
                        <option value="">Select experience</option>
                        {experienceOptions.map((e) => (
                          <option key={e.value} value={e.value}>
                            {e.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="language-select"
                        className="mb-2 block text-sm font-semibold text-foreground"
                      >
                        Language Test Score
                      </label>
                      <select
                        id="language-select"
                        value={languageTest}
                        onChange={(e) =>
                          setLanguageTest(e.target.value as LanguageTest)
                        }
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        data-ocid="visa.checker.language"
                      >
                        <option value="">Select language test</option>
                        {languageOptions.map((l) => (
                          <option key={l.value} value={l.value}>
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <StepTransition stepKey={4}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Review Your Details
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Please confirm your selections before checking
                      eligibility.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl bg-muted/40 p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" /> Visa Type
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedVisa?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-lg">
                          {selectedCountry?.flagEmoji}
                        </span>{" "}
                        Country
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedCountry?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" /> Age
                      </span>
                      <span className="font-semibold text-foreground">
                        {age} years
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" /> Education
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedEducation?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" /> Experience
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedExperience?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" /> Language
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedLanguage?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Step 5: Results */}
            {step === 5 && result && (
              <StepTransition stepKey={5}>
                <div className="space-y-8">
                  {/* Score Gauge */}
                  <div className="text-center">
                    <div className="relative mx-auto h-40 w-40">
                      <svg
                        className="h-full w-full -rotate-90"
                        viewBox="0 0 100 100"
                        aria-label="Eligibility score"
                      >
                        <title>Eligibility Score</title>
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="oklch(var(--muted))"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke={
                            result.status === "highly-eligible"
                              ? "#22c55e"
                              : result.status === "borderline"
                                ? "#f59e0b"
                                : "#ef4444"
                          }
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${result.score * 2.64} ${264 - result.score * 2.64}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-heading text-4xl font-bold text-gold">
                          {result.score}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Eligibility
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      {result.status === "highly-eligible" && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-gold">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-semibold">Highly Eligible</span>
                        </div>
                      )}
                      {result.status === "borderline" && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-gold">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-semibold">
                            Borderline — Improvements Needed
                          </span>
                        </div>
                      )}
                      {result.status === "needs-improvement" && (
                        <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-gold">
                          <XCircle className="h-5 w-5" />
                          <span className="font-semibold">
                            Needs Improvement
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
                      {result.message}
                    </p>
                  </div>

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="rounded-xl bg-muted/40 p-5">
                      <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
                        Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec) => (
                          <li
                            key={rec}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="rounded-xl border border-border bg-card p-5">
                    <h3 className="mb-3 font-heading text-sm font-semibold text-foreground">
                      Next Steps
                    </h3>
                    <ul className="space-y-2">
                      {result.nextSteps.map((step) => (
                        <li
                          key={step}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetWizard}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      data-ocid="visa.checker.start_over"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start Over
                    </button>
                    <a
                      href="/free-counseling"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
                      data-ocid="visa.checker.book_consultation"
                    >
                      Book Free Consultation
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Navigation */}
            {step <= 4 && (
              <div className="mt-8 flex gap-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                    data-ocid={`visa.checker.step${step}.back`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
                  data-ocid={`visa.checker.step${step}.next`}
                >
                  {step === 4 ? "Check Eligibility" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
