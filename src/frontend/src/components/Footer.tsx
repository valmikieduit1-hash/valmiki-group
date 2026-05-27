import {
  Bookmark,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  X,
  Youtube,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  useContactInfo,
  useFooterContent,
  useHeroContent,
  useHomeSectionsContent,
} from "../hooks/useBackendContent";

const platformIconMap: Record<string, ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: X,
  x: X,
  whatsapp: MessageCircle,
  pinterest: Bookmark,
  // legacy casing
  LinkedIn: Linkedin,
  Facebook: Facebook,
  Instagram: Instagram,
  YouTube: Youtube,
};

/** Brand background colours for each social platform */
const platformColorMap: Record<string, string> = {
  linkedin: "#0A66C2",
  facebook: "#1877F2",
  instagram: "#E1306C",
  youtube: "#FF0000",
  twitter: "#000000",
  x: "#000000",
  whatsapp: "#25D366",
  pinterest: "#E60023",
  // legacy casing
  LinkedIn: "#0A66C2",
  Facebook: "#1877F2",
  Instagram: "#E1306C",
  YouTube: "#FF0000",
};

/** Returns inline style for a social icon circle with brand colour */
function socialIconStyle(platform: string): React.CSSProperties {
  const bg = platformColorMap[platform] ?? "#334155";
  return { background: bg };
}

