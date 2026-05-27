import Types "common";

module {
  // Input types (no id — assigned by lib)
  public type ServiceItemInput = {
    name : Text;
    description : Text;
    icon : Text;
    features : [Text];
    ctaLink : Text;
    order : Nat;
  };

  public type TestimonialInput = {
    name : Text;
    university : Text;
    country : Text;
    course : Text;
    text : Text;
    rating : Nat;
    imageUrl : Text;
    isVisible : Bool;
    youtubeUrl : ?Text;
  };

  public type EventItemInput = {
    title : Text;
    date : Text;
    description : Text;
    imageUrl : Text;
    location : Text;
    registrationLink : Text;
    isActive : Bool;
  };

  public type TeamMemberInput = {
    name : Text;
    role : Text;
    bio : Text;
    imageUrl : Text;
    order : Nat;
  };

  // Full entity types (with id)
  public type ServiceItem = {
    id : Types.RecordId;
    name : Text;
    description : Text;
    icon : Text;
    features : [Text];
    ctaLink : Text;
    order : Nat;
  };

  public type CountryTopUniversity = {
    name : Text;
    ranking : Text;
  };

  public type CountryFAQ = {
    question : Text;
    answer : Text;
  };

  public type CountryInfo = {
    slug : Text;
    tuition : Text;
    visaSuccessRate : Text;
    popularCourses : [Text];
    workOpportunities : Text;
    prPathway : Text;
    // Extended fields for per-country editing
    acceptanceRate : Text;
    processingTime : Text;
    averageCost : Text;
    intakeMonths : Text;
    description : Text;
    topUniversities : [CountryTopUniversity];
    requirements : [Text];
    visaSteps : [Text];
    scholarships : [Text];
    faqs : [CountryFAQ];
    heroImage : Text;
    flagImage : Text;
    order : Nat;
  };

  public type TestimonialItem = {
    id : Types.RecordId;
    name : Text;
    university : Text;
    country : Text;
    course : Text;
    text : Text;
    rating : Nat;
    imageUrl : Text;
    isVisible : Bool;
    youtubeUrl : ?Text;
  };

  public type EventItem = {
    id : Types.RecordId;
    title : Text;
    date : Text;
    description : Text;
    imageUrl : Text;
    location : Text;
    registrationLink : Text;
    isActive : Bool;
  };

  public type TeamMember = {
    id : Types.RecordId;
    name : Text;
    role : Text;
    bio : Text;
    imageUrl : Text;
    order : Nat;
  };

  public type HeroContent = {
    headline : Text;
    subheadline : Text;
    studentsGuided : Text;
    universityPartnerships : Text;
    yearsExperience : Text;
    visaSuccessRate : Text;
  };

  public type ContactInfo = {
    phone1 : Text;
    phone2 : Text;
    phone3 : Text;
    email : Text;
    address1 : Text;
    address2 : Text;
    address3 : Text;
    branch1Name : Text;
    branch2Name : Text;
    branch3Name : Text;
  };

  public type AdminDashboardStats = {
    totalLeads : Nat;
    thisMonth : Nat;
    pending : Nat;
  };

  // --- Page Hero Content (per-page heroes for sub-pages) ---
  public type PageHeroContent = {
    pageId : Text;
    headline : Text;
    subheadline : Text;
    imageUrl : Text;
  };

  // --- Life At Valmiki Page ---
  public type LifeAtValmikiGalleryImage = {
    imageUrl : Text;
    caption : Text;
  };

  public type LifeAtValmikiPerk = {
    title : Text;
    description : Text;
    icon : Text;
  };

  public type LifeAtValmikiContent = {
    heroHeadline : Text;
    heroSubheadline : Text;
    heroImageUrl : Text;
    missionText : Text;
    cultureDescription : Text;
    galleryImages : [LifeAtValmikiGalleryImage];
    perks : [LifeAtValmikiPerk];
  };

  // --- Free Counseling Page ---
  public type FreeCounselingBenefitPoint = {
    title : Text;
    description : Text;
  };

  public type FreeCounselingContent = {
    heroHeadline : Text;
    heroSubheadline : Text;
    heroImageUrl : Text;
    formDescription : Text;
    ctaText : Text;
    benefitPoints : [FreeCounselingBenefitPoint];
  };

  // --- Home Sections Content ---
  public type HomeSectionPoint = {
    title : Text;
    description : Text;
    icon : Text;
  };

  public type HomeSocialLink = {
    platform : Text;
    url : Text;
  };

  public type HomeSectionsContent = {
    whyChooseUsHeadline : Text;
    whyChooseUsPoints : [HomeSectionPoint];
    ctaBannerHeadline : Text;
    ctaBannerSubheadline : Text;
    ctaBannerButtonText : Text;
    footerDescription : Text;
    footerSocialLinks : [HomeSocialLink];
    testimonialsDisplayCount : Nat;
    universityMarqueeEnabled : Bool;
    eventsDisplayCount : Nat;
  };

  // --- Website Theme ---
  public type WebsiteTheme = {
    primaryColor : Text;
    secondaryColor : Text;
    accentColor : Text;
    headingTextColor : Text;
    bodyTextColor : Text;
    buttonColor : Text;
    buttonTextColor : Text;
    backgroundColor : Text;
    footerBgColor : Text;
    footerTextColor : Text;
  };

  // --- Footer Content ---
  public type FooterLink = {
    linkLabel : Text;
    url : Text;
  };

  public type FooterSocialLink = {
    platform : Text;
    url : Text;
  };

  public type GoogleReviewsBadge = {
    rating : Text;
    reviewCount : Text;
    reviewUrl : Text;
    isVisible : Bool;
  };

  public type FacebookReviewsBadge = {
    rating : Text;
    reviewCount : Text;
    reviewUrl : Text;
    isVisible : Bool;
  };

  public type EduLoanPartner = {
    id : Text;
    name : Text;
    logoUrl : Text;
    websiteUrl : Text;
  };

  public type OfficeLocation = {
    id : Text;
    city : Text;
    address : Text;
    phone : Text;
    email : Text;
  };

  public type FooterContent = {
    quickLinks : [FooterLink];
    serviceLinks : [FooterLink];
    countryLinks : [FooterLink];
    socialLinks : [FooterSocialLink];
    whatsappNumber : Text;
    copyrightText : Text;
    googleReviewsBadge : GoogleReviewsBadge;
    facebookReviewsBadge : FacebookReviewsBadge;
    eduLoanPartners : [EduLoanPartner];
    officeLocations : [OfficeLocation];
  };

  // --- Generic Page Content ---
  public type PageContent = {
    pageId : Text;
    title : Text;
    heroHeadline : Text;
    heroSubheadline : Text;
    heroImageUrl : Text;
    bodyContent : Text;
    sections : [PageSection];
    metaDescription : Text;
    isActive : Bool;
  };

  public type PageSection = {
    id : Text;
    sectionType : Text;
    title : Text;
    content : Text;
    imageUrl : Text;
    items : [Text];
    order : Nat;
  };

  // Session token alias
  public type SessionToken = Text;

  // --- Blog ---
  public type BlogPostInput = {
    title : Text;
    slug : Text;
    content : Text;
    featuredImageUrl : Text;
    category : Text;
    isPublished : Bool;
  };

  public type BlogPost = {
    id : Types.RecordId;
    title : Text;
    slug : Text;
    content : Text;
    featuredImageUrl : Text;
    category : Text;
    tags : [Text];
    isPublished : Bool;
    publishedAt : Nat;
    createdAt : Types.Timestamp;
    updatedAt : Types.Timestamp;
  };

  // --- Test Preparation ---
  public type BatchTiming = {
    id : Types.RecordId;
    startDate : Text;
    endDate : Text;
    schedule : Text;
    capacity : Nat;
    enrolled : Nat;
  };

  public type TestPrepExam = {
    id : Text;
    name : Text;
    description : Text;
    duration : Text;
    cost : Text;
    scoreRange : Text;
    successRate : Text;
    batchTimings : [BatchTiming];
    imageUrl : Text;
  };

  // --- Immigration ---
  public type ImmigrationVisa = {
    id : Text;
    visaType : Text;
    title : Text;
    description : Text;
    requirements : [Text];
    processingTime : Text;
    successRate : Text;
    documentsRequired : [Text];
    eligibilityCriteria : [Text];
    imageUrl : Text;
  };

  // --- About Page ---
  public type TimelineEntry = {
    id : Types.RecordId;
    year : Text;
    milestone : Text;
    description : Text;
  };

  public type Achievement = {
    id : Types.RecordId;
    metric : Text;
    description : Text;
    icon : Text;
  };

  public type LeadershipMember = {
    id : Types.RecordId;
    name : Text;
    role : Text;
    bio : Text;
    imageUrl : Text;
    order : Nat;
  };

  public type AboutPageContent = {
    companyStory : Text;
    vision : Text;
    mission : Text;
    timeline : [TimelineEntry];
    achievements : [Achievement];
    imageUrl : Text;
  };

  // --- Study Abroad ---
  public type ProcessStep = {
    id : Types.RecordId;
    order : Nat;
    title : Text;
    description : Text;
    icon : Text;
  };

  public type ScholarshipInfo = {
    id : Types.RecordId;
    name : Text;
    amount : Text;
    eligibility : Text;
    deadline : Text;
  };

  public type StudyAbroadContent = {
    headline : Text;
    introduction : Text;
    processSteps : [ProcessStep];
    scholarships : [ScholarshipInfo];
    intakeInfo : Text;
    imageUrl : Text;
  };

  // --- Partner Universities ---
  public type PartnerUniversity = {
    id : Types.RecordId;
    name : Text;
    logoUrl : Text;
    country : Text;
    website : Text;
    order : Nat;
  };

  // --- Country Detail ---
  public type CountryUniversity = {
    id : Types.RecordId;
    name : Text;
    ranking : Text;
    tuition : Text;
    logoUrl : Text;
    website : Text;
  };

  public type VisaStep = {
    id : Types.RecordId;
    order : Nat;
    title : Text;
    description : Text;
  };

  public type CostBreakdown = {
    accommodation : Text;
    food : Text;
    transport : Text;
    miscellaneous : Text;
    totalMonthly : Text;
  };

  public type FAQ = {
    id : Types.RecordId;
    question : Text;
    answer : Text;
    order : Nat;
  };

  public type CountryDetailContent = {
    countrySlug : Text;
    heroTitle : Text;
    heroSubtitle : Text;
    heroImageUrl : Text;
    whyStudyHere : Text;
    universities : [CountryUniversity];
    visaProcess : [VisaStep];
    costOfLiving : CostBreakdown;
    scholarships : [Text];
    popularCourses : [Text];
    workRights : Text;
    prOpportunities : Text;
    faqs : [FAQ];
  };
  // --- Service Detail Content ---
  public type ServiceProcessStep = {
    order : Nat;
    title : Text;
    description : Text;
    icon : Text;
  };

  public type ServiceFAQ = {
    question : Text;
    answer : Text;
  };

  public type ServiceDetailContent = {
    serviceId : Text;
    heroImage : Text;
    heroHeadline : Text;
    heroSubheadline : Text;
    overview : Text;
    whatIsIncluded : [Text];
    processSteps : [ServiceProcessStep];
    eligibilityCriteria : [Text];
    whyChooseValmiki : [Text];
    faqs : [ServiceFAQ];
    ctaText : Text;
    ctaButtonText : Text;
  };

  // --- Be Our Partner Content ---
  public type PartnershipTypeItem = {
    title : Text;
    description : Text;
    icon : Text;
    benefits : [Text];
  };

  public type BeOurPartnerContent = {
    heroImage : Text;
    heroHeadline : Text;
    heroSubheadline : Text;
    partnershipTypes : [PartnershipTypeItem];
    generalBenefits : [Text];
    formDescription : Text;
  };

  // --- Gallery Entries ---
  public type GalleryEntryInput = {
    studentName : Text;
    destinationCountry : Text;
    universityAdmitted : Text;
    visaStatus : Text;
    imageUrl : Text;
    order : Nat;
    isVisible : Bool;
  };

  public type GalleryEntry = {
    id : Nat;
    studentName : Text;
    destinationCountry : Text;
    universityAdmitted : Text;
    visaStatus : Text;
    imageUrl : Text;
    order : Nat;
    isVisible : Bool;
    createdAt : Int;
  };

  // --- Job Openings ---
  public type JobOpeningInput = {
    title : Text;
    department : Text;
    location : Text;
    description : Text;
    requirements : Text;
    isActive : Bool;
  };

  public type JobOpening = {
    id : Nat;
    title : Text;
    department : Text;
    location : Text;
    description : Text;
    requirements : Text;
    isActive : Bool;
    createdAt : Int;
  };

  // --- Job Applications ---
  public type JobApplicationInput = {
    applicantName : Text;
    email : Text;
    phone : Text;
    positionApplied : Text;
    coverLetter : Text;
    resumeUrl : Text;
    jobOpeningId : Nat;
  };

  public type JobApplication = {
    id : Nat;
    applicantName : Text;
    email : Text;
    phone : Text;
    positionApplied : Text;
    coverLetter : Text;
    resumeUrl : Text;
    jobOpeningId : Nat;
    submittedAt : Int;
  };
};
