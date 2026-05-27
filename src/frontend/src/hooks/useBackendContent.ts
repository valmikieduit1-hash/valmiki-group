import { createActor } from "@/backend";
import type {
  AboutPageContent,
  BeOurPartnerContent,
  BlogPost,
  ContactInfo,
  CountryDetailContent,
  CountryInfo,
  EventItem,
  FreeCounselingContent,
  HeroContent,
  HomeSectionsContent,
  ImmigrationVisa,
  LeadershipMember,
  LifeAtValmikiContent,
  PartnerUniversity,
  ServiceDetailContent,
  ServiceItem,
  StudyAbroadContent,
  TeamMember,
  TestPrepExam,
  TestimonialItem,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// re-export for convenience
export type { ServiceDetailContent, BeOurPartnerContent };

export function useHeroContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HeroContent | null>({
    queryKey: ["heroContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeroContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// Global hook that loads all key backend data in one place
export function useGlobalContent() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const heroQuery = useQuery<HeroContent | null>({
    queryKey: ["heroContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeroContent();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const countriesQuery = useQuery<CountryInfo[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCountryInfoAll();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const footerQuery = useQuery<FooterContent>({
    queryKey: ["footerContent"],
    queryFn: async () => {
      if (!actor) return defaultFooterContent;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).getFooterContent();
        return result ?? defaultFooterContent;
      } catch {
        return defaultFooterContent;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
    placeholderData: defaultFooterContent,
  });

  const themeQuery = useQuery({
    queryKey: ["websiteTheme"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWebsiteTheme();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const homeSectionsQuery = useQuery<HomeSectionsContent | null>({
    queryKey: ["homeSectionsContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHomeSectionsContent();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const isLoading =
    actorFetching ||
    heroQuery.isLoading ||
    countriesQuery.isLoading ||
    footerQuery.isLoading ||
    themeQuery.isLoading ||
    homeSectionsQuery.isLoading;

  // Build a slug-keyed map of countries for quick lookup
  const countriesMap = Object.fromEntries(
    (countriesQuery.data ?? []).map((c) => [
      c.slug,
      {
        slug: c.slug,
        flagImage: c.flagImage,
        heroImage: c.heroImage,
        visaSuccessRate: c.visaSuccessRate,
      },
    ]),
  );

  function refetchAll() {
    queryClient.invalidateQueries({ queryKey: ["heroContent"] });
    queryClient.invalidateQueries({ queryKey: ["countries"] });
    queryClient.invalidateQueries({ queryKey: ["footerContent"] });
    queryClient.invalidateQueries({ queryKey: ["websiteTheme"] });
    queryClient.invalidateQueries({ queryKey: ["homeSectionsContent"] });
  }

  return {
    isLoading,
    // Never return a hardcoded fallback string — return undefined while loading
    heroContent: heroQuery.data ?? undefined,
    countriesMap,
    footerContent: footerQuery.data ?? undefined,
    websiteTheme: themeQuery.data ?? undefined,
    homeSections: homeSectionsQuery.data ?? undefined,
    refetchAll,
  };
}

export function useServices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ServiceItem[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCountries() {
  const { actor, isFetching } = useActor(createActor);
  const query = useQuery<CountryInfo[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCountryInfoAll();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  function getStoredOrder(): string[] {
    try {
      const stored = localStorage.getItem("valmikiCountryOrder");
      if (stored) return JSON.parse(stored) as string[];
    } catch {}
    return ["us", "ca", "gb", "au", "de", "ie", "nz", "ae", "sg", "eu"];
  }

  const storedOrder = getStoredOrder();
  const orderedCountries = [...(query.data ?? [])].sort((a, b) => {
    const ai = storedOrder.indexOf(a.slug);
    const bi = storedOrder.indexOf(b.slug);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return { ...query, orderedCountries };
}

export function useTestimonials() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TestimonialItem[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getTestimonials();
      return result.filter((t) => t.isVisible);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useEvents() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<EventItem[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getEvents();
      return result.filter((e) => e.isActive);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useTeamMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TeamMember[]>({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeamMembers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ContactInfo | null>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
export function usePublishedBlogPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BlogPost[]>({
    queryKey: ["publishedBlogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useTestPrepExams() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<TestPrepExam[]>({
    queryKey: ["testPrepExams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestPrepExams();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useImmigrationVisas() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ImmigrationVisa[]>({
    queryKey: ["immigrationVisas"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getImmigrationVisas();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useAboutPageContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AboutPageContent | null>({
    queryKey: ["aboutPageContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAboutPageContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useStudyAbroadContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<StudyAbroadContent | null>({
    queryKey: ["studyAbroadContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudyAbroadContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function usePartnerUniversities() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PartnerUniversity[]>({
    queryKey: ["partnerUniversities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPartnerUniversities();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCountryDetail(slug: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<CountryDetailContent | null>({
    queryKey: ["countryDetail", slug],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCountryDetailBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useLeadershipMembers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LeadershipMember[]>({
    queryKey: ["leadershipMembers"],
    queryFn: async () => {
      if (!actor) return [] as LeadershipMember[];
      const result = await actor.getLeadershipMembers();
      return result as LeadershipMember[];
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
export function useHomeSectionsContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<HomeSectionsContent | null>({
    queryKey: ["homeSectionsContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHomeSectionsContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useLifeAtValmikiContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<LifeAtValmikiContent | null>({
    queryKey: ["lifeAtValmikiContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLifeAtValmikiContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useServiceDetail(serviceId: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ServiceDetailContent | null>({
    queryKey: ["serviceDetail", serviceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getServiceDetail(serviceId);
    },
    enabled: !!actor && !isFetching && !!serviceId,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useBeOurPartnerContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BeOurPartnerContent | null>({
    queryKey: ["beOurPartnerContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBeOurPartnerContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useSubmitPartnerInquiry() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      companyName: string;
      contactName: string;
      email: string;
      phone: string;
      partnershipType: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitPartnerInquiry(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerInquiries"] });
    },
  });
}

export function useFreeCounselingContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FreeCounselingContent | null>({
    queryKey: ["freeCounselingContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFreeCounselingContent();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function usePartnerInquiries() {
  const token = localStorage.getItem("valmikiAdminToken") ?? "";
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["partnerInquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPartnerInquiries(token);
    },
    staleTime: 0,
    enabled: !!token && !!actor && !isFetching,
  });
}

export function useWebsiteTheme() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["websiteTheme"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWebsiteTheme();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// ── Footer Content ──────────────────────────────────────────────────────────

export interface FooterLink {
  linkLabel: string;
  url: string;
}

export interface FooterSocialLink {
  platform: string;
  url: string;
}

export interface ReviewsBadge {
  rating: string;
  reviewCount: string;
  reviewUrl: string;
  isVisible: boolean;
}

export interface EduLoanPartner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
}

export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

export interface FooterContent {
  quickLinks: FooterLink[];
  serviceLinks: FooterLink[];
  countryLinks: FooterLink[];
  socialLinks: FooterSocialLink[];
  whatsappNumber: string;
  copyrightText: string;
  googleReviewsBadge: ReviewsBadge;
  facebookReviewsBadge: ReviewsBadge;
  eduLoanPartners: EduLoanPartner[];
  officeLocations: OfficeLocation[];
}

export const defaultFooterContent: FooterContent = {
  quickLinks: [
    { linkLabel: "About Us", url: "/about" },
    { linkLabel: "Study Abroad", url: "/study-abroad" },
    { linkLabel: "Countries", url: "/countries" },
    { linkLabel: "Services", url: "/services" },
    { linkLabel: "Test Preparation", url: "/test-preparation" },
    { linkLabel: "Immigration", url: "/immigration" },
    { linkLabel: "Success Stories", url: "/success-stories" },
    { linkLabel: "Contact Us", url: "/contact" },
  ],
  serviceLinks: [
    { linkLabel: "Study Abroad Counseling", url: "/services" },
    { linkLabel: "Immigration Services", url: "/immigration" },
    { linkLabel: "Visa Assistance", url: "/services" },
    { linkLabel: "Test Preparation", url: "/test-preparation" },
    { linkLabel: "Scholarship Guidance", url: "/services" },
    { linkLabel: "Education Loans", url: "/services" },
    { linkLabel: "SOP & Documentation", url: "/services" },
    { linkLabel: "Career Counseling", url: "/free-counseling" },
  ],
  countryLinks: [
    { linkLabel: "Study in USA", url: "/countries/usa" },
    { linkLabel: "Study in Canada", url: "/countries/canada" },
    { linkLabel: "Study in UK", url: "/countries/uk" },
    { linkLabel: "Study in Australia", url: "/countries/australia" },
    { linkLabel: "Study in Germany", url: "/countries/germany" },
    { linkLabel: "Study in Ireland", url: "/countries/ireland" },
    { linkLabel: "Study in New Zealand", url: "/countries/new-zealand" },
    { linkLabel: "Study in Dubai", url: "/countries/dubai" },
    { linkLabel: "Study in Singapore", url: "/countries/singapore" },
    { linkLabel: "Study in Europe", url: "/countries/europe" },
  ],
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/company/valmikigroup" },
    { platform: "Facebook", url: "https://facebook.com/valmikigroup" },
    { platform: "Instagram", url: "https://instagram.com/valmikigroup" },
    { platform: "YouTube", url: "https://youtube.com/@valmikigroup" },
  ],
  whatsappNumber: "919090474777",
  copyrightText: "© {year} Valmiki Group. All rights reserved.",
  googleReviewsBadge: {
    rating: "4.8",
    reviewCount: "500+ reviews",
    reviewUrl: "https://g.page/r/valmikigroup/review",
    isVisible: false,
  },
  facebookReviewsBadge: {
    rating: "4.7",
    reviewCount: "300+ reviews",
    reviewUrl: "https://facebook.com/valmikigroup/reviews",
    isVisible: false,
  },
  eduLoanPartners: [],
  officeLocations: [],
};

export function useFooterContent() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<FooterContent>({
    queryKey: ["footerContent"],
    queryFn: async () => {
      if (!actor) return defaultFooterContent;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await (actor as any).getFooterContent();
        return result ?? defaultFooterContent;
      } catch {
        return defaultFooterContent;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    refetchOnWindowFocus: true,
    placeholderData: defaultFooterContent,
  });
}

export function useUpdateFooterContent() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      token,
      content,
    }: { token: string; content: FooterContent }) => {
      if (!actor) throw new Error("Actor not ready");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).updateFooterContent(token, content);
      if (result && "err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["footerContent"] });
    },
  });
}

export function useUpdateWebsiteTheme() {
  const queryClient = useQueryClient();
  const { actor } = useActor(createActor);
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async ({ token, theme }: { token: string; theme: any }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.updateWebsiteTheme(token, theme);
      if ("err" in result) throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteTheme"] });
    },
  });
}
