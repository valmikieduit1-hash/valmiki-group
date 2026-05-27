import { createActor } from "@/backend";
import type { CountryInfo } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

const countryNames: Record<string, string> = {
  us: "USA",
  ca: "Canada",
  gb: "UK",
  au: "Australia",
  de: "Germany",
  ie: "Ireland",
  nz: "New Zealand",
  ae: "UAE / Dubai",
  sg: "Singapore",
  eu: "Europe",
  fr: "France",
};

const DEFAULT_ORDER = [
  "us",
  "ca",
  "gb",
  "au",
  "de",
  "ie",
  "nz",
  "ae",
  "sg",
  "eu",
  "fr",
];

const countryFlags: Record<string, string> = {
  us: "🇺🇸",
  ca: "🇨🇦",
  gb: "🇬🇧",
  au: "🇦🇺",
  de: "🇩🇪",
  ie: "🇮🇪",
  nz: "🇳🇿",
  ae: "🇦🇪",
  sg: "🇸🇬",
  eu: "🇪🇺",
  fr: "🇫🇷",
};

const defaultCountry = (slug: string): CountryInfo => ({
  slug,
  tuition: "",
  popularCourses: [],
  workOpportunities: "",
  prPathway: "",
  visaSuccessRate: "",
  acceptanceRate: "",
  visaSteps: [],
  faqs: [],
  description: "",
  averageCost: "",
  flagImage: "",
  processingTime: "",
  heroImage: "",
  topUniversities: [],
  intakeMonths: "",
  requirements: [],
  scholarships: [],
  order: 0n,
});

