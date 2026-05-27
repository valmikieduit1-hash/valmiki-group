import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageHero {
  pageKey: string;
  pageLabel: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaHref: string;
}

const _defaultHeroes: PageHero[] = [
  {
    pageKey: "home",
    pageLabel: "Home Page",
    title: "Transform Your Future with Global Education Opportunities",
    subtitle: "Trusted Overseas Education & Immigration Experts Since 2001",
    imageUrl: "",
    ctaLabel: "Book Free Counseling",
    ctaHref: "/free-counseling",
  },
  {
    pageKey: "about",
    pageLabel: "About Us",
    title: "We Help Students Overcome the Obstacles of Overseas Education",
    subtitle: "24+ years of trusted expertise in international education",
    imageUrl: "",
    ctaLabel: "Meet Our Team",
    ctaHref: "/our-leadership",
  },
  {
    pageKey: "study-abroad",
    pageLabel: "Study Abroad",
    title: "Your Global Study Journey Starts Here",
    subtitle: "Expert guidance for every step of your study abroad path",
    imageUrl: "",
    ctaLabel: "Explore Countries",
    ctaHref: "/countries",
  },
  {
    pageKey: "services",
    pageLabel: "Services",
    title: "End-to-End Overseas Education Services",
    subtitle: "From visa assistance to scholarships — we handle it all",
    imageUrl: "",
    ctaLabel: "Get Started",
    ctaHref: "/free-counseling",
  },
  {
    pageKey: "immigration",
    pageLabel: "Immigration",
    title: "Your Pathway to Global Immigration",
    subtitle: "Expert immigration counseling for PR, work, and dependent visas",
    imageUrl: "",
    ctaLabel: "Check Eligibility",
    ctaHref: "/visa-checker",
  },
  {
    pageKey: "test-prep",
    pageLabel: "Test Preparation",
    title: "Ace Your Language & Aptitude Tests",
    subtitle: "Expert coaching for IELTS, PTE, TOEFL, GRE, GMAT, SAT",
    imageUrl: "",
    ctaLabel: "Book Demo Class",
    ctaHref: "/test-preparation",
  },
  {
    pageKey: "contact",
    pageLabel: "Contact Us",
    title: "Get in Touch with Our Experts",
    subtitle: "We're here to help — reach out anytime",
    imageUrl: "",
    ctaLabel: "Book Free Counseling",
    ctaHref: "/free-counseling",
  },
  {
    pageKey: "careers",
    pageLabel: "Careers",
    title: "Build a Career That Matters",
    subtitle: "Join the Valmiki Group family and shape global education",
    imageUrl: "",
    ctaLabel: "View Open Roles",
    ctaHref: "/careers",
  },
];

import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Save,
} from "lucide-react";
import ImageUpload from "../../components/admin/ImageUpload";

interface HeroState {
  headline: string;
  subheadline: string;
  imageUrl: string;
}

const PAGES = [
  { id: "services", label: "Services" },
  { id: "study-abroad", label: "Study Abroad" },
  { id: "countries", label: "Countries" },
  { id: "test-prep", label: "Test Preparation" },
  { id: "immigration", label: "Immigration" },
  { id: "success-stories", label: "Success Stories" },
  { id: "blog", label: "Blog" },
  { id: "careers", label: "Careers" },
  { id: "contact", label: "Contact" },
] as const;

export default function AdminPageHeroes() {
  const [heroes, setHeroes] = useState<Record<string, HeroState>>(
    Object.fromEntries(
      PAGES.map((p) => [p.id, { headline: "", subheadline: "", imageUrl: "" }]),
    ),
  );
  const [expanded, setExpanded] = useState<string | null>("services");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedMsg, setSavedMsg] = useState<
    Record<string, "success" | "error" | "">
  >({});
  const { actor } = useActor(createActor);

  useEffect(() => {
    if (!actor) return;
    Promise.all(
      PAGES.map(async (p) => {
        try {
          const result = await actor.getPageHeroContent(p.id);
          return { id: p.id, data: result };
        } catch {
          return { id: p.id, data: null };
        }
      }),
    ).then((results) => {
      const updates: Record<string, HeroState> = {};
      for (const r of results) {
        if (r.data)
          updates[r.id] = {
            headline: r.data.headline,
            subheadline: r.data.subheadline,
            imageUrl: r.data.imageUrl,
          };
      }
      setHeroes((prev) => ({ ...prev, ...updates }));
      setLoading(false);
    });
  }, [actor]);

  const updateHero = (
    pageId: string,
    field: keyof HeroState,
    value: string,
  ) => {
    setHeroes((prev) => ({
      ...prev,
      [pageId]: { ...prev[pageId], [field]: value },
    }));
  };

  const saveHero = async (pageId: string) => {
    const token = localStorage.getItem("valmikiAdminToken") || "";
    setSaving((prev) => ({ ...prev, [pageId]: true }));
    try {
      if (!actor) throw new Error("Not connected");
      await actor.updatePageHeroContent(token, {
        pageId,
        headline: heroes[pageId]?.headline || "",
        subheadline: heroes[pageId]?.subheadline || "",
        imageUrl: heroes[pageId]?.imageUrl || "",
      });
      setSavedMsg((prev) => ({ ...prev, [pageId]: "success" }));
      setTimeout(
        () => setSavedMsg((prev) => ({ ...prev, [pageId]: "" })),
        3000,
      );
    } catch {
      setSavedMsg((prev) => ({ ...prev, [pageId]: "error" }));
    } finally {
      setSaving((prev) => ({ ...prev, [pageId]: false }));
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/40 focus:border-[#FF8A00]";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Page Hero Editors</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the hero headline, subheadline, and background image for each
          page.
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00]" />
        </div>
      ) : (
        <div className="space-y-3">
          {PAGES.map((page) => {
            const isOpen = expanded === page.id;
            return (
              <div
                key={page.id}
                className="rounded-xl border border-border bg-card shadow-subtle overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : page.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="font-semibold text-[#0B1F3A]">
                    {page.label}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-[#FF8A00]" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`${page.id}-headline`}
                        className="text-sm font-medium text-[#0B1F3A]"
                      >
                        Hero Headline
                      </label>
                      <input
                        id={`${page.id}-headline`}
                        type="text"
                        value={heroes[page.id]?.headline || ""}
                        onChange={(e) =>
                          updateHero(page.id, "headline", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Page headline"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor={`${page.id}-subheadline`}
                        className="text-sm font-medium text-[#0B1F3A]"
                      >
                        Hero Subheadline
                      </label>
                      <input
                        id={`${page.id}-subheadline`}
                        type="text"
                        value={heroes[page.id]?.subheadline || ""}
                        onChange={(e) =>
                          updateHero(page.id, "subheadline", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Page subheadline"
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-[#0B1F3A]">
                        Hero Background Image
                      </span>
                      <ImageUpload
                        value={heroes[page.id]?.imageUrl || ""}
                        onChange={(url) => updateHero(page.id, "imageUrl", url)}
                        label="Hero Background Image"
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => saveHero(page.id)}
                        disabled={saving[page.id]}
                        className="flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e67800] disabled:opacity-50 transition-colors"
                      >
                        {saving[page.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save {page.label} Hero
                      </button>
                      {savedMsg[page.id] === "success" && (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Saved!
                        </span>
                      )}
                      {savedMsg[page.id] === "error" && (
                        <span className="flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          Save failed
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
