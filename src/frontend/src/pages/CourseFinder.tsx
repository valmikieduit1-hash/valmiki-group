import { SEOHead } from "@/components/SEOHead";
import { countries } from "@/data/countries";
import { getSEOData } from "@/data/seo";
import {
  ArrowUpDown,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cpu,
  DollarSign,
  Filter,
  GraduationCap,
  HeartPulse,
  MapPin,
  Palette,
  RotateCcw,
  Scale,
  Search,
  Sprout,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

type FieldOfStudy =
  | "engineering"
  | "business"
  | "medicine"
  | "cs"
  | "architecture"
  | "law"
  | "arts"
  | "social"
  | "agriculture"
  | "nursing";

type Duration = "1" | "2" | "3";
type SortBy = "cost" | "duration" | "popularity";

interface CourseResult {
  id: string;
  name: string;
  university: string;
  country: string;
  duration: string;
  tuition: string;
  tuitionNum: number;
  durationNum: number;
  level: string;
  field: FieldOfStudy;
  workRights: string;
  hasScholarship: boolean;
  popularity: number;
}

const fieldsOfStudy: {
  value: FieldOfStudy;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "engineering", label: "Engineering", icon: Building2 },
  { value: "business", label: "Business / MBA", icon: Briefcase },
  { value: "medicine", label: "Medicine", icon: Stethoscope },
  { value: "cs", label: "Computer Science", icon: Cpu },
  { value: "architecture", label: "Architecture", icon: Building2 },
  { value: "law", label: "Law", icon: Scale },
  { value: "arts", label: "Arts & Design", icon: Palette },
  { value: "social", label: "Social Sciences", icon: Users },
  { value: "agriculture", label: "Agriculture", icon: Sprout },
  { value: "nursing", label: "Nursing", icon: HeartPulse },
];

