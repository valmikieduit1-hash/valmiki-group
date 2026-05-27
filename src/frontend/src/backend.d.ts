import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FAQ {
    id: RecordId;
    question: string;
    order: bigint;
    answer: string;
}
export interface ServiceProcessStep {
    title: string;
    order: bigint;
    icon: string;
    description: string;
}
export interface NewsletterSubscription {
    id: RecordId;
    email: string;
    timestamp: Timestamp;
}
export interface JobOpeningInput {
    title: string;
    description: string;
    isActive: boolean;
    department: string;
    requirements: string;
    location: string;
}
export interface HomeSectionPoint {
    title: string;
    icon: string;
    description: string;
}
export interface ContactSubmission {
    id: RecordId;
    inquiryType: string;
    name: string;
    email: string;
    message: string;
    timestamp: Timestamp;
    phone: string;
}
export interface PageHeroContent {
    headline: string;
    imageUrl: string;
    subheadline: string;
    pageId: string;
}
export interface BeOurPartnerInquiry {
    id: bigint;
    contactName: string;
    partnershipType: string;
    submittedAt: bigint;
    email: string;
    message: string;
    companyName: string;
    phone: string;
}
export interface AdminDashboardStats {
    pending: bigint;
    totalLeads: bigint;
    thisMonth: bigint;
}
export interface TimelineEntry {
    id: RecordId;
    year: string;
    description: string;
    milestone: string;
}
export interface TestimonialInput {
    country: string;
    name: string;
    text: string;
    university: string;
    imageUrl: string;
    isVisible: boolean;
    rating: bigint;
    course: string;
    youtubeUrl?: string;
}
export interface VisaStep {
    id: RecordId;
    title: string;
    order: bigint;
    description: string;
}
export interface FooterLink {
    url: string;
    linkLabel: string;
}
export interface Achievement {
    id: RecordId;
    metric: string;
    icon: string;
    description: string;
}
export interface CountryUniversity {
    id: RecordId;
    name: string;
    tuition: string;
    website: string;
    logoUrl: string;
    ranking: string;
}
export interface FacebookReviewsBadge {
    reviewUrl: string;
    isVisible: boolean;
    rating: string;
    reviewCount: string;
}
export interface CountryFAQ {
    question: string;
    answer: string;
}
export interface PageContent {
    heroImageUrl: string;
    metaDescription: string;
    bodyContent: string;
    title: string;
    isActive: boolean;
    heroSubheadline: string;
    sections: Array<PageSection>;
    heroHeadline: string;
    pageId: string;
}
export type SessionToken = string;
export interface EduLoanPartner {
    id: string;
    websiteUrl: string;
    name: string;
    logoUrl: string;
}
export interface TeamMemberInput {
    bio: string;
    order: bigint;
    name: string;
    role: string;
    imageUrl: string;
}
export interface ContactInfo {
    branch2Name: string;
    email: string;
    branch1Name: string;
    branch3Name: string;
    address1: string;
    address2: string;
    address3: string;
    phone1: string;
    phone2: string;
    phone3: string;
}
export interface PartnerUniversity {
    id: RecordId;
    country: string;
    order: bigint;
    name: string;
    website: string;
    logoUrl: string;
}
export interface CountryDetailContent {
    heroImageUrl: string;
    workRights: string;
    faqs: Array<FAQ>;
    universities: Array<CountryUniversity>;
    heroSubtitle: string;
    visaProcess: Array<VisaStep>;
    countrySlug: string;
    prOpportunities: string;
    popularCourses: Array<string>;
    costOfLiving: CostBreakdown;
    heroTitle: string;
    scholarships: Array<string>;
    whyStudyHere: string;
}
export interface OfficeLocation {
    id: string;
    city: string;
    email: string;
    address: string;
    phone: string;
}
export interface LifeAtValmikiGalleryImage {
    imageUrl: string;
    caption: string;
}
export interface TestimonialItem {
    id: RecordId;
    country: string;
    name: string;
    text: string;
    university: string;
    imageUrl: string;
    isVisible: boolean;
    rating: bigint;
    course: string;
    youtubeUrl?: string;
}
export interface HeroContent {
    yearsExperience: string;
    headline: string;
    studentsGuided: string;
    subheadline: string;
    universityPartnerships: string;
    visaSuccessRate: string;
}
export interface FreeCounselingBenefitPoint {
    title: string;
    description: string;
}
export interface FooterSocialLink {
    url: string;
    platform: string;
}
export interface EventItem {
    id: RecordId;
    title: string;
    date: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    registrationLink: string;
    location: string;
}
export interface ServiceDetailContent {
    faqs: Array<ServiceFAQ>;
    ctaButtonText: string;
    overview: string;
    processSteps: Array<ServiceProcessStep>;
    heroImage: string;
    ctaText: string;
    heroSubheadline: string;
    serviceId: string;
    heroHeadline: string;
    eligibilityCriteria: Array<string>;
    whyChooseValmiki: Array<string>;
    whatIsIncluded: Array<string>;
}
export interface ImmigrationVisa {
    id: string;
    title: string;
    successRate: string;
    description: string;
    processingTime: string;
    visaType: string;
    imageUrl: string;
    documentsRequired: Array<string>;
    requirements: Array<string>;
    eligibilityCriteria: Array<string>;
}
export interface FooterContent {
    facebookReviewsBadge: FacebookReviewsBadge;
    serviceLinks: Array<FooterLink>;
    socialLinks: Array<FooterSocialLink>;
    googleReviewsBadge: GoogleReviewsBadge;
    copyrightText: string;
    whatsappNumber: string;
    quickLinks: Array<FooterLink>;
    countryLinks: Array<FooterLink>;
    eduLoanPartners: Array<EduLoanPartner>;
    officeLocations: Array<OfficeLocation>;
}
export interface VisaEligibilityResult {
    id: RecordId;
    age: bigint;
    country: string;
    education: string;
    testScores: string;
    visaType: string;
    timestamp: Timestamp;
    workExperienceYears: bigint;
    resultPercentage: bigint;
}
export interface JobApplicationInput {
    applicantName: string;
    positionApplied: string;
    coverLetter: string;
    email: string;
    phone: string;
    jobOpeningId: bigint;
    resumeUrl: string;
}
export interface StudyAbroadContent {
    headline: string;
    intakeInfo: string;
    processSteps: Array<ProcessStep>;
    imageUrl: string;
    introduction: string;
    scholarships: Array<ScholarshipInfo>;
}
export interface JobOpening {
    id: bigint;
    title: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    department: string;
    requirements: string;
    location: string;
}
export interface CostBreakdown {
    miscellaneous: string;
    food: string;
    transport: string;
    totalMonthly: string;
    accommodation: string;
}
export interface GalleryEntryInput {
    studentName: string;
    order: bigint;
    universityAdmitted: string;
    imageUrl: string;
    isVisible: boolean;
    destinationCountry: string;
    visaStatus: string;
}
export interface ScholarshipInfo {
    id: RecordId;
    name: string;
    deadline: string;
    eligibility: string;
    amount: string;
}
export interface LifeAtValmikiContent {
    heroImageUrl: string;
    galleryImages: Array<LifeAtValmikiGalleryImage>;
    missionText: string;
    heroSubheadline: string;
    cultureDescription: string;
    perks: Array<LifeAtValmikiPerk>;
    heroHeadline: string;
}
export type Timestamp = bigint;
export interface ServiceFAQ {
    question: string;
    answer: string;
}
export interface BlogPostInput {
    title: string;
    content: string;
    isPublished: boolean;
    slug: string;
    featuredImageUrl: string;
    category: string;
}
export interface PartnershipTypeItem {
    title: string;
    icon: string;
    description: string;
    benefits: Array<string>;
}
export interface CountryTopUniversity {
    name: string;
    ranking: string;
}
export interface ProcessStep {
    id: RecordId;
    title: string;
    order: bigint;
    icon: string;
    description: string;
}
export interface JobApplication {
    id: bigint;
    applicantName: string;
    positionApplied: string;
    submittedAt: bigint;
    coverLetter: string;
    email: string;
    phone: string;
    jobOpeningId: bigint;
    resumeUrl: string;
}
export interface PageSection {
    id: string;
    title: string;
    content: string;
    order: bigint;
    sectionType: string;
    imageUrl: string;
    items: Array<string>;
}
export interface BeOurPartnerContent {
    formDescription: string;
    partnershipTypes: Array<PartnershipTypeItem>;
    generalBenefits: Array<string>;
    heroImage: string;
    heroSubheadline: string;
    heroHeadline: string;
}
export interface WebsiteTheme {
    backgroundColor: string;
    primaryColor: string;
    buttonTextColor: string;
    accentColor: string;
    buttonColor: string;
    secondaryColor: string;
    footerBgColor: string;
    footerTextColor: string;
    headingTextColor: string;
    bodyTextColor: string;
}
export type RecordId = bigint;
export interface HomeSectionsContent {
    universityMarqueeEnabled: boolean;
    whyChooseUsHeadline: string;
    ctaBannerSubheadline: string;
    footerSocialLinks: Array<HomeSocialLink>;
    whyChooseUsPoints: Array<HomeSectionPoint>;
    ctaBannerButtonText: string;
    footerDescription: string;
    ctaBannerHeadline: string;
    eventsDisplayCount: bigint;
    testimonialsDisplayCount: bigint;
}
export interface TestPrepExam {
    id: string;
    duration: string;
    scoreRange: string;
    cost: string;
    successRate: string;
    name: string;
    description: string;
    imageUrl: string;
    batchTimings: Array<BatchTiming>;
}
export interface CounselingBooking {
    id: RecordId;
    name: string;
    email: string;
    countryInterests: Array<string>;
    preferredTime: string;
    timestamp: Timestamp;
    phone: string;
    educationLevel: string;
}
export interface DemoClassBooking {
    id: RecordId;
    name: string;
    testType: string;
    email: string;
    preferredTime: string;
    timestamp: Timestamp;
    phone: string;
}
export interface ServiceItem {
    id: RecordId;
    features: Array<string>;
    order: bigint;
    icon: string;
    name: string;
    description: string;
    ctaLink: string;
}
export interface BeOurPartnerInquiryInput {
    contactName: string;
    partnershipType: string;
    email: string;
    message: string;
    companyName: string;
    phone: string;
}
export interface BatchTiming {
    id: RecordId;
    endDate: string;
    enrolled: bigint;
    capacity: bigint;
    schedule: string;
    startDate: string;
}
export interface AboutPageContent {
    mission: string;
    companyStory: string;
    imageUrl: string;
    achievements: Array<Achievement>;
    vision: string;
    timeline: Array<TimelineEntry>;
}
export interface LeadershipMember {
    id: RecordId;
    bio: string;
    order: bigint;
    name: string;
    role: string;
    imageUrl: string;
}
export interface BlogPost {
    id: RecordId;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: Timestamp;
    slug: string;
    tags: Array<string>;
    publishedAt: bigint;
    updatedAt: Timestamp;
    featuredImageUrl: string;
    category: string;
}
export interface EventItemInput {
    title: string;
    date: string;
    description: string;
    isActive: boolean;
    imageUrl: string;
    registrationLink: string;
    location: string;
}
export interface ServiceItemInput {
    features: Array<string>;
    order: bigint;
    icon: string;
    name: string;
    description: string;
    ctaLink: string;
}
export interface LifeAtValmikiPerk {
    title: string;
    icon: string;
    description: string;
}
export interface HomeSocialLink {
    url: string;
    platform: string;
}
export interface GoogleReviewsBadge {
    reviewUrl: string;
    isVisible: boolean;
    rating: string;
    reviewCount: string;
}
export interface GalleryEntry {
    id: bigint;
    studentName: string;
    order: bigint;
    universityAdmitted: string;
    createdAt: bigint;
    imageUrl: string;
    isVisible: boolean;
    destinationCountry: string;
    visaStatus: string;
}
export interface FreeCounselingContent {
    heroImageUrl: string;
    formDescription: string;
    benefitPoints: Array<FreeCounselingBenefitPoint>;
    ctaText: string;
    heroSubheadline: string;
    heroHeadline: string;
}
export interface CountryInfo {
    order: bigint;
    acceptanceRate: string;
    visaSteps: Array<string>;
    faqs: Array<CountryFAQ>;
    slug: string;
    description: string;
    tuition: string;
    averageCost: string;
    flagImage: string;
    processingTime: string;
    heroImage: string;
    popularCourses: Array<string>;
    topUniversities: Array<CountryTopUniversity>;
    workOpportunities: string;
    prPathway: string;
    intakeMonths: string;
    requirements: Array<string>;
    scholarships: Array<string>;
    visaSuccessRate: string;
}
export interface TeamMember {
    id: RecordId;
    bio: string;
    order: bigint;
    name: string;
    role: string;
    imageUrl: string;
}
export interface SubmissionResult {
    id: RecordId;
    timestamp: Timestamp;
}
export interface ImmigrationConsultation {
    id: RecordId;
    country: string;
    name: string;
    email: string;
    visaType: string;
    preferredTime: string;
    timestamp: Timestamp;
    phone: string;
}
export interface backendInterface {
    addBatchTiming(token: SessionToken, examId: string, batch: {
        endDate: string;
        enrolled: bigint;
        capacity: bigint;
        schedule: string;
        startDate: string;
    }): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addBlogPost(token: SessionToken, input: BlogPostInput): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addCountry(token: string, slug: string, name: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addEvent(token: string, item: EventItemInput): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addGalleryEntry(token: SessionToken, input: GalleryEntryInput): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addJobOpening(token: SessionToken, input: JobOpeningInput): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addPartnerUniversity(token: SessionToken, uni: PartnerUniversity): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addService(token: string, service: ServiceItemInput): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTeamMember(token: string, member: TeamMemberInput): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addTestimonial(token: string, item: TestimonialInput): Promise<{
        __kind__: "ok";
        ok: RecordId;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogin(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: SessionToken;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogout(token: string): Promise<void>;
    deleteBatchTiming(token: SessionToken, examId: string, batchId: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteBlogPost(token: SessionToken, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCountry(token: string, slug: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteEvent(token: string, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteGalleryEntry(token: SessionToken, id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteJobApplication(token: SessionToken, id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteJobOpening(token: SessionToken, id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deletePartnerUniversity(token: SessionToken, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteService(token: string, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTeamMember(token: string, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteTestimonial(token: string, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAboutPageContent(): Promise<AboutPageContent>;
    getActiveJobOpenings(): Promise<Array<JobOpening>>;
    getAdminDashboardStats(): Promise<AdminDashboardStats>;
    getAllCountries(): Promise<Array<CountryInfo>>;
    getAllPageContents(): Promise<Array<PageContent>>;
    getBeOurPartnerContent(): Promise<BeOurPartnerContent | null>;
    getBlogPostById(id: RecordId): Promise<BlogPost | null>;
    getBlogPosts(): Promise<Array<BlogPost>>;
    getContactInfo(): Promise<ContactInfo>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getCounselingBookings(): Promise<Array<CounselingBooking>>;
    getCountryDetail(slug: string): Promise<CountryDetailContent | null>;
    getCountryDetailAll(): Promise<Array<CountryDetailContent>>;
    getCountryDetailBySlug(slug: string): Promise<CountryDetailContent | null>;
    getCountryInfo(slug: string): Promise<CountryInfo | null>;
    getCountryInfoAll(): Promise<Array<CountryInfo>>;
    getDemoClassBookings(): Promise<Array<DemoClassBooking>>;
    getEvents(): Promise<Array<EventItem>>;
    getFooterContent(): Promise<FooterContent>;
    getFreeCounselingContent(): Promise<FreeCounselingContent>;
    getGalleryEntries(): Promise<Array<GalleryEntry>>;
    getHeroContent(): Promise<HeroContent>;
    getHomeSectionsContent(): Promise<HomeSectionsContent>;
    getImmigrationConsultations(): Promise<Array<ImmigrationConsultation>>;
    getImmigrationVisaById(id: string): Promise<ImmigrationVisa | null>;
    getImmigrationVisas(): Promise<Array<ImmigrationVisa>>;
    getJobApplications(token: SessionToken): Promise<Array<JobApplication>>;
    getJobOpenings(): Promise<Array<JobOpening>>;
    getLeadershipMembers(): Promise<Array<LeadershipMember>>;
    getLifeAtValmikiContent(): Promise<LifeAtValmikiContent>;
    getNewsletterSubscriptions(): Promise<Array<NewsletterSubscription>>;
    getPageContent(pageId: string): Promise<PageContent | null>;
    getPageHeroContent(pageId: string): Promise<PageHeroContent | null>;
    getPartnerInquiries(token: SessionToken): Promise<Array<BeOurPartnerInquiry>>;
    getPartnerUniversities(): Promise<Array<PartnerUniversity>>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getServiceDetail(serviceId: string): Promise<ServiceDetailContent | null>;
    getServices(): Promise<Array<ServiceItem>>;
    getStudyAbroadContent(): Promise<StudyAbroadContent>;
    getTeamMembers(): Promise<Array<TeamMember>>;
    getTestPrepExamById(id: string): Promise<TestPrepExam | null>;
    getTestPrepExams(): Promise<Array<TestPrepExam>>;
    getTestimonials(): Promise<Array<TestimonialItem>>;
    getVisaEligibilityResults(): Promise<Array<VisaEligibilityResult>>;
    getVisibleGalleryEntries(): Promise<Array<GalleryEntry>>;
    getWebsiteTheme(): Promise<WebsiteTheme>;
    reorderCountries(token: string, slugOrder: Array<string>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    reorderPartnerUniversities(token: SessionToken, orderedIds: Array<RecordId>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setBeOurPartnerContent(token: SessionToken, content: BeOurPartnerContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    setServiceDetail(token: SessionToken, content: ServiceDetailContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitContactForm(name: string, email: string, phone: string, inquiryType: string, message: string): Promise<SubmissionResult>;
    submitCounselingBooking(name: string, email: string, phone: string, countryInterests: Array<string>, educationLevel: string, preferredTime: string): Promise<SubmissionResult>;
    submitDemoClassBooking(testType: string, preferredTime: string, name: string, email: string, phone: string): Promise<SubmissionResult>;
    submitImmigrationConsultation(visaType: string, country: string, name: string, email: string, phone: string, preferredTime: string): Promise<SubmissionResult>;
    submitJobApplication(input: JobApplicationInput): Promise<JobApplication>;
    submitPartnerInquiry(input: BeOurPartnerInquiryInput): Promise<SubmissionResult>;
    submitVisaEligibility(visaType: string, country: string, age: bigint, education: string, workExperienceYears: bigint, testScores: string, resultPercentage: bigint): Promise<SubmissionResult>;
    subscribeNewsletter(email: string): Promise<SubmissionResult>;
    toggleBlogPostPublish(token: SessionToken, id: RecordId): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    toggleGalleryEntryVisibility(token: SessionToken, id: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateAboutPageContent(token: SessionToken, content: AboutPageContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateBatchTiming(token: SessionToken, examId: string, batchId: RecordId, batch: {
        endDate: string;
        enrolled: bigint;
        capacity: bigint;
        schedule: string;
        startDate: string;
    }): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateBlogPost(token: SessionToken, id: RecordId, input: BlogPostInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateContactInfo(token: string, info: ContactInfo): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCountryDetailBySlug(token: SessionToken, content: CountryDetailContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateCountryInfo(token: string, info: CountryInfo): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateEvent(token: string, id: RecordId, item: EventItemInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateFooterContent(token: string, content: FooterContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateFreeCounselingContent(token: string, content: FreeCounselingContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGalleryEntry(token: SessionToken, id: bigint, input: GalleryEntryInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateHeroContent(token: string, content: HeroContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateHomeSectionsContent(token: string, content: HomeSectionsContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateImmigrationVisa(token: SessionToken, visa: ImmigrationVisa): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateJobOpening(token: SessionToken, id: bigint, input: JobOpeningInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateLeadershipMembers(token: SessionToken, members: Array<LeadershipMember>): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateLifeAtValmikiContent(token: string, content: LifeAtValmikiContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePageContent(token: SessionToken, pageId: string, content: PageContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePageHeroContent(token: string, content: PageHeroContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updatePartnerUniversity(token: SessionToken, id: RecordId, uni: PartnerUniversity): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateService(token: string, id: RecordId, service: ServiceItemInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateStudyAbroadContent(token: SessionToken, content: StudyAbroadContent): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTeamMember(token: string, id: RecordId, member: TeamMemberInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTestPrepExam(token: SessionToken, exam: TestPrepExam): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateTestimonial(token: string, id: RecordId, item: TestimonialInput): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateWebsiteTheme(token: string, theme: WebsiteTheme): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    verifyAdminToken(token: string): Promise<boolean>;
}
