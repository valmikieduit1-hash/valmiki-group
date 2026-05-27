import { createActor } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface GalleryImage {
  imageUrl: string;
  caption: string;
}

interface Perk {
  title: string;
  description: string;
  icon: string;
}

interface LifeContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroImageUrl: string;
  missionText: string;
  cultureDescription: string;
  galleryImages: GalleryImage[];
  perks: Perk[];
}

const defaultContent: LifeContent = {
  heroHeadline: "",
  heroSubheadline: "",
  heroImageUrl: "",
  missionText: "",
  cultureDescription: "",
  galleryImages: [],
  perks: [],
};

export default function AdminLifeAtValmiki() {
  const { actor } = useActor(createActor);
  const [content, setContent] = useState<LifeContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  useEffect(() => {
    if (!actor) return;
    actor
      .getLifeAtValmikiContent()
      .then((result) => {
        const data = Array.isArray(result) ? result[0] : result;
        if (data) {
          setContent({
            heroHeadline: data.heroHeadline ?? "",
            heroSubheadline: data.heroSubheadline ?? "",
            heroImageUrl: data.heroImageUrl ?? "",
            missionText: data.missionText ?? "",
            cultureDescription: data.cultureDescription ?? "",
            galleryImages: Array.isArray(data.galleryImages)
              ? (data.galleryImages as GalleryImage[])
              : [],
            perks: Array.isArray(data.perks) ? (data.perks as Perk[]) : [],
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
      const result = await actor.updateLifeAtValmikiContent(token, content);
      if (result.__kind__ === "ok") {
        toast.success("Life@Valmiki page saved!");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = () => {
    setContent((p) => ({
      ...p,
      galleryImages: [...p.galleryImages, { imageUrl: "", caption: "" }],
    }));
  };

  const updateGalleryImage = (
    idx: number,
    field: keyof GalleryImage,
    value: string,
  ) => {
    setContent((p) => ({
      ...p,
      galleryImages: p.galleryImages.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeGalleryImage = (idx: number) => {
    setContent((p) => ({
      ...p,
      galleryImages: p.galleryImages.filter((_, i) => i !== idx),
    }));
  };

  const addPerk = () => {
    setContent((p) => ({
      ...p,
      perks: [...p.perks, { title: "", description: "", icon: "" }],
    }));
  };

  const updatePerk = (idx: number, field: keyof Perk, value: string) => {
    setContent((p) => ({
      ...p,
      perks: p.perks.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removePerk = (idx: number) => {
    setContent((p) => ({
      ...p,
      perks: p.perks.filter((_, i) => i !== idx),
    }));
  };

  if (loading) {
    return (
      <div
        className="flex h-64 items-center justify-center"
        data-ocid="admin.life.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#FF8A00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.life.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Life@Valmiki Editor
        </h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.life.save_button"
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
              htmlFor="life-hero-headline"
              className="block text-sm font-medium text-foreground"
            >
              Hero Headline
            </label>
            <input
              id="life-hero-headline"
              type="text"
              value={content.heroHeadline}
              onChange={(e) =>
                setContent((p) => ({ ...p, heroHeadline: e.target.value }))
              }
              placeholder="e.g. Thrive & Grow at Valmiki"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.life.hero_headline.input"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="life-hero-sub"
              className="block text-sm font-medium text-foreground"
            >
              Hero Subheadline
            </label>
            <input
              id="life-hero-sub"
              type="text"
              value={content.heroSubheadline}
              onChange={(e) =>
                setContent((p) => ({ ...p, heroSubheadline: e.target.value }))
              }
              placeholder="Subheadline text"
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.life.hero_subheadline.input"
            />
          </div>
          <ImageUpload
            label="Hero Background Image"
            value={content.heroImageUrl}
            onChange={(url) => setContent((p) => ({ ...p, heroImageUrl: url }))}
          />
        </div>
      </div>

      {/* Mission & Culture */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="font-semibold text-foreground">Mission & Culture</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="life-mission"
              className="block text-sm font-medium text-foreground"
            >
              Mission Text
            </label>
            <textarea
              id="life-mission"
              rows={4}
              value={content.missionText}
              onChange={(e) =>
                setContent((p) => ({ ...p, missionText: e.target.value }))
              }
              placeholder="Our mission statement..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.life.mission_text.textarea"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="life-culture"
              className="block text-sm font-medium text-foreground"
            >
              Culture Description
            </label>
            <textarea
              id="life-culture"
              rows={4}
              value={content.cultureDescription}
              onChange={(e) =>
                setContent((p) => ({
                  ...p,
                  cultureDescription: e.target.value,
                }))
              }
              placeholder="Describe the workplace culture..."
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              data-ocid="admin.life.culture_description.textarea"
            />
          </div>
        </div>
      </div>

      {/* Gallery Images */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Gallery Images</h3>
          <button
            type="button"
            onClick={addGalleryImage}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.life.gallery.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Image
          </button>
        </div>

        {content.galleryImages.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.life.gallery.empty_state"
          >
            No gallery images yet. Click Add Image to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {content.galleryImages.map((item, idx) => (
              <div
                key={item.imageUrl || item.caption || `gallery-item-${idx}`}
                className="rounded-lg border border-border bg-background p-4 space-y-3"
                data-ocid={`admin.life.gallery.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Image {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Remove image"
                    data-ocid={`admin.life.gallery.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ImageUpload
                  label="Gallery Image"
                  value={item.imageUrl}
                  onChange={(url) => updateGalleryImage(idx, "imageUrl", url)}
                />
                <div className="space-y-1.5">
                  <label
                    htmlFor={`gallery-caption-${idx}`}
                    className="block text-sm font-medium text-foreground"
                  >
                    Caption
                  </label>
                  <input
                    id={`gallery-caption-${idx}`}
                    type="text"
                    value={item.caption}
                    onChange={(e) =>
                      updateGalleryImage(idx, "caption", e.target.value)
                    }
                    placeholder="Image caption"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid={`admin.life.gallery.caption.input.${idx + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Perks */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Perks & Benefits</h3>
          <button
            type="button"
            onClick={addPerk}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.life.perks.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Perk
          </button>
        </div>

        {content.perks.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.life.perks.empty_state"
          >
            No perks added yet. Click Add Perk to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {content.perks.map((perk, idx) => (
              <div
                key={perk.title || `perk-item-${idx}`}
                className="rounded-lg border border-border bg-background p-4 space-y-3"
                data-ocid={`admin.life.perks.item.${idx + 1}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Perk {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePerk(idx)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Remove perk"
                    data-ocid={`admin.life.perks.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`perk-title-${idx}`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Title
                    </label>
                    <input
                      id={`perk-title-${idx}`}
                      type="text"
                      value={perk.title}
                      onChange={(e) => updatePerk(idx, "title", e.target.value)}
                      placeholder="e.g. Health Insurance"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid={`admin.life.perks.title.input.${idx + 1}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`perk-icon-${idx}`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Icon (emoji)
                    </label>
                    <input
                      id={`perk-icon-${idx}`}
                      type="text"
                      value={perk.icon}
                      onChange={(e) => updatePerk(idx, "icon", e.target.value)}
                      placeholder="🏥"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid={`admin.life.perks.icon.input.${idx + 1}`}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-1">
                    <label
                      htmlFor={`perk-desc-${idx}`}
                      className="block text-sm font-medium text-foreground"
                    >
                      Description
                    </label>
                    <input
                      id={`perk-desc-${idx}`}
                      type="text"
                      value={perk.description}
                      onChange={(e) =>
                        updatePerk(idx, "description", e.target.value)
                      }
                      placeholder="Brief description"
                      className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid={`admin.life.perks.description.input.${idx + 1}`}
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
          data-ocid="admin.life.bottom_save_button"
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
