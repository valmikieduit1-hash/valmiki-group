import { createActor } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BenefitPoint {
  title: string;
  description: string;
}

interface CounselingContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  formDescription: string;
  ctaText: string;
  benefitPoints: BenefitPoint[];
}

const defaultContent: CounselingContent = {
  heroHeadline: "",
  heroSubheadline: "",
  heroImageUrl: "",
  formDescription: "",
  ctaText: "",
  benefitPoints: [],
};

export default function AdminFreeCounseling() {
  const { actor } = useActor(createActor);
  const [content, setContent] = useState<CounselingContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  useEffect(() => {
    if (!actor) return;
    actor
      .getFreeCounselingContent()
      .then((result) => {
        const data = Array.isArray(result) ? result[0] : result;
        if (data) {
          setContent({
            heroHeadline: data.heroHeadline ?? "",
            heroSubheadline: data.heroSubheadline ?? "",
            heroImageUrl: data.heroImageUrl ?? "",
            formDescription: data.formDescription ?? "",
            ctaText: data.ctaText ?? "",
            benefitPoints: Array.isArray(data.benefitPoints)
              ? (data.benefitPoints as BenefitPoint[])
              : [],
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateFreeCounselingContent(token, content);
      if (result.__kind__ === "ok") {
        toast.success("Free Counseling page saved!");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const addBenefit = () => {
    setContent((p) => ({
      ...p,
      benefitPoints: [...p.benefitPoints, { title: "", description: "" }],
    }));
  };

  const updateBenefit = (
    idx: number,
    field: keyof BenefitPoint,
    value: string,
  ) => {
    setContent((p) => ({
      ...p,
      benefitPoints: p.benefitPoints.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeBenefit = (idx: number) => {
    setContent((p) => ({
      ...p,
      benefitPoints: p.benefitPoints.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div
        className="flex h-64 items-center justify-center"
        data-ocid="admin.counseling.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.counseling.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Free Counseling Page Editor
        </h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.counseling.save_button"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving…" : "Save All"}
        </button>
      </div>

      {/* Hero Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="font-semibold text-foreground">Hero Section</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="counseling-hero-headline"
              className="block text-sm font-medium text-foreground"
            >
              Hero Headline
            </label>
            <input
              id="counseling-hero-headline"
              type="text"
              value={content.heroHeadline}
              onChange={(e) =>
                setContent((p) => ({ ...p, heroHeadline: e.target.value }))
              }
              placeholder="e.g. Start Your Global Journey Today"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.counseling.hero_headline.input"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="counseling-hero-sub"
              className="block text-sm font-medium text-foreground"
            >
              Hero Subheadline
            </label>
            <input
              id="counseling-hero-sub"
              type="text"
              value={content.heroSubheadline}
              onChange={(e) =>
                setContent((p) => ({ ...p, heroSubheadline: e.target.value }))
              }
              placeholder="Supporting subheadline text"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.counseling.hero_subheadline.input"
            />
          </div>
          <ImageUpload
            label="Hero Background Image"
            value={content.heroImageUrl}
            onChange={(url) => setContent((p) => ({ ...p, heroImageUrl: url }))}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="font-semibold text-foreground">Form Content</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="counseling-form-description"
              className="block text-sm font-medium text-foreground"
            >
              Form Description
            </label>
            <textarea
              id="counseling-form-description"
              rows={4}
              value={content.formDescription}
              onChange={(e) =>
                setContent((p) => ({ ...p, formDescription: e.target.value }))
              }
              placeholder="Describe what the counseling session covers..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.counseling.form_description.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="counseling-cta"
              className="block text-sm font-medium text-foreground"
            >
              CTA Button Text
            </label>
            <input
              id="counseling-cta"
              type="text"
              value={content.ctaText}
              onChange={(e) =>
                setContent((p) => ({ ...p, ctaText: e.target.value }))
              }
              placeholder="e.g. Book My Free Session"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.counseling.cta_text.input"
            />
          </div>
        </div>
      </div>

      {/* Benefit Points */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Benefit Points</h3>
          <button
            type="button"
            onClick={addBenefit}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.counseling.benefits.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Benefit
          </button>
        </div>

        {content.benefitPoints.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.counseling.benefits.empty_state"
          >
            No benefit points added yet. Click Add Benefit to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {content.benefitPoints.map((benefit, idx) => (
              <div
                key={benefit.title || `benefit-item-${idx}`}
                className="rounded-lg border border-border bg-background p-4"
                data-ocid={`admin.counseling.benefits.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    Benefit {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(idx)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Remove benefit"
                    data-ocid={`admin.counseling.benefits.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`benefit-title-${idx}`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Title
                    </label>
                    <input
                      id={`benefit-title-${idx}`}
                      type="text"
                      value={benefit.title}
                      onChange={(e) =>
                        updateBenefit(idx, "title", e.target.value)
                      }
                      placeholder="e.g. Personalized Guidance"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid={`admin.counseling.benefits.title.input.${idx + 1}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`benefit-desc-${idx}`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Description
                    </label>
                    <input
                      id={`benefit-desc-${idx}`}
                      type="text"
                      value={benefit.description}
                      onChange={(e) =>
                        updateBenefit(idx, "description", e.target.value)
                      }
                      placeholder="Short benefit description"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid={`admin.counseling.benefits.description.input.${idx + 1}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.counseling.bottom_save_button"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving…" : "Save All"}
        </button>
      </div>
    </div>
  );
}
