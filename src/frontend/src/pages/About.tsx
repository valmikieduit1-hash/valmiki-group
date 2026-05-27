import type { LeadershipMember } from "@/backend";
import { useContent } from "@/context/ContentContext";
import {
  useAboutPageContent,
  useLeadershipMembers,
} from "@/hooks/useBackendContent";
import React, { useState } from "react";
import { Link } from "react-router-dom";

type LocalLeader = {
  id: string | bigint | number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  order: number | bigint;
};

const DEFAULT_LEADERS: LocalLeader[] = [
  {
    id: 1,
    name: "Surya Ganesh Valmiki",
    role: "Chairman & Managing Director",
    bio: "The visionary force behind Valmiki Group, Surya Ganesh Valmiki has been transforming the landscape of foreign education and immigration services for more than two decades. As an educationist, entrepreneur, and philanthropist, he has created a platform that empowers aspiring students to explore prestigious universities worldwide.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Surya+Ganesh+Valmiki&background=0B1F3A&color=fff&size=200",
    order: 1,
  },
  {
    id: 2,
    name: "Hari Kishan Valmiki",
    role: "Director",
    bio: "As the Director of the Valmiki Group, Hari Kishan Valmiki drives growth initiatives, oversees operations, and steers the Valmiki Tours and Travels Services and the Valmiki Foundation.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Hari+Kishan+Valmiki&background=FF8A00&color=fff&size=200",
    order: 2,
  },
  {
    id: 3,
    name: "Pushpa Valmiki",
    role: "Director",
    bio: "Pushpa Valmiki brings a unique leadership style informed by values, compassion, and resilience. She has traveled to over 20 countries as an ambassador for the Valmiki Group.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Pushpa+Valmiki&background=FFC247&color=0B1F3A&size=200",
    order: 3,
  },
  {
    id: 4,
    name: "Nirupama Das",
    role: "Chief Executive Officer",
    bio: "Nirupama oversees all business aspects from strategic development to building best-in-class teams. With fifteen years of experience, she has cultivated a high-performance work culture leveraging interpersonal skills.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Nirupama+Das&background=0B1F3A&color=fff&size=200",
    order: 4,
  },
  {
    id: 5,
    name: "Kavita",
    role: "HR Lead",
    bio: "With over 15 years across IT, Education, FMCG, and Entertainment sectors, Kavita leads all human resources and cultural strategy, central to establishing the dedicated HR department.",
    imageUrl:
      "https://ui-avatars.com/api/?name=Kavita+HR&background=FF8A00&color=fff&size=200",
    order: 5,
  },
  {
    id: 6,
    name: "T.M. Sathyanarayanan",
    role: "Chief Advisor - International Education",
    bio: "A distinguished Economist with 38 years of global teaching experience. As Managing Director of OECS India, he has spearheaded the United Nations Special Interest Group on inter-country relations.",
    imageUrl:
      "https://ui-avatars.com/api/?name=TM+Sathyanarayanan&background=0B1F3A&color=fff&size=200",
    order: 6,
  },
];

const DEFAULT_TIMELINE = [
  {
    id: "1",
    year: "2001",
    milestone: "Founded",
    description: "Established in Secunderabad, Hyderabad, Telangana, India",
  },
  {
    id: "2",
    year: "2005",
    milestone: "Global Expansion",
    description: "Expanded to USA, UK, Canada, Australia and more",
  },
  {
    id: "3",
    year: "2010",
    milestone: "10,000 Students",
    description: "Crossed 10,000 students guided to international universities",
  },
  {
    id: "4",
    year: "2015",
    milestone: "Multiple Branches",
    description: "Opened multiple branches across Hyderabad",
  },
  {
    id: "5",
    year: "2020",
    milestone: "50,000 Students",
    description: "Crossed 50,000 students with 97% visa success rate",
  },
  {
    id: "6",
    year: "2024",
    milestone: "1 Lakh+ Students",
    description: "1 Lakh+ students guided, 24+ years of excellence",
  },
];

const BRAND_POINTS = [
  "We believe every student has the potential to succeed abroad and we are committed to helping them reach their full potential.",
  "Two decades of experience and a team of expert counselors to help fulfill your study abroad dreams.",
  "One-on-one personalized guidance, tailoring the journey to your individual goals and preferences.",
  "Complete transparency from application submission to visa processing, keeping you informed at every step.",
  "Comprehensive services simplifying the entire study abroad journey, from university selection to visa processing.",
  "Continuous innovation in services, keeping up with the latest trends in the education sector.",
  "End-to-end support, not just during the application process, but throughout your study abroad journey.",
];

