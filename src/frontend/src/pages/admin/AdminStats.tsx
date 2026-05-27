import { createActor } from "@/backend";
import type { HeroContent } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, RotateCcw, Save, TrendingUp } from "lucide-react";
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

const statsMeta = [
  {
    key: "studentsGuided" as const,
    label: "Students Guided",
    icon: "👩‍🎓",
    color: "#FF8A00",
    bg: "bg-[#FF8A00]/10",
    hint: "e.g. 1 Lakh+",
    labelHint: "e.g. Students Guided",
  },
  {
    key: "universityPartnerships" as const,
    label: "University Partnerships",
    icon: "🏛️",
    color: "#FFC247",
    bg: "bg-[#FFC247]/10",
    hint: "e.g. 350+",
    labelHint: "e.g. University Partners",
  },
  {
    key: "yearsExperience" as const,
    label: "Years Experience",
    icon: "📅",
    color: "#0B1F3A",
    bg: "bg-primary/10",
    hint: "e.g. 24+",
    labelHint: "e.g. Years of Experience",
  },
  {
    key: "visaSuccessRate" as const,
    label: "Visa Success Rate",
    icon: "✅",
    color: "#10b981",
    bg: "bg-emerald-500/10",
    hint: "e.g. 93%",
    labelHint: "e.g. Visa Success Rate",
  },
];

const statLabelMap: Record<
  keyof Pick<
    HeroContent,
    | "studentsGuided"
    | "universityPartnerships"
    | "yearsExperience"
    | "visaSuccessRate"
  >,
  string
> = {
  studentsGuided: "Students Guided",
  universityPartnerships: "University Partners",
  yearsExperience: "Years of Experience",
  visaSuccessRate: "Visa Success Rate",
};

export default function AdminStats() {
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
        await queryClient.invalidateQueries({ queryKey: ["heroContent"] });
        toast.success("Stats saved successfully!");
      } else {
        toast.error((result as { err: string }).err ?? "Save failed");
      }
    } catch {
      toast.error("Failed to save stats");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setContent(original);
    toast.info("Changes reverted");
  };

  const updateStat = (field: keyof HeroContent, value: string) => {
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
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF8A00]/10">
            <BarChart3 className="h-5 w-5 text-[#FF8A00]" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Stats / Counters
            </h2>
            <p className="text-sm text-muted-foreground">
              These counters appear on the home page hero section
            </p>
          </div>
        </div>
        {changed && (
          <span className="rounded-full bg-[#FFC247]/15 px-3 py-1 text-xs font-medium text-[#FFC247]">
            Unsaved changes
          </span>
        )}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-[#FF8A00]/20 bg-[#FF8A00]/5 p-4">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#FF8A00]" />
        <p className="text-sm text-muted-foreground">
          Edit the value shown in large text (e.g.{" "}
          <strong className="text-foreground">24+</strong>) for each counter.
          These appear as highlight badges in the hero section of your home page
          to build credibility with visitors.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2">
        {statsMeta.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl border border-border bg-card p-5 shadow-subtle"
            data-ocid={`admin.stats.${stat.key}.card`}
          >
            {/* Card header */}
            <div className="mb-4 flex items-center gap-2.5">
              <span className="text-2xl" role="img" aria-label={stat.label}>
                {stat.icon}
              </span>
              <span className="font-medium text-foreground">{stat.label}</span>
            </div>

            {/* Value input */}
            <div className="mb-3">
              <label
                htmlFor={`stat-value-${stat.key}`}
                className="mb-1.5 block text-xs font-medium text-muted-foreground"
              >
                Counter Value
              </label>
              <input
                id={`stat-value-${stat.key}`}
                type="text"
                value={content[stat.key] as string}
                onChange={(e) => updateStat(stat.key, e.target.value)}
                placeholder={stat.hint}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid={`admin.stats.${stat.key}.input`}
              />
            </div>

            {/* Preview */}
            <div className={`mt-3 rounded-lg ${stat.bg} px-4 py-3`}>
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Preview
              </p>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl font-bold font-display"
                  style={{ color: stat.color }}
                >
                  {(content[stat.key] as string) || stat.hint}
                </span>
                <span className="text-sm text-muted-foreground">
                  {statLabelMap[stat.key]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !changed}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#FF8A00]/90 disabled:opacity-50"
          data-ocid="admin.stats.save_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!changed}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          data-ocid="admin.stats.reset_button"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
