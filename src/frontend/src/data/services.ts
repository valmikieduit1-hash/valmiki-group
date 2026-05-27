import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "study-abroad",
    title: "Study Abroad Counseling",
    shortDescription:
      "Personalized guidance to choose the right country, university, and course aligned with your career goals.",
    fullDescription:
      "Our expert counselors provide end-to-end guidance for your study abroad journey. From profile assessment and university shortlisting to application submission and admission acceptance, we ensure every step is handled with precision and care. With partnerships across 350+ universities worldwide, we help you find the perfect match for your academic and career aspirations.",
    icon: "GraduationCap",
    features: [
      "Free profile assessment & career counseling",
      "University shortlisting based on profile & budget",
      "Application documentation & submission support",
      "Admission follow-up & offer negotiation",
      "Pre-departure orientation & briefing",
    ],
    ctaText: "Book Free Counseling",
    ctaLink: "/free-counseling",
  },
  {
    id: "immigration",
    title: "Immigration Services",
    shortDescription:
      "Expert assistance for PR visas, work visas, and family sponsorship with high success rates.",
    fullDescription:
      "Navigate complex immigration pathways with confidence. Our registered immigration consultants provide comprehensive support for Permanent Residency (PR) applications, work permits, dependent visas, and tourist visas. We stay updated with the latest immigration policies to maximize your chances of success.",
    icon: "Globe",
    features: [
      "PR visa application & documentation",
      "Work permit & skilled worker visas",
      "Dependent & family sponsorship visas",
      "Tourist & visitor visa assistance",
      "Immigration policy updates & compliance",
    ],
    ctaText: "Check Eligibility",
    ctaLink: "/visa-checker",
  },
  {
    id: "visa-assistance",
    title: "Visa Assistance",
    shortDescription:
      "End-to-end visa processing with mock interviews and documentation support for 93% success rate.",
    fullDescription:
      "Our visa experts handle everything from document preparation and application filing to interview coaching and follow-up. With a 93% visa success rate, we ensure your visa application is thorough, accurate, and compelling. We specialize in student visas, work visas, and tourist visas for all major destinations.",
    icon: "FileCheck",
    features: [
      "Document checklist & verification",
      "Visa application filing & tracking",
      "Mock interview preparation",
      "Financial documentation guidance",
      "Visa rejection analysis & reapplication",
    ],
    ctaText: "Start Visa Process",
    ctaLink: "/contact",
  },
  {
    id: "test-prep",
    title: "Test Preparation",
    shortDescription:
      "Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT & SAT with proven strategies and mock tests.",
    fullDescription:
      "Achieve your target scores with our comprehensive test preparation programs. Our certified trainers use proven methodologies, personalized study plans, and extensive mock tests to ensure you're fully prepared. We offer flexible batch timings, online and offline classes, and unlimited doubt-clearing sessions.",
    icon: "BookOpen",
    features: [
      "IELTS, PTE, TOEFL, GRE, GMAT & SAT coaching",
      "Personalized study plans & progress tracking",
      "Full-length mock tests with detailed analysis",
      "Small batch sizes for individual attention",
      "Online & offline class options",
    ],
    ctaText: "View Batches",
    ctaLink: "/test-preparation",
  },
  {
    id: "scholarships",
    title: "Scholarship Guidance",
    shortDescription:
      "Identify and apply for merit-based and need-based scholarships to reduce your education costs.",
    fullDescription:
      "Don't let finances limit your dreams. Our scholarship experts help you identify relevant scholarships, prepare winning applications, and meet deadlines. We maintain an updated database of scholarships from universities, governments, and private organizations worldwide.",
    icon: "Award",
    features: [
      "Scholarship database & matching",
      "Application strategy & essay guidance",
      "Merit-based & need-based scholarships",
      "Government & private funding options",
      "Deadline tracking & submission support",
    ],
    ctaText: "Find Scholarships",
    ctaLink: "/contact",
  },
  {
    id: "education-loans",
    title: "Education Loans",
    shortDescription:
      "Assistance with education loan applications from leading banks with competitive interest rates.",
    fullDescription:
      "We partner with leading banks and financial institutions to help you secure education loans with favorable terms. Our team assists with loan application documentation, collateral guidance, and co-applicant requirements. We ensure you get the best interest rates and repayment terms.",
    icon: "CreditCard",
    features: [
      "Loan eligibility assessment",
      "Bank comparison & rate negotiation",
      "Documentation & application support",
      "Collateral & co-applicant guidance",
      "Loan disbursement tracking",
    ],
    ctaText: "Apply for Loan",
    ctaLink: "/contact",
  },
  {
    id: "sop-guidance",
    title: "SOP & Documentation",
    shortDescription:
      "Professional SOP writing, LOR guidance, and resume building to make your application stand out.",
    fullDescription:
      "Your Statement of Purpose (SOP) can make or break your application. Our expert writers craft compelling, personalized SOPs that highlight your strengths, aspirations, and fit with the university. We also provide guidance for Letters of Recommendation (LOR) and professional resume building.",
    icon: "FileText",
    features: [
      "Custom SOP writing & editing",
      "LOR guidance & templates",
      "Professional resume building",
      "Application essay support",
      "Document verification & formatting",
    ],
    ctaText: "Get SOP Help",
    ctaLink: "/contact",
  },
  {
    id: "career-counseling",
    title: "Career Counseling",
    shortDescription:
      "Strategic career planning with industry insights, skill gap analysis, and job market trends.",
    fullDescription:
      "Plan your career with clarity and confidence. Our career counselors analyze your profile, identify skill gaps, and create a roadmap aligned with global job market trends. Whether you're a student choosing a course or a professional seeking international opportunities, we provide actionable guidance.",
    icon: "Briefcase",
    features: [
      "Career aptitude assessment",
      "Industry trend analysis",
      "Skill gap identification",
      "International job market insights",
      "Long-term career roadmap planning",
    ],
    ctaText: "Plan Your Career",
    ctaLink: "/free-counseling",
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}