export default function About() {
  const { data: backendContent } = useAboutPageContent();
  const { data: backendLeaders } = useLeadershipMembers();
  const { heroContent } = useContent();
  const [expandedLeader, setExpandedLeader] = useState<string | null>(null);

  // Stable ref: preserve last known hero values so stats never flash empty
  const lastHeroRef = React.useRef(heroContent);
  if (heroContent) lastHeroRef.current = heroContent;
  const stableHero = lastHeroRef.current;

  const leaders: LocalLeader[] =
    backendLeaders && (backendLeaders as LeadershipMember[]).length > 0
      ? [...(backendLeaders as LeadershipMember[])].sort(
          (a, b) => Number(a.order) - Number(b.order),
        )
      : DEFAULT_LEADERS;

  const timeline =
    backendContent?.timeline && backendContent.timeline.length > 0
      ? backendContent.timeline
      : DEFAULT_TIMELINE;

  const achievements =
    backendContent?.achievements && backendContent.achievements.length > 0
      ? backendContent.achievements
      : [
          {
            id: "1",
            metric: stableHero?.studentsGuided ?? "",
            description: "Students received offers from top universities",
            icon: "🎓",
          },
          {
            id: "2",
            metric: stableHero?.universityPartnerships ?? "",
            description: "University tie-ups across the globe",
            icon: "🏛️",
          },
          {
            id: "3",
            metric: "1 Million+",
            description: `Counselling sessions in ${stableHero?.yearsExperience ?? ""} years`,
            icon: "💬",
          },
          {
            id: "4",
            metric: stableHero?.visaSuccessRate ?? "",
            description: "Visa success rate",
            icon: "✅",
          },
        ];

  const heroImage =
    backendContent?.imageUrl ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600";

  return (
    <div className="min-h-screen" data-ocid="about.page">
      {/* Hero */}
      <section
        className="relative min-h-[75vh] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(11,31,58,0.88) 0%, rgba(11,31,58,0.65) 100%), url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="about.hero.section"
      >
        <div className="container mx-auto px-4 text-center text-white py-24">
          <span className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
            We Help Students Overcome the Obstacles of Overseas Education
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Trusted Overseas Education &amp; Immigration Experts Since 2001
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg"
              data-ocid="about.hero.cta_button"
            >
              Book Free Counseling
            </Link>
            <a
              href="#story"
              className="btn-outline-themed font-bold px-8 py-3.5"
              style={{
                borderColor: "var(--color-button)",
                color: "var(--color-button)",
              }}
              data-ocid="about.hero.secondary_button"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white shadow-lg py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                metric: stableHero?.studentsGuided ?? "",
                label: "Students",
                sub: "received offers from top universities",
              },
              {
                metric: stableHero?.universityPartnerships ?? "",
                label: "University Tie-Ups",
                sub: "finest institutions globally",
              },
              {
                metric: "1 Million+",
                label: "Counsellings",
                sub: `in ${stableHero?.yearsExperience ?? ""} years of existence`,
              },
              {
                metric: stableHero?.visaSuccessRate ?? "",
                label: "Visa Success Rate",
                sub: "commitment to your success",
              },
            ].map((stat, i) => (
              <div
                key={stat.metric}
                className="py-4"
                data-ocid={`about.stats.item.${i + 1}`}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                  {stat.metric}
                </div>
                <div
                  className="font-semibold text-lg mt-1"
                  style={{ color: "#0B1F3A" }}
                >
                  {stat.label}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section id="story" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
                Our Story
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-6"
                style={{ color: "#0B1F3A" }}
              >
                Valmiki Group: Championing Student Success Since 2001
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {backendContent?.companyStory ||
                  "Valmiki Group was established in 2001 in Secunderabad, Hyderabad, India. For more than 24 years, Valmiki has played a major role in international educational consultancy, helping students study in USA, Canada, Australia, New Zealand, UK, Europe, and various other countries."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Founded", value: "2001" },
                  { label: "Headquarters", value: "Secunderabad, Hyderabad" },
                  { label: "Team Size", value: "66+ Employees" },
                  { label: "Industry", value: "Overseas Education" },
                ].map((item, _i) => (
                  <div
                    key={item.label}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {item.label}
                    </div>
                    <div className="font-bold" style={{ color: "#0B1F3A" }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800"
                alt="Students"
                className="rounded-2xl shadow-2xl w-full h-[450px] object-cover"
              />
              <div
                className="absolute -bottom-6 -left-6 text-white rounded-2xl p-5 shadow-xl"
                style={{ backgroundColor: "#FF8A00" }}
              >
                <div className="text-3xl font-bold">
                  {stableHero?.yearsExperience ?? ""}
                </div>
                <div className="text-sm font-medium">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#0B1F3A" }}
            >
              Our Vision &amp; Mission
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              style={{ borderLeftWidth: 4, borderLeftColor: "#FF8A00" }}
              data-ocid="about.vision.card"
            >
              <div className="w-14 h-14 bg-[#FF8A00] rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Vision"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#0B1F3A" }}
              >
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {backendContent?.vision ||
                  "To help students navigate through the ups and downs of foreign education, discover their potential, find the right educational opportunities, and succeed in their chosen field."}
              </p>
            </div>
            <div
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              style={{ borderLeftWidth: 4, borderLeftColor: "#0B1F3A" }}
              data-ocid="about.mission.card"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-[#0B1F3A]">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Mission"
                  role="img"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#0B1F3A" }}
              >
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {backendContent?.mission ||
                  "We truly believe that studying abroad should be accessible and uncomplicated. Our mission is to empower students, offering them valuable insights to make well-informed choices."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Valmiki Different */}
      <section
        className="py-20 text-white"
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #1a3a6b 100%)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Makes Valmiki Consultancy a Cut Above the Rest?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {BRAND_POINTS.map((point, i) => (
              <div
                key={i.toString()}
                className="flex items-start gap-4 rounded-xl p-5"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#FF8A00" }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Check"
                    role="img"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-blue-50 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white" data-ocid="about.leadership.section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
              Our Team
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#0B1F3A" }}
            >
              Meet Our Leadership
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              The visionary team driving Valmiki Group&apos;s mission to
              transform overseas education
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaders.map((member, idx) => {
              const memberId = String(member.id);
              return (
                <div
                  key={memberId}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6 text-center group"
                  data-ocid={`about.leadership.item.${idx + 1}`}
                >
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-5 ring-4 ring-orange-100 group-hover:ring-orange-300 transition-all"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0B1F3A&color=fff&size=200`;
                    }}
                  />
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: "#0B1F3A" }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className="font-semibold text-sm mb-4"
                    style={{ color: "#FF8A00" }}
                  >
                    {member.role}
                  </p>
                  <p
                    className={`text-gray-500 text-sm leading-relaxed ${expandedLeader === memberId ? "" : "line-clamp-3"}`}
                  >
                    {member.bio}
                  </p>
                  {member.bio.length > 150 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLeader(
                          expandedLeader === memberId ? null : memberId,
                        )
                      }
                      className="text-orange-500 text-xs font-semibold mt-2 hover:text-orange-700 transition-colors"
                      data-ocid={`about.leadership.toggle.${idx + 1}`}
                    >
                      {expandedLeader === memberId ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#0B1F3A" }}
            >
              Our Journey Since 2001
            </h2>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-orange-200 hidden md:block" />
            {timeline.map((item, i) => (
              <div
                key={String(item.id)}
                className={`relative flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                data-ocid={`about.timeline.item.${i + 1}`}
              >
                <div
                  className={`flex-1 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                >
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#FFC247" }}
                  >
                    {item.year}
                  </div>
                  <div className="font-bold mb-1" style={{ color: "#0B1F3A" }}>
                    {item.milestone}
                  </div>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <div
                  className="relative z-10 w-5 h-5 rounded-full border-4 border-white shadow flex-shrink-0 md:mt-5"
                  style={{ backgroundColor: "#FF8A00" }}
                />
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#0B1F3A" }}
            >
              {stableHero?.studentsGuided
                ? `More than ${stableHero?.studentsGuided} Students Trust Valmiki Consultancy`
                : "Students Trust Valmiki Consultancy"}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((a) => (
              <div
                key={String(a.id)}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow"
                data-ocid={`about.achievement.item.${a.id}`}
              >
                <div className="text-4xl mb-3">{a.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent mb-2">
                  {a.metric}
                </div>
                <p className="text-gray-500 text-sm">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-white"
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #1a3a6b 100%)",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Fuel Your Study Abroad Dreams With Valmiki
          </h2>
          <p className="text-xl text-blue-200 mb-10">
            Join over 1 lakh students who have trusted Valmiki Group for their
            overseas education journey
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
              data-ocid="about.cta.primary_button"
            >
              Book Free Counseling
            </Link>
            <Link
              to="/study-abroad"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold px-10 py-4 rounded-full text-lg transition-all"
              data-ocid="about.cta.secondary_button"
            >
              Apply to Fly
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
