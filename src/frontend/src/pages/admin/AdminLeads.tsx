import { createActor } from "@/backend";
import type {
  ContactSubmission,
  CounselingBooking,
  DemoClassBooking,
  ImmigrationConsultation,
  NewsletterSubscription,
  VisaEligibilityResult,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Download, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type LeadType =
  | "all"
  | "counseling"
  | "contact"
  | "newsletter"
  | "demo"
  | "immigration"
  | "visa";

interface UnifiedLead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone: string;
  date: string;
  details: string;
}

const tabs: { key: LeadType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "counseling", label: "Counseling" },
  { key: "contact", label: "Contact" },
  { key: "newsletter", label: "Newsletter" },
  { key: "demo", label: "Demo Class" },
  { key: "immigration", label: "Immigration" },
  { key: "visa", label: "Visa Eligibility" },
];

function formatDate(ts: bigint): string {
  try {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN");
  } catch {
    return String(ts);
  }
}

export default function AdminLeads() {
  const { actor } = useActor(createActor);
  const [activeTab, setActiveTab] = useState<LeadType>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<UnifiedLead[]>([]);

  useEffect(() => {
    if (!actor) return;
    Promise.all([
      actor.getCounselingBookings(),
      actor.getContactSubmissions(),
      actor.getNewsletterSubscriptions(),
      actor.getDemoClassBookings(),
      actor.getImmigrationConsultations(),
      actor.getVisaEligibilityResults(),
    ])
      .then(([counseling, contact, newsletter, demo, immigration, visa]) => {
        const all: UnifiedLead[] = [];
        for (const c of counseling) {
          all.push({
            id: String(c.id),
            type: "counseling",
            name: c.name,
            email: c.email,
            phone: c.phone,
            date: formatDate(c.timestamp),
            details: `${c.educationLevel} | ${c.countryInterests.join(", ")} | ${c.preferredTime}`,
          });
        }
        for (const c of contact) {
          all.push({
            id: String(c.id),
            type: "contact",
            name: c.name,
            email: c.email,
            phone: c.phone,
            date: formatDate(c.timestamp),
            details: `${c.inquiryType} | ${c.message.slice(0, 60)}`,
          });
        }
        for (const n of newsletter) {
          all.push({
            id: String(n.id),
            type: "newsletter",
            name: "—",
            email: n.email,
            phone: "—",
            date: formatDate(n.timestamp),
            details: "Newsletter subscription",
          });
        }
        for (const d of demo) {
          all.push({
            id: String(d.id),
            type: "demo",
            name: d.name,
            email: d.email,
            phone: d.phone,
            date: formatDate(d.timestamp),
            details: `${d.testType} | ${d.preferredTime}`,
          });
        }
        for (const i of immigration) {
          all.push({
            id: String(i.id),
            type: "immigration",
            name: i.name,
            email: i.email,
            phone: i.phone,
            date: formatDate(i.timestamp),
            details: `${i.visaType} | ${i.country} | ${i.preferredTime}`,
          });
        }
        for (const v of visa) {
          all.push({
            id: String(v.id),
            type: "visa",
            name: "—",
            email: "—",
            phone: "—",
            date: formatDate(v.timestamp),
            details: `${v.country} | ${v.visaType} | ${v.resultPercentage}%`,
          });
        }
        setLeads(all.sort((a, b) => b.date.localeCompare(a.date)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const filtered = useMemo(() => {
    let list =
      activeTab === "all" ? leads : leads.filter((l) => l.type === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q),
      );
    }
    return list;
  }, [leads, activeTab, search]);

  const countFor = (type: LeadType) =>
    type === "all" ? leads.length : leads.filter((l) => l.type === type).length;

  const exportCSV = () => {
    const headers = ["Type", "Name", "Email", "Phone", "Date", "Details"];
    const rows = filtered.map((l) => [
      l.type,
      l.name,
      l.email,
      l.phone,
      l.date,
      l.details,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `valmiki-leads-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Leads Management
        </h2>
        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm hover:bg-muted"
          data-ocid="admin.leads.export_button"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === t.key
                ? "bg-[#FF8A00] text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-ocid={`admin.leads.tab.${t.key}`}
          >
            {t.label} ({countFor(t.key)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
          data-ocid="admin.leads.search_input"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-subtle">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((l, idx) => (
              <tr
                key={`${l.type}-${l.id}-${idx}`}
                className="hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                    {l.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {l.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.date}</td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                  {l.details}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
