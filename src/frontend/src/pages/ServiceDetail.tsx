import { createActor } from "@/backend";
import type { ServiceDetailContent } from "@/backend";
import { useContent } from "@/context/ContentContext";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Banknote,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Globe,
  GraduationCap,
  Heart,
  MapPin,
  Phone,
  Plane,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const SERVICE_MAP: Record<
  string,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    tagline: string;
  }
> = {
  "study-abroad-counseling": {
    name: "Study Abroad Counseling",
    icon: Globe,
    tagline: "Your personalised roadmap to a global education",
  },
  "student-visa-assistance": {
    name: "Student Visa Assistance",
    icon: Shield,
    tagline: "End-to-end visa support with 93% success rate",
  },
  "immigration-services": {
    name: "Immigration Services",
    icon: MapPin,
    tagline: "Expert guidance on PR, work & dependent visas",
  },
  "scholarships-guidance": {
    name: "Scholarships Guidance",
    icon: GraduationCap,
    tagline: "Unlock funding opportunities at top universities",
  },
  "education-loans": {
    name: "Education Loans",
    icon: Banknote,
    tagline: "Hassle-free education loan assistance",
  },
  "sop-documentation": {
    name: "SOP & Documentation",
    icon: ClipboardList,
    tagline: "Compelling statements that get you admitted",
  },
  "pre-departure-assistance": {
    name: "Pre-Departure Assistance",
    icon: Plane,
    tagline: "Everything you need before you fly",
  },
  "career-counseling": {
    name: "Career Counseling",
    icon: Briefcase,
    tagline: "Map your career with expert professional guidance",
  },
  "valmiki-foundation": {
    name: "Valmiki Foundation",
    icon: Heart,
    tagline: "Empowering Communities Through Education & Social Impact",
  },
  "tours-and-travel": {
    name: "Tours & Travel",
    icon: Plane,
    tagline: "Your Trusted Travel Partner for International Journeys",
  },
};

