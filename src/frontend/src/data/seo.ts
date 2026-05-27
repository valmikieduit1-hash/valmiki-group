import type { SEOMeta } from "@/types";

export const seoData: Record<string, SEOMeta> = {
  home: {
    title: "Valmiki Group — Overseas Education & Immigration Consultancy",
    description:
      "Trusted overseas education & immigration experts since 2001. 1 lakh+ students guided, 350+ university partnerships, 93% visa success rate. Book free counseling.",
    keywords: [
      "overseas education consultants",
      "study abroad consultants Hyderabad",
      "student visa consultants",
      "immigration services",
      "Valmiki Group",
    ],
  },
  about: {
    title: "About Us — Valmiki Group | 24+ Years of Excellence",
    description:
      "Learn about Valmiki Group's journey since 2001. Leading overseas education consultancy in Hyderabad with expert counselors and global university partnerships.",
    keywords: [
      "about Valmiki Group",
      "overseas education consultancy history",
      "study abroad experts Hyderabad",
    ],
  },
  studyAbroad: {
    title: "Study Abroad — Valmiki Group | Global Education Opportunities",
    description:
      "Comprehensive study abroad services for USA, Canada, UK, Australia, Germany & more. University admissions, scholarships, and visa assistance.",
    keywords: [
      "study abroad",
      "overseas education",
      "university admissions",
      "study in USA",
      "study in Canada",
      "study in UK",
    ],
  },
  countries: {
    title: "Study Abroad Countries — Valmiki Group",
    description:
      "Explore top study destinations: USA, Canada, UK, Australia, Germany, Ireland, New Zealand, Dubai, Singapore & Europe. Find your perfect country.",
    keywords: [
      "study abroad countries",
      "best countries to study",
      "overseas education destinations",
    ],
  },
  services: {
    title: "Our Services — Valmiki Group | End-to-End Education Support",
    description:
      "Complete range of overseas education services: counseling, visa assistance, test prep, scholarships, education loans, SOP guidance & more.",
    keywords: [
      "overseas education services",
      "student visa assistance",
      "test preparation",
      "scholarship guidance",
      "education loans",
    ],
  },
  testPreparation: {
    title: "Test Preparation — IELTS, PTE, TOEFL, GRE, GMAT Coaching",
    description:
      "Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT & SAT. Mock tests, online classes, and proven success strategies at Valmiki Group.",
    keywords: [
      "IELTS coaching Hyderabad",
      "PTE coaching",
      "TOEFL preparation",
      "GRE coaching",
      "GMAT classes",
    ],
  },
  immigration: {
    title: "Immigration Services — PR Visa, Work Visa & More",
    description:
      "Professional immigration services: PR visa, work visa, tourist visa, dependent visa. Expert counseling for USA, Canada, Australia & UK immigration.",
    keywords: [
      "immigration consultants Hyderabad",
      "PR visa services",
      "work visa assistance",
      "immigration counseling",
    ],
  },
  successStories: {
    title: "Student Success Stories — Valmiki Group",
    description:
      "Inspiring success stories of students who achieved their global education dreams with Valmiki Group. Visa approvals, university admits & testimonials.",
    keywords: [
      "student success stories",
      "visa success stories",
      "study abroad testimonials",
      "university admission success",
    ],
  },
  contact: {
    title: "Contact Us — Valmiki Group | Get in Touch",
    description:
      "Contact Valmiki Group for free counseling. Branches in Secunderabad & Jubilee Hills, Hyderabad. Call +91-9090 4747 77 or email enquiry@valmikigroup.com.",
    keywords: [
      "contact Valmiki Group",
      "overseas education consultants Hyderabad",
      "study abroad counseling",
    ],
  },
  freeCounseling: {
    title: "Book Free Counseling — Valmiki Group",
    description:
      "Book your free counseling session with Valmiki Group. Expert guidance for study abroad, university selection, visa process & scholarships.",
    keywords: [
      "free counseling study abroad",
      "book counseling session",
      "study abroad guidance free",
    ],
  },
  visaChecker: {
    title: "Visa Eligibility Checker — Valmiki Group",
    description:
      "Check your visa eligibility instantly. Free visa assessment tool for student visas, work visas & PR visas to USA, Canada, UK, Australia & more.",
    keywords: [
      "visa eligibility checker",
      "visa assessment tool",
      "student visa eligibility",
    ],
  },
  courseFinder: {
    title: "Course Finder — Find Your Perfect Program | Valmiki Group",
    description:
      "Find the perfect course and university with our AI-powered course finder. Filter by country, field of study, budget & more.",
    keywords: [
      "course finder",
      "university course search",
      "study program finder",
      "best courses abroad",
    ],
  },
};

export function getSEOData(pageKey: string): SEOMeta {
  return (
    seoData[pageKey] ?? {
      title: "Valmiki Group — Overseas Education & Immigration",
      description:
        "Trusted overseas education & immigration experts since 2001.",
      keywords: ["Valmiki Group", "study abroad", "immigration"],
    }
  );
}
