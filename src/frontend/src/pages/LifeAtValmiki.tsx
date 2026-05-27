import { useLifeAtValmikiContent } from "@/hooks/useBackendContent";
import { Link } from "react-router-dom";

const CULTURE_VALUES = [
  {
    icon: "💙",
    title: "Care",
    desc: "We genuinely care for our people, students, and communities. A culture of care is at the very heart of everything we do.",
  },
  {
    icon: "🚀",
    title: "Growth",
    desc: "We invest in continuous learning and professional development, empowering every team member to reach their full potential.",
  },
  {
    icon: "💡",
    title: "Innovation",
    desc: "We encourage fresh thinking and creative problem-solving, constantly evolving our services for students and partners.",
  },
  {
    icon: "🤝",
    title: "Teamwork",
    desc: "Together we achieve more. Collaboration, trust, and open communication drive every project and decision we make.",
  },
];

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800",
    alt: "Team collaboration at Valmiki",
  },
  {
    src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800",
    alt: "Office workspace",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    alt: "Team meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1543269664-7eef42226a21?w=800",
    alt: "Team event",
  },
  {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
    alt: "Valmiki team celebration",
  },
  {
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
    alt: "Learning session",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Working at Valmiki has been a truly transformative experience. The culture of care here is real — you feel supported every single day.",
    name: "Priya S.",
    role: "Counselor",
  },
  {
    quote:
      "Valmiki gave me the platform to grow both professionally and personally. I've never felt more motivated in my career.",
    name: "Rahul M.",
    role: "Marketing Executive",
  },
  {
    quote:
      "The team here is passionate about making a difference in students' lives. It's incredibly fulfilling work.",
    name: "Anita K.",
    role: "Visa Specialist",
  },
];

const PERKS = [
  {
    icon: "🏥",
    title: "Health & Wellness",
    desc: "Comprehensive health coverage and wellness programs for all team members.",
  },
  {
    icon: "📚",
    title: "Learning & Development",
    desc: "Regular training, workshops, and opportunities to grow your skills.",
  },
  {
    icon: "🌿",
    title: "Flexible Environment",
    desc: "A balanced and flexible work culture that respects your personal time.",
  },
  {
    icon: "🎉",
    title: "Team Events",
    desc: "Fun team outings, celebrations, and social events throughout the year.",
  },
  {
    icon: "📈",
    title: "Career Growth",
    desc: "Clear career paths and mentorship from industry leaders.",
  },
  {
    icon: "✨",
    title: "Positive Culture",
    desc: "A vibrant, inclusive workplace where everyone is heard and valued.",
  },
];

