import { createActor } from "@/backend";
import type { HomeSectionsContent } from "@/backend";
import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { CheckCircle2, Loader2, Minus, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";

type WhyPoint = { title: string; description: string; icon: string };
type SocialLink = { platform: string; url: string };

const defaultContent: HomeSectionsContent = {
  whyChooseUsHeadline: "Why Valmiki Group Leads the Way",
  whyChooseUsPoints: [],
  ctaBannerHeadline: "Your Global Career Starts Here",
  ctaBannerSubheadline:
    "Take the first step toward your global education dreams. Book a free counseling session with our expert advisors today.",
  ctaBannerButtonText: "Book Your Free Counseling Session",
  footerDescription:
    "Trusted overseas education & immigration experts since 2001. Guiding 1 lakh+ students to global opportunities with 93% visa success rate.",
  footerSocialLinks: [],
  testimonialsDisplayCount: BigInt(6),
  universityMarqueeEnabled: true,
  eventsDisplayCount: BigInt(4),
};

export default function AdminHomeSections() {
  const { actor } = useActor(createActor);
  const token =
    typeof window !== "undefined"
      ? (localStorage.getItem("valmikiAdminToken") ?? "")
      : "";

  const [form, setForm] = useState<HomeSectionsContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!actor) return;
    actor
      .getHomeSectionsContent()
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await actor.updateHomeSectionsContent(token, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addWhyPoint = () =>
    setForm((f) => ({
      ...f,
      whyChooseUsPoints: [
        ...f.whyChooseUsPoints,
        { title: "", description: "", icon: "Star" },
      ],
    }));

  const removeWhyPoint = (i: number) =>
    setForm((f) => ({
      ...f,
      whyChooseUsPoints: f.whyChooseUsPoints.filter((_, idx) => idx !== i),
    }));

  const updateWhyPoint = (i: number, field: keyof WhyPoint, value: string) =>
    setForm((f) => ({
      ...f,
      whyChooseUsPoints: f.whyChooseUsPoints.map((p, idx) =>
        idx === i ? { ...p, [field]: value } : p,
      ),
    }));

  const addSocialLink = () =>
    setForm((f) => ({
      ...f,
      footerSocialLinks: [...f.footerSocialLinks, { platform: "", url: "" }],
    }));

  const removeSocialLink = (i: number) =>
    setForm((f) => ({
      ...f,
      footerSocialLinks: f.footerSocialLinks.filter((_, idx) => idx !== i),
    }));

  const updateSocialLink = (
    i: number,
    field: keyof SocialLink,
    value: string,
  ) =>
    setForm((f) => ({
      ...f,
      footerSocialLinks: f.footerSocialLinks.map((s, idx) =>
        idx === i ? { ...s, [field]: value } : s,
      ),
    }));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "#0B1F3A" }}
          >
            Home Sections
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edit Why Choose Us, CTA Banner, Footer Content, and Display Settings
          </p>
        </div>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
          style={{ background: saving ? "#94a3b8" : "#FF8A00", color: "white" }}
          data-ocid="admin.home_sections.save_button"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {success && (
        <div
          className="flex items-center gap-2 rounded-lg p-4 text-sm font-medium"
          style={{ background: "#dcfce7", color: "#166534" }}
          data-ocid="admin.home_sections.success_state"
        >
          <CheckCircle2 className="h-4 w-4" />
          Home sections updated successfully!
        </div>
      )}
      {error && (
        <div
          className="rounded-lg p-4 text-sm font-medium"
          style={{ background: "#fee2e2", color: "#991b1b" }}
          data-ocid="admin.home_sections.error_state"
        >
          {error}
        </div>
      )}

      {/* Why Choose Us */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-subtle">
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "#0B1F3A" }}
        >
          Why Choose Us
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Section headline and feature points shown on the homepage
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="why-headline"
              className="block text-sm font-medium text-foreground"
            >
              Section Headline
            </label>
            <input
              id="why-headline"
              type="text"
              value={form.whyChooseUsHeadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, whyChooseUsHeadline: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              placeholder="Why Valmiki Group Leads the Way"
              data-ocid="admin.home_sections.why_headline_input"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="block text-sm font-medium text-foreground">
                Feature Points ({form.whyChooseUsPoints.length})
              </span>
              <button
                type="button"
                onClick={addWhyPoint}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "#0B1F3A" }}
                data-ocid="admin.home_sections.add_why_point_button"
              >
                <Plus className="h-3.5 w-3.5" /> Add Point
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {form.whyChooseUsPoints.map((point, i) => (
                <div
                  key={point.title || `why-point-${i}`}
                  className="rounded-lg border border-border bg-background p-4"
                  data-ocid={`admin.home_sections.why_point.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor={`why-title-${i}`}
                          className="block text-xs font-medium text-muted-foreground"
                        >
                          Title
                        </label>
                        <input
                          id={`why-title-${i}`}
                          type="text"
                          value={point.title}
                          onChange={(e) =>
                            updateWhyPoint(i, "title", e.target.value)
                          }
                          className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none"
                          placeholder="24+ Years Experience"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`why-desc-${i}`}
                          className="block text-xs font-medium text-muted-foreground"
                        >
                          Description
                        </label>
                        <input
                          id={`why-desc-${i}`}
                          type="text"
                          value={point.description}
                          onChange={(e) =>
                            updateWhyPoint(i, "description", e.target.value)
                          }
                          className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none"
                          placeholder="Two decades of trusted guidance"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`why-icon-${i}`}
                          className="block text-xs font-medium text-muted-foreground"
                        >
                          Icon Name
                        </label>
                        <input
                          id={`why-icon-${i}`}
                          type="text"
                          value={point.icon}
                          onChange={(e) =>
                            updateWhyPoint(i, "icon", e.target.value)
                          }
                          className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none"
                          placeholder="Star"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWhyPoint(i)}
                      className="mt-5 rounded p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove point"
                      data-ocid={`admin.home_sections.remove_why_point.${i + 1}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {form.whyChooseUsPoints.length === 0 && (
                <p
                  className="rounded-lg py-6 text-center text-sm text-muted-foreground"
                  style={{ background: "rgba(11,31,58,0.03)" }}
                  data-ocid="admin.home_sections.why_points.empty_state"
                >
                  No points yet. Click Add Point to create one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-subtle">
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "#0B1F3A" }}
        >
          CTA Banner
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The full-width call-to-action section at the bottom of the homepage
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="cta-headline"
              className="block text-sm font-medium text-foreground"
            >
              Headline
            </label>
            <input
              id="cta-headline"
              type="text"
              value={form.ctaBannerHeadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaBannerHeadline: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              placeholder="Your Global Career Starts Here"
              data-ocid="admin.home_sections.cta_headline_input"
            />
          </div>
          <div>
            <label
              htmlFor="cta-subheadline"
              className="block text-sm font-medium text-foreground"
            >
              Sub-headline
            </label>
            <input
              id="cta-subheadline"
              type="text"
              value={form.ctaBannerSubheadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaBannerSubheadline: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              placeholder="Take the first step..."
              data-ocid="admin.home_sections.cta_subheadline_input"
            />
          </div>
          <div>
            <label
              htmlFor="cta-button-text"
              className="block text-sm font-medium text-foreground"
            >
              Button Text
            </label>
            <input
              id="cta-button-text"
              type="text"
              value={form.ctaBannerButtonText}
              onChange={(e) =>
                setForm((f) => ({ ...f, ctaBannerButtonText: e.target.value }))
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              placeholder="Book Your Free Counseling Session"
              data-ocid="admin.home_sections.cta_button_text_input"
            />
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-subtle">
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "#0B1F3A" }}
        >
          Footer Content
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Company description and social media links shown in the footer
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="footer-description"
              className="block text-sm font-medium text-foreground"
            >
              Company Description
            </label>
            <textarea
              id="footer-description"
              value={form.footerDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, footerDescription: e.target.value }))
              }
              rows={3}
              className="mt-1.5 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              placeholder="Trusted overseas education & immigration experts since 2001..."
              data-ocid="admin.home_sections.footer_description_textarea"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="block text-sm font-medium text-foreground">
                Social Media Links ({form.footerSocialLinks.length})
              </span>
              <button
                type="button"
                onClick={addSocialLink}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "#0B1F3A" }}
                data-ocid="admin.home_sections.add_social_link_button"
              >
                <Plus className="h-3.5 w-3.5" /> Add Link
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {form.footerSocialLinks.map((link, i) => (
                <div
                  key={link.platform || `social-link-${i}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                  data-ocid={`admin.home_sections.social_link.${i + 1}`}
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor={`social-platform-${i}`}
                        className="block text-xs font-medium text-muted-foreground"
                      >
                        Platform
                      </label>
                      <input
                        id={`social-platform-${i}`}
                        type="text"
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(i, "platform", e.target.value)
                        }
                        className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none"
                        placeholder="LinkedIn"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`social-url-${i}`}
                        className="block text-xs font-medium text-muted-foreground"
                      >
                        URL
                      </label>
                      <input
                        id={`social-url-${i}`}
                        type="url"
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(i, "url", e.target.value)
                        }
                        className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none"
                        placeholder="https://linkedin.com/..."
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(i)}
                    className="mt-4 rounded p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove social link"
                    data-ocid={`admin.home_sections.remove_social_link.${i + 1}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {form.footerSocialLinks.length === 0 && (
                <p
                  className="rounded-lg py-5 text-center text-sm text-muted-foreground"
                  style={{ background: "rgba(11,31,58,0.03)" }}
                  data-ocid="admin.home_sections.social_links.empty_state"
                >
                  No social links yet. Click Add Link to add one.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-subtle">
        <h2
          className="font-display text-lg font-semibold"
          style={{ color: "#0B1F3A" }}
        >
          Display Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control how many items appear and toggle marquee visibility
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="testimonials-count"
              className="block text-sm font-medium text-foreground"
            >
              Testimonials to Display
            </label>
            <input
              id="testimonials-count"
              type="number"
              min={1}
              max={20}
              value={Number(form.testimonialsDisplayCount)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  testimonialsDisplayCount: BigInt(
                    Number.parseInt(e.target.value) || 6,
                  ),
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.home_sections.testimonials_count_input"
            />
          </div>
          <div>
            <label
              htmlFor="events-count"
              className="block text-sm font-medium text-foreground"
            >
              Events to Display
            </label>
            <input
              id="events-count"
              type="number"
              min={1}
              max={12}
              value={Number(form.eventsDisplayCount)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  eventsDisplayCount: BigInt(
                    Number.parseInt(e.target.value) || 4,
                  ),
                }))
              }
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.home_sections.events_count_input"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="block text-sm font-medium text-foreground">
              University Marquee
            </span>
            <label className="mt-2 flex cursor-pointer items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.universityMarqueeEnabled}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      universityMarqueeEnabled: e.target.checked,
                    }))
                  }
                  className="sr-only"
                  data-ocid="admin.home_sections.marquee_toggle"
                />
                <div
                  className="h-6 w-11 rounded-full transition-colors"
                  style={{
                    background: form.universityMarqueeEnabled
                      ? "#FF8A00"
                      : "#d1d5db",
                  }}
                />
                <div
                  className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                  style={{
                    transform: form.universityMarqueeEnabled
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </div>
              <span className="text-sm text-foreground">
                {form.universityMarqueeEnabled ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Save */}
      <div className="flex justify-end pb-4">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
          style={{ background: saving ? "#94a3b8" : "#FF8A00", color: "white" }}
          data-ocid="admin.home_sections.bottom_save_button"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}