const FALLBACK: Record<string, ServiceDetailContent> = {
  "valmiki-foundation": {
    serviceId: "valmiki-foundation",
    heroHeadline: "Valmiki Foundation",
    heroSubheadline: "Making a Difference Through Education & Community Impact",
    heroImage:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&auto=format&fit=crop",
    overview:
      "The Valmiki Foundation is the CSR arm of Valmiki Group, committed to empowering underprivileged communities through education, skill development, and social initiatives. Since 2001, we have been investing in the future of thousands of students and families across India, believing that quality education is the most powerful tool to change lives.",
    whatIsIncluded: [
      "Education Scholarships for deserving students",
      "Community Skill Development Programs",
      "Student Mentorship & Career Support",
      "Social Welfare Initiatives",
    ],
    processSteps: [
      {
        order: 1n,
        icon: "Users",
        title: "Identify & Outreach",
        description:
          "We identify underprivileged students and communities in need through local outreach programs.",
      },
      {
        order: 2n,
        icon: "GraduationCap",
        title: "Scholarship Assessment",
        description:
          "Eligible candidates are assessed for academic merit and financial need to receive scholarships.",
      },
      {
        order: 3n,
        icon: "CheckCircle",
        title: "Support & Follow-Up",
        description:
          "Recipients receive ongoing mentorship, resources, and career guidance throughout their journey.",
      },
    ],
    eligibilityCriteria: [
      "Demonstrated financial need",
      "Academic merit",
      "Commitment to community",
    ],
    whyChooseValmiki: [
      "24+ years of social commitment",
      "Thousands of lives impacted",
      "Transparent CSR programs",
      "Partnered with leading institutions",
    ],
    faqs: [
      {
        question: "Who can apply for a Valmiki Foundation scholarship?",
        answer:
          "Students from financially weaker backgrounds with strong academic records can apply. Contact our office for eligibility details.",
      },
      {
        question: "How can organizations partner with the Foundation?",
        answer:
          "We welcome CSR partnerships from corporates and NGOs. Reach out via our Contact page or call our Secunderabad office.",
      },
    ],
    ctaText: "Join Us in Changing Lives",
    ctaButtonText: "Get Involved",
  },
  "tours-and-travel": {
    serviceId: "tours-and-travel",
    heroHeadline: "Tours & Travel",
    heroSubheadline:
      "Explore the World with Valmiki Group's Trusted Travel Services",
    heroImage:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&auto=format&fit=crop",
    overview:
      "Valmiki Group's Tours & Travel division offers comprehensive international travel services for students, families, and professionals. From flight bookings and hotel accommodations to visa travel documents and airport transfers, we handle every detail so you can focus on your journey. With our deep knowledge of international routes and study-abroad destinations, we are your one-stop travel partner.",
    whatIsIncluded: [
      "International Flight Bookings",
      "Hotel Accommodations",
      "Visa Travel Documents",
      "Airport Transfers & Pickup",
    ],
    processSteps: [
      {
        order: 1n,
        icon: "MessageCircle",
        title: "Travel Consultation",
        description:
          "Discuss your travel dates, destination, and budget with our experienced travel advisors.",
      },
      {
        order: 2n,
        icon: "Plane",
        title: "Itinerary & Booking",
        description:
          "We create a customized travel plan and handle all flight, hotel, and transfer bookings on your behalf.",
      },
      {
        order: 3n,
        icon: "CheckCircle",
        title: "Travel & Support",
        description:
          "Travel with confidence knowing our team is available 24/7 for any assistance during your journey.",
      },
    ],
    eligibilityCriteria: [
      "Valid passport",
      "Valid student or tourist visa",
      "Travel insurance (recommended)",
    ],
    whyChooseValmiki: [
      "24+ years of global travel expertise",
      "Best-price flight & hotel packages",
      "Dedicated travel support team",
      "Trusted by 1 Lakh+ students",
    ],
    faqs: [
      {
        question: "Can you book travel for my entire family?",
        answer:
          "Yes, we offer group and family travel packages. Contact us to get a customized quote.",
      },
      {
        question: "Do you assist with travel insurance?",
        answer:
          "Yes, we can guide you through travel insurance options suitable for students and international travelers.",
      },
    ],
    ctaText: "Ready to Start Your Journey?",
    ctaButtonText: "Book Your Travel",
  },
  "study-abroad-counseling": {
    serviceId: "study-abroad-counseling",
    heroHeadline: "Study Abroad Counseling",
    heroSubheadline:
      "Personalized guidance from expert advisors with 24+ years of experience",
    heroImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop",
    overview:
      "At Valmiki Group, our Study Abroad Counseling service is designed to give every student a clear, confident path to overseas education. From selecting the right country and university to preparing a winning application, our expert counselors work with you at every step.",
    whatIsIncluded: [
      "1-on-1 profile assessment",
      "University shortlisting",
      "Application guidance",
      "SOP & LOR support",
      "Scholarship identification",
      "Pre-visa documentation checklist",
    ],
    processSteps: [
      {
        order: 1n,
        icon: "MessageCircle",
        title: "Free Consultation",
        description:
          "Understand your goals, grades, and budget in a free 1-hour session.",
      },
      {
        order: 2n,
        icon: "Search",
        title: "Profile Evaluation",
        description:
          "Deep-dive analysis of academics, work experience, and ambitions.",
      },
      {
        order: 3n,
        icon: "GraduationCap",
        title: "University Shortlisting",
        description:
          "Curated list of universities matching your profile and aspirations.",
      },
      {
        order: 4n,
        icon: "FileText",
        title: "Application Support",
        description:
          "Expert help with essays, statements, and online applications.",
      },
      {
        order: 5n,
        icon: "CheckCircle",
        title: "Offer & Enrolment",
        description:
          "Guidance on accepting your offer and preparing for enrolment.",
      },
    ],
    eligibilityCriteria: [
      "Completed 10+2 / Bachelor's degree",
      "Minimum 60% academic score",
      "Valid passport",
      "English proficiency (IELTS/PTE/TOEFL)",
      "Financial proof",
    ],
    whyChooseValmiki: [
      "Decades of expertise",
      "Lakhs of students successfully placed",
      "300+ university partnerships",
      "Free initial consultation",
      "Dedicated counselor assigned",
      "Post-admission support",
    ],
    faqs: [
      {
        question: "How long does the counseling process take?",
        answer:
          "The typical timeline from initial consultation to final university offer is 3–6 months depending on the intake deadline.",
      },
      {
        question: "Is counseling free?",
        answer:
          "The initial consultation is completely free. Service fees apply for application and documentation support.",
      },
      {
        question: "Which countries do you cover?",
        answer:
          "USA, UK, Canada, Australia, Germany, Ireland, New Zealand, Dubai, Singapore, and Europe.",
      },
    ],
    ctaText: "Start Your Journey Today",
    ctaButtonText: "Book Free Counseling",
  },
};

