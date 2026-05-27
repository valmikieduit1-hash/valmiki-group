import { createActor } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  type EduLoanPartner,
  type FooterContent,
  type OfficeLocation,
  type ReviewsBadge,
  defaultFooterContent,
} from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Globe,
  Link2,
  MapPin,
  Plus,
  Save,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Tab =
  | "links"
  | "social"
  | "google"
  | "facebook"
  | "loans"
  | "offices"
  | "misc";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00] text-foreground";
const labelClass = "mb-1 block text-xs font-medium text-muted-foreground";

function LinkSection({
  title,
  links,
  onChange,
  ocidPrefix,
}: {
  title: string;
  links: { linkLabel: string; url: string }[];
  onChange: (updated: { linkLabel: string; url: string }[]) => void;
  ocidPrefix: string;
}) {
  const addLink = () => onChange([...links, { linkLabel: "", url: "" }]);
  const removeLink = (i: number) =>
    onChange(links.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: "linkLabel" | "url", val: string) => {
    const updated = [...links];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };
  return (
    <div>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div
            key={`${ocidPrefix}-link-${link.linkLabel}-${link.url}`}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <label
                htmlFor={`${ocidPrefix}_label_${i}`}
                className={labelClass}
              >
                Label
              </label>
              <input
                id={`${ocidPrefix}_label_${i}`}
                type="text"
                value={link.linkLabel}
                onChange={(e) => updateLink(i, "linkLabel", e.target.value)}
                placeholder="Link label"
                className={inputClass}
                data-ocid={`admin.footer.${ocidPrefix}_label.${i + 1}`}
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`${ocidPrefix}_url_${i}`} className={labelClass}>
                URL
              </label>
              <input
                id={`${ocidPrefix}_url_${i}`}
                type="text"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="/path or https://..."
                className={inputClass}
                data-ocid={`admin.footer.${ocidPrefix}_url.${i + 1}`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="mb-px flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
              aria-label="Delete link"
              data-ocid={`admin.footer.${ocidPrefix}_delete.${i + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addLink}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#FF8A00]/60 px-3 py-1.5 text-xs font-medium text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/5"
        data-ocid={`admin.footer.${ocidPrefix}_add_button`}
      >
        <Plus className="h-3.5 w-3.5" /> Add {title} Link
      </button>
    </div>
  );
}

function ReviewsBadgeSection({
  platform,
  badge,
  onChange,
  ocidPrefix,
}: {
  platform: string;
  badge: ReviewsBadge;
  onChange: (updated: ReviewsBadge) => void;
  ocidPrefix: string;
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => onChange({ ...badge, isVisible: !badge.isVisible })}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          badge.isVisible
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            : "bg-muted text-muted-foreground hover:bg-muted/70"
        }`}
        data-ocid={`admin.footer.${ocidPrefix}_visibility_toggle`}
      >
        {badge.isVisible ? (
          <Eye className="h-4 w-4" />
        ) : (
          <EyeOff className="h-4 w-4" />
        )}
        {badge.isVisible ? "Visible in footer" : "Hidden from footer"}
      </button>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor={`${ocidPrefix}_rating`} className={labelClass}>
            Rating (e.g. 4.8)
          </label>
          <input
            id={`${ocidPrefix}_rating`}
            type="text"
            value={badge.rating}
            onChange={(e) => onChange({ ...badge, rating: e.target.value })}
            placeholder="4.8"
            className={inputClass}
            data-ocid={`admin.footer.${ocidPrefix}_rating`}
          />
        </div>
        <div>
          <label htmlFor={`${ocidPrefix}_count`} className={labelClass}>
            Review Count Label
          </label>
          <input
            id={`${ocidPrefix}_count`}
            type="text"
            value={badge.reviewCount}
            onChange={(e) =>
              onChange({ ...badge, reviewCount: e.target.value })
            }
            placeholder="200+ reviews"
            className={inputClass}
            data-ocid={`admin.footer.${ocidPrefix}_count`}
          />
        </div>
        <div>
          <label htmlFor={`${ocidPrefix}_review_url`} className={labelClass}>
            Reviews Page URL
          </label>
          <input
            id={`${ocidPrefix}_review_url`}
            type="text"
            value={badge.reviewUrl}
            onChange={(e) => onChange({ ...badge, reviewUrl: e.target.value })}
            placeholder={`https://${platform.toLowerCase()}.com/...`}
            className={inputClass}
            data-ocid={`admin.footer.${ocidPrefix}_url`}
          />
        </div>
      </div>
      {badge.isVisible && (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Preview
          </p>
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <span className="font-semibold text-yellow-500">
              ★ {badge.rating}
            </span>
            <span className="text-muted-foreground">{badge.reviewCount}</span>
            <span className="text-xs text-primary">on {platform}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function EduLoanPartnersSection({
  partners,
  onChange,
}: {
  partners: EduLoanPartner[];
  onChange: (updated: EduLoanPartner[]) => void;
}) {
  const addPartner = () =>
    onChange([
      ...partners,
      { id: Date.now().toString(), name: "", logoUrl: "", websiteUrl: "" },
    ]);
  const removePartner = (id: string) =>
    onChange(partners.filter((p) => p.id !== id));
  const updatePartner = (
    id: string,
    field: keyof EduLoanPartner,
    val: string,
  ) =>
    onChange(partners.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
  return (
    <div className="space-y-3">
      {partners.length === 0 && (
        <p
          className="text-sm text-muted-foreground"
          data-ocid="admin.footer.loan_partners_empty_state"
        >
          No partners added yet. Click “Add Partner” to add your first education
          loan partner.
        </p>
      )}
      {partners.map((p, i) => (
        <div
          key={p.id}
          className="rounded-lg border border-border bg-muted/20 p-4"
          data-ocid={`admin.footer.loan_partner.${i + 1}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Partner {i + 1}
            </span>
            <button
              type="button"
              onClick={() => removePartner(p.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50"
              aria-label="Remove partner"
              data-ocid={`admin.footer.loan_partner_delete.${i + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`loan_partner_name_${i}`} className={labelClass}>
                Partner Name
              </label>
              <input
                id={`loan_partner_name_${i}`}
                type="text"
                value={p.name}
                onChange={(e) => updatePartner(p.id, "name", e.target.value)}
                placeholder="e.g. HDFC Credila"
                className={inputClass}
                data-ocid={`admin.footer.loan_partner_name.${i + 1}`}
              />
            </div>
            <div>
              <label
                htmlFor={`loan_partner_website_${i}`}
                className={labelClass}
              >
                Website URL
              </label>
              <input
                id={`loan_partner_website_${i}`}
                type="text"
                value={p.websiteUrl}
                onChange={(e) =>
                  updatePartner(p.id, "websiteUrl", e.target.value)
                }
                placeholder="https://partnerwebsite.com"
                className={inputClass}
                data-ocid={`admin.footer.loan_partner_website.${i + 1}`}
              />
            </div>
          </div>
          <div className="mt-3">
            <ImageUpload
              label="Partner Logo"
              value={p.logoUrl}
              onChange={(url) => updatePartner(p.id, "logoUrl", url)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addPartner}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#FF8A00]/60 px-3 py-1.5 text-xs font-medium text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/5"
        data-ocid="admin.footer.loan_partner_add_button"
      >
        <Plus className="h-3.5 w-3.5" /> Add Partner
      </button>
    </div>
  );
}

function OfficeLocationsSection({
  locations,
  onChange,
}: {
  locations: OfficeLocation[];
  onChange: (updated: OfficeLocation[]) => void;
}) {
  const addLocation = () =>
    onChange([
      ...locations,
      {
        id: Date.now().toString(),
        city: "",
        address: "",
        phone: "",
        email: "",
      },
    ]);
  const removeLocation = (id: string) =>
    onChange(locations.filter((l) => l.id !== id));
  const updateLocation = (
    id: string,
    field: keyof OfficeLocation,
    val: string,
  ) =>
    onChange(locations.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  return (
    <div className="space-y-3">
      {locations.length === 0 && (
        <p
          className="text-sm text-muted-foreground"
          data-ocid="admin.footer.offices_empty_state"
        >
          No offices added. Footer falls back to Contact page info. Click “Add
          Office” to override.
        </p>
      )}
      {locations.map((loc, i) => (
        <div
          key={loc.id}
          className="rounded-lg border border-border bg-muted/20 p-4"
          data-ocid={`admin.footer.office.${i + 1}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {loc.city || `Office ${i + 1}`}
            </span>
            <button
              type="button"
              onClick={() => removeLocation(loc.id)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-red-200 text-red-500 hover:bg-red-50"
              aria-label="Remove office"
              data-ocid={`admin.footer.office_delete.${i + 1}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`office_city_${i}`} className={labelClass}>
                City / Branch Name
              </label>
              <input
                id={`office_city_${i}`}
                type="text"
                value={loc.city}
                onChange={(e) => updateLocation(loc.id, "city", e.target.value)}
                placeholder="e.g. Secunderabad HQ"
                className={inputClass}
                data-ocid={`admin.footer.office_city.${i + 1}`}
              />
            </div>
            <div>
              <label htmlFor={`office_address_${i}`} className={labelClass}>
                Address
              </label>
              <input
                id={`office_address_${i}`}
                type="text"
                value={loc.address}
                onChange={(e) =>
                  updateLocation(loc.id, "address", e.target.value)
                }
                placeholder="Full street address"
                className={inputClass}
                data-ocid={`admin.footer.office_address.${i + 1}`}
              />
            </div>
            <div>
              <label htmlFor={`office_phone_${i}`} className={labelClass}>
                Phone
              </label>
              <input
                id={`office_phone_${i}`}
                type="text"
                value={loc.phone}
                onChange={(e) =>
                  updateLocation(loc.id, "phone", e.target.value)
                }
                placeholder="+91-90904 74777"
                className={inputClass}
                data-ocid={`admin.footer.office_phone.${i + 1}`}
              />
            </div>
            <div>
              <label htmlFor={`office_email_${i}`} className={labelClass}>
                Email
              </label>
              <input
                id={`office_email_${i}`}
                type="email"
                value={loc.email}
                onChange={(e) =>
                  updateLocation(loc.id, "email", e.target.value)
                }
                placeholder="branch@valmikigroup.com"
                className={inputClass}
                data-ocid={`admin.footer.office_email.${i + 1}`}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addLocation}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#FF8A00]/60 px-3 py-1.5 text-xs font-medium text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/5"
        data-ocid="admin.footer.office_add_button"
      >
        <Plus className="h-3.5 w-3.5" /> Add Office
      </button>
    </div>
  );
}

function SocialSection({
  links,
  onChange,
}: {
  links: { platform: string; url: string }[];
  onChange: (updated: { platform: string; url: string }[]) => void;
}) {
  const addLink = () => onChange([...links, { platform: "", url: "" }]);
  const removeLink = (i: number) =>
    onChange(links.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: "platform" | "url", val: string) => {
    const updated = [...links];
    updated[i] = { ...updated[i], [field]: val };
    onChange(updated);
  };
  return (
    <div>
      <div className="space-y-2">
        {links.map((link, i) => (
          <div
            key={`social-${link.platform}-${link.url}`}
            className="flex items-end gap-2"
          >
            <div className="w-40 shrink-0">
              <label htmlFor={`social_platform_${i}`} className={labelClass}>
                Platform Name
              </label>
              <input
                id={`social_platform_${i}`}
                type="text"
                value={link.platform}
                onChange={(e) => updateLink(i, "platform", e.target.value)}
                placeholder="Facebook"
                className={inputClass}
                data-ocid={`admin.footer.social_platform.${i + 1}`}
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`social_url_${i}`} className={labelClass}>
                Profile URL
              </label>
              <input
                id={`social_url_${i}`}
                type="text"
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="https://..."
                className={inputClass}
                data-ocid={`admin.footer.social_url.${i + 1}`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="mb-px flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50"
              aria-label="Delete social link"
              data-ocid={`admin.footer.social_delete.${i + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Supported platform names: LinkedIn, Facebook, Instagram, YouTube,
        Twitter, WhatsApp, Pinterest
      </p>
      <button
        type="button"
        onClick={addLink}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#FF8A00]/60 px-3 py-1.5 text-xs font-medium text-[#FF8A00] transition-colors hover:bg-[#FF8A00]/5"
        data-ocid="admin.footer.social_add_button"
      >
        <Plus className="h-3.5 w-3.5" /> Add Social Platform
      </button>
    </div>
  );
}

function AccordionSection({
  id,
  title,
  icon,
  children,
  open,
  onToggle,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
        aria-expanded={open}
        data-ocid={`admin.footer.section_toggle.${id}`}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-[#FF8A00]">{icon}</span>
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div ref={contentRef} className="border-t border-border px-6 py-5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AdminFooter() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<FooterContent>(defaultFooterContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<Tab>("links");
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  useEffect(() => {
    if (!actor) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (actor as any)
      .getFooterContent()
      .then((result: FooterContent | null) => {
        if (result) {
          setForm({
            ...defaultFooterContent,
            ...result,
            googleReviewsBadge:
              result.googleReviewsBadge ??
              defaultFooterContent.googleReviewsBadge,
            facebookReviewsBadge:
              result.facebookReviewsBadge ??
              defaultFooterContent.facebookReviewsBadge,
            eduLoanPartners: result.eduLoanPartners ?? [],
            officeLocations: result.officeLocations ?? [],
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).updateFooterContent(token, form);
      if (result && "err" in result) {
        toast.error(result.err);
      } else {
        toast.success("Footer updated successfully!");
      }
    } catch {
      toast.error("Failed to save footer content");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (id: Tab) =>
    setOpenSection((prev) => (prev === id ? ("" as Tab) : id));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  const SaveBtn = ({ ocid }: { ocid: string }) => (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#FF8A00]/90 disabled:opacity-50"
      data-ocid={ocid}
    >
      <Save className="h-4 w-4" />
      {saving ? "Saving..." : "Save All Changes"}
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Footer Editor
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Click any section to expand and edit it. Save all changes together.
          </p>
        </div>
        <SaveBtn ocid="admin.footer.save_button" />
      </div>

      <AccordionSection
        id="links"
        title="Page Links — Quick, Services & Countries"
        icon={<Link2 className="h-4 w-4" />}
        open={openSection === "links"}
        onToggle={() => toggleSection("links")}
      >
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FF8A00]">
              Quick Links
            </h4>
            <LinkSection
              title="Quick"
              links={form.quickLinks}
              onChange={(v) => setForm((p) => ({ ...p, quickLinks: v }))}
              ocidPrefix="quick_link"
            />
          </div>
          <div className="border-t border-border pt-5">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FF8A00]">
              Services Links
            </h4>
            <LinkSection
              title="Service"
              links={form.serviceLinks}
              onChange={(v) => setForm((p) => ({ ...p, serviceLinks: v }))}
              ocidPrefix="service_link"
            />
          </div>
          <div className="border-t border-border pt-5">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#FF8A00]">
              Countries Links
            </h4>
            <LinkSection
              title="Country"
              links={form.countryLinks}
              onChange={(v) => setForm((p) => ({ ...p, countryLinks: v }))}
              ocidPrefix="country_link"
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        id="social"
        title="Social Media Links"
        icon={<Share2 className="h-4 w-4" />}
        open={openSection === "social"}
        onToggle={() => toggleSection("social")}
      >
        <SocialSection
          links={form.socialLinks}
          onChange={(v) => setForm((p) => ({ ...p, socialLinks: v }))}
        />
      </AccordionSection>

      <AccordionSection
        id="google"
        title="Google Reviews Badge"
        icon={<Star className="h-4 w-4" />}
        open={openSection === "google"}
        onToggle={() => toggleSection("google")}
      >
        <ReviewsBadgeSection
          platform="Google"
          badge={form.googleReviewsBadge}
          onChange={(v) => setForm((p) => ({ ...p, googleReviewsBadge: v }))}
          ocidPrefix="google_reviews"
        />
      </AccordionSection>

      <AccordionSection
        id="facebook"
        title="Facebook Reviews Badge"
        icon={<Star className="h-4 w-4" />}
        open={openSection === "facebook"}
        onToggle={() => toggleSection("facebook")}
      >
        <ReviewsBadgeSection
          platform="Facebook"
          badge={form.facebookReviewsBadge}
          onChange={(v) => setForm((p) => ({ ...p, facebookReviewsBadge: v }))}
          ocidPrefix="facebook_reviews"
        />
      </AccordionSection>

      <AccordionSection
        id="loans"
        title="Education Loan Partners"
        icon={<Building2 className="h-4 w-4" />}
        open={openSection === "loans"}
        onToggle={() => toggleSection("loans")}
      >
        <EduLoanPartnersSection
          partners={form.eduLoanPartners}
          onChange={(v) => setForm((p) => ({ ...p, eduLoanPartners: v }))}
        />
      </AccordionSection>

      <AccordionSection
        id="offices"
        title="Office Locations"
        icon={<MapPin className="h-4 w-4" />}
        open={openSection === "offices"}
        onToggle={() => toggleSection("offices")}
      >
        <OfficeLocationsSection
          locations={form.officeLocations}
          onChange={(v) => setForm((p) => ({ ...p, officeLocations: v }))}
        />
      </AccordionSection>

      <AccordionSection
        id="misc"
        title="WhatsApp Number & Copyright"
        icon={<Globe className="h-4 w-4" />}
        open={openSection === "misc"}
        onToggle={() => toggleSection("misc")}
      >
        <div className="space-y-5">
          <div className="max-w-sm">
            <label htmlFor="whatsapp-number" className={labelClass}>
              WhatsApp Number (digits only with country code, e.g. 919090474777)
            </label>
            <input
              id="whatsapp-number"
              type="text"
              value={form.whatsappNumber}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))
              }
              placeholder="919090474777"
              className={inputClass}
              data-ocid="admin.footer.whatsapp_number"
            />
          </div>
          <div className="border-t border-border pt-5">
            <label htmlFor="copyright-text" className={labelClass}>
              Copyright Text — use{" "}
              <code className="rounded bg-muted px-1 py-0.5">{"{year}"}</code>{" "}
              as placeholder for the current year
            </label>
            <input
              id="copyright-text"
              type="text"
              value={form.copyrightText}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, copyrightText: e.target.value }))
              }
              placeholder="© {year} Valmiki Group. All rights reserved."
              className={inputClass}
              data-ocid="admin.footer.copyright_text"
            />
            {form.copyrightText && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Preview:{" "}
                {form.copyrightText.replace(
                  "{year}",
                  String(new Date().getFullYear()),
                )}
              </p>
            )}
          </div>
        </div>
      </AccordionSection>

      <div className="sticky bottom-0 rounded-xl border border-border bg-card/80 px-6 py-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Changes are not saved until you click Save All Changes.
          </p>
          <SaveBtn ocid="admin.footer.save_button_bottom" />
        </div>
      </div>
    </div>
  );
}
