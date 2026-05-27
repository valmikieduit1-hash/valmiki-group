import type { Country } from "@/types";

export const countries: Country[] = [
  {
    name: "USA",
    slug: "usa",
    flagEmoji: "🇺🇸",
    flagCdnCode: "us",
    heroHeadline: "Study in the USA — World-Class Education Awaits",
    heroSubheadline:
      "Home to 8 of the world's top 10 universities. Launch your global career with a US degree.",
    whyStudy: [
      "World-renowned universities with cutting-edge research facilities",
      "Optional Practical Training (OPT) up to 3 years for STEM students",
      "Diverse campus culture with students from 200+ countries",
      "Strong industry connections and internship opportunities",
      "Flexible curriculum allowing exploration across disciplines",
    ],
    topUniversities: [
      "Harvard University",
      "MIT",
      "Stanford University",
      "Yale University",
      "Columbia University",
      "University of Pennsylvania",
      "Johns Hopkins University",
      "University of California, Berkeley",
    ],
    avgTuition: "$25,000 – $55,000 per year",
    costOfLiving: "$12,000 – $18,000 per year",
    visaProcessingTime: "3–8 weeks (F-1 Visa)",
    workRights:
      "On-campus work 20 hrs/week; OPT up to 12 months (36 months STEM)",
    prPathway:
      "H-1B work visa → Employer-sponsored Green Card (EB-2/EB-3 categories)",
    popularCourses: [
      "Computer Science & Data Analytics",
      "Business Administration (MBA)",
      "Engineering & Robotics",
      "Biotechnology & Healthcare",
      "Finance & Economics",
      "Media & Communications",
    ],
    intakeMonths: [
      "Fall (August/September)",
      "Spring (January)",
      "Summer (May)",
    ],
    scholarshipOpportunities: [
      "Fulbright Foreign Student Program",
      "Hubert Humphrey Fellowship",
      "University-specific merit scholarships",
      "Tata Cornell Scholarship",
      "Inlaks Shivdasani Foundation Scholarship",
    ],
    visaSuccessRate: "93%",
    costOfLivingBreakdown: {
      rent: "$800 – $1,500",
      food: "$300 – $500",
      transport: "$100 – $200",
      utilities: "$150 – $250",
      total: "$1,350 – $2,450",
    },
    visaProcessSteps: [
      "Receive I-20 from university",
      "Pay SEVIS fee & complete DS-160",
      "Schedule visa interview at US Embassy",
      "Attend interview with documents",
      "Receive F-1 visa decision",
    ],
    scholarships: [
      {
        name: "Fulbright Scholarship",
        amount: "Full tuition + stipend",
        description: "For graduate students and young professionals",
      },
      {
        name: "Tata Cornell Scholarship",
        amount: "Full tuition",
        description: "For Indian students at Cornell University",
      },
      {
        name: "University Merit Scholarships",
        amount: "$5,000 – $30,000",
        description: "Merit-based aid from individual universities",
      },
    ],
    courseSalaries: [
      { course: "Computer Science", avgSalary: "$95,000 – $140,000" },
      { course: "MBA", avgSalary: "$90,000 – $150,000" },
      { course: "Engineering", avgSalary: "$80,000 – $120,000" },
      { course: "Data Science", avgSalary: "$100,000 – $145,000" },
      { course: "Medicine", avgSalary: "$200,000 – $300,000" },
      { course: "Finance", avgSalary: "$85,000 – $130,000" },
    ],
    faqs: [
      {
        question: "What is the cost of studying in the USA?",
        answer:
          "Tuition ranges from $25,000 to $55,000 per year depending on the university and program. Living costs are approximately $12,000–$18,000 annually.",
      },
      {
        question: "Can I work while studying in the USA?",
        answer:
          "Yes, F-1 students can work on-campus up to 20 hours per week during term and full-time during breaks. OPT allows up to 12 months of post-study work (36 months for STEM).",
      },
      {
        question: "What is the F-1 visa process?",
        answer:
          "After receiving your I-20, pay the SEVIS fee, complete DS-160, schedule an embassy interview, and attend with required documents. Processing takes 3–8 weeks.",
      },
      {
        question: "Are scholarships available for Indian students?",
        answer:
          "Yes, many universities offer merit scholarships. External options include Fulbright, Tata Cornell, and Inlaks Shivdasani scholarships.",
      },
      {
        question: "What are the popular intakes?",
        answer:
          "Fall (August/September) is the main intake. Spring (January) and Summer (May) are secondary options with fewer programs.",
      },
      {
        question: "How long does it take to get a US student visa?",
        answer:
          "Typically 3–8 weeks from the interview date, though it varies by embassy and season.",
      },
      {
        question: "What is OPT and how does it work?",
        answer:
          "Optional Practical Training lets you work in your field for up to 12 months post-graduation. STEM graduates get a 24-month extension.",
      },
      {
        question: "Is health insurance mandatory?",
        answer:
          "Yes, most US universities require international students to have health insurance, either through the university or a private provider.",
      },
    ],
  },
  {
    name: "Canada",
    slug: "canada",
    flagEmoji: "🇨🇦",
    flagCdnCode: "ca",
    heroHeadline: "Study in Canada — Quality Education, Bright Future",
    heroSubheadline:
      "Affordable tuition, post-study work permits, and a clear pathway to permanent residency.",
    whyStudy: [
      "High-quality education at affordable tuition fees",
      "Post-Graduation Work Permit (PGWP) up to 3 years",
      "Clear pathway to Canadian permanent residency",
      "Safe, multicultural, and welcoming environment",
      "Strong job market with high graduate employment rates",
    ],
    topUniversities: [
      "University of Toronto",
      "McGill University",
      "University of British Columbia",
      "University of Waterloo",
      "McMaster University",
      "University of Alberta",
      "Western University",
      "Queen's University",
    ],
    avgTuition: "CAD 15,000 – CAD 35,000 per year",
    costOfLiving: "CAD 10,000 – CAD 15,000 per year",
    visaProcessingTime: "4–12 weeks (Study Permit + SDS)",
    workRights:
      "On/off-campus 20 hrs/week; full-time during breaks; PGWP 1–3 years",
    prPathway:
      "Canadian Experience Class (CEC) via Express Entry after 1 year skilled work",
    popularCourses: [
      "Computer Science & AI",
      "Business Management",
      "Engineering & Technology",
      "Healthcare & Nursing",
      "Hospitality & Tourism",
      "Environmental Sciences",
    ],
    intakeMonths: ["Fall (September)", "Winter (January)", "Summer (May)"],
    scholarshipOpportunities: [
      "Vanier Canada Graduate Scholarships",
      "Ontario Graduate Scholarship",
      "Trudeau Foundation Scholarship",
      "University of Toronto International Scholarship",
      "Lester B. Pearson International Scholarship",
    ],
    visaSuccessRate: "96%",
    costOfLivingBreakdown: {
      rent: "CAD 600 – CAD 1,200",
      food: "CAD 300 – CAD 500",
      transport: "CAD 100 – CAD 150",
      utilities: "CAD 100 – CAD 200",
      total: "CAD 1,100 – CAD 2,050",
    },
    visaProcessSteps: [
      "Receive Letter of Acceptance",
      "Apply for Study Permit + SDS (if eligible)",
      "Submit biometrics and medical exam",
      "Wait for visa decision",
      "Receive passport with visa stamp",
    ],
    scholarships: [
      {
        name: "Vanier Canada Graduate Scholarship",
        amount: "CAD 50,000/year",
        description:
          "For doctoral students demonstrating leadership and research excellence",
      },
      {
        name: "Lester B. Pearson Scholarship",
        amount: "Full tuition + living",
        description:
          "For exceptional international students at University of Toronto",
      },
      {
        name: "Ontario Graduate Scholarship",
        amount: "CAD 15,000",
        description: "Merit-based scholarship for graduate students in Ontario",
      },
    ],
    courseSalaries: [
      { course: "Computer Science", avgSalary: "CAD 75,000 – CAD 120,000" },
      { course: "Business Management", avgSalary: "CAD 65,000 – CAD 110,000" },
      { course: "Engineering", avgSalary: "CAD 70,000 – CAD 115,000" },
      { course: "Healthcare", avgSalary: "CAD 80,000 – CAD 130,000" },
      { course: "Data Analytics", avgSalary: "CAD 72,000 – CAD 110,000" },
      { course: "Hospitality", avgSalary: "CAD 50,000 – CAD 80,000" },
    ],
    faqs: [
      {
        question: "What is the SDS stream for Canada?",
        answer:
          "The Student Direct Stream is a faster visa processing route for residents of India, China, Philippines, Vietnam, Morocco, Pakistan, and Senegal with higher language scores and GIC proof.",
      },
      {
        question: "Can I bring my spouse to Canada?",
        answer:
          "Yes, your spouse can apply for an open work permit if you are enrolled in a master's or doctoral program, or certain professional degree programs.",
      },
      {
        question: "What is the PGWP?",
        answer:
          "The Post-Graduation Work Permit allows you to work in Canada for 1–3 years after graduation, depending on your program length.",
      },
      {
        question: "How do I apply for PR after studying?",
        answer:
          "After 1 year of skilled work on PGWP, you can apply for PR through the Canadian Experience Class under Express Entry.",
      },
      {
        question: "What are the language requirements?",
        answer:
          "Most universities require IELTS 6.5+ or TOEFL 80+. SDS applicants need IELTS 6.0+ in each band.",
      },
      {
        question: "Is a GIC mandatory?",
        answer:
          "A GIC of CAD 10,000 is required for SDS applicants as proof of funds. Regular stream applicants can show other financial documents.",
      },
      {
        question: "Can I work off-campus?",
        answer:
          "Yes, full-time students can work up to 20 hours/week off-campus during term and full-time during scheduled breaks.",
      },
      {
        question: "What is the cost of living in Canada?",
        answer:
          "Living costs range from CAD 10,000–15,000 per year depending on the city. Toronto and Vancouver are more expensive.",
      },
    ],
  },
  {
    name: "United Kingdom",
    slug: "uk",
    flagEmoji: "🇬🇧",
    flagCdnCode: "gb",
    heroHeadline: "Study in the UK — Tradition Meets Innovation",
    heroSubheadline:
      "Degrees recognized worldwide. Shorter courses, lower overall cost, and the Graduate Visa route.",
    whyStudy: [
      "Degrees recognized and respected globally",
      "Shorter course durations (3-year bachelor's, 1-year master's)",
      "Graduate Visa allowing 2 years work post-study",
      "Rich academic heritage with modern research facilities",
      "Access to European job markets and networks",
    ],
    topUniversities: [
      "University of Oxford",
      "University of Cambridge",
      "Imperial College London",
      "University College London",
      "London School of Economics",
      "University of Edinburgh",
      "King's College London",
      "University of Manchester",
    ],
    avgTuition: "£12,000 – £35,000 per year",
    costOfLiving: "£9,000 – £12,000 per year (London: £12,000–£15,000)",
    visaProcessingTime: "3–6 weeks (Student Route Visa)",
    workRights:
      "20 hrs/week during term; full-time during holidays; Graduate Visa 2 years (3 years PhD)",
    prPathway: "Skilled Worker Visa after Graduate Visa → ILR after 5 years",
    popularCourses: [
      "Business & Management",
      "Law & International Relations",
      "Engineering",
      "Computer Science",
      "Medicine & Healthcare",
      "Arts & Design",
    ],
    intakeMonths: ["September/October", "January/February", "April/May"],
    scholarshipOpportunities: [
      "Chevening Scholarships",
      "Commonwealth Scholarships",
      "Gates Cambridge Scholarship",
      "Rhodes Scholarship",
      "British Council GREAT Scholarships",
    ],
    visaSuccessRate: "94%",
    costOfLivingBreakdown: {
      rent: "£500 – £1,200",
      food: "£200 – £350",
      transport: "£50 – £100",
      utilities: "£100 – £150",
      total: "£850 – £1,800",
    },
    visaProcessSteps: [
      "Receive CAS from university",
      "Complete online visa application",
      "Pay IHS surcharge and visa fee",
      "Submit biometrics at VFS",
      "Receive Student Route visa decision",
    ],
    scholarships: [
      {
        name: "Chevening Scholarship",
        amount: "Full tuition + living",
        description:
          "One-year master's for future leaders funded by UK government",
      },
      {
        name: "Commonwealth Scholarship",
        amount: "Full funding",
        description:
          "For students from Commonwealth countries pursuing master's or PhD",
      },
      {
        name: "GREAT Scholarships",
        amount: "£10,000",
        description: "For students from selected countries including India",
      },
    ],
    courseSalaries: [
      { course: "Business & Management", avgSalary: "£35,000 – £60,000" },
      { course: "Computer Science", avgSalary: "£40,000 – £70,000" },
      { course: "Engineering", avgSalary: "£32,000 – £55,000" },
      { course: "Medicine", avgSalary: "£55,000 – £85,000" },
      { course: "Law", avgSalary: "£40,000 – £75,000" },
      { course: "Finance", avgSalary: "£45,000 – £80,000" },
    ],
    faqs: [
      {
        question: "What is the Graduate Visa?",
        answer:
          "The Graduate Visa allows you to stay and work in the UK for 2 years after completing your degree (3 years for PhD). No sponsorship required.",
      },
      {
        question: "How long are UK degrees?",
        answer:
          "Bachelor's degrees are typically 3 years. Master's degrees are 1 year. This saves time and money compared to other countries.",
      },
      {
        question: "What is a CAS?",
        answer:
          "Confirmation of Acceptance for Studies is a reference number issued by your university that you need for your visa application.",
      },
      {
        question: "Can I work in the UK as a student?",
        answer:
          "Yes, up to 20 hours per week during term time and full-time during holidays on a Student Route visa.",
      },
      {
        question: "What is the IHS?",
        answer:
          "The Immigration Health Surcharge gives you access to the UK's National Health Service. It costs £470 per year for students.",
      },
      {
        question: "Are there scholarships for Indian students?",
        answer:
          "Yes, Chevening, Commonwealth, GREAT, and many university-specific scholarships are available.",
      },
      {
        question: "What is the PSW route to PR?",
        answer:
          "After Graduate Visa, switch to Skilled Worker Visa. After 5 years on Skilled Worker Visa, apply for Indefinite Leave to Remain.",
      },
      {
        question: "Do I need to show proof of funds?",
        answer:
          "Yes, you need to show funds for tuition plus £9,207 (London: £12,006) for living costs for 9 months.",
      },
    ],
  },
  {
    name: "Australia",
    slug: "australia",
    flagEmoji: "🇦🇺",
    flagCdnCode: "au",
    heroHeadline: "Study in Australia — Excellence in Education & Lifestyle",
    heroSubheadline:
      "Top-ranked universities, stunning campuses, and excellent post-study work opportunities.",
    whyStudy: [
      "7 universities in the global top 100",
      "Post-Study Work Visa up to 4–6 years",
      "High standard of living with beautiful natural environment",
      "Strong research output and industry collaboration",
      "Multicultural society with vibrant student life",
    ],
    topUniversities: [
      "University of Melbourne",
      "Australian National University",
      "University of Sydney",
      "University of Queensland",
      "Monash University",
      "University of New South Wales",
      "University of Western Australia",
      "University of Adelaide",
    ],
    avgTuition: "AUD 20,000 – AUD 45,000 per year",
    costOfLiving: "AUD 21,000 – AUD 25,000 per year",
    visaProcessingTime: "4–12 weeks (Subclass 500)",
    workRights:
      "48 hrs/fortnight during term; full-time during breaks; PSW 2–4 years",
    prPathway:
      "Temporary Graduate Visa → Skilled Independent Visa (189) or Employer Nomination (186)",
    popularCourses: [
      "Engineering & Technology",
      "Business & Accounting",
      "Medicine & Health Sciences",
      "Environmental Science",
      "Hospitality Management",
      "Information Technology",
    ],
    intakeMonths: ["February", "July", "November"],
    scholarshipOpportunities: [
      "Australia Awards Scholarships",
      "Destination Australia Program",
      "Research Training Program (RTP)",
      "University of Melbourne International Scholarship",
      "Monash International Leadership Scholarship",
    ],
    visaSuccessRate: "91%",
    costOfLivingBreakdown: {
      rent: "AUD 800 – AUD 1,500",
      food: "AUD 300 – AUD 500",
      transport: "AUD 100 – AUD 200",
      utilities: "AUD 150 – AUD 250",
      total: "AUD 1,350 – AUD 2,450",
    },
    visaProcessSteps: [
      "Receive CoE from university",
      "Create ImmiAccount and apply online",
      "Submit documents and biometrics",
      "Undergo health examination",
      "Receive Subclass 500 visa",
    ],
    scholarships: [
      {
        name: "Australia Awards",
        amount: "Full tuition + living + travel",
        description:
          "Prestigious government-funded scholarships for developing countries",
      },
      {
        name: "Destination Australia",
        amount: "AUD 15,000/year",
        description: "For students studying in regional Australia",
      },
      {
        name: "RTP Scholarship",
        amount: "Full tuition + stipend",
        description: "For research-based postgraduate degrees",
      },
    ],
    courseSalaries: [
      { course: "Engineering", avgSalary: "AUD 70,000 – AUD 110,000" },
      { course: "Business & Accounting", avgSalary: "AUD 60,000 – AUD 95,000" },
      { course: "Medicine", avgSalary: "AUD 80,000 – AUD 150,000" },
      {
        course: "IT & Computer Science",
        avgSalary: "AUD 75,000 – AUD 120,000",
      },
      {
        course: "Environmental Science",
        avgSalary: "AUD 65,000 – AUD 100,000",
      },
      { course: "Hospitality", avgSalary: "AUD 55,000 – AUD 85,000" },
    ],
    faqs: [
      {
        question: "What is the PSW visa duration?",
        answer:
          "Bachelor's graduates get 2 years, Master's get 3 years, and PhD graduates get 4–6 years of post-study work rights.",
      },
      {
        question: "What is a CoE?",
        answer:
          "Confirmation of Enrolment is an official document from your Australian university required for your student visa application.",
      },
      {
        question: "Can I work unlimited hours?",
        answer:
          "During term, you can work 48 hours per fortnight. During breaks, there is no limit on work hours.",
      },
      {
        question: "What is regional Australia?",
        answer:
          "Regional areas are outside major cities like Sydney and Melbourne. Studying there gives extra PSW time and scholarship opportunities.",
      },
      {
        question: "Is health insurance mandatory?",
        answer:
          "Yes, all international students must have Overseas Student Health Cover (OSHC) for the entire visa duration.",
      },
      {
        question: "What is the Genuine Temporary Entrant requirement?",
        answer:
          "You must demonstrate that you genuinely intend to stay in Australia temporarily for study purposes.",
      },
      {
        question: "Can I bring family?",
        answer:
          "Yes, you can include family members in your visa application. They can work limited hours depending on your course level.",
      },
      {
        question: "What is the cost of studying in Australia?",
        answer:
          "Tuition ranges from AUD 20,000–45,000 per year. Living costs are approximately AUD 21,000–25,000 annually.",
      },
    ],
  },
  {
    name: "Germany",
    slug: "germany",
    flagEmoji: "🇩🇪",
    flagCdnCode: "de",
    heroHeadline: "Study in Germany — Tuition-Free World-Class Education",
    heroSubheadline:
      "Experience excellence in engineering and research with minimal or no tuition fees at public universities.",
    whyStudy: [
      "No tuition fees at most public universities",
      "World leader in engineering, technology & research",
      "18-month job seeker visa after graduation",
      "Strong economy with high demand for skilled graduates",
      "Rich cultural heritage and central European location",
    ],
    topUniversities: [
      "Technical University of Munich",
      "Ludwig Maximilian University",
      "Heidelberg University",
      "Humboldt University of Berlin",
      "RWTH Aachen University",
      "Free University of Berlin",
      "Karlsruhe Institute of Technology",
      "University of Freiburg",
    ],
    avgTuition: "€0 – €3,000 per year (public); €10,000–€30,000 (private)",
    costOfLiving: "€10,000 – €12,000 per year",
    visaProcessingTime: "6–12 weeks (Student Visa / Aufenthaltserlaubnis)",
    workRights:
      "120 full days or 240 half days per year; 18-month job seeker visa post-study",
    prPathway:
      "EU Blue Card after skilled employment → Permanent Residence after 21–33 months",
    popularCourses: [
      "Mechanical & Automotive Engineering",
      "Computer Science & AI",
      "Business Administration",
      "Medicine & Life Sciences",
      "Physics & Chemistry",
      "Architecture & Design",
    ],
    intakeMonths: ["Winter (October)", "Summer (April)"],
    scholarshipOpportunities: [
      "DAAD Scholarships",
      "Heinrich Böll Foundation Scholarship",
      "Konrad-Adenauer-Stiftung Scholarship",
      "Deutschlandstipendium",
      "Erasmus+ Program",
    ],
    visaSuccessRate: "92%",
    costOfLivingBreakdown: {
      rent: "€300 – €600",
      food: "€200 – €300",
      transport: "€50 – €100",
      utilities: "€100 – €150",
      total: "€650 – €1,150",
    },
    visaProcessSteps: [
      "Receive admission letter from university",
      "Open blocked account (€11,208/year)",
      "Apply for student visa at German embassy",
      "Submit documents and attend interview",
      "Receive national visa and travel to Germany",
    ],
    scholarships: [
      {
        name: "DAAD Scholarship",
        amount: "Full funding",
        description:
          "Germany's largest scholarship program for international students",
      },
      {
        name: "Deutschlandstipendium",
        amount: "€300/month",
        description: "Merit-based scholarship for talented students",
      },
      {
        name: "Heinrich Böll Scholarship",
        amount: "Full funding",
        description: "For students committed to green and social causes",
      },
    ],
    courseSalaries: [
      { course: "Engineering", avgSalary: "€50,000 – €75,000" },
      { course: "Computer Science", avgSalary: "€48,000 – €72,000" },
      { course: "Business", avgSalary: "€45,000 – €68,000" },
      { course: "Medicine", avgSalary: "€60,000 – €90,000" },
      { course: "Architecture", avgSalary: "€42,000 – €60,000" },
      { course: "Physics", avgSalary: "€45,000 – €65,000" },
    ],
    faqs: [
      {
        question: "Is education really free in Germany?",
        answer:
          "Most public universities charge no tuition fees for bachelor's and master's programs. You only pay a semester contribution of €150–€350.",
      },
      {
        question: "What is a blocked account?",
        answer:
          "A blocked account (Sperrkonto) with €11,208 is required to prove you can support yourself. You can withdraw €934 per month.",
      },
      {
        question: "Do I need to know German?",
        answer:
          "Many master's programs are in English. However, learning German helps with daily life and expands job opportunities.",
      },
      {
        question: "What is the 18-month job seeker visa?",
        answer:
          "After graduation, you get 18 months to find a job related to your degree. During this time, you can work any job.",
      },
      {
        question: "How do I get permanent residence?",
        answer:
          "After skilled employment, apply for EU Blue Card. Permanent residence is possible after 21–33 months with B1 German.",
      },
      {
        question: "What is the semester contribution?",
        answer:
          "It covers administrative costs and public transport ticket. It ranges from €150–€350 per semester.",
      },
      {
        question: "Can I work while studying?",
        answer:
          "Yes, 120 full days or 240 half days per year. Student jobs within the university have no restrictions.",
      },
      {
        question: "What are the best cities for students?",
        answer:
          "Munich, Berlin, Heidelberg, Aachen, and Freiburg are popular. Each offers a unique student experience.",
      },
    ],
  },
  {
    name: "Ireland",
    slug: "ireland",
    flagEmoji: "🇮🇪",
    flagCdnCode: "ie",
    heroHeadline: "Study in Ireland — Europe's Tech & Pharma Hub",
    heroSubheadline:
      "Home to European HQs of Google, Apple, Meta & Pfizer. Excellent education with a 2-year stay-back option.",
    whyStudy: [
      "2-year stay-back visa for master's graduates",
      "European HQ of top tech and pharma companies",
      "English-speaking country in the European Union",
      "Safe, friendly, and culturally rich environment",
      "Strong focus on research and innovation",
    ],
    topUniversities: [
      "Trinity College Dublin",
      "University College Dublin",
      "University of Galway",
      "University College Cork",
      "Dublin City University",
      "University of Limerick",
      "Maynooth University",
      "Technological University Dublin",
    ],
    avgTuition: "€10,000 – €25,000 per year",
    costOfLiving: "€10,000 – €14,000 per year",
    visaProcessingTime: "4–8 weeks (Study Visa)",
    workRights:
      "20 hrs/week during term; full-time during holidays; 2-year stay-back (master's)",
    prPathway:
      "Critical Skills Employment Permit → Stamp 4 (Residence) after 2 years",
    popularCourses: [
      "Computer Science & Data Science",
      "Pharmaceutical Sciences",
      "Business & Finance",
      "Biotechnology",
      "Digital Marketing",
      "Cybersecurity",
    ],
    intakeMonths: ["September", "January"],
    scholarshipOpportunities: [
      "Government of Ireland International Education Scholarship",
      "Trinity College Dublin Global Excellence Scholarship",
      "UCD Global Excellence Scholarship",
      "NUI Galway International Student Scholarship",
      "Irish Research Council Scholarship",
    ],
    visaSuccessRate: "95%",
    costOfLivingBreakdown: {
      rent: "€600 – €1,000",
      food: "€250 – €400",
      transport: "€50 – €100",
      utilities: "€100 – €150",
      total: "€1,000 – €1,650",
    },
    visaProcessSteps: [
      "Receive offer letter from Irish university",
      "Pay tuition deposit",
      "Apply for study visa online",
      "Submit biometrics and documents",
      "Receive visa decision",
    ],
    scholarships: [
      {
        name: "Government of Ireland Scholarship",
        amount: "€10,000 + fee waiver",
        description:
          "Prestigious scholarship for high-achieving international students",
      },
      {
        name: "Trinity Global Excellence",
        amount: "€5,000 – €10,000",
        description:
          "Merit-based scholarship for undergraduate and postgraduate students",
      },
      {
        name: "UCD Global Excellence",
        amount: "Up to 50% tuition",
        description: "For academically outstanding international applicants",
      },
    ],
    courseSalaries: [
      { course: "Computer Science", avgSalary: "€45,000 – €70,000" },
      { course: "Pharmaceutical Sciences", avgSalary: "€50,000 – €75,000" },
      { course: "Business & Finance", avgSalary: "€40,000 – €65,000" },
      { course: "Biotechnology", avgSalary: "€42,000 – €62,000" },
      { course: "Digital Marketing", avgSalary: "€35,000 – €55,000" },
      { course: "Cybersecurity", avgSalary: "€48,000 – €72,000" },
    ],
    faqs: [
      {
        question: "What is the stay-back visa?",
        answer:
          "Master's graduates get a 2-year stay-back visa. Bachelor's graduates get 1 year. This lets you work full-time in Ireland.",
      },
      {
        question: "Why is Ireland good for tech jobs?",
        answer:
          "Ireland hosts European HQs of Google, Apple, Meta, Microsoft, and Pfizer. There is high demand for tech and pharma graduates.",
      },
      {
        question: "What is the Critical Skills Employment Permit?",
        answer:
          "It's a fast-track work permit for jobs on Ireland's critical skills list. It leads to Stamp 4 residence after 2 years.",
      },
      {
        question: "Is Ireland part of the EU?",
        answer:
          "Yes, Ireland is an EU member. An Irish degree is recognized across Europe, and you can travel freely within the EU.",
      },
      {
        question: "What is the cost of living in Dublin?",
        answer:
          "Dublin is the most expensive city. Budget €1,200–€1,800 per month. Other cities like Galway and Cork are more affordable.",
      },
      {
        question: "Can I work part-time?",
        answer:
          "Yes, up to 20 hours per week during term and full-time during holidays. Minimum wage is €11.30 per hour.",
      },
      {
        question: "What is the visa processing time?",
        answer:
          "Typically 4–8 weeks. Apply at least 3 months before your course start date.",
      },
      {
        question: "Are there English language requirements?",
        answer:
          "Most universities require IELTS 6.5 overall with no band less than 6.0. Some accept PTE or TOEFL equivalents.",
      },
    ],
  },
  {
    name: "New Zealand",
    slug: "new-zealand",
    flagEmoji: "🇳🇿",
    flagCdnCode: "nz",
    heroHeadline: "Study in New Zealand — Adventure Meets Academics",
    heroSubheadline:
      "World-class education in a breathtaking setting. Strong PR pathway and excellent work-life balance.",
    whyStudy: [
      "8 universities all ranked in QS World Rankings",
      "Post-study work visa up to 3 years",
      "Straightforward pathway to permanent residency",
      "Stunning natural landscapes and outdoor lifestyle",
      "Safe, inclusive, and welcoming society",
    ],
    topUniversities: [
      "University of Auckland",
      "University of Otago",
      "Victoria University of Wellington",
      "University of Canterbury",
      "Massey University",
      "University of Waikato",
      "Auckland University of Technology",
      "Lincoln University",
    ],
    avgTuition: "NZD 22,000 – NZD 35,000 per year",
    costOfLiving: "NZD 15,000 – NZD 20,000 per year",
    visaProcessingTime: "4–8 weeks (Student Visa)",
    workRights:
      "20 hrs/week during term; full-time during breaks; PSW 1–3 years",
    prPathway:
      "Skilled Migrant Category after skilled work experience on PSW visa",
    popularCourses: [
      "Agriculture & Horticulture",
      "Tourism & Hospitality",
      "Engineering",
      "Business Management",
      "Environmental Science",
      "Information Technology",
    ],
    intakeMonths: ["February", "July", "October"],
    scholarshipOpportunities: [
      "New Zealand International Doctoral Research Scholarship",
      "University of Auckland International Student Excellence Scholarship",
      "Otago International Excellence Scholarship",
      "Victoria Master's Scholarship",
      "Education New Zealand Scholarships",
    ],
    visaSuccessRate: "90%",
    costOfLivingBreakdown: {
      rent: "NZD 600 – NZD 1,000",
      food: "NZD 300 – NZD 450",
      transport: "NZD 100 – NZD 150",
      utilities: "NZD 100 – NZD 200",
      total: "NZD 1,100 – NZD 1,800",
    },
    visaProcessSteps: [
      "Receive offer of place from NZ university",
      "Pay tuition fees or deposit",
      "Apply for student visa online",
      "Submit medical and police certificates",
      "Receive visa and travel to New Zealand",
    ],
    scholarships: [
      {
        name: "NZ International Doctoral Scholarship",
        amount: "Full funding",
        description: "For PhD students with exceptional research potential",
      },
      {
        name: "UoA Excellence Scholarship",
        amount: "Up to NZD 10,000",
        description: "Merit-based for high-achieving international students",
      },
      {
        name: "Education NZ Scholarships",
        amount: "Varies",
        description: "Government-funded scholarships for selected countries",
      },
    ],
    courseSalaries: [
      { course: "Agriculture", avgSalary: "NZD 55,000 – NZD 80,000" },
      { course: "Tourism & Hospitality", avgSalary: "NZD 50,000 – NZD 75,000" },
      { course: "Engineering", avgSalary: "NZD 65,000 – NZD 95,000" },
      { course: "Business Management", avgSalary: "NZD 60,000 – NZD 90,000" },
      { course: "Environmental Science", avgSalary: "NZD 58,000 – NZD 85,000" },
      { course: "IT", avgSalary: "NZD 65,000 – NZD 100,000" },
    ],
    faqs: [
      {
        question: "What is the post-study work visa?",
        answer:
          "You can get a post-study work visa for 1–3 years depending on your qualification level and where you studied.",
      },
      {
        question: "How do I apply for PR in New Zealand?",
        answer:
          "After skilled work experience on a post-study work visa, you can apply under the Skilled Migrant Category.",
      },
      {
        question: "What is the cost of living?",
        answer:
          "Living costs range from NZD 15,000–20,000 per year. Auckland is the most expensive city.",
      },
      {
        question: "Can I work while studying?",
        answer:
          "Yes, up to 20 hours per week during term and full-time during scheduled breaks.",
      },
      {
        question: "What are the English requirements?",
        answer:
          "Most programs require IELTS 6.0–6.5. Some pathways accept lower scores with English preparation.",
      },
      {
        question: "Is health insurance required?",
        answer:
          "Yes, international students must have appropriate medical and travel insurance for the duration of their stay.",
      },
      {
        question: "Can I bring my family?",
        answer:
          "Yes, your partner can apply for a work visa and your children can attend school as domestic students.",
      },
      {
        question: "What makes New Zealand unique for students?",
        answer:
          "Stunning landscapes, safe environment, world-class education, and a strong focus on sustainability and innovation.",
      },
    ],
  },
  {
    name: "Dubai",
    slug: "dubai",
    flagEmoji: "🇦🇪",
    flagCdnCode: "ae",
    heroHeadline: "Study in Dubai — Global Hub of Innovation & Business",
    heroSubheadline:
      "International branch campuses, tax-free earnings, and a gateway to Middle Eastern and global markets.",
    whyStudy: [
      "Branch campuses of top UK, US & Australian universities",
      "Tax-free income and strong job market post-graduation",
      "Strategic location connecting East and West",
      "Modern infrastructure and cosmopolitan lifestyle",
      "Growing sectors in finance, tech, tourism & logistics",
    ],
    topUniversities: [
      "University of Birmingham Dubai",
      "Heriot-Watt University Dubai",
      "Middlesex University Dubai",
      "American University in Dubai",
      "University of Wollongong Dubai",
      "British University in Dubai",
      "Manipal Academy Dubai",
      "Murdoch University Dubai",
    ],
    avgTuition: "AED 40,000 – AED 90,000 per year",
    costOfLiving: "AED 30,000 – AED 50,000 per year",
    visaProcessingTime: "2–4 weeks (Student Residence Visa)",
    workRights:
      "Part-time work permitted with university approval; full-time internship options",
    prPathway:
      "Employment visa after graduation → Long-term residence via Golden Visa for exceptional talent",
    popularCourses: [
      "Business Administration & MBA",
      "Engineering & Construction",
      "Hospitality & Tourism",
      "Aviation Management",
      "Finance & Banking",
      "Media & Design",
    ],
    intakeMonths: ["September", "January", "May"],
    scholarshipOpportunities: [
      "Dubai International Academic City Scholarships",
      "University-specific merit scholarships",
      "KHDA Scholarship Program",
      "Corporate-sponsored scholarships",
      "Early-bird tuition discounts",
    ],
    visaSuccessRate: "97%",
    costOfLivingBreakdown: {
      rent: "AED 2,500 – AED 4,500",
      food: "AED 800 – AED 1,200",
      transport: "AED 300 – AED 500",
      utilities: "AED 400 – AED 600",
      total: "AED 4,000 – AED 6,800",
    },
    visaProcessSteps: [
      "Receive admission from Dubai university",
      "Apply for student residence visa through university",
      "Submit passport, photos, and medical report",
      "Undergo medical fitness test in UAE",
      "Receive student residence visa",
    ],
    scholarships: [
      {
        name: "DIAC Merit Scholarship",
        amount: "Up to 50% tuition",
        description: "For students with outstanding academic records",
      },
      {
        name: "Early Bird Discount",
        amount: "10–20% off",
        description: "For students who pay tuition before the early deadline",
      },
      {
        name: "Corporate Scholarship",
        amount: "Varies",
        description: "Sponsored by partner companies for specific programs",
      },
    ],
    courseSalaries: [
      { course: "Business & MBA", avgSalary: "AED 120,000 – AED 250,000" },
      { course: "Engineering", avgSalary: "AED 100,000 – AED 180,000" },
      { course: "Hospitality", avgSalary: "AED 80,000 – AED 150,000" },
      { course: "Aviation", avgSalary: "AED 90,000 – AED 160,000" },
      { course: "Finance", avgSalary: "AED 110,000 – AED 200,000" },
      { course: "Media & Design", avgSalary: "AED 85,000 – AED 140,000" },
    ],
    faqs: [
      {
        question: "Are Dubai degrees recognized globally?",
        answer:
          "Yes, branch campuses award the same degrees as their parent universities in the UK, US, and Australia.",
      },
      {
        question: "Can I work in Dubai after graduation?",
        answer:
          "Yes, you can convert your student visa to an employment visa. Dubai has a thriving job market.",
      },
      {
        question: "What is the Golden Visa?",
        answer:
          "Exceptional graduates can qualify for a 10-year Golden Visa, offering long-term residency without a sponsor.",
      },
      {
        question: "Is Dubai safe for students?",
        answer:
          "Dubai is one of the safest cities globally with very low crime rates and a cosmopolitan environment.",
      },
      {
        question: "What is the cost of living?",
        answer:
          "Living costs range from AED 30,000–50,000 per year. Sharing accommodation can reduce expenses significantly.",
      },
      {
        question: "Can I work part-time?",
        answer:
          "Part-time work is permitted with university approval. Internships are widely available.",
      },
      {
        question: "What is the visa processing time?",
        answer:
          "Student residence visas are typically processed within 2–4 weeks through the university.",
      },
      {
        question: "Do I need to know Arabic?",
        answer:
          "No, all programs are taught in English. Arabic is useful but not required for daily life or work.",
      },
    ],
  },
  {
    name: "Singapore",
    slug: "singapore",
    flagEmoji: "🇸🇬",
    flagCdnCode: "sg",
    heroHeadline: "Study in Singapore — Asia's Education Powerhouse",
    heroSubheadline:
      "World-class universities, a thriving economy, and a multicultural gateway to Asia-Pacific opportunities.",
    whyStudy: [
      "Top-ranked universities with global recognition",
      "Hub for finance, technology, and innovation in Asia",
      "Safe, clean, and efficient city-state",
      "Strong government support for education and research",
      "Excellent connectivity to Asian and global markets",
    ],
    topUniversities: [
      "National University of Singapore (NUS)",
      "Nanyang Technological University (NTU)",
      "Singapore Management University (SMU)",
      "Singapore University of Technology and Design",
      "James Cook University Singapore",
      "PSB Academy",
      "Kaplan Higher Education Academy",
      "Management Development Institute of Singapore",
    ],
    avgTuition: "SGD 20,000 – SGD 50,000 per year",
    costOfLiving: "SGD 10,000 – SGD 15,000 per year",
    visaProcessingTime: "2–4 weeks (Student's Pass)",
    workRights:
      "16 hrs/week during term; full-time during vacation; Long-Term Visit Pass for job search",
    prPathway:
      "Employment Pass after job offer → PR application after 6 months–2 years of work",
    popularCourses: [
      "Business & Finance",
      "Computer Science & AI",
      "Engineering",
      "Data Science & Analytics",
      "Biomedical Sciences",
      "Supply Chain Management",
    ],
    intakeMonths: ["August", "January", "May"],
    scholarshipOpportunities: [
      "Singapore International Graduate Award (SINGA)",
      "ASEAN Undergraduate Scholarship",
      "NUS Global Merit Scholarship",
      "NTU President's Research Scholarship",
      "SMU Global Impact Scholarship",
    ],
    visaSuccessRate: "95%",
    costOfLivingBreakdown: {
      rent: "SGD 400 – SGD 800",
      food: "SGD 250 – SGD 400",
      transport: "SGD 50 – SGD 100",
      utilities: "SGD 50 – SGD 100",
      total: "SGD 750 – SGD 1,400",
    },
    visaProcessSteps: [
      "Receive offer from Singapore institution",
      "Apply for Student's Pass via SOLAR+",
      "Submit passport and documents to ICA",
      "Pay issuance fee and collection fee",
      "Collect Student's Pass upon arrival",
    ],
    scholarships: [
      {
        name: "SINGA",
        amount: "Full funding + stipend",
        description: "For PhD students in science and engineering",
      },
      {
        name: "NUS Global Merit",
        amount: "Full tuition + living",
        description: "For outstanding undergraduate students",
      },
      {
        name: "ASEAN Scholarship",
        amount: "Full funding",
        description: "For students from ASEAN countries including India",
      },
    ],
    courseSalaries: [
      { course: "Business & Finance", avgSalary: "SGD 55,000 – SGD 90,000" },
      { course: "Computer Science", avgSalary: "SGD 60,000 – SGD 100,000" },
      { course: "Engineering", avgSalary: "SGD 55,000 – SGD 85,000" },
      { course: "Data Science", avgSalary: "SGD 65,000 – SGD 105,000" },
      { course: "Biomedical Sciences", avgSalary: "SGD 50,000 – SGD 80,000" },
      { course: "Supply Chain", avgSalary: "SGD 52,000 – SGD 82,000" },
    ],
    faqs: [
      {
        question: "What is the Student's Pass?",
        answer:
          "It's the official student visa for Singapore, applied through the SOLAR+ system after receiving your admission offer.",
      },
      {
        question: "Can I work while studying?",
        answer:
          "Yes, up to 16 hours per week during term and full-time during vacation. Work must be approved by your institution.",
      },
      {
        question: "How do I get PR in Singapore?",
        answer:
          "After securing a job and an Employment Pass, you can apply for PR after 6 months to 2 years of work.",
      },
      {
        question: "Is Singapore expensive for students?",
        answer:
          "Living costs are moderate at SGD 10,000–15,000 per year. University hostels and shared housing help reduce costs.",
      },
      {
        question: "What is the Long-Term Visit Pass?",
        answer:
          "It allows graduates to stay in Singapore for up to 12 months to seek employment after completing their degree.",
      },
      {
        question: "Are there English-taught programs?",
        answer:
          "Yes, all programs at NUS, NTU, and SMU are taught in English. Singapore is an English-speaking country.",
      },
      {
        question: "What is the visa processing time?",
        answer:
          "Student's Pass applications are typically processed within 2–4 weeks via the SOLAR+ system.",
      },
      {
        question: "Why study in Singapore?",
        answer:
          "World-class universities, thriving economy, safe environment, and a gateway to Asia-Pacific career opportunities.",
      },
    ],
  },
  {
    name: "Europe",
    slug: "europe",
    flagEmoji: "🇪🇺",
    flagCdnCode: "eu",
    heroHeadline: "Study in Europe — Diverse Cultures, World-Class Education",
    heroSubheadline:
      "Explore opportunities across France, Netherlands, Sweden, Italy, Spain & more with the Erasmus+ network.",
    whyStudy: [
      "Low or no tuition fees in many European countries",
      "Erasmus+ mobility and scholarship opportunities",
      "Multilingual environment with English-taught programs",
      "Rich cultural diversity and travel opportunities",
      "Strong emphasis on research and innovation",
    ],
    topUniversities: [
      "ETH Zurich (Switzerland)",
      "École Polytechnique (France)",
      "Delft University of Technology (Netherlands)",
      "KU Leuven (Belgium)",
      "University of Copenhagen (Denmark)",
      "Karolinska Institute (Sweden)",
      "Sorbonne University (France)",
      "University of Amsterdam (Netherlands)",
    ],
    avgTuition: "€0 – €15,000 per year (varies by country)",
    costOfLiving: "€8,000 – €15,000 per year",
    visaProcessingTime: "4–12 weeks (National Visa / Residence Permit)",
    workRights:
      "Varies by country: typically 10–20 hrs/week; post-study work options available",
    prPathway:
      "EU Blue Card or country-specific skilled worker visa → Permanent residence after 3–5 years",
    popularCourses: [
      "Engineering & Technology",
      "Business & Management",
      "Arts & Design",
      "Environmental Sciences",
      "Medicine & Health Sciences",
      "International Relations",
    ],
    intakeMonths: ["September", "February"],
    scholarshipOpportunities: [
      "Erasmus Mundus Joint Master Degrees",
      "Eiffel Excellence Scholarship (France)",
      "Holland Scholarship (Netherlands)",
      "Swedish Institute Scholarship",
      "Marie Skłodowska-Curie Actions",
    ],
    visaSuccessRate: "89%",
    costOfLivingBreakdown: {
      rent: "€400 – €800",
      food: "€200 – €350",
      transport: "€30 – €80",
      utilities: "€80 – €150",
      total: "€710 – €1,380",
    },
    visaProcessSteps: [
      "Receive admission from European university",
      "Apply for national visa at embassy",
      "Submit financial proof and insurance",
      "Attend visa interview (if required)",
      "Receive visa and apply for residence permit",
    ],
    scholarships: [
      {
        name: "Erasmus Mundus",
        amount: "Full funding + travel",
        description:
          "Joint master's degrees across multiple European universities",
      },
      {
        name: "Eiffel Scholarship",
        amount: "€1,181/month",
        description: "For master's and PhD students in France",
      },
      {
        name: "Holland Scholarship",
        amount: "€5,000",
        description: "For non-EEA students studying in the Netherlands",
      },
    ],
    courseSalaries: [
      { course: "Engineering", avgSalary: "€45,000 – €70,000" },
      { course: "Business", avgSalary: "€40,000 – €65,000" },
      { course: "Arts & Design", avgSalary: "€35,000 – €55,000" },
      { course: "Environmental Science", avgSalary: "€38,000 – €60,000" },
      { course: "Medicine", avgSalary: "€50,000 – €80,000" },
      { course: "International Relations", avgSalary: "€38,000 – €58,000" },
    ],
    faqs: [
      {
        question: "What is the Erasmus+ program?",
        answer:
          "Erasmus+ is an EU program that supports education, training, youth, and sport. It offers scholarships for study and internships across Europe.",
      },
      {
        question: "Do I need to learn the local language?",
        answer:
          "Many master's programs are in English. However, learning the local language improves daily life and job prospects.",
      },
      {
        question: "What is the EU Blue Card?",
        answer:
          "It's a work permit for highly qualified non-EU workers. It leads to permanent residence after 3–5 years.",
      },
      {
        question: "How much does it cost to study in Europe?",
        answer:
          "Tuition ranges from €0–15,000 per year depending on the country. Many public universities have low or no fees.",
      },
      {
        question: "Can I travel within Europe?",
        answer:
          "A Schengen visa or residence permit allows travel across 27 European countries without additional visas.",
      },
      {
        question: "What is the Schengen visa?",
        answer:
          "It allows travel across 27 European countries. Student visas are typically national visas that may include Schengen access.",
      },
      {
        question: "Are there part-time work rights?",
        answer:
          "Most countries allow 10–20 hours per week of part-time work. Rules vary by country.",
      },
      {
        question: "Which European country is best for Indian students?",
        answer:
          "Germany, France, Netherlands, and Sweden are popular for affordable education, job opportunities, and quality of life.",
      },
    ],
  },
  {
    name: "France",
    slug: "france",
    flagEmoji: "🇫🇷",
    flagCdnCode: "fr",
    heroHeadline: "Study in France — Art, Innovation & Academic Excellence",
    heroSubheadline:
      "Home to world-class engineering, arts, and business schools with affordable tuition and rich cultural heritage.",
    whyStudy: [
      "Globally ranked universities with strong research programs",
      "Affordable tuition at public universities (as low as €170/year)",
      "Post-study work visa (APS) for up to 2 years after graduation",
      "Rich cultural heritage, arts, cuisine, and quality of life",
      "Gateway to the European job market and Schengen travel",
    ],
    topUniversities: [
      "Sorbonne University",
      "École Polytechnique",
      "Sciences Po",
      "HEC Paris",
      "CentraleSupélec",
      "Université Paris-Saclay",
      "ESSEC Business School",
      "Grenoble Alpes University",
    ],
    avgTuition: "€2,000 – €15,000 per year",
    costOfLiving: "€700 – €1,200 per month",
    visaProcessingTime: "3–4 weeks (Long-stay student visa VLS-TS)",
    workRights: "Work up to 964 hours/year (about 20 hrs/week) during studies",
    prPathway:
      "Post-study APS visa (1-2 years) → Work permit → 5-year permanent residency",
    popularCourses: [
      "Engineering & Technology",
      "Business & Management (MBA)",
      "Architecture & Urban Planning",
      "Medicine & Life Sciences",
      "Arts & Humanities",
      "Culinary Arts & Hospitality",
    ],
    intakeMonths: [
      "September/October (Main intake)",
      "January/February (Secondary intake)",
    ],
    scholarshipOpportunities: [
      "Eiffel Excellence Scholarship Programme",
      "Erasmus+ Scholarship",
      "Campus France Scholarships",
      "French Government Excellence Grants",
      "Charpak Scholarship (for Indian students)",
    ],
    visaSuccessRate: "87%",
    costOfLivingBreakdown: {
      rent: "€400 – €900",
      food: "€200 – €350",
      transport: "€75 – €120",
      utilities: "€50 – €100",
      total: "€725 – €1,470",
    },
    visaProcessSteps: [
      "Register on Campus France portal (India)",
      "Attend Campus France interview and get clearance",
      "Apply for long-stay student visa (VLS-TS) at French consulate",
      "Pay visa fee and submit documents",
      "Receive visa and validate online after arrival in France",
    ],
    scholarships: [
      {
        name: "Eiffel Excellence Scholarship",
        amount: "€1,181 – €1,400/month",
        description: "For outstanding international master's and PhD students",
      },
      {
        name: "Charpak Scholarship",
        amount: "€700 – €900/month",
        description: "Exclusively for Indian students at French institutions",
      },
      {
        name: "Erasmus+ Scholarship",
        amount: "€500 – €800/month",
        description: "EU-funded exchange and study mobility grants",
      },
    ],
    courseSalaries: [
      { course: "Engineering", avgSalary: "€40,000 – €65,000" },
      { course: "Business (MBA)", avgSalary: "€50,000 – €85,000" },
      { course: "Architecture", avgSalary: "€30,000 – €55,000" },
      { course: "Data Science", avgSalary: "€42,000 – €70,000" },
      { course: "Medicine", avgSalary: "€55,000 – €100,000" },
    ],
    faqs: [
      {
        question: "Do I need to know French to study in France?",
        answer:
          "Many master's programs are taught in English, especially in business and engineering. However, learning French helps with daily life and job prospects.",
      },
      {
        question: "What is the Campus France process for Indian students?",
        answer:
          "Indian students must register on the Campus France India portal, pay a fee, and attend an interview before applying for the student visa.",
      },
      {
        question: "Can I work while studying in France?",
        answer:
          "Yes, international students can work up to 964 hours per year (approximately 20 hours/week) during their studies.",
      },
      {
        question: "What is the post-study work visa (APS)?",
        answer:
          "The APS (Autorisation Provisoire de Séjour) allows graduates to stay in France for 1–2 years after graduation to find work or start a business.",
      },
      {
        question: "What are the top cities for Indian students in France?",
        answer:
          "Paris, Lyon, Toulouse, Grenoble, and Bordeaux are the most popular cities for international students with large Indian student communities.",
      },
    ],
  },
];

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

export function getAllCountrySlugs(): string[] {
  return countries.map((c) => c.slug);
}
