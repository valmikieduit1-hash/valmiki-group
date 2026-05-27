import { ChevronDown, Globe, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ── Country data for Foreign Education mega dropdown ── */
const countryItems = [
  {
    label: "Study in USA",
    flagSrc: "https://flagcdn.com/w40/us.png",
    flagAlt: "USA flag",
    href: "/countries/usa",
  },
  {
    label: "Study in UK",
    flagSrc: "https://flagcdn.com/w40/gb.png",
    flagAlt: "UK flag",
    href: "/countries/uk",
  },
  {
    label: "Study in Canada",
    flagSrc: "https://flagcdn.com/w40/ca.png",
    flagAlt: "Canada flag",
    href: "/countries/canada",
  },
  {
    label: "Study in Europe",
    flagSrc: "https://flagcdn.com/w40/eu.png",
    flagAlt: "Europe flag",
    href: "/countries/europe",
  },
  {
    label: "Study in France",
    flagSrc: "https://flagcdn.com/w40/fr.png",
    flagAlt: "France flag",
    href: "/countries/france",
  },
  {
    label: "Study in Australia",
    flagSrc: "https://flagcdn.com/w40/au.png",
    flagAlt: "Australia flag",
    href: "/countries/australia",
  },
  {
    label: "Study in Ireland",
    flagSrc: "https://flagcdn.com/w40/ie.png",
    flagAlt: "Ireland flag",
    href: "/countries/ireland",
  },
  {
    label: "Study in Dubai",
    flagSrc: "https://flagcdn.com/w40/ae.png",
    flagAlt: "UAE flag",
    href: "/countries/dubai",
  },
  {
    label: "Study in Singapore",
    flagSrc: "https://flagcdn.com/w40/sg.png",
    flagAlt: "Singapore flag",
    href: "/countries/singapore",
  },
  {
    label: "Study in New Zealand",
    flagSrc: "https://flagcdn.com/w40/nz.png",
    flagAlt: "New Zealand flag",
    href: "/countries/new-zealand",
  },
  {
    label: "Study in Germany",
    flagSrc: "https://flagcdn.com/w40/de.png",
    flagAlt: "Germany flag",
    href: "/countries/germany",
  },
];

/* ── Test prep data for Smart Learning mega dropdown ── */
const testPrepItems = [
  {
    label: "IELTS",
    href: "/test-preparation/ielts",
    color: "#e74c3c",
    bg: "#fdf2f2",
  },
  {
    label: "GMAT",
    href: "/test-preparation/gmat",
    color: "#8e44ad",
    bg: "#f5eef8",
  },
  {
    label: "PTE",
    href: "/test-preparation/pte",
    color: "#2980b9",
    bg: "#eaf2f8",
  },
  {
    label: "CELPIP",
    href: "/test-preparation/celpip",
    color: "#16a085",
    bg: "#e8f8f5",
  },
  {
    label: "GRE",
    href: "/test-preparation/gre",
    color: "#2c3e50",
    bg: "#f4f6f7",
  },
  {
    label: "TOEFL",
    href: "/test-preparation/toefl",
    color: "#2980b9",
    bg: "#eaf2f8",
  },
  {
    label: "Digital SAT",
    href: "/test-preparation/digital-sat",
    color: "#c0392b",
    bg: "#fdf2f2",
  },
];

/* ── Simple dropdown data ── */
const otherServices = [
  { label: "Education Loans", href: "/services/education-loans" },
  { label: "Scholarship Guidance", href: "/services/scholarships-guidance" },
  { label: "SOP & Documentation", href: "/services/sop-documentation" },
  {
    label: "Pre-Departure Assistance",
    href: "/services/pre-departure-assistance",
  },
  { label: "Career Counseling", href: "/services/career-counseling" },
  { label: "Visa Assistance", href: "/services/student-visa-assistance" },
  { label: "Valmiki Foundation", href: "/services/valmiki-foundation" },
  { label: "Tours & Travel", href: "/services/tours-and-travel" },
];

const eventsLinks = [
  { label: "Upcoming Events", href: "/events" },
  { label: "Education Fairs", href: "/events#fairs" },
  { label: "University Webinars", href: "/events#webinars" },
  { label: "Spot Assessments", href: "/events#assessments" },
];

const aboutLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Leadership", href: "/our-leadership" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Life@Valmiki", href: "/lifevalmiki" },
  { label: "Be Our Partner", href: "/be-our-partner" },
];

/* ── Main nav definition ── */
const mainNav = [
  {
    label: "Foreign Education",
    href: "/countries",
    hasDropdown: true,
    dropdownType: "foreign-education" as const,
  },
  {
    label: "Smart Learning",
    href: "/test-preparation",
    hasDropdown: true,
    dropdownType: "smart-learning" as const,
  },
  { label: "Immigration", href: "/immigration", hasDropdown: false },
  {
    label: "Other Services",
    href: "/services",
    hasDropdown: true,
    dropdownType: "other-services" as const,
  },
  {
    label: "Events",
    href: "/events",
    hasDropdown: true,
    dropdownType: "events" as const,
  },
  {
    label: "About",
    href: "/about",
    hasDropdown: true,
    dropdownType: "about" as const,
  },
  { label: "Blogs", href: "/blog", hasDropdown: false },
];

