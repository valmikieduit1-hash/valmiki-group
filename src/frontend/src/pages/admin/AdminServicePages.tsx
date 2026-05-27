import { createActor } from "@/backend";
import type { ServiceDetailContent } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SERVICES = [
  { id: "study-abroad-counseling", name: "Study Abroad Counseling" },
  { id: "student-visa-assistance", name: "Student Visa Assistance" },
  { id: "immigration-services", name: "Immigration Services" },
  { id: "scholarships-guidance", name: "Scholarships Guidance" },
  { id: "education-loans", name: "Education Loans" },
  { id: "sop-documentation", name: "SOP & Documentation" },
  { id: "pre-departure-assistance", name: "Pre-Departure Assistance" },
  { id: "career-counseling", name: "Career Counseling" },
  { id: "valmiki-foundation", name: "Valmiki Foundation" },
  { id: "tours-and-travel", name: "Tours & Travel" },
];

type Step = { id: string; title: string; description: string; icon: string };
type FAQ = { id: string; question: string; answer: string };

type FormState = {
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  overview: string;
  ctaText: string;
  ctaButtonText: string;
  whatIsIncluded: string[];
  eligibilityCriteria: string[];
  whyChooseValmiki: string[];
  processSteps: Step[];
  faqs: FAQ[];
};

const EMPTY_FORM: FormState = {
  heroImage: "",
  heroHeadline: "",
  heroSubheadline: "",
  overview: "",
  ctaText: "",
  ctaButtonText: "",
  whatIsIncluded: [""],
  eligibilityCriteria: [""],
  whyChooseValmiki: [""],
  processSteps: [
    { id: crypto.randomUUID(), title: "", description: "", icon: "" },
  ],
  faqs: [{ id: crypto.randomUUID(), question: "", answer: "" }],
};

function ArrayEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {values.map((val, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable index key
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={val}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder={`Item ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(values.filter((_, j) => j !== i))}
            className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]"
      >
        <Plus size={14} /> Add item
      </button>
    </div>
  );
}

export default function AdminServicePages() {
  const { actor } = useActor(createActor);
  const [selectedId, setSelectedId] = useState(SERVICES[0].id);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const queryClient = useQueryClient();

  const getToken = () => localStorage.getItem("valmikiAdminToken") ?? "";

  const { data, isLoading } = useQuery<ServiceDetailContent | null>({
    queryKey: ["adminServiceDetail", selectedId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getServiceDetail(selectedId);
      return result != null ? (result[0] ?? null) : null;
    },
    enabled: !!actor,
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      setForm({
        heroImage: data.heroImage,
        heroHeadline: data.heroHeadline,
        heroSubheadline: data.heroSubheadline,
        overview: data.overview,
        ctaText: data.ctaText,
        ctaButtonText: data.ctaButtonText,
        whatIsIncluded: data.whatIsIncluded.length ? data.whatIsIncluded : [""],
        eligibilityCriteria: data.eligibilityCriteria.length
          ? data.eligibilityCriteria
          : [""],
        whyChooseValmiki: data.whyChooseValmiki.length
          ? data.whyChooseValmiki
          : [""],
        processSteps: data.processSteps.length
          ? data.processSteps.map((s) => ({
              id: crypto.randomUUID(),
              title: s.title,
              description: s.description,
              icon: s.icon,
            }))
          : [{ id: crypto.randomUUID(), title: "", description: "", icon: "" }],
        faqs: data.faqs.length
          ? data.faqs.map((f) => ({ id: crypto.randomUUID(), ...f }))
          : [{ id: crypto.randomUUID(), question: "", answer: "" }],
      });
    } else if (!isLoading) {
      setForm(EMPTY_FORM);
    }
  }, [data, isLoading]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.setServiceDetail(getToken(), {
        serviceId: selectedId,
        heroImage: form.heroImage,
        heroHeadline: form.heroHeadline,
        heroSubheadline: form.heroSubheadline,
        overview: form.overview,
        ctaText: form.ctaText,
        ctaButtonText: form.ctaButtonText,
        whatIsIncluded: form.whatIsIncluded.filter(Boolean),
        eligibilityCriteria: form.eligibilityCriteria.filter(Boolean),
        whyChooseValmiki: form.whyChooseValmiki.filter(Boolean),
        processSteps: form.processSteps.map((s, i) => ({
          order: BigInt(i + 1),
          title: s.title,
          description: s.description,
          icon: s.icon,
        })),
        faqs: form.faqs,
      });
    },
    onSuccess: () => {
      toast.success("Saved!");
      queryClient.invalidateQueries({
        queryKey: ["adminServiceDetail", selectedId],
      });
      queryClient.invalidateQueries({
        queryKey: ["serviceDetail", selectedId],
      });
    },
    onError: () => toast.error("Save failed"),
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div
      className="flex h-full gap-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      data-ocid="admin.service_pages.panel"
    >
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-display text-sm font-bold text-foreground">
            Service Pages
          </h2>
          <p className="text-xs text-muted-foreground">Select to edit</p>
        </div>
        <nav className="py-2">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              data-ocid={`admin.service_pages.nav.${s.id}`}
              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                selectedId === s.id
                  ? "bg-[#0B1F3A] text-white"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Form */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <h3 className="font-display text-base font-bold text-foreground">
            {SERVICES.find((s) => s.id === selectedId)?.name}
          </h3>
          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-50"
            data-ocid="admin.service_pages.save_button"
          >
            <Save size={14} />
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
            </div>
          ) : (
            <>
              {/* Hero */}
              <section className="space-y-4 rounded-xl border border-border bg-background p-4">
                <h4 className="font-semibold text-sm text-foreground">
                  Hero Section
                </h4>
                <div>
                  <p className="mb-1 text-sm font-semibold">Hero Image</p>
                  <ImageUpload
                    value={form.heroImage}
                    onChange={(v) => set("heroImage", v)}
                    label="Hero Image"
                  />
                </div>
                <div>
                  <label
                    htmlFor="svc-hero-headline"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Headline
                  </label>
                  <input
                    id="svc-hero-headline"
                    type="text"
                    value={form.heroHeadline}
                    onChange={(e) => set("heroHeadline", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="svc-hero-subheadline"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Subheadline
                  </label>
                  <input
                    id="svc-hero-subheadline"
                    type="text"
                    value={form.heroSubheadline}
                    onChange={(e) => set("heroSubheadline", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </section>

              {/* Overview */}
              <section className="space-y-4 rounded-xl border border-border bg-background p-4">
                <h4 className="font-semibold text-sm text-foreground">
                  Overview & CTA
                </h4>
                <div>
                  <label
                    htmlFor="svc-overview"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Overview
                  </label>
                  <textarea
                    id="svc-overview"
                    rows={4}
                    value={form.overview}
                    onChange={(e) => set("overview", e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="svc-cta-text"
                      className="mb-1 block text-sm font-semibold"
                    >
                      CTA Text
                    </label>
                    <input
                      id="svc-cta-text"
                      type="text"
                      value={form.ctaText}
                      onChange={(e) => set("ctaText", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="svc-cta-btn"
                      className="mb-1 block text-sm font-semibold"
                    >
                      CTA Button Text
                    </label>
                    <input
                      id="svc-cta-btn"
                      type="text"
                      value={form.ctaButtonText}
                      onChange={(e) => set("ctaButtonText", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Array editors */}
              <section className="space-y-4 rounded-xl border border-border bg-background p-4">
                <h4 className="font-semibold text-sm text-foreground">
                  Content Lists
                </h4>
                <ArrayEditor
                  label="What Is Included"
                  values={form.whatIsIncluded}
                  onChange={(v) => set("whatIsIncluded", v)}
                />
                <ArrayEditor
                  label="Eligibility Criteria"
                  values={form.eligibilityCriteria}
                  onChange={(v) => set("eligibilityCriteria", v)}
                />
                <ArrayEditor
                  label="Why Choose Valmiki"
                  values={form.whyChooseValmiki}
                  onChange={(v) => set("whyChooseValmiki", v)}
                />
              </section>

              {/* Process Steps */}
              <section className="space-y-4 rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-foreground">
                    Process Steps
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      set("processSteps", [
                        ...form.processSteps,
                        {
                          id: crypto.randomUUID(),
                          title: "",
                          description: "",
                          icon: "",
                        },
                      ])
                    }
                    className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]"
                  >
                    <Plus size={12} /> Add Step
                  </button>
                </div>
                {form.processSteps.map((step, i) => (
                  <div
                    key={step.id}
                    className="rounded-lg border border-border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Step {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            "processSteps",
                            form.processSteps.filter((_, j) => j !== i),
                          )
                        }
                        className="text-destructive hover:opacity-70"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={step.title}
                        placeholder="Title"
                        onChange={(e) => {
                          const next = [...form.processSteps];
                          next[i] = { ...next[i], title: e.target.value };
                          set("processSteps", next);
                        }}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        value={step.icon}
                        placeholder="Icon (emoji or name)"
                        onChange={(e) => {
                          const next = [...form.processSteps];
                          next[i] = { ...next[i], icon: e.target.value };
                          set("processSteps", next);
                        }}
                        className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={step.description}
                      placeholder="Description"
                      onChange={(e) => {
                        const next = [...form.processSteps];
                        next[i] = { ...next[i], description: e.target.value };
                        set("processSteps", next);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </section>

              {/* FAQs */}
              <section className="space-y-4 rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-foreground">
                    FAQs
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      set("faqs", [
                        ...form.faqs,
                        { id: crypto.randomUUID(), question: "", answer: "" },
                      ])
                    }
                    className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]"
                  >
                    <Plus size={12} /> Add FAQ
                  </button>
                </div>
                {form.faqs.map((faq, i) => (
                  <div
                    key={faq.id}
                    className="rounded-lg border border-border p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">
                        FAQ {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            "faqs",
                            form.faqs.filter((_, j) => j !== i),
                          )
                        }
                        className="text-destructive hover:opacity-70"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      placeholder="Question"
                      onChange={(e) => {
                        const next = [...form.faqs];
                        next[i] = { ...next[i], question: e.target.value };
                        set("faqs", next);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      placeholder="Answer"
                      onChange={(e) => {
                        const next = [...form.faqs];
                        next[i] = { ...next[i], answer: e.target.value };
                        set("faqs", next);
                      }}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
