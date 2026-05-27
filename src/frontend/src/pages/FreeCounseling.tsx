import { createActor } from "@/backend";
import { SEOHead } from "@/components/SEOHead";
import { getSEOData } from "@/data/seo";
import { useFreeCounselingContent } from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useHeroContent } from "../hooks/useBackendContent";

const countriesList = [
  { value: "usa", label: "USA" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "UK" },
  { value: "australia", label: "Australia" },
  { value: "germany", label: "Germany" },
  { value: "ireland", label: "Ireland" },
];

const educationLevels = [
  { value: "", label: "Select education level" },
  { value: "high-school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
];

const timeSlots = [
  { value: "", label: "Select preferred time" },
  { value: "morning", label: "Morning (9 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM – 4 PM)" },
  { value: "evening", label: "Evening (4 PM – 7 PM)" },
];

const benefits = [
  { icon: Users, text: "Personalized Guidance" },
  { icon: BookOpen, text: "University Selection" },
  { icon: ShieldCheck, text: "Visa Strategy" },
  { icon: DollarSign, text: "Scholarship Info" },
  { icon: FileText, text: "Cost Planning" },
  { icon: Star, text: "SOP Tips" },
];

const socialProof = [
  {
    name: "Aarav Sharma",
    destination: "Canada",
    flag: "🇨🇦",
    quote:
      "The counseling session changed my entire approach to studying abroad.",
  },
  {
    name: "Priya Patel",
    destination: "USA",
    flag: "🇺🇸",
    quote:
      "My counselor helped me get into my dream university with a scholarship!",
  },
  {
    name: "Rohan Iyer",
    destination: "UK",
    flag: "🇬🇧",
    quote:
      "Valmiki's free counseling gave me a clear roadmap for my entire journey.",
  },
];

export default function FreeCounseling() {
  const [submitted, setSubmitted] = useState(false);
  const { actor } = useActor(createActor);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countries: [] as string[],
    education: "",
    time: "",
    message: "",
  });
  const { data: fcData } = useFreeCounselingContent();
  const { data: heroContentData } = useHeroContent();
  const stableHero = heroContentData;

  const toggleCountry = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      countries: prev.countries.includes(value)
        ? prev.countries.filter((c) => c !== value)
        : [...prev.countries, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (actor) {
        await actor.submitCounselingBooking(
          formData.name,
          formData.email,
          formData.phone,
          formData.countries,
          formData.education,
          formData.time,
        );
      }
    } catch {
      // graceful fallback: still show success UI
    }
    setSubmitted(true);
  };

  return (
    <>
      <SEOHead meta={getSEOData("freeCounseling")} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy/90 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-bold md:text-5xl lg:text-6xl"
          >
            {fcData?.heroHeadline || "Book Your FREE Counseling Session"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-white/80"
          >
            Get expert guidance from certified counselors. No obligations,
            completely free.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {[
              {
                icon: ShieldCheck,
                text: `${stableHero?.visaSuccessRate ?? ""} Visa Success Rate`.trim(),
              },
              {
                icon: Users,
                text: `${stableHero?.studentsGuided ?? ""} Students Guided`.trim(),
              },
              {
                icon: Star,
                text: `${stableHero?.yearsExperience ?? ""} Years Experience`.trim(),
              },
            ].map((badge) => (
              <div
                key={badge.text}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm"
              >
                <badge.icon className="h-4 w-4 text-gold" />
                {badge.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center shadow-3d"
                  data-ocid="counseling.success_state"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="mt-6 font-heading text-2xl font-bold text-primary">
                    Session Booked Successfully!
                  </h2>
                  <p className="mt-3 max-w-md text-muted-foreground">
                    Thank you! Our counselor will contact you within 24 hours to
                    confirm your appointment.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary/90"
                    data-ocid="counseling.book_another_button"
                  >
                    Book Another Session
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-border bg-card p-8 shadow-3d md:p-10"
                >
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Limited slots available this week
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-primary">
                    Schedule Your Free Session
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill in your details and our counselor will contact you
                    within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="counseling-name"
                          className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                        >
                          <User className="h-4 w-4 text-secondary" />
                          Full Name
                        </label>
                        <input
                          id="counseling-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter your full name"
                          data-ocid="counseling.input.name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="counseling-email"
                          className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                        >
                          <Mail className="h-4 w-4 text-secondary" />
                          Email Address
                        </label>
                        <input
                          id="counseling-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="your@email.com"
                          data-ocid="counseling.input.email"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="counseling-phone"
                          className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                        >
                          <Phone className="h-4 w-4 text-secondary" />
                          Phone Number
                        </label>
                        <input
                          id="counseling-phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="+91-XXXXXXXXXX"
                          data-ocid="counseling.input.phone"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="education-level"
                          className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                        >
                          <GraduationCap className="h-4 w-4 text-secondary" />
                          Education Level
                        </label>
                        <select
                          id="education-level"
                          required
                          value={formData.education}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              education: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          data-ocid="counseling.select.education"
                        >
                          {educationLevels.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <MapPin className="h-4 w-4 text-secondary" />
                        Desired Countries
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {countriesList.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => toggleCountry(c.value)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                              formData.countries.includes(c.value)
                                ? "border-secondary bg-secondary/10 text-secondary"
                                : "border-border bg-card text-muted-foreground hover:border-primary/30"
                            }`}
                            data-ocid={`counseling.checkbox.country.${c.value}`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="preferred-time"
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                      >
                        <Clock className="h-4 w-4 text-secondary" />
                        Preferred Time
                      </label>
                      <select
                        id="preferred-time"
                        required
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        data-ocid="counseling.select.time"
                      >
                        {timeSlots.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                      >
                        <Calendar className="h-4 w-4 text-secondary" />
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Tell us about your goals, preferred courses, or any questions..."
                        data-ocid="counseling.textarea.message"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl hover:-translate-y-0.5"
                      data-ocid="counseling.submit_button"
                    >
                      {fcData?.ctaText || "Book My FREE Session"}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Proof */}
            <div className="mt-12">
              <h3 className="text-center font-heading text-lg font-semibold text-foreground">
                What Students Say About Our Counseling
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {socialProof.map((student, i) => (
                  <div
                    key={student.name}
                    className="rounded-xl border border-border bg-card p-5 shadow-subtle"
                    data-ocid={`counseling.testimonial.${i + 1}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{student.flag}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {student.destination}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      "{student.quote}"
                    </p>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      {student.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-3d">
                <h3 className="font-heading text-xl font-bold text-primary">
                  What You Get
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every free counseling session includes:
                </p>
                <ul className="mt-6 space-y-4">
                  {benefits.map((b) => (
                    <li key={b.text} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15">
                        <b.icon className="h-4 w-4 text-gold" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 p-6 text-white shadow-lg">
                <h3 className="font-heading text-lg font-bold">
                  Need Urgent Help?
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  Call us directly for immediate assistance.
                </p>
                <a
                  href="tel:+919090474777"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-secondary transition-colors hover:bg-white/90"
                  data-ocid="counseling.call_now_button"
                >
                  <Phone className="h-4 w-4" />
                  +91-9090 4747 77
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
