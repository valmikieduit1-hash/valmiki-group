import { createActor } from "@/backend";
import type { BeOurPartnerContent } from "@/backend";
import {
  useBeOurPartnerContent,
  useHeroContent,
} from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Award,
  Building2,
  CheckCircle,
  ChevronRight,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const FALLBACK_CONTENT: BeOurPartnerContent = {
  heroHeadline: "Partner With Valmiki Group",
  heroSubheadline:
    "Join India's most trusted overseas education network with 24+ years of excellence",
  heroImage:
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1600&auto=format&fit=crop",
  partnershipTypes: [
    {
      title: "University Partnership",
      icon: "GraduationCap",
      description:
        "Partner with us to reach thousands of qualified Indian students actively seeking overseas education. We represent your institution with integrity and expertise.",
      benefits: [
        "Direct access to pre-screened students",
        "Regular campus presentations",
        "Dedicated relationship manager",
        "Joint marketing campaigns",
        "Application support services",
      ],
    },
    {
      title: "Referral Partnership",
      icon: "Users",
      description:
        "Earn competitive referral commissions by connecting students to Valmiki Group's world-class counseling services. Perfect for schools, colleges, and coaching centers.",
      benefits: [
        "Attractive commission structure",
        "Marketing materials provided",
        "Training and onboarding",
        "Real-time referral tracking",
        "Monthly payouts",
      ],
    },
    {
      title: "Corporate Partnership",
      icon: "Building2",
      description:
        "Collaborate with Valmiki Group for employee upskilling, sponsored education programs, and workforce development initiatives across international destinations.",
      benefits: [
        "Custom education packages",
        "Group discount pricing",
        "HR integration support",
        "Employee counseling sessions",
        "Dedicated corporate account manager",
      ],
    },
  ],
  generalBenefits: [
    "24+ years of brand trust",
    "1 Lakh+ students in our network",
    "350+ university partnerships globally",
    "Offices in Secunderabad & Jubilee Hills",
    "Dedicated partnership support team",
    "Marketing co-op opportunities",
    "Transparent reporting & analytics",
    "Strong digital presence across platforms",
  ],
  formDescription:
    "Interested in partnering with Valmiki Group? Fill in the form below and our partnerships team will reach out within 24 hours.",
};

const PARTNERSHIP_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  GraduationCap: Award,
  Users: Users,
  Building2: Building2,
};

