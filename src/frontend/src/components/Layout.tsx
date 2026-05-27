import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { useWebsiteTheme } from "@/hooks/useBackendContent";
import { Menu, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "./Breadcrumb";
import { Footer } from "./Footer";
import { MegaMenu } from "./MegaMenu";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: websiteTheme } = useWebsiteTheme();

  useEffect(() => {
    if (websiteTheme) {
      document.documentElement.style.setProperty(
        "--color-primary",
        websiteTheme.primaryColor ?? "#0B1F3A",
      );
      document.documentElement.style.setProperty(
        "--color-secondary",
        websiteTheme.secondaryColor ?? "#FF8A00",
      );
      document.documentElement.style.setProperty(
        "--color-accent",
        websiteTheme.accentColor ?? "#FFC247",
      );
      document.documentElement.style.setProperty(
        "--color-heading-text",
        websiteTheme.headingTextColor ?? "#0B1F3A",
      );
      document.documentElement.style.setProperty(
        "--color-body-text",
        websiteTheme.bodyTextColor ?? "#333333",
      );
      document.documentElement.style.setProperty(
        "--color-button",
        websiteTheme.buttonColor ?? "#FF8A00",
      );
      document.documentElement.style.setProperty(
        "--color-button-text",
        websiteTheme.buttonTextColor ?? "#FFFFFF",
      );
      document.documentElement.style.setProperty(
        "--color-background",
        websiteTheme.backgroundColor ?? "#FFFFFF",
      );
      document.documentElement.style.setProperty(
        "--color-footer-bg",
        websiteTheme.footerBgColor ?? "#0B1F3A",
      );
      document.documentElement.style.setProperty(
        "--color-footer-text",
        websiteTheme.footerTextColor ?? "#FFFFFF",
      );
    }
  }, [websiteTheme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers scroll-to-top on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/50 bg-card/80 shadow-subtle backdrop-blur-xl"
            : "bg-transparent"
        }`}
        data-ocid="header"
      >
        {/* Top Bar */}
        <div
          className={`hidden border-b border-border/30 transition-all duration-300 lg:block ${
            scrolled
              ? "h-0 overflow-hidden opacity-0"
              : "h-auto py-2 opacity-100"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between px-4">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <a
                href="tel:+919090474777"
                className="flex items-center gap-1.5 hover:text-primary"
              >
                <Phone className="h-3 w-3" />
                +91-9090 4747 77
              </a>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Trusted since 2001</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/visa-checker"
                className="text-xs font-medium text-secondary hover:underline"
                data-ocid="header.top.visa_checker"
              >
                Visa Checker
              </Link>
              <Link
                to="/course-finder"
                className="text-xs font-medium text-secondary hover:underline"
                data-ocid="header.top.course_finder"
              >
                Course Finder
              </Link>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:py-4">
          {/* Logo */}
          <Link
            to="/"
            className="inline-flex items-center"
            data-ocid="header.logo"
          >
            <img
              src="/assets/valmiki-group-logo.png"
              alt="Valmiki Group"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <MegaMenu
            isMobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card lg:hidden"
              aria-label="Open menu"
              data-ocid="header.mobile_menu_button"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header — accounts for top bar + main nav */}
      <div className="h-[72px] lg:h-[104px]" />

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp floating widget — not shown in admin */}
      <WhatsAppWidget />
    </div>
  );
}