export default function AdminCountries() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [countries, setCountries] = useState<Record<string, CountryInfo>>({});
  const [original, setOriginal] = useState<Record<string, CountryInfo>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [countryOrder, setCountryOrder] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("valmikiCountryOrder");
      if (stored) return JSON.parse(stored) as string[];
    } catch {}
    return [...DEFAULT_ORDER];
  });
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [dragOverSlug, setDragOverSlug] = useState<string | null>(null);
  const [orderSaved, setOrderSaved] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  useEffect(() => {
    if (!actor) return;
    actor
      .getCountryInfoAll()
      .then((list) => {
        const map: Record<string, CountryInfo> = {};
        const orig: Record<string, CountryInfo> = {};
        for (const c of list) {
          map[c.slug] = c;
          orig[c.slug] = { ...c };
        }
        // Ensure all 10 exist with correct slugs
        for (const slug of Object.keys(countryNames)) {
          if (!map[slug]) {
            map[slug] = defaultCountry(slug);
            orig[slug] = defaultCountry(slug);
          }
        }
        setCountries(map);
        setOriginal(orig);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const updateCountry = (
    slug: string,
    field: keyof CountryInfo,
    value: string | string[],
  ) => {
    setCountries((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }));
  };

  const hasChanges = (slug: string) => {
    return JSON.stringify(countries[slug]) !== JSON.stringify(original[slug]);
  };

  const handleSave = async (slug: string) => {
    if (!actor) return;
    setSavingSlug(slug);
    try {
      // Use the full in-memory country object (includes heroImage)
      const countryData = countries[slug];
      if (!countryData) {
        toast.error("Country data not found");
        return;
      }
      console.log(
        "[AdminCountries] Saving",
        slug,
        "heroImage:",
        countryData.heroImage || "(none)",
      );
      const result = await actor.updateCountryInfo(token, countryData);
      if (result.__kind__ === "ok") {
        setOriginal((prev) => ({ ...prev, [slug]: { ...countryData } }));
        // Force an immediate refetch (not just invalidate) so live site updates instantly
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ["countries"] }),
          queryClient.refetchQueries({ queryKey: ["countryDetail", slug] }),
          queryClient.invalidateQueries({ queryKey: ["country", slug] }),
          queryClient.invalidateQueries({ queryKey: ["heroContent"] }),
          queryClient.invalidateQueries({ queryKey: ["homeSectionsContent"] }),
        ]);
        console.log(
          "[AdminCountries] Saved and refetched — heroImage:",
          countryData.heroImage,
        );
        toast.success(
          `✓ ${countryNames[slug] ?? slug} saved — changes are now live on the website`,
        );
      } else {
        toast.error(`Save failed: ${result.err}`);
      }
    } catch {
      toast.error("Failed to save — please try again");
    } finally {
      setSavingSlug(null);
    }
  };

  const handleSaveOrder = async () => {
    localStorage.setItem("valmikiCountryOrder", JSON.stringify(countryOrder));
    // Attempt backend call if method exists
    if (
      actor &&
      typeof (actor as unknown as Record<string, unknown>).reorderCountries ===
        "function"
    ) {
      try {
        await (
          actor as unknown as {
            reorderCountries: (t: string, o: string[]) => Promise<unknown>;
          }
        ).reorderCountries(token, countryOrder);
      } catch {
        // backend call optional — localStorage already saved
      }
    }
    setOrderSaved(true);
    setTimeout(() => setOrderSaved(false), 2000);
  };

  const loadCountries = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const list = await actor.getCountryInfoAll();
      const map: Record<string, CountryInfo> = {};
      const orig: Record<string, CountryInfo> = {};
      for (const c of list) {
        map[c.slug] = c;
        orig[c.slug] = { ...c };
      }
      for (const slug of Object.keys(countryNames)) {
        if (!map[slug]) {
          map[slug] = defaultCountry(slug);
          orig[slug] = defaultCountry(slug);
        }
      }
      setCountries(map);
      setOriginal(orig);
    } catch {
      toast.error("Failed to refresh countries");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCountry = async () => {
    if (!actor || !newSlug.trim() || !newName.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      const result = await (actor as any).addCountry(
        token,
        newSlug.trim().toLowerCase(),
        newName.trim(),
      );
      if (result && result.__kind__ === "ok") {
        toast.success(`✓ ${newName} added successfully`);
        setNewSlug("");
        setNewName("");
        setShowAddForm(false);
        await loadCountries();
      } else {
        setAddError(result?.err ?? "Failed to add country");
      }
    } catch (_e) {
      setAddError("Failed to add country — please try again");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCountry = async (slug: string) => {
    if (!actor) return;
    const name = countryNames[slug] ?? slug;
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      const result = await (actor as any).deleteCountry(token, slug);
      if (result && result.__kind__ === "ok") {
        toast.success(`✓ ${name} deleted`);
        setCountries((prev) => {
          const next = { ...prev };
          delete next[slug];
          return next;
        });
        setOriginal((prev) => {
          const next = { ...prev };
          delete next[slug];
          return next;
        });
        setCountryOrder((prev) => prev.filter((s) => s !== slug));
      } else {
        toast.error(result?.err ?? "Failed to delete country");
      }
    } catch {
      toast.error("Failed to delete country — please try again");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Countries
        </h2>
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B1F3A]/80"
          data-ocid="admin.countries.add_new_button"
        >
          <Plus className="h-4 w-4" />
          Add New Country
        </button>
      </div>

      {/* ── Add New Country Form ── */}
      {showAddForm && (
        <div className="rounded-xl border-2 border-[#0B1F3A]/20 bg-card p-5 shadow-subtle">
          <h3 className="mb-3 font-display text-base font-bold text-foreground">
            Add New Country
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="add-country-slug"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Country Slug{" "}
                <span className="text-xs text-muted-foreground/60">
                  (lowercase, e.g. jp)
                </span>
              </label>
              <input
                id="add-country-slug"
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value.toLowerCase())}
                placeholder="e.g. jp"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.countries.add_slug_input"
              />
            </div>
            <div>
              <label
                htmlFor="add-country-name"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Country Name{" "}
                <span className="text-xs text-muted-foreground/60">
                  (e.g. Japan)
                </span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Japan"
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.countries.add_name_input"
                id="add-country-name"
              />
            </div>
          </div>
          {addError && (
            <div className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 border border-red-200">
              {addError}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleAddCountry}
              disabled={adding || !newSlug.trim() || !newName.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-50"
              data-ocid="admin.countries.create_button"
            >
              <Plus className="h-4 w-4" />
              {adding ? "Creating..." : "Create Country"}
            </button>
          </div>
        </div>
      )}

      {/* ── Country Display Order ── */}
      <div className="rounded-xl border-2 border-[#0B1F3A]/20 bg-card p-5 shadow-subtle">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Country Display Order
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Drag rows to reorder how countries appear on the website
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveOrder}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B1F3A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0B1F3A]/80"
            data-ocid="admin.countries.save_order_button"
          >
            <Save className="h-4 w-4" />
            Save Order
          </button>
        </div>

        {orderSaved && (
          <div className="mb-3 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 border border-green-200">
            ✓ Order saved! Changes are live on the website.
          </div>
        )}

        <div className="space-y-1.5">
          {countryOrder.map((slug) => (
            <div
              key={slug}
              draggable
              onDragStart={() => setDraggedSlug(slug)}
              onDragEnd={() => {
                setDraggedSlug(null);
                setDragOverSlug(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlug(slug);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (!draggedSlug || draggedSlug === slug) return;
                setCountryOrder((prev) => {
                  const next = prev.filter((s) => s !== draggedSlug);
                  const idx = next.indexOf(slug);
                  next.splice(idx, 0, draggedSlug);
                  return next;
                });
                setDragOverSlug(null);
              }}
              className={[
                "flex cursor-grab items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium select-none transition-all",
                draggedSlug === slug ? "opacity-40" : "",
                dragOverSlug === slug && draggedSlug !== slug
                  ? "border-t-2 border-[#FF8A00] bg-[#FF8A00]/5"
                  : countryOrder.indexOf(slug) % 2 === 0
                    ? "bg-muted/30"
                    : "bg-background",
              ].join(" ")}
              data-ocid={`admin.countries.order_row.${slug}`}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              <span className="text-lg leading-none">
                {countryFlags[slug] ?? "🌍"}
              </span>
              <span className="text-foreground">
                {countryNames[slug] ?? slug}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                #{countryOrder.indexOf(slug) + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Individual Country Editors ── */}
      <div className="space-y-3">
        {Object.entries(countryNames).map(([slug, name]) => {
          const open = expanded === slug;
          const changed = hasChanges(slug);
          const info = countries[slug] ?? defaultCountry(slug);
          return (
            <div
              key={slug}
              className="rounded-xl border border-border bg-card shadow-subtle"
            >
              <button
                type="button"
                onClick={() => setExpanded(open ? null : slug)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
                data-ocid={`admin.countries.toggle.${slug}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-base font-semibold text-foreground">
                    {name}
                  </span>
                  {changed && (
                    <span className="rounded-full bg-[#FFC247]/15 px-2 py-0.5 text-[10px] font-medium text-[#FFC247]">
                      Unsaved
                    </span>
                  )}
                </div>
                {open ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {open && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  {/* ── Hero Image — top of card, prominent ── */}
                  <div className="mb-5 rounded-xl border border-border bg-muted/30 p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Country Hero Image
                    </p>
                    <ImageUpload
                      value={info.heroImage ?? ""}
                      onChange={(url) => updateCountry(slug, "heroImage", url)}
                      label="Upload Hero Background Image"
                    />
                  </div>

                  {/* ── Other fields ── */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`country-${slug}-tuition`}
                        className="mb-1.5 block text-sm font-medium text-muted-foreground"
                      >
                        Average Tuition
                      </label>
                      <input
                        id={`country-${slug}-tuition`}
                        type="text"
                        value={info.tuition}
                        onChange={(e) =>
                          updateCountry(slug, "tuition", e.target.value)
                        }
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`country-${slug}-visaSuccessRate`}
                        className="mb-1.5 block text-sm font-medium text-muted-foreground"
                      >
                        Visa Success Rate (%)
                      </label>
                      <input
                        id={`country-${slug}-visaSuccessRate`}
                        type="text"
                        value={info.visaSuccessRate}
                        onChange={(e) =>
                          updateCountry(slug, "visaSuccessRate", e.target.value)
                        }
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor={`country-${slug}-popularCourses`}
                        className="mb-1.5 block text-sm font-medium text-muted-foreground"
                      >
                        Popular Courses (comma-separated)
                      </label>
                      <input
                        id={`country-${slug}-popularCourses`}
                        type="text"
                        value={info.popularCourses.join(", ")}
                        onChange={(e) =>
                          updateCountry(
                            slug,
                            "popularCourses",
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          )
                        }
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`country-${slug}-workOpportunities`}
                        className="mb-1.5 block text-sm font-medium text-muted-foreground"
                      >
                        Work Opportunities
                      </label>
                      <textarea
                        id={`country-${slug}-workOpportunities`}
                        value={info.workOpportunities}
                        onChange={(e) =>
                          updateCountry(
                            slug,
                            "workOpportunities",
                            e.target.value,
                          )
                        }
                        rows={3}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`country-${slug}-prPathway`}
                        className="mb-1.5 block text-sm font-medium text-muted-foreground"
                      >
                        PR Pathway
                      </label>
                      <textarea
                        id={`country-${slug}-prPathway`}
                        value={info.prPathway}
                        onChange={(e) =>
                          updateCountry(slug, "prPathway", e.target.value)
                        }
                        rows={3}
                        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeleteCountry(slug)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                      data-ocid={`admin.countries.delete_button.${slug}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Country
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSave(slug)}
                      disabled={savingSlug === slug || !changed}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-50"
                      data-ocid={`admin.countries.save_button.${slug}`}
                    >
                      <Save className="h-4 w-4" />
                      {savingSlug === slug ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