const mockCourses: CourseResult[] = [
  {
    id: "1",
    name: "MS in Computer Science",
    university: "University of Texas at Dallas",
    country: "usa",
    duration: "2 years",
    tuition: "$35,000/year",
    tuitionNum: 35000,
    durationNum: 2,
    level: "masters",
    field: "cs",
    workRights: "OPT up to 3 years",
    hasScholarship: true,
    popularity: 95,
  },
  {
    id: "2",
    name: "MBA",
    university: "University of Toronto",
    country: "canada",
    duration: "2 years",
    tuition: "CAD 55,000/year",
    tuitionNum: 41000,
    durationNum: 2,
    level: "masters",
    field: "business",
    workRights: "PGWP up to 3 years",
    hasScholarship: true,
    popularity: 92,
  },
  {
    id: "3",
    name: "MSc Data Science",
    university: "University of Edinburgh",
    country: "uk",
    duration: "1 year",
    tuition: "£28,000",
    tuitionNum: 35000,
    durationNum: 1,
    level: "masters",
    field: "cs",
    workRights: "Graduate Visa 2 years",
    hasScholarship: false,
    popularity: 88,
  },
  {
    id: "4",
    name: "BEng Mechanical Engineering",
    university: "TU Munich",
    country: "germany",
    duration: "3 years",
    tuition: "€0 (public)",
    tuitionNum: 0,
    durationNum: 3,
    level: "bachelors",
    field: "engineering",
    workRights: "18-month job seeker visa",
    hasScholarship: true,
    popularity: 85,
  },
  {
    id: "5",
    name: "MS in Artificial Intelligence",
    university: "University of Melbourne",
    country: "australia",
    duration: "2 years",
    tuition: "AUD 42,000/year",
    tuitionNum: 28000,
    durationNum: 2,
    level: "masters",
    field: "cs",
    workRights: "PSW 2–4 years",
    hasScholarship: true,
    popularity: 90,
  },
  {
    id: "6",
    name: "MSc Biotechnology",
    university: "Trinity College Dublin",
    country: "ireland",
    duration: "1 year",
    tuition: "€20,000",
    tuitionNum: 22000,
    durationNum: 1,
    level: "masters",
    field: "medicine",
    workRights: "2-year stay-back",
    hasScholarship: false,
    popularity: 78,
  },
  {
    id: "7",
    name: "BBA",
    university: "SP Jain School of Global Management",
    country: "singapore",
    duration: "3 years",
    tuition: "SGD 35,000/year",
    tuitionNum: 26000,
    durationNum: 3,
    level: "bachelors",
    field: "business",
    workRights: "Part-time work permitted",
    hasScholarship: true,
    popularity: 82,
  },
  {
    id: "8",
    name: "MBA",
    university: "University of Birmingham Dubai",
    country: "dubai",
    duration: "1 year",
    tuition: "AED 80,000",
    tuitionNum: 22000,
    durationNum: 1,
    level: "masters",
    field: "business",
    workRights: "Full-time internship options",
    hasScholarship: false,
    popularity: 75,
  },
  {
    id: "9",
    name: "MBBS",
    university: "University of Auckland",
    country: "new-zealand",
    duration: "6 years",
    tuition: "NZD 35,000/year",
    tuitionNum: 21000,
    durationNum: 6,
    level: "bachelors",
    field: "medicine",
    workRights: "20 hrs/week during term",
    hasScholarship: true,
    popularity: 80,
  },
  {
    id: "10",
    name: "MSc Environmental Science",
    university: "ETH Zurich",
    country: "europe",
    duration: "2 years",
    tuition: "CHF 1,500/semester",
    tuitionNum: 3500,
    durationNum: 2,
    level: "masters",
    field: "agriculture",
    workRights: "Varies by country",
    hasScholarship: true,
    popularity: 72,
  },
  {
    id: "11",
    name: "BArch",
    university: "University of Sydney",
    country: "australia",
    duration: "3 years",
    tuition: "AUD 38,000/year",
    tuitionNum: 25000,
    durationNum: 3,
    level: "bachelors",
    field: "architecture",
    workRights: "PSW 2–4 years",
    hasScholarship: false,
    popularity: 70,
  },
  {
    id: "12",
    name: "LLM International Law",
    university: "University of Oxford",
    country: "uk",
    duration: "1 year",
    tuition: "£32,000",
    tuitionNum: 40000,
    durationNum: 1,
    level: "masters",
    field: "law",
    workRights: "Graduate Visa 2 years",
    hasScholarship: true,
    popularity: 86,
  },
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
                {s === 1 && "Country"}
                {s === 2 && "Field"}
                {s === 3 && "Preferences"}
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

export default function CourseFinder() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("");
  const [field, setField] = useState<FieldOfStudy | "">("");
  const [budget, setBudget] = useState(30000);
  const [duration, setDuration] = useState<Duration | "">("");
  const [workOpportunities, setWorkOpportunities] = useState(false);
  const [scholarshipPref, setScholarshipPref] = useState(false);
  const [results, setResults] = useState<CourseResult[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [filterLevel, setFilterLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFindCourses = () => {
    let filtered = mockCourses;

    if (country) {
      filtered = filtered.filter((c) => c.country === country);
    }
    if (field) {
      filtered = filtered.filter((c) => c.field === field);
    }
    if (duration) {
      const d = Number.parseInt(duration);
      filtered = filtered.filter((c) => c.durationNum <= d);
    }
    if (workOpportunities) {
      filtered = filtered.filter(
        (c) => c.workRights && c.workRights.length > 0,
      );
    }
    if (scholarshipPref) {
      filtered = filtered.filter((c) => c.hasScholarship);
    }
    // Budget filter: show courses within 1.5x of selected budget
    filtered = filtered.filter((c) => c.tuitionNum <= budget * 1.5);

    setResults(filtered);
    setStep(5);
  };

  const sortedResults = useMemo(() => {
    const sorted = [...results];
    switch (sortBy) {
      case "cost":
        return sorted.sort((a, b) => a.tuitionNum - b.tuitionNum);
      case "duration":
        return sorted.sort((a, b) => a.durationNum - b.durationNum);
      default:
        return sorted.sort((a, b) => b.popularity - a.popularity);
    }
  }, [results, sortBy]);

  const filteredResults = useMemo(() => {
    let filtered = sortedResults;
    if (filterLevel) {
      filtered = filtered.filter((c) => c.level === filterLevel);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.university.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [sortedResults, filterLevel, searchQuery]);

  const resetWizard = () => {
    setStep(1);
    setCountry("");
    setField("");
    setBudget(30000);
    setDuration("");
    setWorkOpportunities(false);
    setScholarshipPref(false);
    setResults([]);
    setSortBy("popularity");
    setFilterLevel("");
    setSearchQuery("");
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!country;
      case 2:
        return !!field;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 4) {
      handleFindCourses();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const selectedCountry = countries.find((c) => c.slug === country);
  const selectedField = fieldsOfStudy.find((f) => f.value === field);

  return (
    <>
      <SEOHead meta={getSEOData("courseFinder")} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy/90 py-16 text-white md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            Course Finder
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 md:text-lg">
            Find the perfect course and university tailored to your goals,
            budget, and career aspirations.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          {step <= 4 && <WizardProgress currentStep={step} totalSteps={4} />}

          <div className="rounded-2xl border border-border bg-card p-6 shadow-3d md:p-10">
            {/* Step 1: Country */}
            {step === 1 && (
              <StepTransition stepKey={1}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Select Country
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Where do you want to study?
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
                        data-ocid={`course.finder.country.${c.slug}`}
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

            {/* Step 2: Field of Study */}
            {step === 2 && (
              <StepTransition stepKey={2}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Select Field of Study
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      What do you want to study?
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {fieldsOfStudy.map((f) => {
                      const Icon = f.icon;
                      return (
                        <button
                          type="button"
                          key={f.value}
                          onClick={() => setField(f.value)}
                          className={`group relative flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all duration-300 ${
                            field === f.value
                              ? "border-secondary bg-secondary/5 shadow-lg"
                              : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                          }`}
                          data-ocid={`course.finder.field.${f.value}`}
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                              field === f.value
                                ? "bg-secondary text-white"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="font-display text-sm font-semibold text-foreground">
                            {f.label}
                          </span>
                          {field === f.value && (
                            <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-secondary" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <StepTransition stepKey={3}>
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="font-heading text-xl font-semibold text-primary md:text-2xl">
                      Your Preferences
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Set your budget, duration, and other preferences.
                    </p>
                  </div>

                  {/* Budget Slider */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">
                        Annual Budget
                      </p>
                      <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-bold text-secondary">
                        ${budget.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="50000"
                      step="5000"
                      value={budget}
                      onChange={(e) =>
                        setBudget(Number.parseInt(e.target.value))
                      }
                      className="w-full accent-secondary"
                      data-ocid="course.finder.budget"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>$10k</span>
                      <span>$50k+</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <p className="mb-3 block text-sm font-semibold text-foreground">
                      Maximum Duration
                    </p>
                    <div className="flex gap-3">
                      {(["1", "2", "3"] as Duration[]).map((d) => (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`flex-1 rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                            duration === d
                              ? "border-secondary bg-secondary/5 text-secondary"
                              : "border-border text-foreground hover:border-primary/30"
                          }`}
                          data-ocid={`course.finder.duration.${d}`}
                        >
                          {d} year{d !== "1" ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-secondary" />
                        <div>
                          <span className="block text-sm font-medium text-foreground">
                            Work Opportunities
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Show courses with post-study work rights
                          </span>
                        </div>
                      </div>
                      <div
                        role="switch"
                        aria-checked={workOpportunities}
                        tabIndex={0}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          workOpportunities ? "bg-secondary" : "bg-muted"
                        }`}
                        onClick={() => setWorkOpportunities(!workOpportunities)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setWorkOpportunities(!workOpportunities);
                          }
                        }}
                        data-ocid="course.finder.work_toggle"
                      >
                        <div
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            workOpportunities
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-secondary" />
                        <div>
                          <span className="block text-sm font-medium text-foreground">
                            Scholarship Preference
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Only show courses with scholarship options
                          </span>
                        </div>
                      </div>
                      <div
                        role="switch"
                        aria-checked={scholarshipPref}
                        tabIndex={0}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          scholarshipPref ? "bg-secondary" : "bg-muted"
                        }`}
                        onClick={() => setScholarshipPref(!scholarshipPref)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setScholarshipPref(!scholarshipPref);
                          }
                        }}
                        data-ocid="course.finder.scholarship_toggle"
                      >
                        <div
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            scholarshipPref
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </div>
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
                      Review & Find Courses
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Confirm your preferences and search for matching courses.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl bg-muted/40 p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> Country
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedCountry?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4" /> Field
                      </span>
                      <span className="font-semibold text-foreground">
                        {selectedField?.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" /> Budget
                      </span>
                      <span className="font-semibold text-foreground">
                        ${budget.toLocaleString()}/year
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" /> Max Duration
                      </span>
                      <span className="font-semibold text-foreground">
                        {duration} year{duration !== "1" ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" /> Work Opportunities
                      </span>
                      <span className="font-semibold text-foreground">
                        {workOpportunities ? "Yes" : "No preference"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Wallet className="h-4 w-4" /> Scholarship
                      </span>
                      <span className="font-semibold text-foreground">
                        {scholarshipPref ? "Required" : "No preference"}
                      </span>
                    </div>
                  </div>
                </div>
              </StepTransition>
            )}

            {/* Step 5: Results */}
            {step === 5 && (
              <StepTransition stepKey={5}>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-primary">
                        Matching Courses
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Found {filteredResults.length} course
                        {filteredResults.length !== 1 ? "s" : ""} for you
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        data-ocid="course.finder.toggle_filters"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                      </button>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                        data-ocid="course.finder.sort"
                      >
                        <option value="popularity">Sort: Popularity</option>
                        <option value="cost">Sort: Cost (Low to High)</option>
                        <option value="duration">Sort: Duration</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Sidebar */}
                  {showFilters && (
                    <div className="rounded-xl border border-border bg-muted/30 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="course-search"
                            className="mb-2 block text-sm font-medium text-foreground"
                          >
                            Search
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                              id="course-search"
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search courses or universities..."
                              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                              data-ocid="course.finder.search_input"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="course-level"
                            className="mb-2 block text-sm font-medium text-foreground"
                          >
                            Level
                          </label>
                          <select
                            id="course-level"
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                            data-ocid="course.finder.level_filter"
                          >
                            <option value="">All Levels</option>
                            <option value="bachelors">Bachelor's</option>
                            <option value="masters">Master's</option>
                            <option value="mba">MBA</option>
                            <option value="phd">PhD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Course Grid */}
                  {filteredResults.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredResults.map((course, idx) => (
                        <div
                          key={course.id}
                          className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                          data-ocid={`course.finder.item.${idx + 1}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex gap-1.5">
                              {course.hasScholarship && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                                  <BadgeCheck className="h-3 w-3" />
                                  Scholarship
                                </span>
                              )}
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                {course.level}
                              </span>
                            </div>
                          </div>

                          <h3 className="mt-3 font-display text-base font-semibold text-foreground line-clamp-2">
                            {course.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {course.university}
                          </p>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 shrink-0 text-secondary" />
                              {
                                countries.find((c) => c.slug === course.country)
                                  ?.name
                              }
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 shrink-0 text-secondary" />
                              {course.duration}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <DollarSign className="h-4 w-4 shrink-0 text-gold" />
                              <span className="font-semibold text-gold">
                                {course.tuition}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 shrink-0 text-secondary" />
                              <span className="line-clamp-1">
                                {course.workRights}
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto pt-4">
                            <a
                              href="/free-counseling"
                              className="block w-full rounded-lg border border-secondary px-4 py-2.5 text-center text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-white"
                              data-ocid={`course.finder.item.${idx + 1}.learn_more`}
                            >
                              Learn More
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-card p-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                        No courses found
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your filters or preferences to find more
                        courses.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
                        data-ocid="course.finder.refine_search"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        Refine Search
                      </button>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetWizard}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      data-ocid="course.finder.start_over"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start Over
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
                      data-ocid="course.finder.refine_button"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      Refine Search
                    </button>
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
                    data-ocid={`course.finder.step${step}.back`}
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
                  data-ocid={`course.finder.step${step}.next`}
                >
                  {step === 4 ? "Find Courses" : "Next"}
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
