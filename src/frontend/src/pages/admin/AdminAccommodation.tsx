import { createActor } from "@/backend";
import type { ServiceDetailContent } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Step = { id: string; title: string; description: string; icon: string };

type FormState = {
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  overview: string;
  ctaText: string;
  ctaButtonText: string;
  processSteps: Step[];
  destinationsCovered: string[];
};

const EMPTY_FORM: FormState = {
  heroImage: "",
  heroHeadline: "",
  heroSubheadline: "",
  overview: "",
  ctaText: "",
  ctaButtonText: "",
  processSteps: [
    { id: crypto.randomUUID(), title: "", description: "", icon: "" },
  ],
  destinationsCovered: [""],
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

export default function AdminAccommodation() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const queryClient = useQueryClient();

  const getToken = () => localStorage.getItem("valmikiAdminToken") ?? "";

  const { data, isLoading } = useQuery<ServiceDetailContent | null>({
    queryKey: ["adminServiceDetail", "accommodation"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getServiceDetail("accommodation");
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
        processSteps: data.processSteps.length
          ? data.processSteps.map((s) => ({
              id: crypto.randomUUID(),
              title: s.title,
              description: s.description,
              icon: s.icon,
            }))
          : [{ id: crypto.randomUUID(), title: "", description: "", icon: "" }],
        destinationsCovered: data.whatIsIncluded.length
          ? data.whatIsIncluded
          : [""],
      });
    } else if (!isLoading) {
      setForm(EMPTY_FORM);
    }
  }, [data, isLoading]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.setServiceDetail(getToken(), {
        serviceId: "accommodation",
        heroImage: form.heroImage,
        heroHeadline: form.heroHeadline,
        heroSubheadline: form.heroSubheadline,
        overview: form.overview,
        ctaText: form.ctaText,
        ctaButtonText: form.ctaButtonText,
        whatIsIncluded: form.destinationsCovered.filter(Boolean),
        eligibilityCriteria: [],
        whyChooseValmiki: [],
        processSteps: form.processSteps.map((s, i) => ({
          order: BigInt(i + 1),
          title: s.title,
          description: s.description,
          icon: s.icon,
        })),
        faqs: [],
      });
    },
    onSuccess: () => {
      toast.success("Accommodation page saved!");
      queryClient.invalidateQueries({
        queryKey: ["adminServiceDetail", "accommodation"],
      });
      queryClient.invalidateQueries({
        queryKey: ["serviceDetail", "accommodation"],
      });
    },
    onError: () => toast.error("Save failed"),
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6" data-ocid="admin.accommodation.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Study Abroad Accommodation Editor
        </h2>
        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.accommodation.save_button"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saveMutation.isPending ? "Saving…" : "Save"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00]" />
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="space-y-4 rounded-xl border border-border bg-card p-4">
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
                htmlFor="acc-hero-headline"
                className="mb-1 block text-sm font-semibold"
              >
                Headline
              </label>
              <input
                id="acc-hero-headline"
                type="text"
                value={form.heroHeadline}
                onChange={(e) => set("heroHeadline", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                data-ocid="admin.accommodation.hero_headline.input"
              />
            </div>
            <div>
              <label
                htmlFor="acc-hero-subheadline"
                className="mb-1 block text-sm font-semibold"
              >
                Subheadline
              </label>
              <input
                id="acc-hero-subheadline"
                type="text"
                value={form.heroSubheadline}
                onChange={(e) => set("heroSubheadline", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                data-ocid="admin.accommodation.hero_subheadline.input"
              />
            </div>
          </section>

          {/* Overview */}
          <section className="space-y-4 rounded-xl border border-border bg-card p-4">
            <h4 className="font-semibold text-sm text-foreground">
              Overview & CTA
            </h4>
            <div>
              <label
                htmlFor="acc-overview"
                className="mb-1 block text-sm font-semibold"
              >
                Overview
              </label>
              <textarea
                id="acc-overview"
                rows={4}
                value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                data-ocid="admin.accommodation.overview.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="acc-cta-text"
                  className="mb-1 block text-sm font-semibold"
                >
                  CTA Text
                </label>
                <input
                  id="acc-cta-text"
                  type="text"
                  value={form.ctaText}
                  onChange={(e) => set("ctaText", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  data-ocid="admin.accommodation.cta_text.input"
                />
              </div>
              <div>
                <label
                  htmlFor="acc-cta-btn"
                  className="mb-1 block text-sm font-semibold"
                >
                  CTA Button Text
                </label>
                <input
                  id="acc-cta-btn"
                  type="text"
                  value={form.ctaButtonText}
                  onChange={(e) => set("ctaButtonText", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  data-ocid="admin.accommodation.cta_button_text.input"
                />
              </div>
            </div>
          </section>

          {/* Destinations Covered */}
          <section className="space-y-4 rounded-xl border border-border bg-card p-4">
            <h4 className="font-semibold text-sm text-foreground">
              Destinations Covered
            </h4>
            <ArrayEditor
              label="Destinations"
              values={form.destinationsCovered}
              onChange={(v) => set("destinationsCovered", v)}
            />
          </section>

          {/* Process Steps */}
          <section className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">
                How It Works
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
                data-ocid="admin.accommodation.steps.add_button"
              >
                <Plus size={12} /> Add Step
              </button>
            </div>
            {form.processSteps.map((step, i) => (
              <div
                key={step.id}
                className="rounded-lg border border-border p-3 space-y-2"
                data-ocid={`admin.accommodation.steps.item.${i + 1}`}
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
                    data-ocid={`admin.accommodation.steps.delete_button.${i + 1}`}
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
                    data-ocid={`admin.accommodation.steps.title.input.${i + 1}`}
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
                    data-ocid={`admin.accommodation.steps.icon.input.${i + 1}`}
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
                  data-ocid={`admin.accommodation.steps.description.textarea.${i + 1}`}
                />
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
