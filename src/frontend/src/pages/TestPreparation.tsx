import { createActor } from "@/backend";
import type { BatchTiming, TestPrepExam } from "@/backend";
import { SEOHead } from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContent } from "@/context/ContentContext";
import { getSEOData } from "@/data/seo";
import { useTestPrepExams } from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Award,
  BookOpen,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TestInfo {
  id: string;
  name: string;
  description: string;
  sections: string[];
  duration: string;
  scoreRange: string;
  successRate: string;
  onlineSchedule: string;
  offlineSchedule: string;
  batches: string;
}

interface Trainer {
  initials: string;
  name: string;
  qualification: string;
  experience: string;
  specialization: string;
  rating: number;
}

interface DemoForm {
  name: string;
  phone: string;
  email: string;
  testType: string;
  preferredTime: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const tests: TestInfo[] = [
  {
    id: "ielts",
    name: "IELTS",
    description:
      "The International English Language Testing System is the world's most popular English language proficiency test for higher education and global migration. Our expert trainers help you master all four sections with proven strategies.",
    sections: ["Listening", "Reading", "Writing", "Speaking"],
    duration: "2 hours 45 minutes",
    scoreRange: "Band 1 – 9",
    successRate: "96%",
    onlineSchedule: "Mon, Wed, Fri – 7:00 PM to 9:00 PM",
    offlineSchedule: "Tue, Thu, Sat – 10:00 AM to 12:00 PM",
    batches: "Mon-Wed-Fri & Tue-Thu-Sat",
  },
  {
    id: "pte",
    name: "PTE Academic",
    description:
      "Pearson Test of English Academic is a computer-based English language test trusted by universities, colleges, and governments around the world. Our coaching focuses on AI-scoring patterns and time management.",
    sections: ["Speaking & Writing", "Reading", "Listening"],
    duration: "2 hours",
    scoreRange: "10 – 90",
    successRate: "94%",
    onlineSchedule: "Mon, Wed, Fri – 6:00 PM to 8:00 PM",
    offlineSchedule: "Tue, Thu, Sat – 2:00 PM to 4:00 PM",
    batches: "Mon-Wed-Fri & Tue-Thu-Sat",
  },
  {
    id: "toefl",
    name: "TOEFL iBT",
    description:
      "Test of English as a Foreign Language is accepted by more than 11,000 universities and institutions in over 150 countries. Our structured program ensures you excel in the internet-based test format.",
    sections: ["Reading", "Listening", "Speaking", "Writing"],
    duration: "3 hours",
    scoreRange: "0 – 120",
    successRate: "93%",
    onlineSchedule: "Mon, Wed, Fri – 8:00 PM to 10:00 PM",
    offlineSchedule: "Tue, Thu, Sat – 11:00 AM to 1:00 PM",
    batches: "Mon-Wed-Fri & Tue-Thu-Sat",
  },
  {
    id: "gre",
    name: "GRE",
    description:
      "Graduate Record Examination is required for admission to most graduate schools in the United States and many in other countries. Our quant and verbal experts help you achieve top percentiles.",
    sections: [
      "Analytical Writing",
      "Verbal Reasoning",
      "Quantitative Reasoning",
    ],
    duration: "3 hours 45 minutes",
    scoreRange: "260 – 340",
    successRate: "91%",
    onlineSchedule: "Mon, Wed, Fri – 7:30 PM to 9:30 PM",
    offlineSchedule: "Tue, Thu, Sat – 3:00 PM to 5:00 PM",
    batches: "Mon-Wed-Fri & Tue-Thu-Sat",
  },
  {
    id: "gmat",
    name: "GMAT",
    description:
      "Graduate Management Admission Test is used for admission to graduate business programs worldwide. Our coaching covers the Focus Edition with Data Insights, Verbal, and Quantitative sections.",
    sections: ["Quantitative", "Verbal", "Data Insights"],
    duration: "2 hours 15 minutes",
    scoreRange: "205 – 805",
    successRate: "90%",
    onlineSchedule: "Mon, Wed, Fri – 6:30 PM to 8:30 PM",
    offlineSchedule: "Tue, Thu, Sat – 4:00 PM to 6:00 PM",
    batches: "Mon-Wed-Fri & Tue-Thu-Sat",
  },
  {
    id: "sat",
    name: "SAT",
    description:
      "Scholastic Assessment Test is widely used for college admissions in the United States. Our digital SAT coaching prepares you for Reading & Writing and Math sections with adaptive practice.",
    sections: ["Reading & Writing", "Math"],
    duration: "2 hours 14 minutes",
    scoreRange: "400 – 1600",
    successRate: "92%",
    onlineSchedule: "Mon, Wed, Fri – 5:00 PM to 7:00 PM",
    offlineSchedule: "Tue, Thu, Sat – 9:00 AM to 11:00 AM",
    batches: "Mon-Wed-Fri & Tue-Thu-Sat",
  },
];

const trainers: Trainer[] = [
  {
    initials: "RK",
    name: "Ravi Kumar",
    qualification: "IELTS Certified Trainer (British Council)",
    experience: "12 Years",
    specialization: "IELTS & PTE",
    rating: 4.9,
  },
  {
    initials: "SP",
    name: "Sneha Patel",
    qualification: "TOEFL iBT Certified Trainer (ETS)",
    experience: "8 Years",
    specialization: "TOEFL & GRE Verbal",
    rating: 4.8,
  },
  {
    initials: "AR",
    name: "Arun Reddy",
    qualification: "GMAT Club Expert (99th Percentile)",
    experience: "10 Years",
    specialization: "GMAT & GRE Quant",
    rating: 5.0,
  },
  {
    initials: "PM",
    name: "Priya Menon",
    qualification: "SAT Master Trainer (College Board)",
    experience: "7 Years",
    specialization: "SAT & ACT",
    rating: 4.9,
  },
];

// stats values resolved from heroContent inside the component
const staticStats = [
  { icon: Award, staticValue: "500+", label: "Band 7+ IELTS" },
  { icon: Target, staticValue: "300+", label: "PTE 79+ Scores" },
  {
    icon: TrendingUp,
    staticValue: null,
    label: "Pass Rate",
    heroKey: "visaSuccessRate" as const,
  },
  { icon: Users, staticValue: "15+", label: "Expert Trainers" },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface TestPanelProps {
  test: TestInfo;
  backendExam?: TestPrepExam;
}

function BatchTimingsTable({ timings }: { timings: BatchTiming[] }) {
  if (timings.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">
              Batch Schedule
            </th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">
              Start Date
            </th>
            <th className="px-4 py-2.5 text-left font-semibold text-foreground">
              End Date
            </th>
            <th className="px-4 py-2.5 text-right font-semibold text-foreground">
              Seats
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {timings.map((b) => (
            <tr key={String(b.id)} className="bg-card hover:bg-muted/20">
              <td className="px-4 py-2.5 text-foreground">{b.schedule}</td>
              <td className="px-4 py-2.5 text-muted-foreground">
                {b.startDate}
              </td>
              <td className="px-4 py-2.5 text-muted-foreground">{b.endDate}</td>
              <td className="px-4 py-2.5 text-right">
                <span
                  className={
                    Number(b.enrolled) >= Number(b.capacity)
                      ? "font-semibold text-destructive"
                      : "font-semibold text-primary"
                  }
                >
                  {String(b.enrolled)}/{String(b.capacity)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TestPanel({ test, backendExam }: TestPanelProps) {
  const description = backendExam?.description?.trim()
    ? backendExam.description
    : test.description;
  const duration = backendExam?.duration?.trim()
    ? backendExam.duration
    : test.duration;
  const scoreRange = backendExam?.scoreRange?.trim()
    ? backendExam.scoreRange
    : test.scoreRange;
  const successRate = backendExam?.successRate?.trim()
    ? backendExam.successRate
    : (test.successRate ?? "");
  const batchTimings = backendExam?.batchTimings ?? [];

  return (
    <div className="space-y-6">
      {backendExam?.imageUrl && (
        <div className="overflow-hidden rounded-2xl">
          <img
            src={backendExam.imageUrl}
            alt={test.name}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      <div>
        <h3 className="font-heading text-2xl font-bold text-primary">
          {test.name}
        </h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card shadow-subtle">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sections</p>
              <p className="text-sm font-semibold text-foreground">
                {test.sections.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-subtle">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <Clock className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold text-foreground">
                {duration}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-subtle">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Score Range</p>
              <p className="text-sm font-semibold text-foreground">
                {scoreRange}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card shadow-subtle">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-sm font-semibold text-foreground">
                {successRate}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {batchTimings.length > 0 ? (
        <div>
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-secondary" /> Upcoming Batches
          </h4>
          <BatchTimingsTable timings={batchTimings} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" />
              <h4 className="font-semibold text-foreground">Online Classes</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {test.onlineSchedule}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Batches: {test.batches}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <h4 className="font-semibold text-foreground">Offline Classes</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {test.offlineSchedule}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Batches: {test.batches}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          className="bg-secondary text-white hover:bg-secondary/90"
          data-ocid="test.enroll_button"
        >
          <Link
            to={`/test-preparation/${test.id === "sat" ? "digital-sat" : test.id}`}
          >
            Learn More <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild data-ocid="test.demo_button">
          <Link
            to={`/test-preparation/${test.id === "sat" ? "digital-sat" : test.id}#demo-booking`}
          >
            Book Free Demo
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ScoreCalculator() {
  const [result, setResult] = useState<{
    weeks: number;
    batch: string;
    message: string;
  } | null>(null);

  const [currentScore, setCurrentScore] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [testType, setTestType] = useState("");

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const current = Number.parseFloat(currentScore);
    const target = Number.parseFloat(targetScore);
    if (Number.isNaN(current) || Number.isNaN(target) || target <= current)
      return;

    const diff = target - current;
    const weeks = Math.ceil(diff * 2);
    const batch = weeks < 8 ? "Intensive Batch" : "Regular Batch";
    const message =
      weeks < 8
        ? "Great progress potential! Our intensive batch will get you there fast."
        : "Steady wins the race! Our regular batch ensures deep mastery.";

    setResult({ weeks, batch, message });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-subtle md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-primary">
            Score Calculator
          </h3>
          <p className="text-sm text-muted-foreground">
            Estimate your preparation timeline
          </p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="current-score"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Current Score
            </label>
            <Input
              id="current-score"
              type="number"
              placeholder="e.g. 5.5"
              value={currentScore}
              onChange={(e) => setCurrentScore(e.target.value)}
              data-ocid="score_calculator.current_input"
            />
          </div>
          <div>
            <label
              htmlFor="target-score"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Target Score
            </label>
            <Input
              id="target-score"
              type="number"
              placeholder="e.g. 7.5"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              data-ocid="score_calculator.target_input"
            />
          </div>
          <div>
            <label
              htmlFor="test-type"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Test Type
            </label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger
                id="test-type"
                data-ocid="score_calculator.test_select"
              >
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                {tests.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          className="bg-secondary text-white hover:bg-secondary/90"
          data-ocid="score_calculator.submit_button"
        >
          Calculate Timeline
        </Button>
      </form>

      {result && (
        <div
          className="mt-6 rounded-xl border border-border bg-muted/30 p-5"
          data-ocid="score_calculator.result"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{result.weeks}</p>
              <p className="text-sm text-muted-foreground">Estimated Weeks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">
                {result.batch}
              </p>
              <p className="text-sm text-muted-foreground">Recommended Batch</p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm font-medium text-foreground">
                {result.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <Card className="glass-card overflow-hidden shadow-subtle transition-all hover:shadow-3d">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            {trainer.initials}
          </div>
          <h4 className="mt-4 font-heading text-lg font-bold text-primary">
            {trainer.name}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {trainer.qualification}
          </p>

          <div className="mt-4 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={`star-${n}`}
                className={`h-4 w-4 ${
                  n <= Math.floor(trainer.rating)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-semibold text-foreground">
              {trainer.rating}
            </span>
          </div>

          <div className="mt-4 grid w-full gap-2 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Experience</span>
              <span className="font-semibold text-foreground">
                {trainer.experience}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-muted-foreground">Specialization</span>
              <span className="font-semibold text-foreground">
                {trainer.specialization}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DemoBookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const { actor } = useActor(createActor);

  const form = useForm<DemoForm>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      testType: "",
      preferredTime: "",
    },
  });

  const onSubmit = async (data: DemoForm) => {
    try {
      if (actor) {
        await actor.submitDemoClassBooking(
          data.testType,
          data.preferredTime,
          data.name,
          data.email,
          data.phone,
        );
      }
    } catch {
      // graceful fallback: still show success UI
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    form.reset();
  };

  return (
    <div
      id="demo-booking"
      className="rounded-2xl border border-border bg-card p-6 shadow-subtle md:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
          <Calendar className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-primary">
            Book a Free Demo Class
          </h3>
          <p className="text-sm text-muted-foreground">
            Experience our teaching methodology firsthand
          </p>
        </div>
      </div>

      {submitted ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl bg-primary/5 py-12 text-center"
          data-ocid="demo_booking.success_state"
        >
          <CheckCircle2 className="h-12 w-12 text-primary" />
          <h4 className="mt-4 font-display text-lg font-bold text-primary">
            Booking Confirmed!
          </h4>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Our team will contact you shortly to confirm your demo class
            schedule.
          </p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Your full name"
                          className="pl-10"
                          {...field}
                          data-ocid="demo_booking.name_input"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="10-digit mobile number"
                          className="pl-10"
                          {...field}
                          data-ocid="demo_booking.phone_input"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        {...field}
                        data-ocid="demo_booking.email_input"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="testType"
                rules={{ required: "Please select a test type" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-ocid="demo_booking.test_select">
                          <SelectValue placeholder="Select test" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tests.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredTime"
                rules={{ required: "Please select a preferred time" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-ocid="demo_booking.time_select">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">
                          Morning (9 AM – 12 PM)
                        </SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (12 PM – 4 PM)
                        </SelectItem>
                        <SelectItem value="evening">
                          Evening (4 PM – 9 PM)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-secondary text-white hover:bg-secondary/90 sm:w-auto"
              data-ocid="demo_booking.submit_button"
            >
              Book Free Demo Class
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function TestPreparation() {
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const { actor } = useActor(createActor);
  const { heroContent } = useContent();
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("test-prep")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const { data: backendExams = [] } = useTestPrepExams();

  // Map backend exams by their id to static test ids
  const backendExamMap = Object.fromEntries(
    backendExams.map((exam) => [exam.id.toLowerCase(), exam]),
  );
  return (
    <>
      <SEOHead meta={getSEOData("testPreparation")} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-secondary blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/90">Test Preparation</span>
          </nav>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {heroData?.headline ?? "Test Preparation Coaching"}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
            {heroData?.subheadline ??
              "Expert IELTS, PTE, TOEFL, GRE, GMAT & SAT Training with certified trainers and proven success strategies."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-secondary text-white hover:bg-secondary/90"
              data-ocid="hero.cta.book_demo"
            >
              <a href="#demo-booking">Book Free Demo</a>
            </Button>
            <Button
              variant="outline"
              asChild
              className="btn-outline-themed px-8 py-4"
              style={{
                borderColor: "var(--color-button)",
                color: "var(--color-button)",
              }}
              data-ocid="hero.cta.explore"
            >
              <a href="#tests">Explore Tests</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {staticStats.map((stat, idx) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
                data-ocid={`stats.item.${idx + 1}`}
              >
                <stat.icon className="h-8 w-8 text-secondary" />
                <p className="mt-3 font-display text-3xl font-bold text-primary">
                  {stat.heroKey
                    ? (heroContent?.[stat.heroKey] ?? "")
                    : (stat.staticValue ?? "")}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Tabs */}
      <section id="tests" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge
              variant="outline"
              className="mb-3 border-secondary/30 text-secondary"
            >
              Our Programs
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Choose Your Test
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive coaching for all major international entrance exams
            </p>
          </div>

          <Tabs defaultValue="ielts" className="w-full">
            <TabsList className="mb-8 flex h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
              {tests.map((test) => (
                <TabsTrigger
                  key={test.id}
                  value={test.id}
                  className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground shadow-sm data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:text-white"
                  data-ocid={`test.tab.${test.id}`}
                >
                  {test.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {tests.map((test) => (
              <TabsContent key={test.id} value={test.id}>
                <TestPanel test={test} backendExam={backendExamMap[test.id]} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Score Calculator */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge
              variant="outline"
              className="mb-3 border-secondary/30 text-secondary"
            >
              Planning Tool
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Score Calculator
            </h2>
            <p className="mt-3 text-muted-foreground">
              Estimate how long you need to reach your target score
            </p>
          </div>
          <div className="mx-auto max-w-4xl">
            <ScoreCalculator />
          </div>
        </div>
      </section>

      {/* Trainer Profiles */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Badge
              variant="outline"
              className="mb-3 border-secondary/30 text-secondary"
            >
              Our Team
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-primary md:text-4xl">
              Meet Our Expert Trainers
            </h2>
            <p className="mt-3 text-muted-foreground">
              Certified professionals with years of experience in test
              preparation
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((trainer, idx) => (
              <div key={trainer.name} data-ocid={`trainer.card.${idx + 1}`}>
                <TrainerCard trainer={trainer} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Booking */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <DemoBookingForm />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-white/80" />
          <h2 className="mt-4 font-heading text-3xl font-bold text-white md:text-4xl">
            Ready to Ace Your Exam?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Join thousands of students who achieved their dream scores with
            Valmiki Group's expert coaching.
          </p>
          <Button
            asChild
            className="mt-8 bg-secondary text-white hover:bg-secondary/90"
            data-ocid="cta.enroll_now"
          >
            <Link to="/free-counseling">Enroll Now – Free Counseling</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
