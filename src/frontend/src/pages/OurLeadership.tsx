import {
  useHeroContent,
  useLeadershipMembers,
} from "@/hooks/useBackendContent";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

type Leader = {
  id: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
};

type AdvisoryMember = {
  id: number;
  name: string;
  role: string;
  bio?: string;
};

const ADVISORY_BOARD: AdvisoryMember[] = [
  {
    id: 1,
    name: "Mr. Santosh Mehra, IPS (Retd.)",
    role: "International Advisor",
  },
  {
    id: 2,
    name: "Prof. T.M. Sathyanarayanan",
    role: "Chief Advisor, International Education & Diplomacy",
    bio: "A distinguished Economist and International Relations specialist with 38 years of global teaching experience. Managing Director of OECS India, Pune. Has advised and consulted for universities, corporate entities, and consulates globally. Spearheaded the United Nations Special Interest Group on inter-country relations.",
  },
];

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border p-8 flex flex-col items-center text-center"
      data-ocid={`leadership.member.card.${index + 1}`}
    >
      <div className="relative mb-6">
        <img
          src={leader.photo}
          alt={leader.name}
          width={120}
          height={120}
          className="w-28 h-28 rounded-full object-cover ring-4 ring-orange-100 group-hover:ring-orange-400 transition-all duration-300 shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=0B1F3A&color=fff&size=300`;
          }}
        />
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-white px-3 py-1 rounded-full shadow"
          style={{ backgroundColor: "#FF8A00" }}
        >
          {leader.title}
        </span>
      </div>
      <h3
        className="text-xl font-bold mt-4 mb-2"
        style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
      >
        {leader.name}
      </h3>
      <p
        className={`text-muted-foreground text-sm leading-relaxed mt-1 ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {leader.bio}
      </p>
      {leader.bio.length > 200 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-semibold transition-colors"
          style={{ color: "#FF8A00" }}
          data-ocid={`leadership.member.toggle.${index + 1}`}
        >
          {expanded ? "Show less ▲" : "Read more ▼"}
        </button>
      )}
    </div>
  );
}

export default function OurLeadership() {
  const { data: heroContentData } = useHeroContent();
  const { data: backendLeaders, isLoading } = useLeadershipMembers();

  // Stable ref: preserve last known hero values so stats never flash empty
  const lastHeroRef = React.useRef(heroContentData);
  if (heroContentData) lastHeroRef.current = heroContentData;
  const stableHero = lastHeroRef.current;

  const leaders: Leader[] = (backendLeaders ?? []).map((l) => ({
    id: String(l.id),
    name: l.name,
    title: l.role,
    photo:
      l.imageUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(l.name)}&background=0B1F3A&color=fff&size=300`,
    bio: l.bio,
  }));

  return (
    <div className="min-h-screen" data-ocid="our-leadership.page">
      {/* Hero */}
      <section
        className="relative min-h-[55vh] flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #0B1F3A 0%, #1a3a6b 60%, #0B1F3A 100%)",
        }}
        data-ocid="our-leadership.hero.section"
      >
        {/* Decorative circles */}
        <div
          className="absolute top-10 right-16 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FFC247, transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-10 w-48 h-48 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #FF8A00, transparent)",
          }}
        />
        <div className="container mx-auto px-4 text-center text-white py-24 relative z-10">
          <span
            className="inline-block text-sm font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-widest"
            style={{
              backgroundColor: "rgba(255,138,0,0.2)",
              color: "#FFC247",
              border: "1px solid rgba(255,194,71,0.4)",
            }}
          >
            Meet the A-Team
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Valmiki Leadership:
            <br />
            <span style={{ color: "#FFC247" }}>Guiding Success</span>
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Meet the A-Team Leading the Charge
          </p>
          <p className="text-base text-blue-200 max-w-2xl mx-auto leading-relaxed">
            We are creating a new wave in foreign education by helping students
            apply to the most prestigious universities of the world, from India.
          </p>
        </div>
      </section>

      {/* Leadership Grid */}
      <section
        className="py-20 bg-muted/30"
        data-ocid="our-leadership.team.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide"
              style={{ backgroundColor: "#FFF3E0", color: "#FF8A00" }}
            >
              Our Leadership
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
            >
              The Visionary Team Behind Valmiki Group
            </h2>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              data-ocid="our-leadership.team.loading_state"
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl bg-card border border-border p-8 flex flex-col items-center gap-4 animate-pulse"
                >
                  <div className="w-28 h-28 rounded-full bg-muted" />
                  <div className="w-40 h-4 rounded bg-muted" />
                  <div className="w-24 h-3 rounded bg-muted" />
                  <div className="w-full h-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && leaders.length === 0 && (
            <div
              className="text-center py-16"
              data-ocid="our-leadership.team.empty_state"
            >
              <p
                className="text-lg text-muted-foreground"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Leadership information coming soon.
              </p>
            </div>
          )}

          {/* Leaders grid */}
          {!isLoading && leaders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, idx) => (
                <LeaderCard key={leader.id} leader={leader} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* International Advisory Board */}
      <section
        className="py-20 bg-white"
        data-ocid="our-leadership.advisory.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-bold px-5 py-2 rounded-full mb-4 uppercase tracking-widest"
              style={{ backgroundColor: "#FFC247", color: "#0B1F3A" }}
            >
              ★ Advisory Board
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
            >
              International Advisory Board
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Seasoned global experts guiding our strategic vision
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            {ADVISORY_BOARD.map((member, idx) => (
              <div
                key={member.id}
                className="flex-1 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-t-4"
                style={{ borderTopColor: "#FFC247" }}
                data-ocid={`our-leadership.advisory.item.${idx + 1}`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0"
                    style={{ backgroundColor: "#0B1F3A" }}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{
                        color: "#0B1F3A",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {member.name}
                    </h3>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#FF8A00" }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>
                {member.bio && (
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section
        className="py-16 text-white"
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #1a3a6b 100%)",
        }}
        data-ocid="our-leadership.stats.banner"
      >
        <div className="container mx-auto px-4 text-center">
          <p
            className="text-lg font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#FFC247" }}
          >
            Our Track Record
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            More than 1 Lakh Students Trust Valmiki Consultancy
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Our track record of triumphs speaks for itself.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-10">
            {[
              {
                metric: stableHero?.studentsGuided ?? "",
                label: "Students Guided",
              },
              {
                metric: stableHero?.universityPartnerships ?? "",
                label: "University Partners",
              },
              {
                metric: stableHero?.yearsExperience ?? "",
                label: "Years Experience",
              },
              {
                metric: stableHero?.visaSuccessRate ?? "",
                label: "Visa Success Rate",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-4xl font-bold mb-1"
                  style={{
                    color: "#FFC247",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {stat.metric}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <Link
            to="/contact"
            className="inline-block font-bold px-10 py-4 rounded-full text-white text-lg transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: "#FF8A00" }}
            data-ocid="our-leadership.cta.primary_button"
          >
            Book Free Counseling
          </Link>
        </div>
      </section>
    </div>
  );
}