interface MegaMenuProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function MegaMenu({ isMobileOpen, onMobileClose }: MegaMenuProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (type: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(type);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const toggleMobileSection = (type: string) => {
    setMobileExpanded((prev) => (prev === type ? null : type));
  };

  return (
    <>
      {/* ── Desktop Mega Menu ── */}
      <div
        className="hidden items-center gap-0.5 lg:flex xl:gap-1"
        ref={dropdownRef}
      >
        {mainNav.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() =>
              item.hasDropdown && handleMouseEnter(item.dropdownType!)
            }
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={item.href}
              className="flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-medium text-[#1a1a2e] transition-colors hover:text-[#ff8a00] xl:px-3"
              data-ocid={`nav.link.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {item.label}
              {item.hasDropdown && (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Link>

            {/* ── Foreign Education Mega Dropdown ── */}
            {item.dropdownType === "foreign-education" &&
              activeDropdown === "foreign-education" && (
                <div
                  className="absolute left-1/2 top-full z-[60] mt-2 w-[560px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-5 shadow-xl"
                  onMouseEnter={() => handleMouseEnter("foreign-education")}
                  onMouseLeave={handleMouseLeave}
                  data-ocid="nav.dropdown.foreign_education"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Globe className="h-5 w-5 text-[#0b1f3a]" />
                    <h3 className="font-[Poppins] text-base font-semibold text-[#0b1f3a]">
                      Study Destinations
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {countryItems.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#0b1f3a] hover:text-white"
                        data-ocid={`nav.dropdown.country.${c.label
                          .toLowerCase()
                          .replace(/\s+/g, "_")
                          .replace(/study_in_/g, "")}`}
                      >
                        <img
                          src={c.flagSrc}
                          alt={c.flagAlt}
                          className="h-5 w-8 shrink-0 rounded-sm object-cover shadow-sm"
                          loading="lazy"
                        />
                        <span className="font-[Poppins] text-sm">
                          {c.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* ── Smart Learning Mega Dropdown ── */}
            {item.dropdownType === "smart-learning" &&
              activeDropdown === "smart-learning" && (
                <div
                  className="absolute left-1/2 top-full z-[60] mt-2 w-[520px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white p-5 shadow-xl"
                  onMouseEnter={() => handleMouseEnter("smart-learning")}
                  onMouseLeave={handleMouseLeave}
                  data-ocid="nav.dropdown.smart_learning"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Pencil className="h-5 w-5 text-[#0b1f3a]" />
                    <h3 className="font-[Poppins] text-base font-semibold text-[#0b1f3a]">
                      Test Preparation
                    </h3>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {testPrepItems.map((t) => (
                      <Link
                        key={t.label}
                        to={t.href}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white px-3 py-4 text-center shadow-sm transition-all hover:shadow-md"
                        style={{ backgroundColor: t.bg }}
                        data-ocid={`nav.dropdown.testprep.${t.label.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        <span
                          className="font-[Poppins] text-lg font-bold"
                          style={{ color: t.color }}
                        >
                          {t.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* ── Other Services Dropdown ── */}
            {item.dropdownType === "other-services" &&
              activeDropdown === "other-services" && (
                <div
                  className="absolute left-1/2 top-full z-[60] mt-2 w-64 -translate-x-1/2 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                  onMouseEnter={() => handleMouseEnter("other-services")}
                  onMouseLeave={handleMouseLeave}
                  data-ocid="nav.dropdown.other_services"
                >
                  {otherServices.map((s) => (
                    <Link
                      key={s.label}
                      to={s.href}
                      className="block px-4 py-2.5 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#0b1f3a] hover:text-white"
                      data-ocid={`nav.dropdown.service.${s.label.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "and")}`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}

            {/* ── Events Dropdown ── */}
            {item.dropdownType === "events" && activeDropdown === "events" && (
              <div
                className="absolute left-1/2 top-full z-[60] mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                onMouseEnter={() => handleMouseEnter("events")}
                onMouseLeave={handleMouseLeave}
                data-ocid="nav.dropdown.events"
              >
                {eventsLinks.map((e) => (
                  <Link
                    key={e.label}
                    to={e.href}
                    className="block px-4 py-2.5 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#0b1f3a] hover:text-white"
                    data-ocid={`nav.dropdown.event.${e.label.toLowerCase().replace(/\s+/g, "_")}`}
                  >
                    {e.label}
                  </Link>
                ))}
              </div>
            )}

            {/* ── About Dropdown ── */}
            {item.dropdownType === "about" && activeDropdown === "about" && (
              <div
                className="absolute left-1/2 top-full z-[60] mt-2 w-56 -translate-x-1/2 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
                onMouseEnter={() => handleMouseEnter("about")}
                onMouseLeave={handleMouseLeave}
                data-ocid="nav.dropdown.about"
              >
                {aboutLinks.map((a) => (
                  <Link
                    key={a.label}
                    to={a.href}
                    className="block px-4 py-2.5 text-sm font-medium text-[#1a1a2e] transition-colors hover:bg-[#0b1f3a] hover:text-white"
                    data-ocid={`nav.dropdown.about.${a.label.toLowerCase().replace(/\s+/g, "_").replace(/@/g, "at")}`}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Register Now CTA */}
        <Link
          to="/free-counseling"
          className="ml-2 inline-flex items-center rounded-full bg-[#C0392B] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 xl:ml-3"
          style={{ fontFamily: "Poppins, sans-serif" }}
          data-ocid="nav.register_now.button"
        >
          Register Now
        </Link>
      </div>

      {/* ── Mobile Menu ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" data-ocid="mobile.menu">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
            onKeyDown={(e) => e.key === "Escape" && onMobileClose()}
            role="button"
            tabIndex={0}
          />
          <div className="absolute right-0 top-0 h-full w-[320px] overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <span className="font-[Poppins] text-lg font-bold text-[#0b1f3a]">
                Menu
              </span>
              <button
                type="button"
                onClick={onMobileClose}
                className="rounded-md p-2 hover:bg-gray-100"
                aria-label="Close menu"
                data-ocid="mobile.menu.close_button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4">
              {/* Foreign Education */}
              <div className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("foreign-education")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                  data-ocid="mobile.nav.section.foreign_education"
                >
                  Foreign Education
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileExpanded === "foreign-education" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded === "foreign-education" && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                    {countryItems.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        onClick={onMobileClose}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                        data-ocid={`mobile.nav.country.${c.label
                          .toLowerCase()
                          .replace(/\s+/g, "_")
                          .replace(/study_in_/g, "")}`}
                      >
                        <img
                          src={c.flagSrc}
                          alt={c.flagAlt}
                          className="h-4 w-6 shrink-0 rounded-sm object-cover"
                          loading="lazy"
                        />
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Smart Learning */}
              <div className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("smart-learning")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                  data-ocid="mobile.nav.section.smart_learning"
                >
                  Smart Learning
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileExpanded === "smart-learning" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded === "smart-learning" && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                    {testPrepItems.map((t) => (
                      <Link
                        key={t.label}
                        to={t.href}
                        onClick={onMobileClose}
                        className="block rounded-md px-3 py-2 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                        style={{ color: t.color }}
                        data-ocid={`mobile.nav.testprep.${t.label.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        {t.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Immigration */}
              <Link
                to="/immigration"
                onClick={onMobileClose}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                data-ocid="mobile.nav.link.immigration"
              >
                Immigration
              </Link>

              {/* Other Services */}
              <div className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("other-services")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                  data-ocid="mobile.nav.section.other_services"
                >
                  Other Services
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileExpanded === "other-services" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded === "other-services" && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                    {otherServices.map((s) => (
                      <Link
                        key={s.label}
                        to={s.href}
                        onClick={onMobileClose}
                        className="block rounded-md px-3 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                        data-ocid={`mobile.nav.service.${s.label.toLowerCase().replace(/\s+/g, "_").replace(/&/g, "and")}`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Events */}
              <div className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("events")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                  data-ocid="mobile.nav.section.events"
                >
                  Events
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileExpanded === "events" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded === "events" && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                    {eventsLinks.map((e) => (
                      <Link
                        key={e.label}
                        to={e.href}
                        onClick={onMobileClose}
                        className="block rounded-md px-3 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                        data-ocid={`mobile.nav.event.${e.label.toLowerCase().replace(/\s+/g, "_")}`}
                      >
                        {e.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* About */}
              <div className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("about")}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                  data-ocid="mobile.nav.section.about"
                >
                  About
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileExpanded === "about" ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileExpanded === "about" && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-100 pl-3">
                    {aboutLinks.map((a) => (
                      <Link
                        key={a.label}
                        to={a.href}
                        onClick={onMobileClose}
                        className="block rounded-md px-3 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                        data-ocid={`mobile.nav.about.${a.label.toLowerCase().replace(/\s+/g, "_").replace(/@/g, "at")}`}
                      >
                        {a.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Blogs */}
              <Link
                to="/blog"
                onClick={onMobileClose}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-[#1a1a2e] hover:bg-gray-50"
                data-ocid="mobile.nav.link.blogs"
              >
                Blogs
              </Link>

              {/* Register Now */}
              <div className="mt-4 px-4">
                <Link
                  to="/free-counseling"
                  onClick={onMobileClose}
                  className="block w-full rounded-full bg-[#C0392B] px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-red-700"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  data-ocid="mobile.nav.register_now.button"
                >
                  Register Now
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