export default function BeOurPartner() {
  const { data: backendContent } = useBeOurPartnerContent();
  const { data: heroContentData } = useHeroContent();

  // Stable ref: preserve last known hero values so stats never flash empty
  const lastHeroRef = React.useRef(heroContentData);
  if (heroContentData) lastHeroRef.current = heroContentData;
  const stableHero = lastHeroRef.current;

  const STATS = [
    {
      value: stableHero?.universityPartnerships ?? "",
      label: "Partner Universities",
    },
    {
      value: stableHero?.yearsExperience ?? "",
      label: "Years of Experience",
    },
    {
      value: stableHero?.studentsGuided ?? "",
      label: "Students Guided",
    },
    {
      value: stableHero?.visaSuccessRate ?? "",
      label: "Visa Success Rate",
    },
  ];
  const { actor } = useActor(createActor);
  const formRef = useRef<HTMLDivElement>(null);
  const content = backendContent ?? FALLBACK_CONTENT;

  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "University",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connection not ready. Please try again.");
      return;
    }
    setSubmitting(true);
    try {
      await actor.submitPartnerInquiry({
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        partnershipType: formData.partnershipType,
        message: formData.message,
      });
      toast.success(
        "Inquiry submitted! Our partnerships team will contact you within 24 hours.",
      );
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        partnershipType: "University",
        message: "",
      });
    } catch {
      toast.error("Failed to submit. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-ocid="be_our_partner.page">
      {/* Hero */}
      <section
        className="relative min-h-[460px] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(${content.heroImage || "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1600&auto=format&fit=crop"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3a]/90 via-[#0b1f3a]/70 to-transparent" />
        <div className="relative container mx-auto px-4 py-24">
          <nav className="mb-5 flex items-center gap-2 text-sm text-white/60">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/90">Be Our Partner</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="font-[Poppins] text-4xl font-bold text-white sm:text-5xl">
              {content.heroHeadline}
            </h1>
            <p className="mt-4 text-lg text-white/80">
              {content.heroSubheadline}
            </p>
            <button
              type="button"
              onClick={scrollToForm}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ff8a00] px-8 py-3.5 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-all hover:-translate-y-0.5"
              data-ocid="be_our_partner.hero.apply_now_button"
            >
              Apply Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Partnership Types */}
      <section
        className="bg-background py-16 sm:py-20"
        data-ocid="be_our_partner.types.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-[Poppins] text-3xl font-bold text-[#0b1f3a] sm:text-4xl">
              Partnership Opportunities
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Choose the partnership model that works best for you and your
              organisation.
            </p>
          </motion.div>
          <div className="grid gap-6 lg:grid-cols-3">
            {content.partnershipTypes.map((type, i) => {
              const Icon = PARTNERSHIP_ICONS[type.icon] ?? Globe;
              return (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 shadow-lg hover:-translate-y-1 transition-all"
                  data-ocid={`be_our_partner.types.card.${i + 1}`}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#ff8a00] to-[#ffc247] opacity-80 group-hover:opacity-100" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0b1f3a]/8 text-[#0b1f3a] mb-5 transition-all group-hover:bg-[#0b1f3a] group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-[Poppins] text-xl font-bold text-[#0b1f3a] mb-3">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {type.description}
                  </p>
                  <ul className="mt-auto space-y-2">
                    {type.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle className="h-4 w-4 text-[#ff8a00] flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* General Benefits */}
      <section
        className="bg-[#0b1f3a] py-16 sm:py-20"
        data-ocid="be_our_partner.benefits.section"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-[Poppins] text-3xl font-bold text-white text-center mb-12"
          >
            Why Partner With Us
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {content.generalBenefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/8 px-5 py-4 backdrop-blur-sm"
                data-ocid={`be_our_partner.benefits.item.${i + 1}`}
              >
                <CheckCircle className="h-5 w-5 text-[#ffc247] flex-shrink-0 mt-0.5" />
                <span className="text-white text-sm font-medium">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-background py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center rounded-2xl border border-border/60 bg-card py-8 text-center shadow-sm"
                data-ocid={`be_our_partner.stats.item.${i + 1}`}
              >
                <span className="font-[Poppins] text-4xl font-bold text-[#ffc247]">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section
        className="bg-muted/30 py-16 sm:py-20"
        ref={formRef}
        data-ocid="be_our_partner.form.section"
      >
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-[Poppins] text-3xl font-bold text-[#0b1f3a] text-center mb-3">
              Start a Partnership
            </h2>
            <p className="text-muted-foreground text-center mb-10">
              {content.formDescription}
            </p>
            <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="bop-company"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Company / Organisation Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="bop-company"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                        placeholder="Valmiki University"
                        data-ocid="be_our_partner.form.company_input"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bop-contact-name"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Contact Person Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="bop-contact-name"
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactName: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                        placeholder="Dr. Jane Smith"
                        data-ocid="be_our_partner.form.contact_name_input"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="bop-email"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="bop-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                        placeholder="partner@organisation.com"
                        data-ocid="be_our_partner.form.email_input"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bop-phone"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="bop-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                        placeholder="+91 XXXXX XXXXX"
                        data-ocid="be_our_partner.form.phone_input"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bop-type"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Partnership Type
                  </label>
                  <select
                    id="bop-type"
                    value={formData.partnershipType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partnershipType: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40"
                    data-ocid="be_our_partner.form.type_select"
                  >
                    <option value="University">University Partnership</option>
                    <option value="Referral">Referral Partnership</option>
                    <option value="Corporate">Corporate Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="bop-message"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="bop-message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff8a00]/40 resize-none"
                      placeholder="Tell us about your organisation and what you're looking to achieve..."
                      data-ocid="be_our_partner.form.message_textarea"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-[#ff8a00] py-3.5 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-all disabled:opacity-60"
                  data-ocid="be_our_partner.form.submit_button"
                >
                  {submitting ? "Submitting..." : "Submit Partnership Inquiry"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section
        className="bg-[#0b1f3a] py-14"
        data-ocid="be_our_partner.cta.section"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-[Poppins] text-2xl font-bold text-white mb-3">
            Join Our Network Today
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Join 350+ partner universities and organisations that trust Valmiki
            Group to connect them with India's best students.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:+919090474777"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff8a00] px-7 py-3 font-[Poppins] font-bold text-white shadow-lg hover:bg-orange-600 transition-all"
              data-ocid="be_our_partner.cta.call_button"
            >
              <Phone className="h-4 w-4" />
              +91-9090 4747 77
            </a>
            <a
              href="mailto:enquiry@valmikigroup.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 font-[Poppins] font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
              data-ocid="be_our_partner.cta.email_button"
            >
              <Mail className="h-4 w-4" />
              enquiry@valmikigroup.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
