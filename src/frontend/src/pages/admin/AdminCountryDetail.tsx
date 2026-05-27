import { createActor } from "@/backend";
import type {
  CostBreakdown,
  CountryDetailContent,
  CountryUniversity,
  FAQ,
  VisaStep,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

const COUNTRIES = [
  { label: "USA", slug: "usa" },
  { label: "Canada", slug: "canada" },
  { label: "UK", slug: "uk" },
  { label: "Australia", slug: "australia" },
  { label: "Germany", slug: "germany" },
  { label: "Ireland", slug: "ireland" },
  { label: "New Zealand", slug: "new-zealand" },
  { label: "Dubai", slug: "dubai" },
  { label: "Singapore", slug: "singapore" },
  { label: "Europe", slug: "europe" },
];

const defaultCost: CostBreakdown = {
  accommodation: "",
  food: "",
  transport: "",
  miscellaneous: "",
  totalMonthly: "",
};

const makeDefault = (
  slug: string,
): CountryDetailContent & { visaSuccessRate: string } => ({
  countrySlug: slug,
  heroTitle: "",
  heroSubtitle: "",
  heroImageUrl: "",
  whyStudyHere: "",
  universities: [],
  visaProcess: [],
  costOfLiving: { ...defaultCost },
  scholarships: [],
  popularCourses: [],
  workRights: "",
  prOpportunities: "",
  faqs: [],
  visaSuccessRate: "",
});

// Generic text-array section
function TextArraySection({
  label,
  items,
  onChange,
  ocidPrefix,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  ocidPrefix: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="text-array-input"
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1 rounded-md bg-[#0B1F3A] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
          data-ocid={`${ocidPrefix}.add_button`}
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={`${ocidPrefix}-${i}-${item.slice(0, 8)}`}
          className="flex gap-2"
        >
          <input
            id={i === 0 ? "text-array-input" : undefined}
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
            data-ocid={`${ocidPrefix}.input.${i + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="rounded-lg border border-border px-2 text-red-500 hover:bg-red-50"
            aria-label="Remove"
            data-ocid={`${ocidPrefix}.remove_button.${i + 1}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminCountryDetail() {
  const { actor } = useActor(createActor);
  const [allContent, setAllContent] = useState<
    Record<string, CountryDetailContent>
  >({});
  const [selectedSlug, setSelectedSlug] = useState("usa");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  // Section expand state
  const [expandedSection, setExpandedSection] = useState<string>("hero");

  // Inline form state for complex sub-items
  const [uniForm, setUniForm] = useState<Omit<CountryUniversity, "id">>({
    name: "",
    ranking: "",
    tuition: "",
    website: "",
    logoUrl: "",
  });
  const [editUniId, setEditUniId] = useState<bigint | null>(null);
  const [showUniForm, setShowUniForm] = useState(false);

  const [visaForm, setVisaForm] = useState<Omit<VisaStep, "id">>({
    order: BigInt(1),
    title: "",
    description: "",
  });
  const [editVisaId, setEditVisaId] = useState<bigint | null>(null);
  const [showVisaForm, setShowVisaForm] = useState(false);

  const [faqForm, setFaqForm] = useState<Omit<FAQ, "id">>({
    question: "",
    answer: "",
    order: BigInt(1),
  });
  const [editFaqId, setEditFaqId] = useState<bigint | null>(null);
  const [showFaqForm, setShowFaqForm] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getCountryDetailAll()
      .then((list) => {
        const map: Record<string, CountryDetailContent> = {};
        for (const item of list) map[item.countrySlug] = item;
        setAllContent(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const current = allContent[selectedSlug] ?? makeDefault(selectedSlug);

  const updateCurrent = (patch: Partial<CountryDetailContent>) => {
    setAllContent((prev) => ({
      ...prev,
      [selectedSlug]: { ...current, ...patch },
    }));
  };

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateCountryDetailBySlug(token, current);
      if (result.__kind__ === "ok") {
        queryClient.invalidateQueries({ queryKey: ["countries"] });
        queryClient.invalidateQueries({ queryKey: ["countryDetail"] });
        queryClient.invalidateQueries({ queryKey: ["country"] });
        toast.success(`${selectedSlug.toUpperCase()} saved!`);
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? "" : section));

  const SectionHeader = ({ id, title }: { id: string; title: string }) => (
    <button
      type="button"
      onClick={() => toggle(id)}
      className="flex w-full items-center justify-between rounded-lg bg-[#0B1F3A]/5 px-4 py-3 text-sm font-semibold text-foreground hover:bg-[#0B1F3A]/10"
      data-ocid={`admin.country.section.${id}`}
    >
      {title}
      <ChevronDown
        className={`h-4 w-4 transition-transform ${expandedSection === id ? "rotate-180" : ""}`}
      />
    </button>
  );

  // University helpers
  const openAddUni = () => {
    setEditUniId(null);
    setUniForm({
      name: "",
      ranking: "",
      tuition: "",
      website: "",
      logoUrl: "",
    });
    setShowUniForm(true);
  };
  const openEditUni = (u: CountryUniversity) => {
    setEditUniId(u.id);
    setUniForm({
      name: u.name,
      ranking: u.ranking,
      tuition: u.tuition,
      website: u.website,
      logoUrl: u.logoUrl,
    });
    setShowUniForm(true);
  };
  const saveUni = () => {
    if (!uniForm.name.trim()) {
      toast.error("Name required");
      return;
    }
    if (editUniId !== null) {
      updateCurrent({
        universities: current.universities.map((u) =>
          u.id === editUniId ? { ...u, ...uniForm } : u,
        ),
      });
    } else {
      const nu: CountryUniversity = { id: BigInt(Date.now()), ...uniForm };
      updateCurrent({ universities: [...current.universities, nu] });
    }
    setShowUniForm(false);
  };
  const deleteUni = (id: bigint) =>
    updateCurrent({
      universities: current.universities.filter((u) => u.id !== id),
    });

  // Visa step helpers
  const openAddVisa = () => {
    setEditVisaId(null);
    setVisaForm({
      order: BigInt(current.visaProcess.length + 1),
      title: "",
      description: "",
    });
    setShowVisaForm(true);
  };
  const openEditVisa = (v: VisaStep) => {
    setEditVisaId(v.id);
    setVisaForm({ order: v.order, title: v.title, description: v.description });
    setShowVisaForm(true);
  };
  const saveVisa = () => {
    if (!visaForm.title.trim()) {
      toast.error("Title required");
      return;
    }
    if (editVisaId !== null) {
      updateCurrent({
        visaProcess: current.visaProcess.map((v) =>
          v.id === editVisaId ? { ...v, ...visaForm } : v,
        ),
      });
    } else {
      const nv: VisaStep = { id: BigInt(Date.now()), ...visaForm };
      updateCurrent({ visaProcess: [...current.visaProcess, nv] });
    }
    setShowVisaForm(false);
  };
  const deleteVisa = (id: bigint) =>
    updateCurrent({
      visaProcess: current.visaProcess.filter((v) => v.id !== id),
    });

  // FAQ helpers
  const openAddFaq = () => {
    setEditFaqId(null);
    setFaqForm({
      question: "",
      answer: "",
      order: BigInt(current.faqs.length + 1),
    });
    setShowFaqForm(true);
  };
  const openEditFaq = (f: FAQ) => {
    setEditFaqId(f.id);
    setFaqForm({ question: f.question, answer: f.answer, order: f.order });
    setShowFaqForm(true);
  };
  const saveFaq = () => {
    if (!faqForm.question.trim()) {
      toast.error("Question required");
      return;
    }
    if (editFaqId !== null) {
      updateCurrent({
        faqs: current.faqs.map((f) =>
          f.id === editFaqId ? { ...f, ...faqForm } : f,
        ),
      });
    } else {
      const nf: FAQ = { id: BigInt(Date.now()), ...faqForm };
      updateCurrent({ faqs: [...current.faqs, nf] });
    }
    setShowFaqForm(false);
  };
  const deleteFaq = (id: bigint) =>
    updateCurrent({ faqs: current.faqs.filter((f) => f.id !== id) });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin.country.page">
      {/* Header + Save */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-foreground">
          Country Detail Editor
        </h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.country.save_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Country"}
        </button>
      </div>

      {/* Country Selector */}
      <div className="flex flex-wrap gap-2" data-ocid="admin.country.selector">
        {COUNTRIES.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => {
              setSelectedSlug(c.slug);
              setShowUniForm(false);
              setShowVisaForm(false);
              setShowFaqForm(false);
              setExpandedSection("hero");
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedSlug === c.slug
                ? "bg-[#FF8A00] text-white"
                : "border border-border bg-card text-muted-foreground hover:border-[#FF8A00]/50 hover:text-foreground"
            }`}
            data-ocid={`admin.country.tab.${c.slug}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Hero Section ────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader id="hero" title="Hero Section" />
        {expandedSection === "hero" && (
          <div className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`${selectedSlug}-visa-success`}
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Visa Success Rate (%)
                </label>
                <input
                  id={`${selectedSlug}-visa-success`}
                  type="text"
                  value={
                    (
                      current as CountryDetailContent & {
                        visaSuccessRate: string;
                      }
                    ).visaSuccessRate || ""
                  }
                  onChange={(e) =>
                    updateCurrent({
                      visaSuccessRate: e.target.value,
                    } as Partial<
                      CountryDetailContent & { visaSuccessRate: string }
                    >)
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  placeholder="e.g. 95%"
                  data-ocid="admin.country.visa_success_rate.input"
                />
              </div>
              <div>
                <label
                  htmlFor={`${selectedSlug}-hero-title`}
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Hero Title
                </label>
                <input
                  id={`${selectedSlug}-hero-title`}
                  type="text"
                  value={current.heroTitle}
                  onChange={(e) => updateCurrent({ heroTitle: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  placeholder="Study in USA"
                  data-ocid="admin.country.hero_title.input"
                />
              </div>
              <div>
                <label
                  htmlFor={`${selectedSlug}-hero-subtitle`}
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Hero Subtitle
                </label>
                <input
                  id={`${selectedSlug}-hero-subtitle`}
                  type="text"
                  value={current.heroSubtitle}
                  onChange={(e) =>
                    updateCurrent({ heroSubtitle: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  placeholder="Top universities, world-class education"
                  data-ocid="admin.country.hero_subtitle.input"
                />
              </div>
            </div>
            <div className="rounded-lg border border-[#FF8A00]/20 bg-[#FF8A00]/5 p-4">
              <ImageUpload
                label="Country Hero Background Image"
                value={current.heroImageUrl}
                onChange={(url) => updateCurrent({ heroImageUrl: url })}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Upload a high-resolution landscape photo (1600×900 recommended).
                If left empty, a default Unsplash photo will be used.
              </p>
            </div>
            <div>
              <label
                htmlFor={`${selectedSlug}-why-study`}
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Why Study Here
              </label>
              <textarea
                id={`${selectedSlug}-why-study`}
                rows={4}
                value={current.whyStudyHere}
                onChange={(e) =>
                  updateCurrent({ whyStudyHere: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                data-ocid="admin.country.why_study.textarea"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Universities ─────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader
          id="universities"
          title={`Universities (${current.universities.length})`}
        />
        {expandedSection === "universities" && (
          <div className="p-5 space-y-4">
            <button
              type="button"
              onClick={openAddUni}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
              data-ocid="admin.country.uni.add_button"
            >
              <Plus className="h-3.5 w-3.5" /> Add University
            </button>
            {showUniForm && (
              <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="uni-form-name"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Name *
                    </label>
                    <input
                      id="uni-form-name"
                      type="text"
                      value={uniForm.name}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.uni.name.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="uni-form-ranking"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Ranking
                    </label>
                    <input
                      id="uni-form-ranking"
                      type="text"
                      value={uniForm.ranking}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, ranking: e.target.value }))
                      }
                      placeholder="Top 50"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.uni.ranking.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="uni-form-tuition"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Tuition
                    </label>
                    <input
                      id="uni-form-tuition"
                      type="text"
                      value={uniForm.tuition}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, tuition: e.target.value }))
                      }
                      placeholder="$30,000/year"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.uni.tuition.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="uni-form-website"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Website
                    </label>
                    <input
                      id="uni-form-website"
                      type="url"
                      value={uniForm.website}
                      onChange={(e) =>
                        setUniForm((p) => ({ ...p, website: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.uni.website.input"
                    />
                  </div>
                </div>
                <ImageUpload
                  label="University Logo"
                  value={uniForm.logoUrl}
                  onChange={(url) =>
                    setUniForm((p) => ({ ...p, logoUrl: url }))
                  }
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveUni}
                    className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                    data-ocid="admin.country.uni.save_button"
                  >
                    {editUniId !== null ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUniForm(false)}
                    className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                    data-ocid="admin.country.uni.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {current.universities.length === 0 ? (
              <p
                className="text-sm text-muted-foreground"
                data-ocid="admin.country.uni.empty_state"
              >
                No universities yet.
              </p>
            ) : (
              <div className="space-y-2">
                {current.universities.map((u, i) => (
                  <div
                    key={String(u.id)}
                    className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                    data-ocid={`admin.country.uni.item.${i + 1}`}
                  >
                    {u.logoUrl && (
                      <img
                        src={u.logoUrl}
                        alt={u.name}
                        className="h-10 w-14 rounded object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {u.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {u.ranking} · {u.tuition}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => openEditUni(u)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        aria-label="Edit"
                        data-ocid={`admin.country.uni.edit_button.${i + 1}`}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUni(u.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50"
                        aria-label="Delete"
                        data-ocid={`admin.country.uni.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Visa Process ─────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader
          id="visa"
          title={`Visa Process (${current.visaProcess.length} steps)`}
        />
        {expandedSection === "visa" && (
          <div className="p-5 space-y-4">
            <button
              type="button"
              onClick={openAddVisa}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
              data-ocid="admin.country.visa.add_button"
            >
              <Plus className="h-3.5 w-3.5" /> Add Step
            </button>
            {showVisaForm && (
              <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="visa-step-order"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Order
                    </label>
                    <input
                      id="visa-step-order"
                      type="number"
                      value={Number(visaForm.order)}
                      onChange={(e) =>
                        setVisaForm((p) => ({
                          ...p,
                          order: BigInt(e.target.value || 1),
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.visa.order.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="visa-step-title"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Title *
                    </label>
                    <input
                      id="visa-step-title"
                      type="text"
                      value={visaForm.title}
                      onChange={(e) =>
                        setVisaForm((p) => ({ ...p, title: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.visa.title.input"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="visa-step-desc"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Description
                  </label>
                  <textarea
                    id="visa-step-desc"
                    rows={2}
                    value={visaForm.description}
                    onChange={(e) =>
                      setVisaForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid="admin.country.visa.description.textarea"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveVisa}
                    className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                    data-ocid="admin.country.visa.save_button"
                  >
                    {editVisaId !== null ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVisaForm(false)}
                    className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                    data-ocid="admin.country.visa.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {current.visaProcess.length === 0 ? (
              <p
                className="text-sm text-muted-foreground"
                data-ocid="admin.country.visa.empty_state"
              >
                No steps yet.
              </p>
            ) : (
              [...current.visaProcess]
                .sort((a, b) => Number(a.order) - Number(b.order))
                .map((v, i) => (
                  <div
                    key={String(v.id)}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                    data-ocid={`admin.country.visa.item.${i + 1}`}
                  >
                    <span className="shrink-0 rounded-md bg-[#0B1F3A]/10 px-2 py-0.5 text-xs font-bold text-[#0B1F3A]">
                      #{Number(v.order)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {v.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {v.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => openEditVisa(v)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted"
                        aria-label="Edit"
                        data-ocid={`admin.country.visa.edit_button.${i + 1}`}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteVisa(v.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50"
                        aria-label="Delete"
                        data-ocid={`admin.country.visa.delete_button.${i + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* ── Cost of Living ───────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader id="cost" title="Cost of Living" />
        {expandedSection === "cost" && (
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["accommodation", "Accommodation"],
                  ["food", "Food"],
                  ["transport", "Transport"],
                  ["miscellaneous", "Miscellaneous"],
                  ["totalMonthly", "Total Monthly"],
                ] as [keyof CostBreakdown, string][]
              ).map(([field, label]) => (
                <div key={field}>
                  <label
                    htmlFor={`cost-${field}`}
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    {label}
                  </label>
                  <input
                    id={`cost-${field}`}
                    type="text"
                    value={current.costOfLiving[field]}
                    onChange={(e) =>
                      updateCurrent({
                        costOfLiving: {
                          ...current.costOfLiving,
                          [field]: e.target.value,
                        },
                      })
                    }
                    placeholder="$500–800/month"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid={`admin.country.cost.${field}.input`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Scholarships ─────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader
          id="scholarships"
          title={`Scholarships (${current.scholarships.length})`}
        />
        {expandedSection === "scholarships" && (
          <div className="p-5">
            <TextArraySection
              label="Scholarships"
              items={current.scholarships}
              onChange={(items) => updateCurrent({ scholarships: items })}
              ocidPrefix="admin.country.scholarships"
            />
          </div>
        )}
      </div>

      {/* ── Popular Courses ──────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader
          id="courses"
          title={`Popular Courses (${current.popularCourses.length})`}
        />
        {expandedSection === "courses" && (
          <div className="p-5">
            <TextArraySection
              label="Popular Courses"
              items={current.popularCourses}
              onChange={(items) => updateCurrent({ popularCourses: items })}
              ocidPrefix="admin.country.courses"
            />
          </div>
        )}
      </div>

      {/* ── Work Rights & PR ─────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader id="workpr" title="Work Rights & PR Opportunities" />
        {expandedSection === "workpr" && (
          <div className="p-5 space-y-4">
            <div>
              <label
                htmlFor={`${selectedSlug}-work-rights`}
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Work Rights
              </label>
              <textarea
                id={`${selectedSlug}-work-rights`}
                rows={3}
                value={current.workRights}
                onChange={(e) => updateCurrent({ workRights: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                data-ocid="admin.country.work_rights.textarea"
              />
            </div>
            <div>
              <label
                htmlFor={`${selectedSlug}-pr-opps`}
                className="mb-1 block text-xs font-medium text-foreground"
              >
                PR Opportunities
              </label>
              <textarea
                id={`${selectedSlug}-pr-opps`}
                rows={3}
                value={current.prOpportunities}
                onChange={(e) =>
                  updateCurrent({ prOpportunities: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                data-ocid="admin.country.pr_opportunities.textarea"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── FAQs ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <SectionHeader id="faqs" title={`FAQs (${current.faqs.length})`} />
        {expandedSection === "faqs" && (
          <div className="p-5 space-y-4">
            <button
              type="button"
              onClick={openAddFaq}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
              data-ocid="admin.country.faq.add_button"
            >
              <Plus className="h-3.5 w-3.5" /> Add FAQ
            </button>
            {showFaqForm && (
              <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="faq-order"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Order
                    </label>
                    <input
                      id="faq-order"
                      type="number"
                      value={Number(faqForm.order)}
                      onChange={(e) =>
                        setFaqForm((p) => ({
                          ...p,
                          order: BigInt(e.target.value || 1),
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.country.faq.order.input"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="faq-question"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Question *
                  </label>
                  <input
                    id="faq-question"
                    type="text"
                    value={faqForm.question}
                    onChange={(e) =>
                      setFaqForm((p) => ({ ...p, question: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid="admin.country.faq.question.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="faq-answer"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Answer
                  </label>
                  <textarea
                    id="faq-answer"
                    rows={3}
                    value={faqForm.answer}
                    onChange={(e) =>
                      setFaqForm((p) => ({ ...p, answer: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid="admin.country.faq.answer.textarea"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveFaq}
                    className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                    data-ocid="admin.country.faq.save_button"
                  >
                    {editFaqId !== null ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFaqForm(false)}
                    className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                    data-ocid="admin.country.faq.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {current.faqs.length === 0 ? (
              <p
                className="text-sm text-muted-foreground"
                data-ocid="admin.country.faq.empty_state"
              >
                No FAQs yet.
              </p>
            ) : (
              [...current.faqs]
                .sort((a, b) => Number(a.order) - Number(b.order))
                .map((f, i) => (
                  <div
                    key={String(f.id)}
                    className="rounded-lg border border-border bg-background p-4 space-y-1"
                    data-ocid={`admin.country.faq.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {f.question}
                      </p>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => openEditFaq(f)}
                          className="rounded p-1 text-muted-foreground hover:bg-muted"
                          aria-label="Edit"
                          data-ocid={`admin.country.faq.edit_button.${i + 1}`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFaq(f.id)}
                          className="rounded p-1 text-red-500 hover:bg-red-50"
                          aria-label="Delete"
                          data-ocid={`admin.country.faq.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{f.answer}</p>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-6 py-3 font-semibold text-white shadow-lg hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.country.save_bottom_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Country"}
        </button>
      </div>
    </div>
  );
}
