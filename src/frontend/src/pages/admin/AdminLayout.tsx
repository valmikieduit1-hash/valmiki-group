import {
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  FileText,
  FolderOpen,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Home,
  Image,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  MapPin,
  Menu,
  MessageSquareQuote,
  Palette,
  Phone,
  Plane,
  Type,
  University,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const homePageGroup = {
  label: "Home Page",
  icon: Home,
  children: [
    { label: "Hero Content", href: "/admin/hero", icon: Type },
    { label: "Stats / Counters", href: "/admin/stats", icon: BarChart3 },
    {
      label: "Home Sections",
      href: "/admin/home-sections",
      icon: LayoutDashboard,
    },
  ],
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Life@Valmiki", href: "/admin/life-valmiki", icon: Heart },
  {
    label: "Free Counseling",
    href: "/admin/free-counseling",
    icon: Headphones,
  },
  { label: "Page Heroes", href: "/admin/page-heroes", icon: LayoutTemplate },
  { label: "Website Theme", href: "/admin/theme", icon: Palette },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Service Pages", href: "/admin/service-pages", icon: Layers },
  {
    label: "Study Abroad Accommodation",
    href: "/admin/accommodation",
    icon: Home,
  },
  { label: "Countries", href: "/admin/countries", icon: Globe },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Contact Info", href: "/admin/contact-info", icon: Phone },
  { label: "Leads", href: "/admin/leads", icon: ClipboardList },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Test Preparation", href: "/admin/test-prep", icon: BookOpen },
  { label: "Immigration", href: "/admin/immigration", icon: Plane },
  { label: "About Page", href: "/admin/about", icon: Building2 },
  { label: "Be Our Partner", href: "/admin/be-our-partner", icon: Handshake },
  { label: "Study Abroad", href: "/admin/study-abroad", icon: GraduationCap },
  {
    label: "Partner Universities",
    href: "/admin/partner-universities",
    icon: University,
  },
  { label: "Country Pages", href: "/admin/country-detail", icon: MapPin },
  { label: "Gallery", href: "/admin/gallery", icon: Image },
  { label: "Jobs & Applications", href: "/admin/jobs", icon: FolderOpen },
  { label: "Footer Editor", href: "/admin/footer", icon: LayoutTemplate },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const isHomePageGroupActive = homePageGroup.children.some(
    (c) => location.pathname === c.href,
  );
  const [homeGroupOpen, setHomeGroupOpen] = useState(isHomePageGroupActive);

  useEffect(() => {
    const token = localStorage.getItem("valmikiAdminToken");
    if (!token) {
      navigate("/admin/login");
    }
    setChecking(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("valmikiAdminToken");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setSidebarOpen(false);
          }}
          role="button"
          tabIndex={0}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-[#0B1F3A] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC247]/20">
                <GraduationCap className="h-5 w-5 text-[#FFC247]" />
              </div>
              <div>
                <span className="font-display text-sm font-bold text-white">
                  Valmiki Group
                </span>
                <p className="text-[10px] text-white/50">Admin Panel</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-white/60 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {/* Dashboard (always first) */}
              {(() => {
                const item = navItems[0];
                const active = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#FF8A00]/15 text-[#FF8A00]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                      data-ocid="admin.nav.dashboard"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })()}

              {/* Home Page expandable group */}
              <li>
                <button
                  type="button"
                  onClick={() => setHomeGroupOpen((o) => !o)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isHomePageGroupActive
                      ? "bg-[#FF8A00]/15 text-[#FF8A00]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                  data-ocid="admin.nav.home_page_group"
                >
                  <homePageGroup.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">
                    {homePageGroup.label}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                      homeGroupOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {homeGroupOpen && (
                  <ul className="mt-0.5 space-y-0.5 pl-3">
                    {homePageGroup.children.map((child) => {
                      const childActive = location.pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              childActive
                                ? "bg-[#FF8A00]/15 text-[#FF8A00]"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                            data-ocid={`admin.nav.${child.label.toLowerCase().replace(/\s+/g, "_")}`}
                          >
                            <child.icon className="h-3.5 w-3.5 shrink-0" />
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>

              {/* Rest of nav items (skip index 0 = Dashboard) */}
              {navItems.slice(1).map((item) => {
                const active = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#FF8A00]/15 text-[#FF8A00]"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                      data-ocid={`admin.nav.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              data-ocid="admin.nav.logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-xl lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background lg:hidden"
              aria-label="Open sidebar"
              data-ocid="admin.sidebar.toggle"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-base font-semibold text-foreground lg:text-lg">
              Valmiki Group Admin
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Welcome, Admin
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
              data-ocid="admin.topbar.logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