const _staticBranches = [
  {
    name: "Secunderabad HQ",
    address:
      "HD-67 & 68, Gruha Kalpa Complex, SP Road, Secunderabad, Telangana",
  },
  {
    name: "Jubilee Hills",
    address: "Road 37, Jubilee Hills, Hyderabad, Telangana",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();
  const { data: backendContact } = useContactInfo();
  const { data: homeSections } = useHomeSectionsContent();
  const { data: heroData } = useHeroContent();
  const { data: footerContent } = useFooterContent();

  const quickLinks = footerContent?.quickLinks ?? [];
  const serviceLinks = footerContent?.serviceLinks ?? [];
  const countryLinks = footerContent?.countryLinks ?? [];
  const socialLinks = footerContent?.socialLinks ?? [];
  const whatsappNumber = footerContent?.whatsappNumber ?? "919090474777";
  const copyrightText = footerContent?.copyrightText
    ? footerContent.copyrightText.replace("{year}", String(currentYear))
    : `\u00a9 ${currentYear} Valmiki Group. All rights reserved.`;
  const googleBadge = footerContent?.googleReviewsBadge;
  const facebookBadge = footerContent?.facebookReviewsBadge;
  const eduLoanPartners = footerContent?.eduLoanPartners ?? [];
  const officeLocations = footerContent?.officeLocations ?? [];

  // Office locations: prefer dynamic list, fall back to contactInfo branches, then static
  const branches =
    officeLocations.length > 0
      ? officeLocations.map((loc) => ({
          name: loc.city,
          address: loc.address,
          phone: loc.phone,
          email: loc.email,
        }))
      : backendContact
        ? [
            {
              name: backendContact.branch1Name ?? "",
              address: backendContact.address1 ?? "",
              phone: "",
              email: "",
            },
            {
              name: backendContact.branch2Name ?? "",
              address: backendContact.address2 ?? "",
              phone: "",
              email: "",
            },
            ...(backendContact.branch3Name
              ? [
                  {
                    name: backendContact.branch3Name,
                    address: backendContact.address3 ?? "",
                    phone: "",
                    email: "",
                  },
                ]
              : []),
          ].filter((b) => b.name)
        : [];

  const phones = backendContact
    ? [
        backendContact.phone1,
        backendContact.phone2,
        backendContact.phone3,
      ].filter((p): p is string => !!p)
    : [];

  const emailAddress = backendContact?.email ?? "";

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer
      className="w-full"
      style={{
        background:
          "linear-gradient(180deg, #0B1F3A 0%, #091729 55%, #060F1E 100%)",
        borderTop: "2px solid",
        borderImageSource:
          "linear-gradient(90deg, #FF8A00 0%, #FFC247 50%, #FF8A00 100%)",
        borderImageSlice: 1,
      }}
      data-ocid="footer"
    >
      {/* Review Badges */}
      {(googleBadge?.isVisible || facebookBadge?.isVisible) && (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-4 px-4 py-4">
            {googleBadge?.isVisible && (
              <a
                href={googleBadge.reviewUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all hover:brightness-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                data-ocid="footer.google_reviews_badge"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <div>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#FFC247" }}
                    >
                      {googleBadge.rating}
                    </span>
                    <span style={{ color: "#FFC247" }}>★★★★★</span>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {googleBadge.reviewCount} on Google
                  </p>
                </div>
              </a>
            )}
            {facebookBadge?.isVisible && (
              <a
                href={facebookBadge.reviewUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all hover:brightness-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                data-ocid="footer.facebook_reviews_badge"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-[#1877F2]"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#FFC247" }}
                    >
                      {facebookBadge.rating}
                    </span>
                    <span style={{ color: "#FFC247" }}>★★★★★</span>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {facebookBadge.reviewCount} on Facebook
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Edu Loan Partners */}
      {eduLoanPartners.length > 0 && (
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <div className="container mx-auto px-4 py-6">
            <p
              className="mb-4 text-center text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              Education Loan Partners
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {eduLoanPartners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.websiteUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-lg px-3 py-2 transition-all hover:brightness-110"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  title={partner.name}
                  data-ocid={`footer.edu_loan_partner.${partner.id}`}
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="h-10 max-w-[120px] object-contain brightness-0 invert"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(255,255,255,0.80)" }}
                    >
                      {partner.name}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div
        className="container mx-auto px-4 py-12"
        style={{ paddingTop: "3rem" }}
      >
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-3">
            <Link
              to="/"
              className="inline-flex items-center"
              data-ocid="footer.logo_link"
            >
              <img
                src="/assets/valmiki-group-logo.png"
                alt="Valmiki Group"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p
              className="mt-4 text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {homeSections?.footerDescription ||
                (heroData?.studentsGuided
                  ? `Trusted overseas education & immigration experts since 2001. Guiding ${heroData.studentsGuided} students to global opportunities with ${heroData.visaSuccessRate ?? ""} visa success rate.`
                  : "Trusted overseas education & immigration experts since 2001.")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = platformIconMap[social.platform] ?? Linkedin;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-all hover:scale-110"
                    style={{
                      ...socialIconStyle(social.platform),
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                    aria-label={social.platform}
                    data-ocid={`footer.social.${social.platform.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4
              className="font-display text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFC247", letterSpacing: "0.08em" }}
            >
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.linkLabel}>
                  <Link
                    to={link.url}
                    className="footer-nav-link text-sm"
                    data-ocid={`footer.quick_link.${link.linkLabel.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {link.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4
              className="font-display text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFC247", letterSpacing: "0.08em" }}
            >
              Services
            </h4>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.linkLabel}>
                  <Link
                    to={link.url}
                    className="footer-nav-link text-sm"
                    data-ocid={`footer.service_link.${link.linkLabel.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {link.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Countries */}
          <div className="lg:col-span-2">
            <h4
              className="font-display text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFC247", letterSpacing: "0.08em" }}
            >
              Countries
            </h4>
            <ul className="mt-4 space-y-2.5">
              {countryLinks.map((link) => (
                <li key={link.linkLabel}>
                  <Link
                    to={link.url}
                    className="footer-nav-link text-sm"
                    data-ocid={`footer.country_link.${link.linkLabel.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {link.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Branches */}
          <div className="lg:col-span-3">
            <h4
              className="font-display text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#FFC247", letterSpacing: "0.08em" }}
            >
              Contact Us
            </h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <Phone
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "#FF8A00" }}
                />
                <div
                  className="space-y-1 text-sm"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  {phones.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: "#FF8A00" }}
                />
                <a
                  href={`mailto:${emailAddress}`}
                  className="footer-nav-link text-sm"
                  data-ocid="footer.email_link"
                >
                  {emailAddress}
                </a>
              </div>
              <div className="space-y-3 pt-2">
                {branches.map((branch) => (
                  <div key={branch.name} className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "#FF8A00" }}
                    />
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#ffffff" }}
                      >
                        {branch.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.60)" }}
                      >
                        {branch.address}
                      </p>
                      {branch.phone && (
                        <p
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.60)" }}
                        >
                          {branch.phone}
                        </p>
                      )}
                      {branch.email && (
                        <p
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.60)" }}
                        >
                          {branch.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div
          className="mt-10 rounded-2xl p-6 md:p-8"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h4
                className="font-display text-lg font-semibold"
                style={{ color: "#ffffff" }}
              >
                Subscribe to Our Newsletter
              </h4>
              <p
                className="mt-1 text-sm"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Get the latest updates on visa policies, scholarships, and study
                abroad opportunities.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full gap-2 md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 md:w-64"
                style={{
                  background: "rgba(6,15,30,0.70)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#ffffff",
                }}
                required
                data-ocid="footer.newsletter_input"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #FF8A00 0%, #FFC247 100%)",
                  boxShadow: "0 4px 16px rgba(255,138,0,0.40)",
                }}
                data-ocid="footer.newsletter_submit_button"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <p
            className="text-center text-sm sm:text-left"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {copyrightText}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="footer-nav-link text-sm"
              data-ocid="footer.bottom.privacy"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="footer-nav-link text-sm"
              data-ocid="footer.bottom.terms"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
        aria-label="Chat on WhatsApp"
        data-ocid="whatsapp.floating_button"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </footer>
  );
}