const DEFAULT_FALLBACK_CONTENT = (serviceId: string): ServiceDetailContent => ({
  serviceId,
  heroHeadline: SERVICE_MAP[serviceId]?.name ?? "Our Service",
  heroSubheadline:
    SERVICE_MAP[serviceId]?.tagline ??
    "Expert guidance for your global journey",
  heroImage:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop",
  overview: `Valmiki Group provides expert ${SERVICE_MAP[serviceId]?.name ?? "consultation"} services with decades of trusted experience. Our dedicated team of advisors ensures you receive personalised, end-to-end support throughout your journey.`,
  whatIsIncluded: [
    "Expert consultation",
    "Personalised guidance",
    "Documentation support",
    "End-to-end assistance",
    "Follow-up support",
  ],
  processSteps: [
    {
      order: 1n,
      icon: "MessageCircle",
      title: "Consultation",
      description: "Free initial session to understand your needs.",
    },
    {
      order: 2n,
      icon: "ClipboardList",
      title: "Assessment",
      description: "Thorough evaluation of your profile and goals.",
    },
    {
      order: 3n,
      icon: "CheckCircle",
      title: "Guidance",
      description: "Step-by-step expert guidance throughout the process.",
    },
  ],
  eligibilityCriteria: [
    "Valid documents",
    "Clear purpose",
    "Financial readiness",
  ],
  whyChooseValmiki: [
    "24+ years experience",
    "1L+ students guided",
    "High success rate",
    "End-to-end support",
  ],
  faqs: [
    {
      question: "How can Valmiki Group help me?",
      answer:
        "Our expert counselors provide personalised guidance and support throughout your entire journey.",
    },
    {
      question: "Is there a consultation fee?",
      answer:
        "Initial consultations are free. Contact us for detailed pricing.",
    },
  ],
  ctaText: "Ready to Get Started?",
  ctaButtonText: "Get Free Counseling",
});

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
        data-ocid="service_detail.faq.toggle"
      >
        <span className="font-semibold text-[#0b1f3a] font-[Poppins] pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[#ff8a00] flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServiceDetail() {
  const { serviceId = "" } = useParams<{ serviceId: string }>();
  const { actor, isFetching } = useActor(createActor);
  const { heroContent } = useContent();

  const [content, setContent] = useState<ServiceDetailContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .getServiceDetail(serviceId)
      .then((data) => {
        setContent(
          data ?? FALLBACK[serviceId] ?? DEFAULT_FALLBACK_CONTENT(serviceId),
        );
      })
      .catch(() => {
        setContent(FALLBACK[serviceId] ?? DEFAULT_FALLBACK_CONTENT(serviceId));
      })
      .finally(() => setLoading(false));
  }, [actor, isFetching, serviceId]);

  useEffect(() => {
    if (!actor && !isFetching) {
      const timer = setTimeout(() => {
        if (!content) {
          setContent(
            FALLBACK[serviceId] ?? DEFAULT_FALLBACK_CONTENT(serviceId),
          );
          setLoading(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actor, isFetching, content, serviceId]);

  const serviceInfo = SERVICE_MAP[serviceId];
  if (!loading && !serviceInfo && !content) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-[Poppins] text-3xl font-bold text-[#0b1f3a]">
          Service Not Found
        </h1>
        <p className="text-muted-foreground">
          The service you're looking for doesn't exist.
        </p>
        <Link
          to="/services"
          className="rounded-full bg-[#ff8a00] px-6 py-3 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-colors"
        >
          View All Services
        </Link>
      </div>
    );
  }

  const c = content ?? DEFAULT_FALLBACK_CONTENT(serviceId);
  const Icon = serviceInfo?.icon ?? Globe;
  const sortedSteps = [...c.processSteps].sort(
    (a, b) => Number(a.order) - Number(b.order),
  );

  return (
    <div data-ocid="service_detail.page">
      {/* Hero */}
      <section
        className="relative min-h-[420px] flex items-end overflow-hidden"
        style={{
          backgroundImage: `url(${c.heroImage || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a] via-[#0b1f3a]/70 to-transparent" />
        <div className="relative container mx-auto px-4 pb-16 pt-24">
          <nav className="mb-4 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/services" className="hover:text-white transition-colors">
              Services
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">{c.heroHeadline}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff8a00] shadow-lg">
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-[Poppins] text-4xl font-bold text-white sm:text-5xl"
              >
                {c.heroHeadline}
              </motion.h1>
              <p className="mt-1 text-white/80 text-lg">{c.heroSubheadline}</p>
            </div>
          </div>
          <Link
            to="/free-counseling"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff8a00] px-8 py-3 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-all hover:shadow-xl"
            data-ocid="service_detail.hero.cta_button"
          >
            Get Free Counseling
          </Link>
        </div>
      </section>

      {/* Overview */}
      <section className="bg-background py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-[Poppins] text-3xl font-bold text-[#0b1f3a] mb-5">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {c.overview}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 shadow-lg"
            >
              <h3 className="font-[Poppins] text-xl font-bold text-[#0b1f3a] mb-5">
                What's Included
              </h3>
              <ul className="space-y-3">
                {c.whatIsIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#ff8a00] flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section
        className="bg-muted/30 py-16 sm:py-20"
        data-ocid="service_detail.process.section"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[Poppins] text-3xl font-bold text-[#0b1f3a] text-center mb-12"
          >
            How It Works
          </motion.h2>
          <div className="space-y-0">
            {sortedSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex gap-6 items-start py-8 ${
                  index < sortedSteps.length - 1
                    ? "border-b border-border/40"
                    : ""
                } ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                data-ocid={`service_detail.process.step.${index + 1}`}
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0b1f3a] text-white shadow-lg font-[Poppins] font-bold text-xl">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h3 className="font-[Poppins] text-xl font-semibold text-[#0b1f3a] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section
        className="bg-[#0b1f3a] py-16 sm:py-20"
        data-ocid="service_detail.eligibility.section"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[Poppins] text-3xl font-bold text-white text-center mb-12"
          >
            Eligibility Criteria
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {c.eligibilityCriteria.map((criterion, i) => (
              <motion.div
                key={criterion}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm"
                data-ocid={`service_detail.eligibility.item.${i + 1}`}
              >
                <CheckCircle className="h-5 w-5 text-[#ffc247] flex-shrink-0" />
                <span className="text-white font-medium">{criterion}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Valmiki */}
      <section
        className="bg-background py-16 sm:py-20"
        data-ocid="service_detail.why_choose.section"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[Poppins] text-3xl font-bold text-[#0b1f3a] text-center mb-12"
          >
            Why Choose Valmiki
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.whyChooseValmiki.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm hover:-translate-y-1 transition-transform backdrop-blur-sm"
                data-ocid={`service_detail.why_choose.item.${i + 1}`}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff8a00]/10">
                  <CheckCircle className="h-4 w-4 text-[#ff8a00]" />
                </div>
                <span className="font-medium text-foreground">{point}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {c.faqs.length > 0 && (
        <section
          className="bg-muted/30 py-16 sm:py-20"
          data-ocid="service_detail.faqs.section"
        >
          <div className="container mx-auto max-w-3xl px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-[Poppins] text-3xl font-bold text-[#0b1f3a] text-center mb-10"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-3">
              {c.faqs.map((faq) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-[#0b1f3a] to-[#0b2d5a] py-20"
        data-ocid="service_detail.cta.section"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#ffc247] blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#ff8a00] blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[Poppins] text-3xl font-bold text-white sm:text-4xl">
              {c.ctaText}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Get personalised guidance from Valmiki Group's expert advisors —{" "}
              {heroContent?.yearsExperience ?? ""} years of experience,{" "}
              {heroContent?.studentsGuided ?? ""} students successfully guided.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/free-counseling"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff8a00] px-8 py-3.5 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-all hover:-translate-y-0.5"
                data-ocid="service_detail.cta.primary_button"
              >
                {c.ctaButtonText || "Book Free Counseling"}
              </Link>
              <a
                href="tel:+919090474777"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 font-[Poppins] font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
                data-ocid="service_detail.cta.call_button"
              >
                <Phone className="h-4 w-4" />
                Call Now: +91-9090 4747 77
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
