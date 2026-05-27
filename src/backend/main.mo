import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import FormTypes "types/forms";
import AdminTypes "types/admin";
import FormsMixin "mixins/forms-api";
import AdminMixin "mixins/admin-api";
import ContentMixin "mixins/content-api";
import Array "mo:core/Array";







actor {
  // --- Forms state ---
  stable var counselingBookings = List.empty<FormTypes.CounselingBooking>();
  stable var contactSubmissions = List.empty<FormTypes.ContactSubmission>();
  stable var newsletterSubscriptions = List.empty<FormTypes.NewsletterSubscription>();
  stable var demoClassBookings = List.empty<FormTypes.DemoClassBooking>();
  stable var immigrationConsultations = List.empty<FormTypes.ImmigrationConsultation>();
  stable var visaEligibilityResults = List.empty<FormTypes.VisaEligibilityResult>();
  stable var formState = { var nextId : Nat = 0 };

  // --- Admin state ---
  stable var adminSessions = Map.empty<AdminTypes.SessionToken, Int>();
  stable var adminState = {
    var passwordHash : Text = "valmiki@2024";
    var heroContent : AdminTypes.HeroContent = {
      headline = "Transform Your Future with Global Education Opportunities";
      subheadline = "Trusted Overseas Education & Immigration Experts Since 2001";
      studentsGuided = "1 Lakh+";
      universityPartnerships = "350+";
      yearsExperience = "24+";
      visaSuccessRate = "93%";
    };
    var contactInfo : AdminTypes.ContactInfo = {
      phone1 = "+91-9090 4747 77";
      phone2 = "+91-9090 4242 22";
      phone3 = "040-2789-9994";
      email = "enquiry@valmikigroup.com";
      address1 = "Secunderabad, Hyderabad";
      address2 = "Jubilee Hills, Hyderabad";
      address3 = "";
      branch1Name = "Secunderabad";
      branch2Name = "Jubilee Hills";
      branch3Name = "";
    };
    var nextAdminId : Nat = 0;
  };
  stable var adminServices = List.empty<AdminTypes.ServiceItem>();
  stable var adminCountries = Map.empty<Text, AdminTypes.CountryInfo>();
  stable var adminTestimonials = List.empty<AdminTypes.TestimonialItem>();
  stable var adminEvents = List.empty<AdminTypes.EventItem>();
  stable var adminTeam = List.empty<AdminTypes.TeamMember>();

  // --- Extended content state (new page content types) ---
  stable var pageHeroesState = {
    var heroes : Map.Map<Text, AdminTypes.PageHeroContent> = Map.empty<Text, AdminTypes.PageHeroContent>();
  };
  stable var lifeAtValmikiState = {
    var content : AdminTypes.LifeAtValmikiContent = {
      heroHeadline = "Thrive & Grow at Valmiki Group";
      heroSubheadline = "Join a team that is passionate about transforming students' futures";
      heroImageUrl = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600";
      missionText = "At Valmiki Group, we believe that our greatest asset is our people. We foster a culture of continuous learning, collaboration, and growth — the same values we instil in the students we guide.";
      cultureDescription = "Our workplace is dynamic, inclusive, and driven by purpose. Every team member contributes directly to changing students' lives and opening doors to global opportunities.";
      galleryImages = [
        { imageUrl = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600"; caption = "Team collaboration session" },
        { imageUrl = "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600"; caption = "Annual team outing" },
        { imageUrl = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600"; caption = "Training workshop" },
        { imageUrl = "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600"; caption = "Student success celebration" },
      ];
      perks = [
        { title = "Continuous Learning"; description = "Regular training programs, certifications, and industry workshops to keep your skills sharp."; icon = "BookOpen" },
        { title = "Growth Opportunities"; description = "Clear career progression paths with mentorship from industry veterans."; icon = "TrendingUp" },
        { title = "Inclusive Culture"; description = "A diverse, welcoming environment where every voice is heard and valued."; icon = "Users" },
        { title = "Work-Life Balance"; description = "Flexible schedules, paid leave, and team events that make work enjoyable."; icon = "Heart" },
        { title = "Competitive Compensation"; description = "Market-leading salaries, performance bonuses, and health benefits."; icon = "Award" },
        { title = "Meaningful Impact"; description = "Every day you help students achieve their dreams — that's a career worth having."; icon = "Globe" },
      ];
    };
  };
  stable var freeCounselingState = {
    var content : AdminTypes.FreeCounselingContent = {
      heroHeadline = "Book Your Free Counseling Session";
      heroSubheadline = "Talk to our expert advisors and get a personalised roadmap to your dream university";
      heroImageUrl = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600";
      formDescription = "Fill in your details below and our expert counselors will reach out to you within 24 hours to schedule your free session.";
      ctaText = "Book My Free Session";
      benefitPoints = [
        { title = "Expert Guidance"; description = "One-on-one session with a certified overseas education counselor with 10+ years of experience." },
        { title = "Personalised Roadmap"; description = "Get a tailored study abroad plan based on your academic profile, budget, and career goals." },
        { title = "University Shortlisting"; description = "Receive a curated list of universities that match your profile and admission chances." },
        { title = "Visa Insights"; description = "Understand visa requirements, timelines, and success factors for your target country." },
        { title = "Scholarship Opportunities"; description = "Discover scholarships and funding options available for your profile and destination." },
        { title = "Zero Commitment"; description = "Completely free, no obligations — just expert advice to help you make the right decision." },
      ];
    };
  };
  stable var homeSectionsState = {
    var content : AdminTypes.HomeSectionsContent = {
      whyChooseUsHeadline = "Why 1 Lakh+ Students Trust Valmiki Group";
      whyChooseUsPoints = [
        { title = "24+ Years Experience"; description = "Established in 2001, we have over two decades of expertise in overseas education and immigration."; icon = "Clock" },
        { title = "Expert Counselors"; description = "Our team of certified counselors brings deep knowledge of global universities and visa processes."; icon = "Users" },
        { title = "End-to-End Support"; description = "From profile assessment to visa approval and pre-departure briefing — we are with you every step."; icon = "CheckCircle" },
        { title = "Global University Network"; description = "350+ partner universities across USA, Canada, UK, Australia, Germany, Ireland, and more."; icon = "Globe" },
        { title = "Fast Visa Processing"; description = "Streamlined documentation and expert preparation to achieve fast, successful visa outcomes."; icon = "Zap" },
        { title = "Personalised Guidance"; description = "Every student gets a tailored counseling plan based on their unique academic profile and goals."; icon = "Target" },
        { title = "High Visa Success Rate"; description = "93% overall visa success rate built on meticulous preparation and deep country-specific expertise."; icon = "Award" },
        { title = "Trusted by Thousands"; description = "Over 1 lakh students have achieved their international education dreams with our guidance."; icon = "Heart" },
      ];
      ctaBannerHeadline = "Your Global Career Starts Here";
      ctaBannerSubheadline = "Join over 1 lakh students who have transformed their futures with Valmiki Group";
      ctaBannerButtonText = "Book Your Free Counseling Session";
      footerDescription = "Valmiki Group — Trusted overseas education and immigration consultants since 2001. Helping students achieve their dreams of studying abroad across 10+ countries worldwide.";
      footerSocialLinks = [
        { platform = "facebook"; url = "https://facebook.com/valmikigroup" },
        { platform = "instagram"; url = "https://instagram.com/valmikigroup" },
        { platform = "linkedin"; url = "https://linkedin.com/company/valmikigroup" },
        { platform = "youtube"; url = "https://youtube.com/valmikigroup" },
        { platform = "twitter"; url = "https://twitter.com/valmikigroup" },
      ];
      testimonialsDisplayCount = 5;
      universityMarqueeEnabled = true;
      eventsDisplayCount = 3;
    };
  };

  // --- Content state ---
  stable var blogPosts = List.empty<AdminTypes.BlogPost>();
  stable var partnerUniversities = List.empty<AdminTypes.PartnerUniversity>();
  stable var testPrepExams = Map.empty<Text, AdminTypes.TestPrepExam>();
  stable var immigrationVisas = Map.empty<Text, AdminTypes.ImmigrationVisa>();
  stable var countryDetails = Map.empty<Text, AdminTypes.CountryDetailContent>();
  stable var galleryEntries = List.empty<AdminTypes.GalleryEntry>();
  stable var jobOpenings = List.empty<AdminTypes.JobOpening>();
  stable var jobApplications = List.empty<AdminTypes.JobApplication>();
  stable var leadershipState = { var members : [AdminTypes.LeadershipMember] = [
    { id = 1; name = "Surya Ganesh Valmiki"; role = "Chairman & Managing Director"; bio = "The visionary force behind Valmiki Group, Surya Ganesh Valmiki has been transforming the landscape of foreign education and immigration services for more than two decades."; imageUrl = "https://ui-avatars.com/api/?name=Surya+Ganesh+Valmiki&background=0B1F3A&color=fff&size=200"; order = 1 },
    { id = 2; name = "Hari Kishan Valmiki"; role = "Director"; bio = "As the Director of the Valmiki Group, Hari Kishan Valmiki drives growth initiatives, oversees operations, and steers the Valmiki Tours and Travels Services and the Valmiki Foundation."; imageUrl = "https://ui-avatars.com/api/?name=Hari+Kishan+Valmiki&background=FF8A00&color=fff&size=200"; order = 2 },
    { id = 3; name = "Pushpa Valmiki"; role = "Director"; bio = "Pushpa Valmiki brings a unique leadership style informed by values, compassion, and resilience. She has traveled to over 20 countries as an ambassador for the group."; imageUrl = "https://ui-avatars.com/api/?name=Pushpa+Valmiki&background=FFC247&color=0B1F3A&size=200"; order = 3 },
    { id = 4; name = "Nirupama Das"; role = "Chief Executive Officer"; bio = "Nirupama oversees all business aspects from strategic development to building best-in-class teams, with fifteen years of experience in education and corporate sectors."; imageUrl = "https://ui-avatars.com/api/?name=Nirupama+Das&background=0B1F3A&color=fff&size=200"; order = 4 },
    { id = 5; name = "Kavita"; role = "HR Lead"; bio = "With over 15 years of experience across IT, Education, FMCG, and Entertainment sectors, Kavita leads all aspects of human resources and cultural strategy."; imageUrl = "https://ui-avatars.com/api/?name=Kavita+HR&background=FF8A00&color=fff&size=200"; order = 5 },
    { id = 6; name = "T.M. Sathyanarayanan"; role = "Chief Advisor - International Education"; bio = "A distinguished Economist with 38 years of global teaching experience, he has spearheaded the United Nations Special Interest Group on inter-country relations."; imageUrl = "https://ui-avatars.com/api/?name=TM+Sathyanarayanan&background=0B1F3A&color=fff&size=200"; order = 6 },
  ] };
  stable var contentState = {
    var nextContentId : Nat = 0;
    var aboutPageContent : AdminTypes.AboutPageContent = {
      companyStory = "Valmiki Group was established in 2001 in Secunderabad, Hyderabad, India. We are an innovative, progressive, and professionally managed group focused on overseas education — one of the core sectors of the economy. For more than 24 years, Valmiki has played a major role in international educational consultancy, helping students study in USA, Canada, Australia, New Zealand, UK, Europe, and various other countries. With our collective experience of specialized professionals and supporting services in all areas of education, students can be rest assured they are partnering with the best in the industry.";
      vision = "To help students navigate through the ups and downs of foreign education, discover their potential, find the right educational opportunities, and succeed in their chosen field.";
      mission = "We truly believe that studying abroad should be accessible and uncomplicated. Our mission is to empower students, offering them valuable insights to make well-informed choices as they shape their educational endeavors.";
      imageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600";
      timeline = [
        { id = 1; year = "2001"; milestone = "Founded"; description = "Established in Secunderabad, Hyderabad, Telangana, India" },
        { id = 2; year = "2005"; milestone = "Global Expansion"; description = "Expanded services to multiple countries including USA, UK, Canada, Australia" },
        { id = 3; year = "2010"; milestone = "10,000 Students"; description = "Crossed 10,000 students successfully guided to international universities" },
        { id = 4; year = "2015"; milestone = "Multiple Branches"; description = "Opened multiple branches across Hyderabad to serve more students" },
        { id = 5; year = "2020"; milestone = "50,000 Students"; description = "Crossed 50,000 students guided with 97% visa success rate" },
        { id = 6; year = "2024"; milestone = "1 Lakh+ Students"; description = "1 Lakh+ students guided, 24+ years of excellence in overseas education" },
      ];
      achievements = [
        { id = 7; metric = "100,000+"; description = "Students received offers from top universities worldwide"; icon = "🎓" },
        { id = 8; metric = "350+"; description = "University tie-ups across the globe"; icon = "🏛" },
        { id = 9; metric = "1 Million+"; description = "Counselling sessions in 24+ years"; icon = "💬" },
        { id = 10; metric = "97%"; description = "Visa success rate — our commitment to your success"; icon = "✅" },
      ];

    };
    var studyAbroadContent : AdminTypes.StudyAbroadContent = {
      headline = "Study Abroad — Your Gateway to Global Opportunities";
      introduction = "Explore top universities across 10+ countries with expert guidance.";
      processSteps = [];
      scholarships = [];
      intakeInfo = "January, May, September intakes available.";
      imageUrl = "";
    };
  };

  // --- Page content state (generic pages: Foundation, Tours, Accommodation, Immigration subpages, Careers, etc.) ---
  stable var pageContents = Map.empty<Text, AdminTypes.PageContent>();

    // --- Service detail & partner content ---
  stable var serviceDetails = Map.empty<Text, AdminTypes.ServiceDetailContent>();
  stable var beOurPartnerState = { var content : ?AdminTypes.BeOurPartnerContent = null };
  stable var partnerInquiries = List.empty<FormTypes.BeOurPartnerInquiry>();
  // --- Website Theme state ---
  stable var websiteThemeState = {
    var theme : AdminTypes.WebsiteTheme = {
      primaryColor = "#0B1F3A";
      secondaryColor = "#FF8A00";
      accentColor = "#FFC247";
      headingTextColor = "#0B1F3A";
      bodyTextColor = "#333333";
      buttonColor = "#FF8A00";
      buttonTextColor = "#FFFFFF";
      backgroundColor = "#FFFFFF";
      footerBgColor = "#0B1F3A";
      footerTextColor = "#FFFFFF";
    };
  };

  // --- Footer Content state ---
  stable var footerContentState = {
    var content : AdminTypes.FooterContent = {
      quickLinks = [
        { linkLabel = "About Us";         url = "/about" },
        { linkLabel = "Study Abroad";     url = "/study-abroad" },
        { linkLabel = "Countries";        url = "/countries" },
        { linkLabel = "Services";         url = "/services" },
        { linkLabel = "Test Preparation"; url = "/test-preparation" },
        { linkLabel = "Immigration";      url = "/immigration" },
        { linkLabel = "Success Stories";  url = "/success-stories" },
        { linkLabel = "Contact Us";       url = "/contact" },
      ];
      serviceLinks = [
        { linkLabel = "Study Abroad Counseling"; url = "/services/study-abroad-counseling" },
        { linkLabel = "Immigration Services";    url = "/services/immigration" },
        { linkLabel = "Visa Assistance";         url = "/services/visa-assistance" },
        { linkLabel = "Test Preparation";        url = "/test-preparation" },
        { linkLabel = "Scholarship Guidance";    url = "/services/scholarship-assistance" },
        { linkLabel = "Education Loans";         url = "/services/education-loans" },
        { linkLabel = "SOP & Documentation";     url = "/services/sop-documentation" },
        { linkLabel = "Career Counseling";       url = "/services/career-counseling" },
      ];
      countryLinks = [
        { linkLabel = "Study in USA";         url = "/countries/usa" },
        { linkLabel = "Canada";               url = "/countries/canada" },
        { linkLabel = "UK";                   url = "/countries/uk" },
        { linkLabel = "Australia";            url = "/countries/australia" },
        { linkLabel = "Germany";              url = "/countries/germany" },
        { linkLabel = "Ireland";              url = "/countries/ireland" },
        { linkLabel = "New Zealand";          url = "/countries/new-zealand" },
        { linkLabel = "Dubai";                url = "/countries/dubai" },
        { linkLabel = "Singapore";            url = "/countries/singapore" },
        { linkLabel = "Europe";               url = "/countries/europe" },
      ];
      socialLinks = [
        { platform = "facebook";  url = "#" },
        { platform = "instagram"; url = "#" },
        { platform = "linkedin";  url = "#" },
        { platform = "youtube";   url = "#" },
      ];
      whatsappNumber = "+919090474777";
      copyrightText = "(c) 2024 Valmiki Group. All rights reserved.";
      googleReviewsBadge = {
        rating = "4.9";
        reviewCount = "1,200+";
        reviewUrl = "https://g.page/r/valmikigroup/review";
        isVisible = false;
      };
      facebookReviewsBadge = {
        rating = "4.8";
        reviewCount = "900+";
        reviewUrl = "https://www.facebook.com/valmikigroup/reviews";
        isVisible = false;
      };
      eduLoanPartners = [];
      officeLocations = [
        { id = "1"; city = "Secunderabad"; address = "Secunderabad, Hyderabad"; phone = "+91-9090 4747 77"; email = "enquiry@valmikigroup.com" },
        { id = "2"; city = "Jubilee Hills"; address = "Jubilee Hills, Hyderabad"; phone = "040-2789-9994";   email = "enquiry@valmikigroup.com" },
      ];
    };
  };

  // -------------------------------------------------------
  // ONE-TIME SEED — runs only when collections are empty
  // -------------------------------------------------------

  // Seed Services (8 cards)
  if (adminServices.size() == 0) {
    let servicesData : [(Text, Text, Text)] = [
      ("GraduationCap",   "Study Abroad Counseling",   "Expert guidance to help you choose the right country, university, and course. We assess your profile and match you with institutions that offer the best fit for your academic and career goals."),
      ("FileText",         "Student Visa Assistance",   "End-to-end support for student visa applications with a 93% success rate. Our visa specialists prepare your documentation, coach you for interviews, and track your application through every step."),
      ("Globe",            "Immigration Services",      "Comprehensive immigration consulting for PR, work, and dependent visas across Canada, Australia, New Zealand, and Europe. We map the fastest and safest pathway for your profile."),
      ("BookOpen",         "IELTS/PTE/TOEFL Coaching",  "Intensive classroom and online coaching for IELTS, PTE, TOEFL, GRE, GMAT, and SAT. Our certified trainers use proven techniques to help you achieve your target band score quickly."),
      ("University",       "University Admissions",     "Access to 350+ partner universities worldwide. We handle shortlisting, application preparation, SOPs, LORs, and follow-ups to maximise your admission chances at top institutions."),
      ("Award",            "Scholarships Guidance",     "Identify and apply for merit-based, need-based, and country-specific scholarships. Our team has helped students secure millions of rupees in scholarship funding."),
      ("CreditCard",       "Education Loans",           "Assistance with education loan applications through leading banks and NBFCs in India. We guide you through collateral, co-applicant, and documentation requirements."),
      ("ClipboardList",    "SOP & Documentation",       "Professional Statement of Purpose writing, Letter of Recommendation guidance, and complete documentation support to strengthen your university application profile."),
    ];
    var sid = adminState.nextAdminId;
    for ((icon, name, desc) in servicesData.vals()) {
      adminServices.add({
        id = sid;
        name;
        description = desc;
        icon;
        features = [];
        ctaLink = "/services";
        order = sid;
      });
      sid += 1;
    };
    adminState.nextAdminId := sid;
  };

  // Seed Country Info (10 cards)
  if (adminCountries.size() == 0) {
    let countrySeedData : [(Text, Text, Text, [Text], Text, Text, Text, Text, Text, Text, Text, [Text], [Text], Text, Text)] = [
      ("usa",         "$25,000/yr",       "95%", ["Engineering", "Business", "Computer Science"],          "OPT/CPT — up to 3 years post-study",    "EB-2 NIW & EB-1A for skilled graduates",
       "75%", "2-3 months", "$45,000/year", "January, September",
       "The USA is the world's most popular study destination, home to top-ranked universities, cutting-edge research, and a vibrant campus life. With OPT/CPT work opportunities and a clear pathway to H-1B sponsorship, US degrees open doors globally.",
       ["Apply for I-20 from your university", "Pay SEVIS fee", "Complete DS-160 online", "Schedule embassy appointment", "Attend visa interview", "Receive visa decision"],
       ["Valid passport", "Offer letter / I-20", "Financial proof (min $45,000/year)", "IELTS/TOEFL scores", "Academic transcripts"],
       "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200",
       "https://flagcdn.com/w80/us.png"),
      ("canada",      "CA$20,000/yr",     "92%", ["Business", "Engineering", "Healthcare"],                "PGWP — up to 3 years post-study",        "Express Entry PR pathway after 1 year work",
       "80%", "6-8 weeks", "CA$30,000/year", "January, May, September",
       "Canada is one of the most popular study destinations for Indian students, offering world-class education and clear PR pathways through the Post-Graduate Work Permit (PGWP) and Express Entry system.",
       ["Receive Letter of Acceptance from a DLI", "Gather financial documents", "Apply online or at a visa centre", "Provide biometrics", "Await decision (SDS: ~20 days)"],
       ["Letter of Acceptance", "Proof of funds (min CAD 10,000 + tuition)", "IELTS band 6.0+", "Valid passport", "Medical exam (if required)"],
       "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1200",
       "https://flagcdn.com/w80/ca.png"),
      ("uk",          "£15,000/yr",       "90%", ["MBA", "Law", "Engineering"],                           "Graduate Route — 2 years post-study",    "Skilled Worker Visa leads to ILR after 5 years",
       "72%", "3-4 weeks", "£25,000/year", "January, September",
       "The UK offers some of the world's most prestigious universities including Oxford and Cambridge. A typical UK undergraduate degree takes 3 years and postgraduate just 1 year, making it cost-effective with globally recognised qualifications.",
       ["Receive CAS from university", "Apply for UK Student Visa online", "Pay healthcare surcharge", "Provide biometrics", "Receive visa decision"],
       ["Confirmation of Acceptance for Studies (CAS)", "Proof of finances (£1,334/month in London)", "IELTS Academic 6.0+", "Valid passport", "Tuberculosis test (certain countries)"],
       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
       "https://flagcdn.com/w80/gb.png"),
      ("australia",   "AU$30,000/yr",     "94%", ["Engineering", "Nursing", "IT"],                        "485 Graduate Visa — 2-4 years",          "SkillSelect points-based PR pathway",
       "78%", "4-6 weeks", "AU$40,000/year", "February, July",
       "Australia is a top study destination with globally ranked universities, excellent post-study work rights through the Temporary Graduate visa, and a welcoming multicultural environment ideal for Indian students.",
       ["Receive Confirmation of Enrolment (CoE)", "Apply for Subclass 500 online", "Complete health examination", "Purchase OSHC insurance", "Submit and await decision"],
       ["Confirmation of Enrolment (CoE)", "Genuine Temporary Entrant (GTE) statement", "Proof of finances", "IELTS 5.5+ (6.0 for most universities)", "Health insurance (OSHC)"],
       "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200",
       "https://flagcdn.com/w80/au.png"),
      ("germany",     "€500/yr (public)", "88%", ["Engineering", "Science", "Research"],                  "18-month job-seeker visa post-study",    "EU Blue Card pathway after employment",
       "65%", "6-10 weeks", "€12,000/year", "April, October",
       "Germany offers world-class education at minimal or zero tuition fees at public universities. Renowned for engineering, science, and research, German degrees are highly valued globally and the country provides a clear pathway to PR through the EU Blue Card.",
       ["Receive university admission letter", "Open blocked account (€11,208)", "Apply for German National Visa (Type D)", "Get APS certificate (Indian applicants)", "Attend visa interview"],
       ["University admission letter", "Blocked account proof (€11,208)", "APS certificate (India)", "Language proof (German or English)", "Health insurance"],
       "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200",
       "https://flagcdn.com/w80/de.png"),
      ("ireland",     "€12,000/yr",       "91%", ["IT", "Pharma", "Finance"],                             "24-month stay-back permission post-study", "Critical Skills Employment Permit to PR",
       "73%", "4-6 weeks", "€18,000/year", "September",
       "Ireland is Europe's fastest-growing economy, home to European headquarters of Google, Apple, and Facebook. A 24-month post-study stay-back permission enables graduates to gain valuable international work experience in a thriving tech and pharma sector.",
       ["Receive Letter of Offer", "Pay first-year fees", "Register with Irish Naturalisation and Immigration Service (INIS)", "Provide private medical insurance", "Attend visa interview (if required)"],
       ["Letter of Offer from Irish university", "Evidence of funds (€7,000 + first year fees)", "Private medical insurance", "IELTS 6.0+", "Travel insurance"],
       "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=1200",
       "https://flagcdn.com/w80/ie.png"),
      ("nz",  "NZ$25,000/yr",     "93%", ["Agriculture", "Engineering", "Tourism"],               "3-year Post-Study Work Visa",             "Skilled Migrant Category PR stream",
       "77%", "20-30 days", "NZ$35,000/year", "February, July",
       "New Zealand offers high-quality education in one of the safest and most scenic countries in the world. The 3-year Post-Study Work Visa and Skilled Migrant Category PR pathway make it an excellent long-term destination for Indian students.",
       ["Receive Offer of Place", "Apply for Student Visa online", "Provide medical clearance", "Arrange travel insurance", "Await decision"],
       ["Offer of Place from institution", "Proof of funds (NZ$15,000/year)", "IELTS 5.5+ (6.0 for degree)", "Medical clearance", "Return ticket"],
       "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200",
       "https://flagcdn.com/w80/nz.png"),
      ("dubai",       "AED 40,000/yr",    "96%", ["Business", "Hospitality", "Finance"],                  "Part-time work permitted during studies", "Golden Visa for high achievers",
       "85%", "2-3 weeks", "AED 60,000/year", "September, January",
       "Dubai has emerged as a global education hub with campuses of prestigious international universities. A tax-free lifestyle, excellent internship opportunities with Fortune 500 companies, and proximity to India make it an attractive study destination.",
       ["Receive admission letter", "Apply for UAE Student Residence Visa through university", "Complete Emirates ID registration", "Medical fitness certificate", "Obtain health insurance"],
       ["Admission letter from UAE university", "Emirates ID registration", "Medical fitness certificate", "Health insurance", "Passport-size photos"],
       "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
       "https://flagcdn.com/w80/ae.png"),
      ("singapore",   "SGD 20,000/yr",    "95%", ["Finance", "Engineering", "Biomedical"],               "Employment Pass after graduation",        "PR application after 2 years employment",
       "70%", "4-6 weeks", "SGD 30,000/year", "August, January",
       "Singapore is Asia's premier education hub, home to world-ranked universities including NUS and NTU. Its strategic location, English-medium instruction, and strong industry connections make it ideal for career-focused students targeting Asian markets.",
       ["Apply via SOLAR system for Student Pass", "Receive In-Principle Approval (IPA)", "Medical clearance", "Pay issuance fees", "Collect student pass on arrival"],
       ["In-Principle Approval letter", "Proof of finances", "Medical clearance", "IELTS 6.0+ (most programmes)", "Passport valid 6+ months"],
       "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200",
       "https://flagcdn.com/w80/sg.png"),
      ("france",      "€8,000/yr",        "87%", ["Engineering", "Architecture", "Medicine"],             "Job seeker visa post-graduation",         "Long-term residence permit pathway",
       "68%", "4-8 weeks", "€14,000/year", "September",
       "France offers world-class education at affordable tuition fees, particularly at public universities and grandes écoles. With a rich cultural heritage, strong research programmes, and the Schengen area travel freedom, studying in France opens doors across Europe.",
       ["Receive admission letter", "Apply via Campus France", "Book visa appointment at French embassy", "Submit biometrics", "Await visa decision"],
       ["Admission letter from French institution", "Campus France registration", "Proof of finances (€615/month)", "French/English language proof", "Health insurance"],
       "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
       "https://flagcdn.com/w80/fr.png"),
    ];
    for ((slug, tuition, visa, courses, work, pr, acceptRate, procTime, avgCost, intakeMo, desc, visaStepsArr, reqs, heroImg, flagImg) in countrySeedData.vals()) {
      adminCountries.add(slug, {
        slug;
        tuition;
        visaSuccessRate = visa;
        popularCourses = courses;
        workOpportunities = work;
        prPathway = pr;
        acceptanceRate = acceptRate;
        processingTime = procTime;
        averageCost = avgCost;
        intakeMonths = intakeMo;
        description = desc;
        topUniversities = [];
        requirements = reqs;
        visaSteps = visaStepsArr;
        scholarships = ["Merit-based scholarships", "Government scholarships", "University-specific awards"];
        faqs = [];
        heroImage = heroImg;
        flagImage = flagImg;
        order = 0;
      });
    };
  };

  // Seed Testimonials (5 students)
  if (adminTestimonials.size() == 0) {
    let testimonialData : [(Text, Text, Text, Text, Text, Text, Nat)] = [
      ("Priya Sharma",   "University of Toronto",        "Canada",    "MBA",            "Valmiki Group guided me through every step of my Canadian study visa process. Their expert team made the entire journey stress-free and successful. I am now pursuing my MBA at one of Canada's finest universities.",                                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", 5),
      ("Rahul Reddy",    "Georgia Tech",                 "USA",       "MS Computer Science", "Thanks to Valmiki Group's counseling, I secured admission at Georgia Tech with a partial scholarship. Their SOP guidance and visa support were exceptional throughout the process.",                                                             "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", 5),
      ("Ananya Patel",   "University of Melbourne",      "Australia", "Nursing",         "The visa assistance team at Valmiki Group is exceptional. My student visa was approved in just 3 weeks! Their attention to detail and proactive follow-ups made all the difference.",                                                               "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", 5),
      ("Kiran Kumar",    "TU Munich",                    "Germany",   "Mechanical Engineering", "Valmiki Group helped me get into one of Germany's top engineering universities with full guidance on blocked account and visa. Their knowledge of German university processes is unmatched.",                                                     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", 5),
      ("Sneha Rao",      "University College Dublin",    "Ireland",   "MSc Data Science",  "From IELTS prep to visa approval, Valmiki Group supported me at every stage of my journey to Ireland. I achieved a band score of 7.5 and got my visa within two weeks of application.",                                                         "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", 5),
    ];
    var tid = adminState.nextAdminId;
    for ((name, university, country, course, text, imageUrl, rating) in testimonialData.vals()) {
      adminTestimonials.add({
        id = tid;
        name;
        university;
        country;
        course;
        text;
        rating;
        imageUrl;
        isVisible = true;
        youtubeUrl = null;
      });
      tid += 1;
    };
    adminState.nextAdminId := tid;
  };

  // Seed Events (3 upcoming)
  if (adminEvents.size() == 0) {
    let eventData : [(Text, Text, Text, Text)] = [
      ("USA University Fair 2025",      "June 15, 2025",  "Meet representatives from 20+ top US universities. Register for spot assessments and scholarship consultations. Bring your academic transcripts for on-the-spot profile evaluation.",       "Secunderabad Office"),
      ("Canada Education Webinar",      "June 22, 2025",  "Learn about fall 2025 intakes, PGWP opportunities, and PR pathways for international students in Canada. Expert counselors will answer all your queries live.",                       "Online — Zoom"),
      ("IELTS Free Demo Class",         "July 1, 2025",   "Experience our IELTS coaching methodology with a free 2-hour demo class. Our certified IELTS trainer will cover Listening, Reading, Writing, and Speaking. Limited seats available.", "Secunderabad Branch"),
    ];
    var eid = adminState.nextAdminId;
    for ((title, date, desc, location) in eventData.vals()) {
      adminEvents.add({
        id = eid;
        title;
        date;
        description = desc;
        imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
        location;
        registrationLink = "/contact";
        isActive = true;
      });
      eid += 1;
    };
    adminState.nextAdminId := eid;
  };

  // Seed Team Members (4)
  if (adminTeam.size() == 0) {
    let teamData : [(Text, Text, Text, Text, Nat)] = [
      ("Dr. Rajesh Valmiki",  "Founder & CEO",        "24+ years of experience in overseas education consulting. Personally guided over 10,000 students to their dream universities across USA, Canada, UK, Australia, and Europe.",                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", 1),
      ("Preethi Sharma",      "Head of Admissions",   "Expert in USA, Canada, and UK admissions with 12 years of experience helping students achieve their study abroad dreams. Has processed over 3,000 successful university applications.",         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", 2),
      ("Mohammed Imran",      "Visa Specialist",      "Specialized in student and immigration visas with a 98% personal visa success rate across 15+ countries. 10 years of experience navigating complex visa documentation and processes.",          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", 3),
      ("Lakshmi Prasad",      "Test Prep Head",       "IELTS certified trainer with 10 years experience. Has coached 5,000+ students to achieve their target band scores. Specializes in high-scorers' techniques and exam strategy.",                 "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", 4),
    ];
    var tmid = adminState.nextAdminId;
    for ((name, role, bio, imageUrl, order) in teamData.vals()) {
      adminTeam.add({
        id = tmid;
        name;
        role;
        bio;
        imageUrl;
        order;
      });
      tmid += 1;
    };
    adminState.nextAdminId := tmid;
  };

  // Seed Blog Posts (3 published)
  if (blogPosts.size() == 0) {
    let now = Time.now();
    let nowNat : Nat = if (now >= 0) { now.toNat() } else { 0 };
    let blogData : [(Text, Text, Text, Text, Text)] = [
      ("Top 10 Universities in Canada for Indian Students 2025", "top-10-universities-canada-indian-students-2025", "Study Abroad",
       "Canada remains one of the most popular study destinations for Indian students, offering world-class education and excellent post-study work opportunities. With the PGWP allowing up to 3 years of work experience post-graduation, Canada provides a clear pathway to permanent residency.\n\nTop universities include University of Toronto, University of British Columbia, McGill University, University of Waterloo, and Simon Fraser University. Each offers strong co-op programs, research opportunities, and a diverse student community.\n\nFor Indian students, Canada offers affordable tuition compared to the USA, relatively straightforward visa processes, and a welcoming multicultural environment that makes the transition abroad much smoother.",
       "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800"),
      ("IELTS vs PTE: Which English Test Should You Choose?", "ielts-vs-pte-which-english-test-2025", "Test Prep",
       "Choosing between IELTS and PTE can be confusing for students planning to study abroad. Both are globally accepted English proficiency tests, but they differ significantly in format, scoring, and acceptance.\n\nIELTS is the more widely recognized test, accepted by 10,000+ institutions globally. It has a paper-based and computer-based format with a human examiner for the speaking test. PTE is fully computer-based and typically has faster results within 48 hours.\n\nFor UK and Australia, both are equally accepted. For Canada, IELTS tends to be preferred. For students who prefer a fully objective, computer-based test, PTE is an excellent choice. Our counselors can help you decide which test aligns with your goals.",
       "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800"),
      ("Complete Guide to Canada Student Visa 2025", "complete-guide-canada-student-visa-2025", "Visa Updates",
       "Applying for a Canadian student visa in 2025 requires careful preparation and the right documentation. The process begins with receiving your Letter of Acceptance (LOA) from a Designated Learning Institution (DLI) in Canada.\n\nKey documents required include a valid passport, Letter of Acceptance, proof of financial support (minimum CAD 10,000 per year plus first year tuition), Statement of Purpose, academic transcripts, English test scores (IELTS/PTE/TOEFL), and biometrics.\n\nProcessing times vary from 4 to 12 weeks depending on your home country. For Indian applicants, the Student Direct Stream (SDS) program offers faster processing in as little as 20 days if you meet the eligibility criteria.",
       "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800"),
    ];
    var bid = contentState.nextContentId;
    for ((title, slug, category, content, imageUrl) in blogData.vals()) {
      blogPosts.add({
        id = bid;
        title;
        slug;
        content;
        featuredImageUrl = imageUrl;
        category;
        tags = [];
        isPublished = true;
        publishedAt = nowNat;
        createdAt = now;
        updatedAt = now;
      });
      bid += 1;
    };
    contentState.nextContentId := bid;
  };

  // Seed Test Prep Exams (6) — rich content
  if (testPrepExams.size() == 0) {
    let examSeedData : [(Text, Text, Text, Nat)] = [
      ("ielts", "IELTS", "International English Language Testing System — the world's most popular English test for study, work, and migration. We offer intensive classroom and online coaching with certified trainers who focus on all four sections: Listening, Reading, Writing, and Speaking.",                                   94),
      ("pte",   "PTE",   "Pearson Test of English — a fully computer-based English test accepted by thousands of universities worldwide. Our expert trainers help you achieve your target score faster with focused practice on integrated skills tasks and automated scoring strategies.",                                       92),
      ("toefl", "TOEFL", "Test of English as a Foreign Language — widely accepted by US and Canadian universities for undergraduate and graduate admissions. Our TOEFL program focuses on all four sections with full-length mock tests and personalized feedback.",                                                              91),
      ("gre",   "GRE",   "Graduate Record Examination — required for most US graduate programs across STEM, business, and humanities. Our GRE coaching covers Verbal Reasoning, Quantitative Reasoning, and Analytical Writing with customised study plans and regular practice tests.",                                      89),
      ("gmat",  "GMAT",  "Graduate Management Admission Test — essential for MBA programs worldwide. Our expert GMAT coaching focuses on Data Sufficiency, Critical Reasoning, Integrated Reasoning, and Analytical Writing to help you achieve a competitive score.",                                                         88),
      ("sat",   "SAT",   "Scholastic Assessment Test — required for undergraduate admissions in the United States. Our SAT program covers Math, Evidence-Based Reading, and Writing with full-length practice tests and score-improvement strategies tailored to each student.",                                            87),
    ];
    for ((id, name, desc, rate) in examSeedData.vals()) {
      let batchTimings : [AdminTypes.BatchTiming] = switch (id) {
        case ("ielts") { [
          { id = 0; startDate = ""; endDate = ""; schedule = "Morning 8:00 AM";   capacity = 20; enrolled = 0 },
          { id = 1; startDate = ""; endDate = ""; schedule = "Evening 6:00 PM";   capacity = 20; enrolled = 0 },
          { id = 2; startDate = ""; endDate = ""; schedule = "Weekend 10:00 AM";  capacity = 25; enrolled = 0 },
        ] };
        case ("pte") { [
          { id = 0; startDate = ""; endDate = ""; schedule = "Morning 9:00 AM";   capacity = 20; enrolled = 0 },
          { id = 1; startDate = ""; endDate = ""; schedule = "Evening 5:30 PM";   capacity = 20; enrolled = 0 },
        ] };
        case ("toefl") { [
          { id = 0; startDate = ""; endDate = ""; schedule = "Morning 8:30 AM";   capacity = 20; enrolled = 0 },
          { id = 1; startDate = ""; endDate = ""; schedule = "Evening 6:30 PM";   capacity = 20; enrolled = 0 },
        ] };
        case ("gre") { [
          { id = 0; startDate = ""; endDate = ""; schedule = "Morning 7:30 AM";   capacity = 15; enrolled = 0 },
          { id = 1; startDate = ""; endDate = ""; schedule = "Evening 5:00 PM";   capacity = 15; enrolled = 0 },
        ] };
        case ("gmat") { [
          { id = 0; startDate = ""; endDate = ""; schedule = "Evening 6:00 PM";   capacity = 15; enrolled = 0 },
          { id = 1; startDate = ""; endDate = ""; schedule = "Weekend 9:00 AM";   capacity = 20; enrolled = 0 },
        ] };
        case _ { [
          { id = 0; startDate = ""; endDate = ""; schedule = "Morning 9:30 AM";   capacity = 20; enrolled = 0 },
          { id = 1; startDate = ""; endDate = ""; schedule = "Weekend 11:00 AM";  capacity = 20; enrolled = 0 },
        ] };
      };
      testPrepExams.add(id, {
        id;
        name;
        description = desc;
        duration = "";
        cost = "";
        scoreRange = "";
        successRate = rate.toText() # "%";
        batchTimings;
        imageUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
      });
    };
  };

  // Seed Immigration Visas (4) — rich content
  if (immigrationVisas.size() == 0) {
    let visaSeedData : [(Text, Text, Text, Text, [Text], [Text])] = [
      ("pr-visa",        "PR",         "Permanent Residency Visa",
       "Permanent Residency pathways to Canada, Australia, New Zealand, and Europe. We assess your eligibility, prepare documentation, and guide you through every step of the PR application process. Our team stays updated with the latest immigration policies to maximise your chances.",
       ["Valid passport", "Educational credentials", "Work experience proof", "Language test scores", "Medical examination"],
       ["Age between 18-45 preferred", "Minimum 1 year skilled work experience", "IELTS band 6.0 or above", "Post-secondary qualification"]),
      ("work-visa",      "Work",       "Work Visa",
       "Work visa services for skilled professionals seeking international career opportunities. We help with job search assistance, employer sponsorship documentation, and complete visa file preparation for countries including Canada, UK, Australia, Germany, and New Zealand.",
       ["Valid job offer letter", "Educational documents", "Work experience certificates", "Passport and photos", "Medical clearance"],
       ["Relevant qualifications in your field", "Valid job offer from employer", "Meet health and character requirements", "Adequate funds for initial settlement"]),
      ("tourist-visa",   "Tourist",   "Tourist Visa",
       "Tourist and visitor visa assistance for individuals and families travelling to USA, UK, Canada, Australia, Europe, and other destinations. We ensure quick processing with all required documentation and a high success rate for our clients.",
       ["Valid passport", "Bank statements (last 6 months)", "Travel itinerary", "Hotel bookings", "Travel insurance"],
       ["Valid passport with 6 months validity", "Sufficient funds to support the trip", "No prior immigration violations", "Strong home country ties"]),
      ("dependent-visa", "Dependent", "Dependent Visa",
       "Dependent visa services for spouses and children accompanying students or workers abroad. We handle all documentation to keep families together during your overseas journey. Available for Canada, Australia, UK, USA, Germany, and New Zealand.",
       ["Relationship proof (marriage/birth certificate)", "Sponsor's visa copy", "Sponsor's financial documents", "Sponsor's enrollment/employment letter", "Passport-size photos"],
       ["Valid primary applicant visa", "Genuine relationship with sponsor", "Adequate financial support from sponsor", "Meet health requirements"]),
    ];
    for ((id, visaType, title, desc, docs, eligibility) in visaSeedData.vals()) {
      immigrationVisas.add(id, {
        id;
        visaType;
        title;
        description = desc;
        requirements = docs;
        processingTime = "4-12 weeks (varies by country)";
        successRate = "93%";
        documentsRequired = docs;
        eligibilityCriteria = eligibility;
        imageUrl = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800";
      });
    };
  };

  // Seed About Page Content
  if (contentState.aboutPageContent.companyStory == "Valmiki Group has been transforming student futures since 2001.") {
    contentState.aboutPageContent := {
      companyStory = "Valmiki Group was founded in 2001 with a single mission: to make quality international education accessible to every deserving student from India. Over 24 years, we have guided more than 1 lakh students to universities across 15+ countries, establishing ourselves as Hyderabad's most trusted overseas education and immigration consultancy.";
      vision = "To be India's most trusted overseas education and immigration consultancy, empowering every deserving student to achieve their global education dreams with honest, expert, and personalised guidance.";
      mission = "To provide honest, expert, and personalised guidance to every student seeking international education and immigration opportunities, ensuring they receive end-to-end support from counseling to visa approval and pre-departure assistance.";
      timeline = [
        { id = 0; year = "2001"; milestone = "Foundation";              description = "Valmiki Group founded in Secunderabad, Hyderabad with a mission to democratise overseas education for Indian students." },
        { id = 1; year = "2005"; milestone = "Immigration Services";    description = "Expanded services to include immigration consulting for PR visas to Canada, Australia, and New Zealand." },
        { id = 2; year = "2010"; milestone = "Jubilee Hills Branch";     description = "Opened second branch at Jubilee Hills to serve the growing demand for overseas education consulting in Hyderabad." },
        { id = 3; year = "2015"; milestone = "25,000 Students";         description = "Reached the milestone of 25,000 students successfully placed in universities and colleges worldwide." },
        { id = 4; year = "2020"; milestone = "Online Programs";         description = "Launched online counseling and test preparation programs, extending our reach to students across Telangana and Andhra Pradesh." },
        { id = 5; year = "2024"; milestone = "1 Lakh+ Students";        description = "Celebrated the landmark achievement of 1 Lakh+ students guided, with 350+ university partnerships across 15+ countries." },
      ];
      achievements = [
        { id = 0; metric = "1 Lakh+";      description = "Students Successfully Guided to Dream Universities"; icon = "Users" },
        { id = 1; metric = "350+";          description = "Global University and College Partnerships";          icon = "University" },
        { id = 2; metric = "93%";           description = "Overall Visa Success Rate Across All Countries";        icon = "CheckCircle" },
        { id = 3; metric = "24+ Years";     description = "Of Excellence in Overseas Education Consulting";        icon = "Clock" },
        { id = 4; metric = "3 Branches";    description = "Conveniently Located in Hyderabad";                    icon = "MapPin" },
      ];
      imageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800";
    };
  };

  // Seed Study Abroad Content
  if (contentState.studyAbroadContent.headline == "Study Abroad — Your Gateway to Global Opportunities") {
    contentState.studyAbroadContent := {
      headline = "Begin Your Global Education Journey";
      introduction = "Studying abroad opens doors to world-class education, international career opportunities, and life-changing experiences. Valmiki Group provides end-to-end support from university selection to visa approval, ensuring your journey overseas is smooth, successful, and fulfilling.";
      processSteps = [
        { id = 0; order = 1; title = "Free Counseling";       description = "Discuss your academic profile, career goals, and preferences with our expert counselors who will shortlist the best countries and universities for you."; icon = "MessageCircle" },
        { id = 1; order = 2; title = "University Selection";  description = "Choose from 350+ partner universities based on your course of interest, budget, and career goals. We provide detailed comparisons and admission probability assessments."; icon = "University" },
        { id = 2; order = 3; title = "Application & SOP";     description = "We prepare your complete university application including a compelling Statement of Purpose, Letters of Recommendation, and all supporting documents."; icon = "FileText" },
        { id = 3; order = 4; title = "Visa Assistance";       description = "Expert visa guidance with a 93% success rate across all countries. We handle interview preparation, documentation, and application submission."; icon = "Shield" },
      ];
      scholarships = [
        { id = 0; name = "Merit-Based Scholarships";     amount = "Up to 50% tuition waiver";   eligibility = "CGPA 8.0+ and above-average test scores"; deadline = "Varies by university" },
        { id = 1; name = "Need-Based Financial Aid";     amount = "Up to $10,000 per year";       eligibility = "Demonstrated financial need with strong academics"; deadline = "Varies by country" },
        { id = 2; name = "Government Scholarships";     amount = "Full tuition + living expenses"; eligibility = "Varies by programme and nationality"; deadline = "Check intake deadlines" },
      ];
      intakeInfo = "Major intakes: January/February (Spring Intake), May/June (Summer Intake), September/October (Fall Intake — most popular). We recommend applying 6-12 months in advance to secure your preferred university and course.";
      imageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800";
    };
  };

  // Seed Partner Universities (10)
  if (partnerUniversities.size() == 0) {
    let uniData : [(Text, Text, Text, Text)] = [
      ("University of Toronto",              "https://images.unsplash.com/photo-1562774053-701939374585?w=200", "Canada",    "https://www.utoronto.ca"),
      ("University of Melbourne",            "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200", "Australia",  "https://www.unimelb.edu.au"),
      ("Georgia Tech",                       "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200", "USA",        "https://www.gatech.edu"),
      ("University College Dublin",          "https://images.unsplash.com/photo-1595829703-8fdc9e09e4f1?w=200", "Ireland",    "https://www.ucd.ie"),
      ("TU Munich",                          "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=200", "Germany",    "https://www.tum.de"),
      ("University of Auckland",             "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200", "New Zealand","https://www.auckland.ac.nz"),
      ("University of British Columbia",     "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=200", "Canada",     "https://www.ubc.ca"),
      ("Imperial College London",            "https://images.unsplash.com/photo-1520637836862-4d197d17c1a2?w=200", "UK",         "https://www.imperial.ac.uk"),
      ("National University of Singapore",   "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200", "Singapore",  "https://www.nus.edu.sg"),
      ("Monash University",                  "https://images.unsplash.com/photo-1588072432836-e10032774350?w=200", "Australia",  "https://www.monash.edu"),
    ];
    var uid = contentState.nextContentId;
    for ((name, logoUrl, country, website) in uniData.vals()) {
      partnerUniversities.add({
        id = uid;
        name;
        logoUrl;
        country;
        website;
        order = uid;
      });
      uid += 1;
    };
    contentState.nextContentId := uid;
  };

  // Seed Country Detail Pages (10 countries — rich content)
  if (countryDetails.size() == 0) {
    let cdData : [(Text, Text, Text, Text, Text, [Text], Text, Text, Text, [Text])] = [
      ("usa", "Study in the USA", "World-class universities and unmatched research opportunities await you",
       "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200",
       "The USA is home to some of the world's top-ranked universities and offers unparalleled research opportunities. International students benefit from Optional Practical Training (OPT) and a vibrant multicultural campus environment that prepares graduates for global careers.",
       ["MIT", "Stanford University", "Harvard University", "Georgia Tech", "University of Michigan", "Carnegie Mellon University"],
       "Apply for F-1 student visa after receiving your I-20 from your university. Submit DS-160 form, pay SEVIS fee, and attend visa interview at US Embassy. Processing typically takes 2-8 weeks. Strong financial documentation and ties to home country are important.",
       "Up to 20 hours/week on campus during studies; OPT allows 12 months full-time work after graduation; STEM OPT extension allows 24 additional months for STEM graduates",
       "EB-2 NIW and EB-1A pathways available for highly skilled graduates; H-1B work visa for sponsored employees; O-1 visa for extraordinary ability",
       ["Engineering", "Computer Science", "Business Administration", "Medicine", "Law", "Data Science", "Finance", "Architecture"]),
      ("canada", "Study in Canada", "A welcoming multicultural country with world-class education and clear PR pathways",
       "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1200",
       "Canada is one of the most popular study destinations for Indian students, offering world-class education at relatively affordable costs. The Post-Graduate Work Permit (PGWP) allows graduates to work for up to 3 years, and the Express Entry system provides a clear and accessible pathway to Permanent Residency.",
       ["University of Toronto", "University of British Columbia", "McGill University", "University of Waterloo", "McMaster University", "Queen's University"],
       "Apply for a Canadian Student Visa (Study Permit) after receiving your Letter of Acceptance from a DLI. Student Direct Stream (SDS) offers faster 20-day processing for Indian students who meet requirements including IELTS band 6.0 and full first-year tuition payment.",
       "Part-time work up to 20 hours/week during studies; full-time during scheduled breaks; PGWP post-graduation for up to 3 years",
       "Express Entry Comprehensive Ranking System (CRS); Canadian Experience Class (CEC); Provincial Nominee Programs (PNPs) for all provinces",
       ["Business", "Engineering", "Healthcare", "Computer Science", "Finance", "Data Analytics", "Nursing", "MBA"]),
      ("uk", "Study in the UK", "Prestigious universities, rich academic heritage, and vibrant student life",
       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
       "The UK is home to some of the oldest and most prestigious universities in the world, including Oxford and Cambridge. A typical UK degree takes just 3 years for undergraduate and 1 year for postgraduate, making it a cost-effective study destination with globally recognised qualifications.",
       ["University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "University of Edinburgh", "University of Manchester"],
       "Apply for UK Student Visa (Tier 4/Student Route) after receiving your Confirmation of Acceptance for Studies (CAS) from a UK university. Provide proof of English proficiency, finances, and intent. Biometrics required. Processing typically takes 3-8 weeks.",
       "Up to 20 hours/week during term; full-time during vacations; Graduate Route visa allows 2 years post-study work (3 years for PhD graduates)",
       "Skilled Worker visa after employment; Indefinite Leave to Remain (ILR) after 5 years of continuous lawful residence in the UK",
       ["MBA", "Law", "Engineering", "Medicine", "Finance", "Computer Science", "Architecture", "Arts & Design"]),
      ("australia", "Study in Australia", "World-ranked universities with stunning lifestyle and post-study work rights",
       "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200",
       "Australia is a top destination for international students with globally recognised qualifications, a safe and welcoming environment, and excellent post-study work opportunities. The Temporary Graduate visa provides 2-4 years of work rights, and the SkillSelect points system offers a clear PR pathway.",
       ["University of Melbourne", "Australian National University", "University of Sydney", "University of Queensland", "Monash University", "UNSW Sydney"],
       "Apply for Australian Student Visa (Subclass 500) after receiving your Confirmation of Enrolment (CoE). Submit health examination, English test scores, GTE statement, and financial evidence. Processing takes 4-8 weeks. Health insurance (OSHC) is mandatory.",
       "Up to 48 hours per fortnight during term; unlimited during holidays; Temporary Graduate Visa (485) provides 2-4 years post-study work rights",
       "SkillSelect EOI through Skilled Independent (189), Skilled Nominated (190), or Skilled Work Regional (491) pathways",
       ["Engineering", "Nursing", "Information Technology", "Accounting", "Construction Management", "Education", "Pharmacy", "Architecture"]),
      ("germany", "Study in Germany", "Free public university education with cutting-edge engineering and research",
       "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200",
       "Germany offers world-class education at minimal or zero tuition fees at public universities, making it the most cost-effective top study destination. Renowned for engineering, science, and research, German degrees are highly valued by global employers and the country provides an 18-month job seeker visa post-graduation.",
       ["TU Munich", "Heidelberg University", "LMU Munich", "KIT Karlsruhe", "Humboldt University", "RWTH Aachen University"],
       "Apply for German National Visa (Type D) for studies. Requires admission letter, blocked account (€11,208), proof of German/English proficiency depending on programme, and APS certificate for Indian applicants. Processing takes 6-12 weeks. Apply well in advance.",
       "Students may work up to 120 full days or 240 half days per year; post-graduation 18-month job seeker visa to find employment",
       "EU Blue Card for qualified professionals; permanent residence after 33 months of contributions to the pension scheme (21 months with B1 German)",
       ["Engineering", "Computer Science", "Natural Sciences", "Business", "Architecture", "Medicine", "Research", "Automotive Technology"]),
      ("ireland", "Study in Ireland", "The Silicon Valley of Europe with top tech companies and a vibrant student community",
       "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=1200",
       "Ireland is Europe's fastest-growing economy, home to the European headquarters of Google, Facebook, Apple, and over 1,000 multinational companies. A post-study stay-back permission of 24 months allows graduates to work and gain international experience, while a thriving tech and pharma industry ensures excellent career prospects.",
       ["University College Dublin", "Trinity College Dublin", "University College Cork", "National University of Ireland Galway", "Dublin City University", "University of Limerick"],
       "Apply for Irish Student Visa after receiving your Letter of Offer. Submit proof of English proficiency, financial evidence, accommodation proof, and travel insurance. Private medical insurance required. Processing takes 4-8 weeks. Apply through your nearest Irish Embassy.",
       "Up to 20 hours/week during term; 40 hours/week during June-September holidays; 24-month Third Level Graduate Scheme post-study",
       "Critical Skills Employment Permit after employment; General Employment Permit; Stamp 4 leads to permanent residence after 5 years",
       ["Information Technology", "Pharmacy", "Finance", "Business Analytics", "Engineering", "Data Science", "Supply Chain", "Biopharmaceuticals"]),
      ("new-zealand", "Study in New Zealand", "Pristine landscapes, world-class education, and a clear path to residency",
       "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200",
       "New Zealand offers a high-quality education system ranked among the best in the world, combined with a spectacular natural environment and one of the safest countries to live and study in. The 3-year Post-Study Work Visa and Skilled Migrant Category PR stream make it an attractive long-term destination.",
       ["University of Auckland", "University of Otago", "Victoria University of Wellington", "University of Canterbury", "Massey University", "Lincoln University"],
       "Apply for New Zealand Student Visa after receiving Offer of Place from institution. Requires proof of funds, English proficiency, and medical clearance. Processing typically takes 20-30 days. Purchase travel insurance and arrange accommodation before applying.",
       "Up to 20 hours/week during term; full-time during scheduled holidays; 3-year Post-Study Work Visa after completing 2+ year qualification",
       "Skilled Migrant Category (SMC) points-based system; Residence from Work stream; Long Term Skill Shortage List occupations eligible",
       ["Agriculture", "Engineering", "Tourism & Hospitality", "Information Technology", "Business", "Environmental Science", "Healthcare", "Film & Media"]),
      ("dubai", "Study in Dubai", "World-class campuses in a global hub connecting East and West",
       "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
       "Dubai has emerged as a global education hub with campuses of prestigious international universities, a tax-free lifestyle, and unparalleled career networking opportunities. With 200+ nationalities calling Dubai home, students gain a truly international experience while staying relatively close to India.",
       ["University of Wollongong Dubai", "Heriot-Watt University Dubai", "Middlesex University Dubai", "Murdoch University Dubai", "Manipal Academy Dubai", "BITS Pilani Dubai"],
       "Apply for UAE Student Residence Visa through your university. Requires admission letter, Emirates ID, medical fitness certificate, and health insurance. University typically sponsors the visa. Processing takes 2-4 weeks after document submission.",
       "Part-time work permitted during studies with university permission; excellent internship opportunities with Fortune 500 companies; full-time work post-graduation",
       "UAE Golden Visa for high academic achievers; investors; and exceptional talents in various fields",
       ["Business Administration", "Hospitality Management", "Finance", "Engineering", "IT", "Fashion Design", "Media Studies", "Supply Chain"]),
      ("singapore", "Study in Singapore", "Asia's premier education hub with world-ranked universities and top career prospects",
       "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=1200",
       "Singapore is Asia's leading education destination, home to two of Asia's top universities (NUS and NTU), a strategic location for business and finance, and a gateway to Asian markets. Singapore's clean and safe environment, combined with English-medium instruction and strong industry connections, makes it ideal for career-focused students.",
       ["National University of Singapore", "Nanyang Technological University", "Singapore Management University", "INSEAD Asia Campus", "Singapore Institute of Technology", "James Cook University Singapore"],
       "Apply for Singapore Student Pass through the Student's Pass Online Application and Registration (SOLAR) system. Requires In-Principle Approval from ICA, financial proof, and medical clearance. Processing takes 4-6 weeks. Student pass valid for course duration.",
       "Up to 16 hours/week during term; full-time during vacations; Employment Pass or S Pass for graduates with valid job offer",
       "Permanent Residence application available after 2 years of employment; Singapore Citizenship possible after 2 years as PR",
       ["Finance", "Engineering", "Biomedical Sciences", "Computer Science", "Business Analytics", "Architecture", "Hospitality", "Digital Marketing"]),
      ("europe", "Study in Europe", "Diverse cultures, affordable education, and internationally recognised qualifications",
       "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200",
       "Europe offers a diverse range of study destinations with affordable education, rich cultural experiences, and Schengen-area travel freedom. Countries like France, Netherlands, Sweden, and Spain offer English-taught programmes at a fraction of the cost of UK or US education, with strong graduate employment prospects.",
       ["University of Amsterdam", "Sciences Po Paris", "TU Delft", "Uppsala University", "Lund University", "University of Barcelona"],
       "Apply for Schengen Student Visa (Type D) through the relevant country's embassy. Requires admission letter, proof of funds (typically €700-1000/month), health insurance, accommodation proof, and return ticket. Processing takes 4-8 weeks. Each country has slightly different requirements.",
       "Part-time work rights vary by country (typically 20 hours/week); post-graduation job seeker visas available in many EU countries",
       "Long-term residence permit after 5 years in EU; Blue Card for highly skilled workers in specific EU countries; individual country PR pathways available",
       ["Engineering", "Architecture", "Medicine", "European Business", "International Relations", "Fine Arts", "Environmental Science", "Renewable Energy"]),
    ];
    var cdid : Nat = 0;
    for ((slug, title, subtitle, heroImg, whyStudy, unis, visaProc, workRights, prOpps, courses) in cdData.vals()) {
      let universities : [AdminTypes.CountryUniversity] = Array.tabulate<AdminTypes.CountryUniversity>(unis.size(), func (i) {
        { id = cdid * 10 + i; name = unis[i]; ranking = ""; tuition = ""; logoUrl = ""; website = "" };
      });
      let defaultCost : AdminTypes.CostBreakdown = {
        accommodation = "";
        food = "";
        transport = "";
        miscellaneous = "";
        totalMonthly = "";
      };
      let faqs : [AdminTypes.FAQ] = [
        { id = cdid * 10 + 0; question = "How long does the visa process take for " # title # "?"; answer = "The visa processing time varies but typically takes 4-12 weeks. We recommend applying at least 3 months before your intended start date to ensure timely processing."; order = 1 },
        { id = cdid * 10 + 1; question = "What are the English language requirements?"; answer = "Most universities require IELTS band 6.0-7.0 or equivalent PTE/TOEFL scores. Requirements vary by institution and course level. Contact our counselors for specific requirements."; order = 2 },
        { id = cdid * 10 + 2; question = "Can I work while studying?"; answer = workRights; order = 3 },
      ];
      countryDetails.add(slug, {
        countrySlug = slug;
        heroTitle = title;
        heroSubtitle = subtitle;
        heroImageUrl = heroImg;
        whyStudyHere = whyStudy;
        universities;
        visaProcess = [
          { id = cdid * 10 + 0; order = 1; title = "Receive Admission Letter"; description = "Get your official admission offer from your chosen university. This document is required to begin your visa application." },
          { id = cdid * 10 + 1; order = 2; title = "Prepare Documentation"; description = "Gather all required documents including financials, test scores, passport, and photographs. Our team will provide you a personalised checklist." },
          { id = cdid * 10 + 2; order = 3; title = "Submit Visa Application"; description = visaProc },
          { id = cdid * 10 + 3; order = 4; title = "Attend Interview (if required)"; description = "Some countries require a visa interview. Our visa specialists will thoroughly prepare you with mock interviews and tips." },
        ];
        costOfLiving = defaultCost;
        scholarships = ["Merit-based scholarships", "Government scholarships", "University-specific awards", "Country-specific grants"];
        popularCourses = courses;
        workRights;
        prOpportunities = prOpps;
        faqs;
      });
      cdid += 1;
    };
  };

  // Seed Gallery Entries (4 samples)
  if (galleryEntries.size() == 0) {
    let now = Time.now();
    let galleryData : [(Text, Text, Text, Text, Text)] = [
      ("Priya Sharma",   "USA",       "University of Southern California",  "Approved", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400"),
      ("Rahul Reddy",    "Canada",    "University of Toronto",              "Approved", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400"),
      ("Ananya Patel",   "UK",        "University of Manchester",           "Approved", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400"),
      ("Kiran Kumar",    "Australia", "Monash University",                  "Approved", "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400"),
    ];
    var gid = contentState.nextContentId;
    for ((studentName, destinationCountry, universityAdmitted, visaStatus, imageUrl) in galleryData.vals()) {
      galleryEntries.add({
        id = gid;
        studentName;
        destinationCountry;
        universityAdmitted;
        visaStatus;
        imageUrl;
        order = gid;
        isVisible = true;
        createdAt = now;
      });
      gid += 1;
    };
    contentState.nextContentId := gid;
  };

  // Seed Job Openings (3 samples)
  if (jobOpenings.size() == 0) {
    let now = Time.now();
    let jobData : [(Text, Text, Text, Text, Text)] = [
      ("Overseas Education Counselor", "Counseling",  "Secunderabad",
       "Guide prospective students through the overseas education process from initial counseling to university selection, application preparation, and visa documentation. Build and maintain relationships with students and parents throughout their journey.",
       "Bachelor's degree required; 1-3 years of counseling or education industry experience preferred; Excellent communication and interpersonal skills; Knowledge of international universities and visa processes"),
      ("Marketing Executive",         "Marketing",   "Jubilee Hills",
       "Plan and execute digital marketing campaigns including SEO, social media, email marketing, and paid advertising. Coordinate with branch teams to drive lead generation, manage the company's online presence, and report on campaign performance.",
       "Bachelor's degree in Marketing or related field; 1-2 years of digital marketing experience; Proficiency in social media platforms and Google Ads; Strong analytical and creative skills"),
      ("IELTS Trainer",               "Test Prep",   "Jubilee Hills",
       "Deliver high-quality IELTS coaching covering all four skills: Listening, Reading, Writing, and Speaking. Develop study materials, conduct mock tests, provide personalised feedback, and track student progress to ensure target band score achievement.",
       "IELTS band score of 8.0 or above; Certified IELTS trainer or teaching qualification; Minimum 2 years of IELTS coaching experience; Strong classroom management and motivational skills"),
    ];
    var jid = contentState.nextContentId;
    for ((title, department, location, description, requirements) in jobData.vals()) {
      jobOpenings.add({
        id = jid;
        title;
        department;
        location;
        description;
        requirements;
        isActive = true;
        createdAt = now;
      });
      jid += 1;
    };
    contentState.nextContentId := jid;
  };

  // Seed Service Detail Content (8 services)
  if (serviceDetails.size() == 0) {
    let studyAbroadDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "study-abroad-counseling";
      heroImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600";
      heroHeadline = "Expert Study Abroad Counseling";
      heroSubheadline = "Personalised guidance to help you choose the right country, university, and course for your career goals";
      overview = "Our study abroad counseling service provides comprehensive, one-on-one guidance to help students identify the best international education opportunities based on their academic profile, career aspirations, and budget. Our certified counselors have in-depth knowledge of over 350 universities across 10+ countries.";
      whatIsIncluded = ["Profile assessment and gap analysis", "Country and university shortlisting", "Course and specialisation guidance", "Admission probability analysis", "Application timeline planning", "Scholarship opportunity identification"];
      processSteps = [
        { order = 1; title = "Initial Consultation"; description = "Free 60-minute session with a certified counselor to understand your academic background, career goals, and preferences."; icon = "MessageCircle" },
        { order = 2; title = "Profile Assessment"; description = "Detailed evaluation of your academic scores, test results, extracurriculars, and work experience to identify your strengths."; icon = "ClipboardCheck" },
        { order = 3; title = "University Shortlisting"; description = "Curated list of 8-12 universities across 2-3 countries that match your profile, with admission probability for each."; icon = "University" },
        { order = 4; title = "Application Strategy"; description = "Customised application timeline, document checklist, and strategy to maximise your admission chances."; icon = "Target" },
      ];
      eligibilityCriteria = ["Completed or pursuing 10+2 / undergraduate / postgraduate degree", "Clear intent to study abroad", "Open to guidance and profile building"];
      whyChooseValmiki = ["24+ years of specialised overseas education experience", "Counselors certified by leading universities worldwide", "Success track record with 1 Lakh+ students guided", "Unbiased guidance focused on your best interests", "Transparent fee structure with no hidden costs"];
      faqs = [
        { question = "Is the initial counseling session free?"; answer = "Yes, the initial counseling session is completely free with no obligations. We want to understand your goals before recommending any specific pathway." },
        { question = "How long does the counseling process take?"; answer = "The full counseling process from initial session to finalised university list typically takes 2-4 weeks, depending on your availability and readiness." },
        { question = "Can I change my country preference after the initial session?"; answer = "Absolutely. Our counselors will present multiple country options and you can explore each before making a final decision." },
      ];
      ctaText = "Ready to explore your global education options? Book a free counseling session today.";
      ctaButtonText = "Book Free Counseling";
    };
    serviceDetails.add("study-abroad-counseling", studyAbroadDetail);

    let visaDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "student-visa-assistance";
      heroImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600";
      heroHeadline = "Student Visa Assistance";
      heroSubheadline = "93% visa success rate backed by expert preparation, documentation, and interview coaching";
      overview = "Our student visa assistance service covers every aspect of the visa application process — from documentation preparation and financial statements to mock interviews and embassy submission tracking. We have successfully processed thousands of student visas across USA, Canada, UK, Australia, Germany, Ireland, and more.";
      whatIsIncluded = ["Complete documentation checklist and preparation", "Financial statement guidance", "SOP review for visa compliance", "Mock visa interview preparation", "Visa application form filling", "Post-submission tracking and updates"];
      processSteps = [
        { order = 1; title = "Document Collection"; description = "We provide a country-specific document checklist and guide you to gather all required documents correctly."; icon = "FolderOpen" },
        { order = 2; title = "Documentation Review"; description = "Our visa specialists review every document for completeness, accuracy, and compliance with embassy requirements."; icon = "Search" },
        { order = 3; title = "Interview Preparation"; description = "Intensive mock interview sessions covering likely questions, do's and don'ts, and confidence-building techniques."; icon = "Users" },
        { order = 4; title = "Application Submission"; description = "We submit your complete application and track its progress, keeping you informed at every stage."; icon = "Send" },
      ];
      eligibilityCriteria = ["Valid admission offer from a recognised university", "Sufficient financial proof for tuition and living expenses", "Valid passport with at least 18 months validity", "English language test scores (IELTS/PTE/TOEFL)"];
      whyChooseValmiki = ["93% overall visa success rate across all countries", "Visa specialists with country-specific expertise", "Comprehensive mock interview preparation", "We handle all complex documentation scenarios", "Continuous tracking until visa decision"];
      faqs = [
        { question = "What is your visa success rate?"; answer = "Our overall visa success rate is 93% across all countries and visa categories, built on meticulous documentation preparation and thorough interview coaching." },
        { question = "What happens if my visa is rejected?"; answer = "We analyse the rejection reason, address the grounds of refusal, and assist with a re-application with a strengthened file." },
      ];
      ctaText = "Don't leave your visa to chance. Let our specialists prepare your winning application.";
      ctaButtonText = "Start Visa Process";
    };
    serviceDetails.add("student-visa-assistance", visaDetail);

    let immigrationDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "immigration-services";
      heroImage = "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=1600";
      heroHeadline = "Immigration Services";
      heroSubheadline = "Expert PR, work, and dependent visa consulting for Canada, Australia, New Zealand, and Europe";
      overview = "Valmiki Group provides end-to-end immigration consulting for skilled workers, students, and families seeking permanent residency or work visas abroad. Our immigration advisors stay current with the latest policy changes to provide accurate, strategic guidance for your immigration journey.";
      whatIsIncluded = ["Eligibility assessment and points calculation", "Profile building and gap analysis", "Expression of Interest (EOI) submission", "Invitation to Apply (ITA) processing", "Complete documentation preparation", "Ongoing file tracking and updates"];
      processSteps = [
        { order = 1; title = "Eligibility Assessment"; description = "Detailed points-based eligibility evaluation for Express Entry, SkillSelect, or other immigration programmes."; icon = "Calculator" },
        { order = 2; title = "Profile Building"; description = "Strategic advice on improving your CRS score or points through language tests, education credentials, and job offers."; icon = "TrendingUp" },
        { order = 3; title = "Application Filing"; description = "Preparation and submission of your complete immigration application with all required supporting documents."; icon = "FileText" },
        { order = 4; title = "Landing Assistance"; description = "Guidance on landing requirements, settlement services, and initial steps after your PR approval."; icon = "Home" },
      ];
      eligibilityCriteria = ["Age below 45 years preferred", "Minimum diploma or degree qualification", "At least 1 year of skilled work experience", "Language proficiency (IELTS band 6.0+)", "Valid passport"];
      whyChooseValmiki = ["Authorised immigration consulting firm", "Up-to-date knowledge of latest immigration policy changes", "Transparent process with regular status updates", "Strong track record of PR approvals", "End-to-end support from assessment to landing"];
      faqs = [
        { question = "Which countries do you provide immigration services for?"; answer = "We provide immigration services for Canada (Express Entry, PNP), Australia (SkillSelect), New Zealand, UK, Germany, and other European countries." },
        { question = "How long does the PR process take?"; answer = "Processing times vary by country and programme. Canadian Express Entry typically takes 6 months, Australian SkillSelect 8-12 months, with variations depending on your occupation and profile." },
      ];
      ctaText = "Take the first step towards your permanent residency. Get a free eligibility assessment today.";
      ctaButtonText = "Check Eligibility";
    };
    serviceDetails.add("immigration-services", immigrationDetail);

    let scholarshipDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "scholarships-guidance";
      heroImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600";
      heroHeadline = "Scholarships Guidance";
      heroSubheadline = "Unlock merit and need-based scholarships worth thousands of dollars at top universities worldwide";
      overview = "Financing international education can be challenging, but Valmiki Group's scholarship guidance service helps students identify, apply for, and secure scholarships, grants, and financial aid from universities, governments, and private organisations across all our destination countries.";
      whatIsIncluded = ["Scholarship database access and matching", "Eligibility pre-screening", "Scholarship application assistance", "Scholarship essay and SOP support", "Government grant research", "Financial aid negotiation guidance"];
      processSteps = [
        { order = 1; title = "Profile Matching"; description = "We match your academic profile against our database of 500+ scholarships to identify the most relevant opportunities."; icon = "Search" },
        { order = 2; title = "Eligibility Check"; description = "Detailed eligibility screening for each shortlisted scholarship including GPA, test score, and deadline requirements."; icon = "CheckCircle" },
        { order = 3; title = "Application Support"; description = "Guidance on scholarship essays, reference letters, and supporting documents to craft a compelling application."; icon = "Edit" },
        { order = 4; title = "Follow-Up"; description = "We track application status and advise on acceptance procedures once scholarships are awarded."; icon = "Bell" },
      ];
      eligibilityCriteria = ["Strong academic record (typically CGPA 7.0+ for merit scholarships)", "Relevant extracurricular activities or achievements", "Adequate language test scores", "Genuine financial need (for need-based scholarships)"];
      whyChooseValmiki = ["Access to an exclusive database of 500+ scholarships", "Expert guidance on scholarship essays and applications", "Partnerships with universities offering special scholarships for our students", "Proven track record of securing significant financial aid", "No success fee — we work in your interest"];
      faqs = [
        { question = "What types of scholarships can you help me apply for?"; answer = "We assist with merit-based scholarships, need-based financial aid, government scholarships (like Australia Awards, Chevening, DAAD), university-specific scholarships, and private foundation grants." },
        { question = "Can I apply for multiple scholarships simultaneously?"; answer = "Yes, we recommend applying for multiple scholarships to maximise your chances. Our team will help you manage deadlines and tailor each application." },
      ];
      ctaText = "Don't miss out on scholarships that could save you thousands. Start your scholarship search today.";
      ctaButtonText = "Find Scholarships";
    };
    serviceDetails.add("scholarships-guidance", scholarshipDetail);

    let loansDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "education-loans";
      heroImage = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600";
      heroHeadline = "Education Loans";
      heroSubheadline = "Navigate education loan options across leading banks and financial institutions with expert guidance";
      overview = "Valmiki Group partners with leading banks and NBFCs to help students secure education loans for their overseas studies. Our financial counselors guide you through loan options, documentation, and the application process to ensure you get the most favourable terms for your needs.";
      whatIsIncluded = ["Loan eligibility assessment", "Bank and NBFC comparison", "Documentation preparation", "Loan application assistance", "Collateral and guarantor guidance", "Interest rate and repayment planning"];
      processSteps = [
        { order = 1; title = "Financial Assessment"; description = "Evaluate your family income, assets, and loan requirement to determine the best loan type and lender."; icon = "DollarSign" },
        { order = 2; title = "Lender Shortlisting"; description = "Compare loan products from SBI, Axis Bank, HDFC Credila, Avanse, and other lenders based on your profile."; icon = "BarChart" },
        { order = 3; title = "Documentation"; description = "Complete guidance on all required documents including admission letter, financial statements, property documents, and KYC."; icon = "FolderOpen" },
        { order = 4; title = "Loan Disbursement"; description = "We liaise with the bank to ensure timely disbursement before your fee payment deadline."; icon = "CreditCard" },
      ];
      eligibilityCriteria = ["Confirmed admission to an accredited overseas university", "Indian citizen or NRI", "Co-applicant (parent/guardian) with stable income", "Clean credit history", "Collateral may be required for loans above INR 7.5 lakhs"];
      whyChooseValmiki = ["Relationships with 10+ leading banks and NBFCs", "Expedited processing due to our institutional partnerships", "Guidance on collateral-free loan options", "Support in negotiating interest rates", "Continuous assistance until loan disbursement"];
      faqs = [
        { question = "How much loan can I get for overseas education?"; answer = "Education loans for overseas studies typically range from INR 10 lakhs to INR 1.5 crore depending on the lender, country, and collateral availability." },
        { question = "Do I need collateral for an education loan?"; answer = "Loans up to INR 7.5 lakhs can often be secured without collateral. Above this amount, tangible collateral (property, FD) is usually required." },
      ];
      ctaText = "Let us help you finance your dream education. Explore loan options today.";
      ctaButtonText = "Explore Loan Options";
    };
    serviceDetails.add("education-loans", loansDetail);

    let sopDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "sop-documentation";
      heroImage = "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1600";
      heroHeadline = "SOP & Documentation Support";
      heroSubheadline = "Compelling Statements of Purpose and flawless documentation to strengthen every application";
      overview = "A strong Statement of Purpose (SOP) can be the deciding factor between admission and rejection. Valmiki Group's expert writers craft personalised, authentic SOPs that highlight your academic journey, career goals, and genuine motivation — tailored to each university's specific requirements.";
      whatIsIncluded = ["Personalised SOP drafting and editing", "Letter of Recommendation (LOR) guidance", "Resume / CV preparation for university applications", "University application form filling", "Transcripts and certificate attestation guidance", "Document translation services (if required)"];
      processSteps = [
        { order = 1; title = "Background Interview"; description = "In-depth interview to understand your academic journey, career goals, achievements, and motivation for your chosen course."; icon = "Mic" },
        { order = 2; title = "SOP Draft"; description = "Our experienced writers craft a compelling, authentic first draft tailored to your target university and programme."; icon = "Edit" },
        { order = 3; title = "Review & Revision"; description = "Multiple rounds of revision with your feedback until the SOP perfectly represents your story and goals."; icon = "RefreshCw" },
        { order = 4; title = "Final Proofreading"; description = "Thorough proofreading for grammar, style, and compliance with each university's word limit and guidelines."; icon = "CheckSquare" },
      ];
      eligibilityCriteria = ["Confirmed university application or shortlist", "Clear career goals and motivations", "Academic transcripts and test scores available", "Minimum 2 weeks before application deadline recommended"];
      whyChooseValmiki = ["Native English-standard SOP writing", "University-specific customisation for each application", "Turnaround within 5-7 business days", "Unlimited revisions until you are satisfied", "Hundreds of successful SOPs for all top universities"];
      faqs = [
        { question = "How many revisions are included?"; answer = "We offer unlimited revisions until you are completely satisfied with your SOP. Our goal is to ensure it perfectly represents your story." },
        { question = "Can you help with SOPs for multiple universities?"; answer = "Yes, we customise each SOP to the specific requirements and tone of each university you are applying to." },
      ];
      ctaText = "Make your application stand out. Let our experts craft your perfect SOP.";
      ctaButtonText = "Get SOP Assistance";
    };
    serviceDetails.add("sop-documentation", sopDetail);

    let predepartureDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "pre-departure-assistance";
      heroImage = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600";
      heroHeadline = "Pre-Departure Assistance";
      heroSubheadline = "Everything you need to know before you fly — accommodation, travel, banking, and settling in abroad";
      overview = "Leaving home for the first time can be overwhelming. Valmiki Group's pre-departure assistance programme ensures you are fully prepared for your new life abroad — from accommodation arrangements and forex to health insurance, travel tips, and what to expect in your first days.";
      whatIsIncluded = ["Pre-departure orientation sessions", "Accommodation search and booking guidance", "Forex and international banking setup", "Health insurance guidance (OSHC/GHIC)", "Travel and packing tips", "Airport pickup coordination (select destinations)"];
      processSteps = [
        { order = 1; title = "Pre-Departure Briefing"; description = "Comprehensive session covering life in your destination country, cultural tips, dos and don'ts, and practical advice."; icon = "Info" },
        { order = 2; title = "Accommodation Planning"; description = "Guidance on finding and securing on-campus or off-campus accommodation before you arrive."; icon = "Home" },
        { order = 3; title = "Financial Preparation"; description = "Setting up forex cards, international bank accounts, and understanding your financial responsibilities abroad."; icon = "CreditCard" },
        { order = 4; title = "Health & Insurance"; description = "Understanding mandatory health insurance requirements for students and arranging appropriate coverage."; icon = "Shield" },
      ];
      eligibilityCriteria = ["Confirmed student visa", "University acceptance confirmed", "Enrolled in Valmiki Group services"];
      whyChooseValmiki = ["Comprehensive, country-specific pre-departure briefings", "Alumni network in major study destinations", "Partnerships with accommodation providers", "Real student testimonials and tips from recent alumni", "24/7 support in first weeks abroad"];
      faqs = [
        { question = "When should I start pre-departure preparations?"; answer = "We recommend starting 4-6 weeks before your departure date to ensure accommodation, forex, insurance, and travel arrangements are all in order." },
        { question = "Do you help with accommodation abroad?"; answer = "Yes, we provide guidance on on-campus dormitories, private student halls, and shared accommodation options for all major cities." },
      ];
      ctaText = "Be fully prepared for your new life abroad. Attend our pre-departure session today.";
      ctaButtonText = "Register for Pre-Departure";
    };
    serviceDetails.add("pre-departure-assistance", predepartureDetail);

    let careerDetail : AdminTypes.ServiceDetailContent = {
      serviceId = "career-counseling";
      heroImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600";
      heroHeadline = "Career Counseling";
      heroSubheadline = "Strategic career planning to align your overseas education with long-term professional success";
      overview = "Choosing the right course and university is deeply connected to your career goals. Valmiki Group's career counseling service helps students map their academic choices to realistic career pathways, salary expectations, and employment prospects in their target country and industry.";
      whatIsIncluded = ["Career aptitude and interest assessment", "Industry and job market analysis by country", "Course-to-career pathway mapping", "Salary and employment prospect research", "Internship and placement guidance", "LinkedIn and professional profile setup"];
      processSteps = [
        { order = 1; title = "Career Assessment"; description = "Psychometric and aptitude testing to identify your strengths, interests, and suitable career pathways."; icon = "BarChart2" },
        { order = 2; title = "Market Research"; description = "Analysis of job market demand, salary ranges, and growth prospects for your chosen field in target countries."; icon = "Globe" },
        { order = 3; title = "Course Alignment"; description = "Mapping your career goals to specific courses, specialisations, and universities that maximise your employment prospects."; icon = "Target" },
        { order = 4; title = "Action Plan"; description = "Personalised career development action plan covering internships, certifications, and professional networking strategies."; icon = "Map" },
      ];
      eligibilityCriteria = ["Students in 11th/12th grade exploring study abroad", "Graduates considering postgraduate studies abroad", "Working professionals seeking career transition through overseas education"];
      whyChooseValmiki = ["Certified career counselors with international education expertise", "Data-driven insights on global job markets", "Alumni mentorship programme", "Industry connections across USA, Canada, UK, and Australia", "Long-term career support beyond graduation"];
      faqs = [
        { question = "Is career counseling only for students choosing their first degree?"; answer = "No, our career counseling is valuable for students at all stages — whether choosing an undergraduate programme, pivoting careers through a postgraduate degree, or planning a return to academics after work experience." },
        { question = "Which industries do you have the most expertise in?"; answer = "We have strong expertise in Engineering, IT, Business, Healthcare, Finance, Data Science, and Hospitality — the most popular fields for Indian students studying abroad." },
      ];
      ctaText = "Align your education investment with your career goals. Start your career counseling today.";
      ctaButtonText = "Start Career Counseling";
    };
    serviceDetails.add("career-counseling", careerDetail);
  };

  // Seed Be Our Partner Content
  if (beOurPartnerState.content == null) {
    beOurPartnerState.content := ?{
      heroImage = "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600";
      heroHeadline = "Be Our Partner";
      heroSubheadline = "Join the Valmiki Group network and grow together — we partner with universities, agencies, and corporates to create global opportunities for students";
      partnershipTypes = [
        {
          title = "University Partnership";
          description = "Collaborate with Valmiki Group to access a steady pipeline of quality Indian students for your undergraduate, postgraduate, and PhD programmes. We work with 350+ universities worldwide and are always looking to expand our network.";
          icon = "University";
          benefits = ["Direct student recruitment pipeline from India", "Dedicated Valmiki Group counselors promoting your programmes", "Campus visits and webinar collaborations", "Co-branded marketing materials", "Preferential scholarship slots for Valmiki students"];
        },
        {
          title = "Referral Partnership";
          description = "Are you an education consultant, coaching centre, or student community that refers students for overseas education? Partner with Valmiki Group for end-to-end support and attractive commission structures.";
          icon = "Users";
          benefits = ["Competitive referral commission structure", "Complete backend support for referred students", "Access to Valmiki Group's 350+ university network", "Co-marketing opportunities", "Training and certification for your counselors"];
        },
        {
          title = "Corporate Partnership";
          description = "Empower your employees with international education opportunities through Valmiki Group's corporate education programmes. We help companies offer overseas education benefits, global talent development, and international mobility support.";
          icon = "Briefcase";
          benefits = ["Customised overseas education programmes for employees", "Group counseling and visa assistance packages", "Corporate rates on test preparation courses", "Employee retention through education benefits", "Dedicated account manager"];
        },
      ];
      generalBenefits = ["Access to 24+ years of industry expertise", "Trusted brand recognised by students and universities globally", "Comprehensive backend support and operations", "Technology-enabled CRM and reporting", "Regular training, updates, and support", "Shared marketing and co-branding opportunities"];
      formDescription = "Fill in the form below and our partnerships team will reach out within 48 hours to discuss how we can build a mutually beneficial relationship.";
    };
  };

  include FormsMixin(
    counselingBookings,
    contactSubmissions,
    newsletterSubscriptions,
    demoClassBookings,
    immigrationConsultations,
    visaEligibilityResults,
    formState,
  );

  // Seed Page Heroes for all sub-pages
  if (pageHeroesState.heroes.size() == 0) {
    let heroData : [(Text, Text, Text, Text)] = [
      ("services",        "Our Expert Services",                             "End-to-end overseas education and immigration support tailored to your needs",        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600"),
      ("study-abroad",   "Your Gateway to Global Education",                 "Explore 350+ partner universities across 10+ countries with personalised guidance",  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600"),
      ("countries",      "Explore Study Destinations",                       "Compare countries, universities, costs, and visa pathways to find your perfect fit",  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600"),
      ("test-prep",      "Achieve Your Target Score",                        "Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT, and SAT with certified trainers",  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600"),
      ("immigration",    "Immigration Made Simple",                          "Navigate PR, work, and dependent visa pathways with expert guidance",               "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600"),
      ("success-stories","1 Lakh+ Dreams Achieved",                          "Real stories from real students who transformed their futures with Valmiki Group",   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600"),
      ("blog",           "Study Abroad Insights",                            "Expert guides, visa updates, scholarships, and student life tips",                   "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600"),
      ("careers",        "Join the Valmiki Family",                          "Build a meaningful career helping students achieve their international education dreams", "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600"),
      ("contact",        "Get in Touch",                                     "Our counselors are ready to answer your questions and guide your study abroad journey", "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600"),
    ];
    for ((pageId, headline, subheadline, imageUrl) in heroData.vals()) {
      pageHeroesState.heroes.add(pageId, { pageId; headline; subheadline; imageUrl });
    };
  };

  include AdminMixin(
    adminSessions,
    adminState,
    adminServices,
    adminCountries,
    adminTestimonials,
    adminEvents,
    adminTeam,
    pageHeroesState,
    lifeAtValmikiState,
    freeCounselingState,
    homeSectionsState,
    websiteThemeState,
    footerContentState,
  );

  include ContentMixin(
    adminSessions,
    blogPosts,
    testPrepExams,
    immigrationVisas,
    partnerUniversities,
    countryDetails,
    galleryEntries,
    jobOpenings,
    jobApplications,
    leadershipState,
    contentState,
    serviceDetails,
    beOurPartnerState,
    partnerInquiries,
    pageContents,
  );
};

