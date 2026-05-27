import { createActor } from "@/backend";
import type { AdminDashboardStats } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Clock,
  Globe,
  LayoutDashboard,
  MessageSquareQuote,
  Phone,
  TrendingUp,
  Type,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const quickActions = [
  {
    label: "Hero Content",
    href: "/admin/hero",
    icon: Type,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Briefcase,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Countries",
    href: "/admin/countries",
    icon: Globe,
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "Events",
    href: "/admin/events",
    icon: CalendarDays,
    color: "bg-rose-500/10 text-rose-600",
  },
  {
    label: "Team",
    href: "/admin/team",
    icon: Users,
    color: "bg-cyan-500/10 text-cyan-600",
  },
  {
    label: "Contact Info",
    href: "/admin/contact-info",
    icon: Phone,
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: ClipboardList,
    color: "bg-indigo-500/10 text-indigo-600",
  },
];

export default function AdminDashboard() {
  const { actor } = useActor(createActor);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAdminDashboardStats()
      .then((s) => {
        setStats(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-display text-xl font-bold text-foreground lg:text-2xl">
          Welcome, Admin
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF8A00]/10">
              <TrendingUp className="h-5 w-5 text-[#FF8A00]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {loading
                  ? "—"
                  : stats
                    ? Number(stats.totalLeads).toLocaleString()
                    : "0"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFC247]/10">
              <Clock className="h-5 w-5 text-[#FFC247]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {loading
                  ? "—"
                  : stats
                    ? Number(stats.thisMonth).toLocaleString()
                    : "0"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-subtle sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {loading
                  ? "—"
                  : stats
                    ? Number(stats.pending).toLocaleString()
                    : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="mb-3 font-display text-base font-semibold text-foreground">
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              to={action.href}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-subtle transition-all hover:shadow-md"
              data-ocid={`admin.dashboard.${action.label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
