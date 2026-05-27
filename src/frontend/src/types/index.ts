export interface Country {
  name: string;
  slug: string;
  flagEmoji: string;
  flagCdnCode?: string;
  heroHeadline: string;
  heroSubheadline: string;
  whyStudy: string[];
  topUniversities: string[];
  avgTuition: string;
  costOfLiving: string;
  visaProcessingTime: string;
  workRights: string;
  prPathway: string;
  popularCourses: string[];
  intakeMonths: string[];
  scholarshipOpportunities: string[];
  visaSuccessRate?: string;
  costOfLivingBreakdown?: {
    rent: string;
    food: string;
    transport: string;
    utilities: string;
    total: string;
  };
  visaProcessSteps?: string[];
  scholarships?: {
    name: string;
    amount: string;
    description: string;
  }[];
  courseSalaries?: {
    course: string;
    avgSalary: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
}

export interface Testimonial {
  id: string;
  studentName: string;
  photo: string;
  country: string;
  university: string;
  course: string;
  quote: string;
  visaSuccess: boolean;
  rating: number;
}

export interface Event {
  id: string;
  title: string;
  type: "Education Fair" | "Webinar" | "Spot Assessment" | "Admission Event";
  date: string;
  time: string;
  location: string;
  description: string;
  registrationLink: string;
  isVirtual: boolean;
}

export interface University {
  id: string;
  name: string;
  country: string;
  logo: string;
  ranking: string;
  popularCourses: string[];
  tuitionRange: string;
  acceptanceRate: string;
  website: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
