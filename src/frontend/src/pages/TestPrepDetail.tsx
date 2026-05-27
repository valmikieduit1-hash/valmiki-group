import { createActor } from "@/backend";
import type { TestPrepExam } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTestPrepExams } from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  DollarSign,
  HelpCircle,
  MessageSquare,
  Phone,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Static exam data per exam id                                       */
/* ------------------------------------------------------------------ */

const EXAM_CONFIG: Record<
  string,
  {
    name: string;
    tagline: string;
    gradient: string;
    accentColor: string;
    bgLight: string;
    icon: string;
    whoNeedsIt: string;
    features: { icon: string; title: string; desc: string }[];
    testimonials: {
      name: string;
      score: string;
      university: string;
      country: string;
      text: string;
    }[];
    faqs: { q: string; a: string }[];
  }
> = {
  ielts: {
    name: "IELTS",
    tagline: "International English Language Testing System",
    gradient: "from-[#c0392b] to-[#e74c3c]",
    accentColor: "#e74c3c",
    bgLight: "#fdf2f2",
    icon: "🎓",
    whoNeedsIt:
      "IELTS is required for students applying to universities in the UK, Australia, Canada, New Zealand, and many European countries. It is also accepted for immigration and professional registration purposes.",
    features: [
      {
        icon: "📖",
        title: "4 Skill Sections",
        desc: "Listening, Reading, Writing & Speaking",
      },
      {
        icon: "🏅",
        title: "Globally Accepted",
        desc: "Accepted by 11,000+ institutions worldwide",
      },
      {
        icon: "📊",
        title: "AI Mock Tests",
        desc: "Simulated exam environment with instant feedback",
      },
      {
        icon: "🎯",
        title: "Band 7+ Focus",
        desc: "Strategies tailored for Band 7 and above",
      },
    ],
    testimonials: [
      {
        name: "Arjun Sharma",
        score: "Band 8.0",
        university: "University of Melbourne",
        country: "Australia 🇦🇺",
        text: "Valmiki Group's IELTS coaching completely transformed my approach to the exam. Achieved Band 8 on my first attempt!",
      },
      {
        name: "Priya Reddy",
        score: "Band 7.5",
        university: "University of Toronto",
        country: "Canada 🇨🇦",
        text: "The expert trainers gave me personalised feedback on my writing and speaking. The mock tests were exactly like the real exam.",
      },
      {
        name: "Kiran Kumar",
        score: "Band 7.0",
        university: "University of Birmingham",
        country: "UK 🇬🇧",
        text: "Excellent study material and batch timings that fit my schedule. Got my target band score on the very first attempt!",
      },
    ],
    faqs: [
      {
        q: "How long is the IELTS course at Valmiki Group?",
        a: "Our standard IELTS coaching program runs for 4–8 weeks depending on your current level and target score. Intensive batches are also available for quick preparation.",
      },
      {
        q: "What is the difference between IELTS Academic and General Training?",
        a: "IELTS Academic is for university admission and professional registration. IELTS General Training is for secondary education, work experience, or migration to English-speaking countries.",
      },
      {
        q: "How many mock tests are included in the coaching?",
        a: "Each student gets 10+ full-length timed mock tests plus section-wise practice tests. All tests are reviewed by certified trainers with detailed feedback.",
      },
      {
        q: "Can I join IELTS coaching online?",
        a: "Yes, we offer both online and offline IELTS coaching. Online classes run on weekday evenings and weekend mornings via live interactive sessions.",
      },
      {
        q: "What is the minimum IELTS score required for Australian universities?",
        a: "Most Australian universities require a minimum overall band of 6.5 with no band below 6.0. Top universities like Melbourne and Sydney may require 7.0+.",
      },
    ],
  },
  pte: {
    name: "PTE Academic",
    tagline: "Pearson Test of English Academic",
    gradient: "from-[#1a5276] to-[#2980b9]",
    accentColor: "#2980b9",
    bgLight: "#eaf2f8",
    icon: "💻",
    whoNeedsIt:
      "PTE Academic is accepted by thousands of universities in Australia, UK, USA, and Canada. It is also accepted for Australian and New Zealand visa applications. Its computer-based format gives faster results within 5 business days.",
    features: [
      {
        icon: "🤖",
        title: "AI Scoring",
        desc: "Understand how AI scores your responses",
      },
      {
        icon: "⚡",
        title: "Fast Results",
        desc: "Get scores within 5 business days",
      },
      {
        icon: "🎙️",
        title: "Speaking Focus",
        desc: "Intensive training for speaking & writing sections",
      },
      {
        icon: "📱",
        title: "Computer-Based",
        desc: "Full practice on computer interface",
      },
    ],
    testimonials: [
      {
        name: "Swathi Goud",
        score: "Score 82",
        university: "Monash University",
        country: "Australia 🇦🇺",
        text: "PTE coaching at Valmiki was incredible. The trainers taught me exactly how AI scoring works and I got 82 on my first attempt!",
      },
      {
        name: "Rahul Nair",
        score: "Score 79",
        university: "University of Auckland",
        country: "New Zealand 🇳🇿",
        text: "The targeted practice for Repeat Sentence and Summarise Spoken Text really helped. Cleared PTE with 79 in just 3 weeks of coaching!",
      },
      {
        name: "Meghana Singh",
        score: "Score 85",
        university: "RMIT University",
        country: "Australia 🇦🇺",
        text: "Best PTE institute in Hyderabad! The study material is comprehensive and the mock tests perfectly simulate the real exam environment.",
      },
    ],
    faqs: [
      {
        q: "How is PTE different from IELTS?",
        a: "PTE is fully computer-based and scored by AI, while IELTS has a face-to-face speaking component scored by a human examiner. PTE results are available within 5 business days versus 13 days for IELTS.",
      },
      {
        q: "What score do I need for Australian PR?",
        a: "For Australian immigration, you typically need an overall PTE score of 65 (equivalent to IELTS 6.5). Some visa subclasses may require 79 or above.",
      },
      {
        q: "How long does PTE coaching take?",
        a: "Our PTE coaching program runs for 3–6 weeks. Since the test is computer-based, many students improve quickly with focused practice.",
      },
      {
        q: "Are online PTE mock tests available?",
        a: "Yes, all enrolled students get access to our online mock test portal with 8+ full-length PTE practice tests and unlimited section-wise practice.",
      },
    ],
  },
  toefl: {
    name: "TOEFL iBT",
    tagline: "Test of English as a Foreign Language",
    gradient: "from-[#154360] to-[#1a6fa8]",
    accentColor: "#1a6fa8",
    bgLight: "#e8f4fd",
    icon: "🌐",
    whoNeedsIt:
      "TOEFL iBT is the most widely accepted English proficiency test by universities in the USA. It is accepted by 11,500+ institutions in 160+ countries. Top US universities including Ivy League schools prefer TOEFL over other English tests.",
    features: [
      {
        icon: "🏫",
        title: "USA Preferred",
        desc: "Required for 90%+ US university admissions",
      },
      {
        icon: "📝",
        title: "Integrated Tasks",
        desc: "Unique integrated reading+listening+writing tasks",
      },
      {
        icon: "🎧",
        title: "Home Edition",
        desc: "Option to take the TOEFL at home",
      },
      {
        icon: "📈",
        title: "Score 100+ Strategy",
        desc: "Expert strategies to cross 100 marks",
      },
    ],
    testimonials: [
      {
        name: "Aditya Verma",
        score: "Score 112/120",
        university: "University of Michigan",
        country: "USA 🇺🇸",
        text: "Valmiki Group's TOEFL coaching is exceptional. Their integrated task strategies helped me score 112 and secure admission at University of Michigan!",
      },
      {
        name: "Divya Patel",
        score: "Score 105/120",
        university: "Boston University",
        country: "USA 🇺🇸",
        text: "The trainers are very knowledgeable and patient. The mock tests and speaking practice were exactly what I needed to score above 100.",
      },
      {
        name: "Srikar Rao",
        score: "Score 108/120",
        university: "Purdue University",
        country: "USA 🇺🇸",
        text: "Excellent coaching centre! The TOEFL material covers every task type in detail. Got into my dream university with a score of 108.",
      },
    ],
    faqs: [
      {
        q: "What is the TOEFL iBT score range?",
        a: "TOEFL iBT scores range from 0 to 120. Each of the four sections (Reading, Listening, Speaking, Writing) is scored from 0 to 30.",
      },
      {
        q: "What TOEFL score do I need for US universities?",
        a: "Most US universities require a minimum score of 80–100. Top universities like MIT, Harvard, and Stanford typically require 100+.",
      },
      {
        q: "How long should I study for TOEFL?",
        a: "Our coaching program runs for 4–8 weeks. Students with strong English foundations often achieve their target scores within 4 weeks with focused practice.",
      },
      {
        q: "Can I take TOEFL from home?",
        a: "Yes, ETS offers TOEFL iBT Home Edition which you can take from a quiet room at home. Our coaching covers both the test center and home edition formats.",
      },
      {
        q: "How is TOEFL different from IELTS?",
        a: "TOEFL uses an American English accent and has unique integrated tasks. IELTS includes British English accents and has a face-to-face speaking section. TOEFL is generally preferred for US admissions.",
      },
    ],
  },
  gre: {
    name: "GRE",
    tagline: "Graduate Record Examination",
    gradient: "from-[#1c2833] to-[#2c3e50]",
    accentColor: "#2c3e50",
    bgLight: "#f4f6f7",
    icon: "🎯",
    whoNeedsIt:
      "GRE is required for admission to most graduate programs in the USA, Canada, and many European universities. It tests verbal reasoning, quantitative reasoning, and analytical writing skills essential for graduate-level study.",
    features: [
      {
        icon: "🔢",
        title: "Quant Mastery",
        desc: "Advanced problem solving & data analysis",
      },
      {
        icon: "📚",
        title: "Verbal Strategies",
        desc: "Text completion, sentence equivalence, RC",
      },
      {
        icon: "✍️",
        title: "AWA Coaching",
        desc: "Expert feedback on analytical writing essays",
      },
      {
        icon: "🏆",
        title: "Top Percentile",
        desc: "Techniques to achieve 165+ in Quant and Verbal",
      },
    ],
    testimonials: [
      {
        name: "Venkat Suresh",
        score: "325/340",
        university: "Carnegie Mellon University",
        country: "USA 🇺🇸",
        text: "The quant coaching at Valmiki Group is world-class. Got 170 in Quant and 155 in Verbal. Admitted to CMU MS CS program!",
      },
      {
        name: "Lakshmi Prasad",
        score: "318/340",
        university: "Georgia Tech",
        country: "USA 🇺🇸",
        text: "Amazing GRE prep! The verbal strategies for text completion really worked for me. Scored 318 and got into Georgia Tech!",
      },
      {
        name: "Nikhil Gupta",
        score: "330/340",
        university: "University of Texas Austin",
        country: "USA 🇺🇸",
        text: "Valmiki's GRE coaching gave me the edge I needed. The personalised study plan and AWA feedback were outstanding. Scored 330!",
      },
    ],
    faqs: [
      {
        q: "What is a good GRE score for MS in the USA?",
        a: "A score of 320+ is considered competitive for top US MS programs. For elite universities like MIT, Stanford, and CMU, aim for 325–330+.",
      },
      {
        q: "How long is the GRE valid?",
        a: "GRE scores are valid for 5 years from the test date. You can retake the GRE up to 5 times in a rolling 12-month period.",
      },
      {
        q: "What is the GRE Verbal section like?",
        a: "The Verbal section tests reading comprehension, text completion, and sentence equivalence. A strong vocabulary and reading speed are essential to score well.",
      },
      {
        q: "Can I skip the GRE for some US universities?",
        a: "Many universities have made GRE optional or waived it for certain programs. However, submitting a strong score (320+) can significantly strengthen your application.",
      },
      {
        q: "How many hours should I study per day for GRE?",
        a: "We recommend 2–3 hours of focused practice per day for 6–8 weeks. Our structured coaching ensures you cover every topic efficiently.",
      },
    ],
  },
  gmat: {
    name: "GMAT Focus Edition",
    tagline: "Graduate Management Admission Test",
    gradient: "from-[#6c3483] to-[#8e44ad]",
    accentColor: "#8e44ad",
    bgLight: "#f5eef8",
    icon: "📊",
    whoNeedsIt:
      "GMAT is required for admission to MBA and other business management programs at top business schools worldwide. The new GMAT Focus Edition tests Data Insights, Verbal Reasoning, and Quantitative Reasoning.",
    features: [
      {
        icon: "📉",
        title: "Data Insights",
        desc: "Dedicated section for data analysis & interpretation",
      },
      {
        icon: "🧮",
        title: "Quant Prep",
        desc: "Problem solving with business-relevant scenarios",
      },
      {
        icon: "💼",
        title: "MBA Focus",
        desc: "Tailored strategies for top B-school admissions",
      },
      {
        icon: "🔄",
        title: "Adaptive Practice",
        desc: "Computer-adaptive mock tests mimicking real GMAT",
      },
    ],
    testimonials: [
      {
        name: "Rohan Mehta",
        score: "740/805",
        university: "Indian School of Business",
        country: "India 🇮🇳",
        text: "Valmiki Group's GMAT Focus coaching is brilliant! The Data Insights section strategies made all the difference. Scored 740 and got into ISB!",
      },
      {
        name: "Ananya Krishnan",
        score: "720/805",
        university: "Warwick Business School",
        country: "UK 🇬🇧",
        text: "Excellent GMAT coaching with personalised attention. The mock tests were spot-on accurate. Got 720 and admitted to Warwick MBA!",
      },
      {
        name: "Siddharth Joshi",
        score: "755/805",
        university: "NUS Business School",
        country: "Singapore 🇸🇬",
        text: "The trainers at Valmiki Group are highly experienced. Their GMAT Focus Edition material is the best I've seen. Scored 755!",
      },
    ],
    faqs: [
      {
        q: "What is the GMAT Focus Edition?",
        a: "The GMAT Focus Edition is the updated version of the GMAT launched in 2023. It has three sections: Quantitative Reasoning, Verbal Reasoning, and Data Insights (replacing Integrated Reasoning and AWA).",
      },
      {
        q: "What GMAT score do I need for top MBA programs?",
        a: "Top MBA programs like Harvard, Wharton, and LBS look for scores of 720+ (old scale) or 665+ on the Focus Edition. A score of 700+ significantly strengthens your application.",
      },
      {
        q: "How long does it take to prepare for GMAT?",
        a: "Most students need 3–6 months of preparation to reach their target score. Our intensive batches can help you prepare in 8–12 weeks with focused daily practice.",
      },
      {
        q: "Is the GMAT harder than GRE for MBA admissions?",
        a: "Both are accepted at most business schools. GMAT is traditionally preferred for MBA admissions but GRE is gaining acceptance. The best test for you depends on your strengths.",
      },
    ],
  },
  celpip: {
    name: "CELPIP",
    tagline: "Canadian English Language Proficiency Index Program",
    gradient: "from-[#c0392b] to-[#e74c3c]",
    accentColor: "#c0392b",
    bgLight: "#fdf2f2",
    icon: "🍁",
    whoNeedsIt:
      "CELPIP is Canada's only nationally designated English proficiency test accepted by Immigration, Refugees and Citizenship Canada (IRCC) for Canadian PR and citizenship applications, as well as by many Canadian universities and professional bodies.",
    features: [
      {
        icon: "🍁",
        title: "Canada Specific",
        desc: "Exclusively designed for Canadian immigration",
      },
      {
        icon: "💻",
        title: "Fully Computer-Based",
        desc: "All sections on computer including speaking",
      },
      {
        icon: "⚡",
        title: "Quick Results",
        desc: "Scores available within 4–5 business days",
      },
      {
        icon: "🏅",
        title: "CLB Aligned",
        desc: "Direct alignment with Canadian Language Benchmarks",
      },
    ],
    testimonials: [
      {
        name: "Deepak Sharma",
        score: "CELPIP 10",
        university: "University of British Columbia",
        country: "Canada 🇨🇦",
        text: "CELPIP coaching at Valmiki Group was very thorough. Got Level 10 in all four skills and my Canadian PR was approved quickly!",
      },
      {
        name: "Pooja Iyer",
        score: "CELPIP 9",
        university: "Canadian PR Application",
        country: "Canada 🇨🇦",
        text: "The trainers explained the unique CELPIP format clearly. The computer-based practice tests were extremely helpful. Got Level 9!",
      },
      {
        name: "Manoj Reddy",
        score: "CELPIP 10",
        university: "Saskatchewan Immigration",
        country: "Canada 🇨🇦",
        text: "Excellent coaching! The CELPIP material at Valmiki Group covers every task type in detail. Achieved CLB 10 across all skills!",
      },
    ],
    faqs: [
      {
        q: "What is CELPIP used for?",
        a: "CELPIP is used for Canadian immigration applications (Express Entry, Provincial Nominee Programs), Canadian citizenship, and admission to some Canadian colleges and professional licensing bodies.",
      },
      {
        q: "What CELPIP score do I need for Express Entry?",
        a: "For Canadian Express Entry (Federal Skilled Worker), you need a minimum CELPIP score of 6 in each skill. A score of 9 or 10 earns maximum points for language proficiency.",
      },
      {
        q: "Is CELPIP easier than IELTS?",
        a: "Many test-takers find CELPIP easier because it is computer-based, uses everyday Canadian English, and has a simpler format. However, this depends on individual strengths.",
      },
      {
        q: "How long is CELPIP valid?",
        a: "CELPIP scores are valid for 2 years from the date of the test for immigration purposes.",
      },
      {
        q: "Can I take CELPIP coaching online?",
        a: "Yes, we offer CELPIP online coaching with live interactive sessions, full-length practice tests, and personalised feedback from certified trainers.",
      },
    ],
  },
  "digital-sat": {
    name: "Digital SAT",
    tagline: "Scholastic Assessment Test — Digital Format",
    gradient: "from-[#a93226] to-[#c0392b]",
    accentColor: "#c0392b",
    bgLight: "#fdf2f2",
    icon: "🎓",
    whoNeedsIt:
      "The Digital SAT is required for undergraduate admission to most US colleges and universities. Since March 2024, the SAT is fully digital with adaptive testing. High SAT scores improve scholarship eligibility and strengthen college applications.",
    features: [
      {
        icon: "💻",
        title: "Adaptive Testing",
        desc: "Computer-adaptive test adjusts to your level",
      },
      {
        icon: "⏱️",
        title: "Shorter Format",
        desc: "Only 2 hours 14 minutes — more focused exam",
      },
      {
        icon: "📐",
        title: "Math Mastery",
        desc: "Algebra, problem solving & data analysis",
      },
      {
        icon: "📖",
        title: "Reading & Writing",
        desc: "Evidence-based reading with grammar focus",
      },
    ],
    testimonials: [
      {
        name: "Aarav Patel",
        score: "1530/1600",
        university: "University of California Berkeley",
        country: "USA 🇺🇸",
        text: "The Digital SAT coaching at Valmiki Group helped me understand the adaptive format perfectly. Scored 1530 and got a merit scholarship at UC Berkeley!",
      },
      {
        name: "Shruti Desai",
        score: "1480/1600",
        university: "New York University",
        country: "USA 🇺🇸",
        text: "Great Digital SAT coaching! The math strategies and reading comprehension techniques were exactly what I needed. Got into NYU with a scholarship!",
      },
      {
        name: "Aryan Kapoor",
        score: "1560/1600",
        university: "University of Illinois",
        country: "USA 🇺🇸",
        text: "Valmiki Group's Digital SAT program is the best in Hyderabad. The adaptive mock tests prepared me perfectly. Scored 1560 on my very first attempt!",
      },
    ],
    faqs: [
      {
        q: "What changed in the new Digital SAT format?",
        a: "The Digital SAT (launched 2024) is shorter (2h 14min), fully computer-based, adaptive, and allows calculators in both Math modules. It has two sections: Reading & Writing, and Math.",
      },
      {
        q: "What SAT score do I need for top US universities?",
        a: "For Ivy League and top-tier universities (MIT, Stanford, Caltech), aim for 1500+. Most state universities accept 1200+ while competitive schools look for 1400+.",
      },
      {
        q: "How many times can I take the Digital SAT?",
        a: "There is no official limit to how many times you can take the SAT. Most students take it 2–3 times to improve their scores. Top schools superscore (take best section scores).",
      },
      {
        q: "Is a calculator allowed in the Digital SAT Math section?",
        a: "Yes, calculators are allowed throughout both Math modules in the Digital SAT. The Desmos graphing calculator is also built into the test interface.",
      },
      {
        q: "Does the Digital SAT score help with scholarships?",
        a: "Yes, a high SAT score (1400+) can make you eligible for merit scholarships at many US universities. Some scholarships specifically require SAT/ACT scores.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Helper: map exam ids                                               */
/* ------------------------------------------------------------------ */

function resolveExamId(slug: string): string {
  if (slug === "digital-sat" || slug === "sat") return "digital-sat";
  return slug;
}

function resolveBackendId(slug: string): string {
  if (slug === "digital-sat") return "sat";
  return slug;
}

/* ------------------------------------------------------------------ */
/*  FAQ Accordion item                                                 */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-card"
      data-ocid={`faq.item.${index}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground">{q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo Booking Form                                                  */
/* ------------------------------------------------------------------ */

function DemoBookingForm({ examName }: { examName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
  });
  const { actor } = useActor(createActor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    try {
      await actor.submitDemoClassBooking(
        examName,
        form.preferredDate,
        form.name,
        form.email,
        form.phone,
      );
    } catch (_e) {
      // non-blocking
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-8 py-12 text-center"
        data-ocid="demo_booking.success_state"
      >
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="font-heading text-2xl font-bold text-foreground">
          Booking Confirmed!
        </h3>
        <p className="max-w-sm text-muted-foreground">
          Our team will call you within 24 hours to confirm your free demo class
          for {examName}.
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => setSubmitted(false)}
          data-ocid="demo_booking.book_again_button"
        >
          Book Another Demo
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
          <Calendar className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            Book a Free Demo Class
          </h3>
          <p className="text-sm text-muted-foreground">
            Experience expert {examName} coaching — completely free
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="demo-name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="demo-name"
                required
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pl-9"
                data-ocid="demo_booking.name_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="demo-phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="demo-phone"
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="pl-9"
                data-ocid="demo_booking.phone_input"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="demo-email">Email Address</Label>
            <Input
              id="demo-email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              data-ocid="demo_booking.email_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="demo-date">Preferred Date</Label>
            <Input
              id="demo-date"
              type="date"
              value={form.preferredDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setForm({ ...form, preferredDate: e.target.value })
              }
              data-ocid="demo_booking.date_input"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-secondary text-white hover:bg-secondary/90"
          data-ocid="demo_booking.submit_button"
        >
          Book My Free Demo Class
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Batch timings table                                                */
/* ------------------------------------------------------------------ */

function BatchTimingsSection({ exam }: { exam: TestPrepExam }) {
  const timings = exam.batchTimings ?? [];
  if (timings.length === 0) return null;
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <Calendar className="h-6 w-6 text-secondary" />
        Upcoming Batches
      </h3>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-foreground">
                Batch Schedule
              </th>
              <th className="px-5 py-3 text-left font-semibold text-foreground">
                Start Date
              </th>
              <th className="px-5 py-3 text-left font-semibold text-foreground">
                End Date
              </th>
              <th className="px-5 py-3 text-right font-semibold text-foreground">
                Seats
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {timings.map((b) => (
              <tr
                key={String(b.id)}
                className="bg-card hover:bg-muted/20"
                data-ocid={`batch.row.${String(b.id)}`}
              >
                <td className="px-5 py-3 text-foreground">{b.schedule}</td>
                <td className="px-5 py-3 text-muted-foreground">
                  {b.startDate}
                </td>
                <td className="px-5 py-3 text-muted-foreground">{b.endDate}</td>
                <td className="px-5 py-3 text-right">
                  <span
                    className={
                      Number(b.enrolled) >= Number(b.capacity)
                        ? "font-semibold text-destructive"
                        : "font-semibold text-green-600"
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function TestPrepDetail() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const resolvedId = resolveExamId(examId ?? "");
  const config = EXAM_CONFIG[resolvedId];

  const { data: backendExams = [] } = useTestPrepExams();
  const backendExam = backendExams.find(
    (e) => e.id.toLowerCase() === resolveBackendId(resolvedId),
  );

  // Redirect unknown exam ids
  useEffect(() => {
    if (!config) navigate("/test-preparation", { replace: true });
  }, [config, navigate]);

  if (!config) return null;

  const description = backendExam?.description?.trim()
    ? backendExam.description
    : "Expert coaching program designed to help you achieve your target score.";
  const duration = backendExam?.duration?.trim() ? backendExam.duration : "";
  const cost = backendExam?.cost?.trim() ? backendExam.cost : "";
  const scoreRange = backendExam?.scoreRange?.trim()
    ? backendExam.scoreRange
    : "";
  const successRate = backendExam?.successRate?.trim()
    ? backendExam.successRate
    : "";
  const batchCount = backendExam?.batchTimings?.length
    ? `${backendExam.batchTimings.length} Active`
    : "Multiple Batches";

  return (
    <>
      {/* Hero Banner */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} py-20 md:py-28`}
      >
        {backendExam?.imageUrl && (
          <div className="absolute inset-0">
            <img
              src={backendExam.imageUrl}
              alt={config.name}
              className="h-full w-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/test-preparation" className="hover:text-white">
              Test Preparation
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{config.name}</span>
          </nav>
          <div className="flex items-start gap-6">
            <div className="hidden text-6xl md:block">{config.icon}</div>
            <div>
              <Badge className="mb-3 border border-white/30 bg-white/20 text-white">
                Smart Learning
              </Badge>
              <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                {config.name}
              </h1>
              <p className="mt-2 text-lg font-medium text-white/80">
                {config.tagline}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
                {description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-white font-bold hover:bg-white/90"
                  style={{ color: config.accentColor }}
                  data-ocid="hero.enroll_button"
                >
                  <Link to="/free-counseling">
                    Enroll Now — Free Counseling
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                  data-ocid="hero.demo_button"
                >
                  <a href="#demo-booking">Book Free Demo</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Stats */}
      <section className="border-b border-border bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                icon: Clock,
                label: "Duration",
                value: duration || "Flexible",
              },
              {
                icon: DollarSign,
                label: "Course Fee",
                value: cost || "Contact Us",
              },
              { icon: Calendar, label: "Batches", value: batchCount },
              {
                icon: TrendingUp,
                label: "Success Rate",
                value: successRate || "90%+",
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3"
                data-ocid={`course_stat.item.${i + 1}`}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${config.accentColor}15` }}
                >
                  <stat.icon
                    className="h-6 w-6"
                    style={{ color: config.accentColor }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-foreground">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Who Needs It */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Who needs it */}
            <div>
              <Badge
                variant="outline"
                className="mb-3"
                style={{
                  borderColor: `${config.accentColor}50`,
                  color: config.accentColor,
                }}
              >
                Who Needs It
              </Badge>
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Is {config.name} Right for You?
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {config.whoNeedsIt}
              </p>
              {scoreRange && (
                <div
                  className="mt-6 inline-flex items-center gap-3 rounded-xl px-5 py-3"
                  style={{ backgroundColor: config.bgLight }}
                >
                  <Award
                    className="h-5 w-5"
                    style={{ color: config.accentColor }}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">Score Range</p>
                    <p
                      className="font-bold"
                      style={{ color: config.accentColor }}
                    >
                      {scoreRange}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Features grid */}
            <div>
              <Badge
                variant="outline"
                className="mb-3"
                style={{
                  borderColor: `${config.accentColor}50`,
                  color: config.accentColor,
                }}
              >
                Why Choose Valmiki
              </Badge>
              <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                What Our Coaching Includes
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {config.features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <span className="text-2xl">{f.icon}</span>
                    <h4 className="mt-2 font-semibold text-foreground">
                      {f.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Batch Timings */}
      {backendExam && backendExam.batchTimings.length > 0 && (
        <section className="bg-muted/30 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <BatchTimingsSection exam={backendExam} />
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <Badge
              variant="outline"
              className="mb-3"
              style={{
                borderColor: `${config.accentColor}50`,
                color: config.accentColor,
              }}
            >
              Success Stories
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Students Who Aced {config.name}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {config.testimonials.map((t, i) => (
              <Card
                key={t.name}
                className="glass-card shadow-subtle"
                data-ocid={`testimonial.item.${i + 1}`}
              >
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((si) => (
                      <Star
                        key={`star-${i}-${si}`}
                        className="h-4 w-4 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="leading-relaxed text-muted-foreground">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">
                          {t.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.university} · {t.country}
                        </p>
                      </div>
                      <Badge
                        className="ml-auto shrink-0 text-xs"
                        style={{
                          backgroundColor: `${config.accentColor}20`,
                          color: config.accentColor,
                          borderColor: `${config.accentColor}40`,
                        }}
                      >
                        {t.score}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <Badge
                variant="outline"
                className="mb-3"
                style={{
                  borderColor: `${config.accentColor}50`,
                  color: config.accentColor,
                }}
              >
                FAQ
              </Badge>
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3" data-ocid="faq.list">
              {config.faqs.map((faq, i) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i + 1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Booking Form */}
      <section id="demo-booking" className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <DemoBookingForm examName={config.name} />
          </div>
        </div>
      </section>

      {/* Back link */}
      <section className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <Link
            to="/test-preparation"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
            data-ocid="back_to_hub.link"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Test Preparation Hub
          </Link>
        </div>
      </section>
    </>
  );
}