export default function LifeAtValmiki() {
  const { data: lifeData } = useLifeAtValmikiContent();
  const displayGallery = lifeData?.galleryImages?.length
    ? lifeData.galleryImages
    : GALLERY_IMAGES;
  const displayPerks = lifeData?.perks?.length ? lifeData.perks : PERKS;
  return (
    <div className="min-h-screen" data-ocid="life-at-valmiki.page">
      {/* Hero */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(11,31,58,0.82) 0%, rgba(11,31,58,0.50) 100%), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="life-at-valmiki.hero.section"
      >
        <div className="container mx-auto px-4 text-center text-white py-24 relative z-10">
          <span
            className="inline-block text-sm font-semibold px-5 py-2 rounded-full mb-6 uppercase tracking-widest"
            style={{
              backgroundColor: "rgba(255,194,71,0.2)",
              color: "#FFC247",
              border: "1px solid rgba(255,194,71,0.4)",
            }}
          >
            Life at Valmiki
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {lifeData?.heroHeadline || "Thrive & Grow"}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join a team that's changing lives through education
          </p>
        </div>
      </section>

      {/* Great Place to Work */}
      <section
        className="py-20 bg-white"
        data-ocid="life-at-valmiki.gptw.section"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div
              className="flex-shrink-0 w-36 h-36 rounded-2xl flex items-center justify-center shadow-xl text-center"
              style={{
                background: "linear-gradient(135deg, #FFC247, #FF8A00)",
              }}
            >
              <div>
                <div className="text-white text-3xl">🏆</div>
                <div
                  className="text-white text-xs font-bold mt-1 px-2 leading-tight"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  GREAT PLACE
                  <br />
                  TO WORK®
                </div>
              </div>
            </div>
            <div>
              <span
                className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
                style={{ backgroundColor: "#FFC247", color: "#0B1F3A" }}
              >
                Certified
              </span>
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
              >
                Valmiki is a Certified Great Place to Work
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our workplace culture is second to none, creating a vibrant and
                supportive atmosphere that stands out. It's our culture of care
                that is at the heart of our organization, setting us apart and
                fostering an environment where every individual thrives and
                contributes to the exceptional journey that is Valmiki.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #1a3a6b 100%)",
        }}
        data-ocid="life-at-valmiki.culture.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(255,194,71,0.2)",
                color: "#FFC247",
                border: "1px solid rgba(255,194,71,0.4)",
              }}
            >
              Our Values
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Culture &amp; Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CULTURE_VALUES.map((val, i) => (
              <div
                key={val.title}
                className="rounded-2xl p-7 text-center hover:scale-105 transition-transform duration-300"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                data-ocid={`life-at-valmiki.culture.item.${i + 1}`}
              >
                <div className="text-5xl mb-4">{val.icon}</div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{
                    color: "#FFC247",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {val.title}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section
        className="py-20 bg-gray-50"
        data-ocid="life-at-valmiki.gallery.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ backgroundColor: "#FFF3E0", color: "#FF8A00" }}
            >
              Gallery
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
            >
              Life in Pictures
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {displayGallery.map((img, i) => (
              <div
                key={img.src}
                className="overflow-hidden rounded-2xl shadow-lg group"
                data-ocid={`life-at-valmiki.gallery.item.${i + 1}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Testimonials */}
      <section
        className="py-20 bg-white"
        data-ocid="life-at-valmiki.testimonials.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ backgroundColor: "#FFF3E0", color: "#FF8A00" }}
            >
              Team Voices
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
            >
              What Our Team Says
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-8 shadow hover:shadow-xl transition-shadow border border-gray-100 relative"
                data-ocid={`life-at-valmiki.testimonial.item.${i + 1}`}
              >
                <div
                  className="text-5xl font-bold leading-none mb-4"
                  style={{ color: "#FF8A00", opacity: 0.4 }}
                >
                  &ldquo;
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: "#0B1F3A" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: "#0B1F3A" }}
                    >
                      {t.name}
                    </div>
                    <div className="text-xs" style={{ color: "#FF8A00" }}>
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section
        className="py-20"
        style={{ background: "#F8F9FA" }}
        data-ocid="life-at-valmiki.perks.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span
              className="inline-block text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest"
              style={{ backgroundColor: "#FFF3E0", color: "#FF8A00" }}
            >
              Benefits
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: "#0B1F3A", fontFamily: "Poppins, sans-serif" }}
            >
              Perks &amp; Benefits
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {displayPerks.map((perk, i) => (
              <div
                key={perk.title}
                className="bg-white rounded-2xl p-7 shadow hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                data-ocid={`life-at-valmiki.perk.item.${i + 1}`}
              >
                <div className="text-4xl mb-4">{perk.icon}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{
                    color: "#0B1F3A",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {perk.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #1a3a6b 100%)",
        }}
        data-ocid="life-at-valmiki.cta.section"
      >
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Ready to Join Our Team?
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Be part of a mission-driven team that's transforming lives through
            overseas education.
          </p>
          <Link
            to="/careers"
            className="inline-block font-bold px-12 py-4 rounded-full text-white text-lg transition-all hover:scale-105 shadow-lg"
            style={{ backgroundColor: "#FF8A00" }}
            data-ocid="life-at-valmiki.cta.primary_button"
          >
            View Open Positions
          </Link>
        </div>
      </section>
    </div>
  );
}
