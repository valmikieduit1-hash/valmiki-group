import { createActor } from "@/backend";
import type { HeroContent } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const defaultHero: HeroContent = {
  headline: "Transform Your Future with Global Education Opportunities",
  subheadline: "Trusted Overseas Education & Immigration Experts Since 2001",
  studentsGuided: "",
  universityPartnerships: "",
  yearsExperience: "",
  visaSuccessRate: "",
};

export default function AdminHero() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [content, setContent] = useState<HeroContent>(defaultHero);
  const [original, setOriginal] = useState<HeroContent>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getHeroContent()
      .then((h) => {
        setContent(h);
        setOriginal(h);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const changed = JSON.stringify(content) !== JSON.stringify(original);

  const handleSave = async () => {
    const token = localStorage.getItem("valmikiAdminToken") ?? "";
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateHeroContent(token, content);
      if ("ok" in result) {
        setOriginal(content);
        queryClient.invalidateQueries({ queryKey: ["heroContent"] });
        toast.success("Hero content saved successfully!");
      } else {
        toast.error((result as { err: string }).err ?? "Save failed");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContent(original);
    toast.info("Changes reverted");
  };

  const update = (field: keyof HeroContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Hero Content
        </h2>
        {changed && (
          <span className="rounded-full bg-[#FFC247]/15 px-3 py-1 text-xs font-medium text-[#FFC247]">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-subtle">
        <div>
          <label
            htmlFor="hero-headline"
            className="mb-1.5 block text-sm font-medium text-muted-foreground"
          >
            Headline
          </label>
          <input
            id="hero-headline"
            type="text"
            value={content.headline}
            onChange={(e) => update("headline", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
            data-ocid="admin.hero.headline"
          />
        </div>

        <div>
          <label
            htmlFor="hero-subheadline"
            className="mb-1.5 block text-sm font-medium text-muted-foreground"
          >
            Subheadline
          </label>
          <input
            id="hero-subheadline"
            type="text"
            value={content.subheadline}
            onChange={(e) => update("subheadline", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
            data-ocid="admin.hero.subheadline"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="hero-studentsGuided"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Students Guided
            </label>
            <input
              id="hero-studentsGuided"
              type="text"
              value={content.studentsGuided}
              onChange={(e) => update("studentsGuided", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.hero.students_guided"
            />
          </div>
          <div>
            <label
              htmlFor="hero-universityPartnerships"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              University Partnerships
            </label>
            <input
              id="hero-universityPartnerships"
              type="text"
              value={content.universityPartnerships}
              onChange={(e) => update("universityPartnerships", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.hero.university_partnerships"
            />
          </div>
          <div>
            <label
              htmlFor="hero-yearsExperience"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Years Experience
            </label>
            <input
              id="hero-yearsExperience"
              type="text"
              value={content.yearsExperience}
              onChange={(e) => update("yearsExperience", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.hero.years_experience"
            />
          </div>
          <div>
            <label
              htmlFor="hero-visaSuccessRate"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Visa Success Rate (%)
            </label>
            <input
              id="hero-visaSuccessRate"
              type="text"
              value={content.visaSuccessRate}
              onChange={(e) => update("visaSuccessRate", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.hero.visa_success_rate"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-border bg-muted/30 p-6">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
          Live Preview
        </h3>
        <div className="space-y-2">
          <p className="font-display text-lg font-bold text-foreground">
            {content.headline}
          </p>
          <p className="text-sm text-muted-foreground">{content.subheadline}</p>
          <div className="flex flex-wrap gap-4 pt-2 text-sm">
            <span className="rounded-full bg-[#FF8A00]/10 px-3 py-1 text-[#FF8A00]">
              {content.studentsGuided} Students
            </span>
            <span className="rounded-full bg-[#FFC247]/10 px-3 py-1 text-[#FFC247]">
              {content.universityPartnerships} Universities
            </span>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
              {content.yearsExperience} Years
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600">
              {content.visaSuccessRate} Visa Success
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !changed}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#FF8A00]/90 disabled:opacity-50"
          data-ocid="admin.hero.save_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!changed}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          data-ocid="admin.hero.reset_button"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
