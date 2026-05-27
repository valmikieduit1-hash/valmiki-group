import { createActor } from "@/backend";
import type { TestimonialInput, TestimonialItem } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Eye, EyeOff, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

type TestimonialForm = TestimonialInput & { youtubeUrl?: string };

const emptyForm: TestimonialForm = {
  name: "",
  university: "",
  country: "",
  course: "",
  text: "",
  rating: BigInt(5),
  imageUrl: "",
  isVisible: true,
  youtubeUrl: "",
};

export default function AdminTestimonials() {
  const { actor } = useActor(createActor);
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  const fetch = () => {
    if (!actor) return;
    actor
      .getTestimonials()
      .then((t) => {
        setItems(t);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    fetch();
  }, [actor]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: TestimonialItem) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      university: t.university,
      country: t.country,
      course: t.course,
      text: t.text,
      rating: t.rating,
      imageUrl: t.imageUrl,
      isVisible: t.isVisible,
      youtubeUrl: t.youtubeUrl || "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Name and review text are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.youtubeUrl) {
        payload.youtubeUrl = undefined;
      }
      if (editingId !== null) {
        const result = await actor.updateTestimonial(token, editingId, payload);
        if (result.__kind__ === "ok") toast.success("Testimonial updated");
        else toast.error(result.err);
      } else {
        const result = await actor.addTestimonial(token, payload);
        if (result.__kind__ === "ok") toast.success("Testimonial added");
        else toast.error(result.err);
      }
      setModalOpen(false);
      fetch();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    try {
      const result = await actor.deleteTestimonial(token, id);
      if (result.__kind__ === "ok") {
        toast.success("Deleted");
        fetch();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  const toggleVisibility = async (t: TestimonialItem) => {
    if (!actor) return;
    const updated = { ...t, isVisible: !t.isVisible };
    try {
      const result = await actor.updateTestimonial(token, t.id, updated);
      if (result.__kind__ === "ok") {
        toast.success(updated.isVisible ? "Made visible" : "Hidden");
        fetch();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to update");
    }
  };

  const updateForm = (
    field: keyof TestimonialForm,
    value: string | boolean | bigint,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Testimonials
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90"
          data-ocid="admin.testimonials.add_button"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-subtle">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                University
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Country
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Rating
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Visible
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((t) => (
              <tr key={String(t.id)} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {t.name}
                    {t.youtubeUrl && (
                      <span className="rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        VIDEO
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {t.university}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.country}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Number(t.rating) }).map((_, i) => (
                      <Star
                        key={`${String(t.id)}-star-${String(i)}`}
                        className="h-3.5 w-3.5 fill-[#FFC247] text-[#FFC247]"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(t)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.isVisible
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-ocid={`admin.testimonials.visibility.${String(t.id)}`}
                  >
                    {t.isVisible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {t.isVisible ? "Visible" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(t)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                      aria-label="Edit"
                      data-ocid={`admin.testimonials.edit_button.${String(t.id)}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(t.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                      data-ocid={`admin.testimonials.delete_button.${String(t.id)}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No testimonials yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-3d max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="testimonial-name"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Name *
                  </label>
                  <input
                    id="testimonial-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="testimonial-university"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    University
                  </label>
                  <input
                    id="testimonial-university"
                    type="text"
                    value={form.university}
                    onChange={(e) => updateForm("university", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="testimonial-country"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Country
                  </label>
                  <input
                    id="testimonial-country"
                    type="text"
                    value={form.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="testimonial-course"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Course
                  </label>
                  <input
                    id="testimonial-course"
                    type="text"
                    value={form.course}
                    onChange={(e) => updateForm("course", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="testimonial-text"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Review Text *
                </label>
                <textarea
                  id="testimonial-text"
                  value={form.text}
                  onChange={(e) => updateForm("text", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="testimonial-rating"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Rating (1-5)
                  </label>
                  <input
                    id="testimonial-rating"
                    type="number"
                    min={1}
                    max={5}
                    value={String(form.rating)}
                    onChange={(e) =>
                      updateForm("rating", BigInt(e.target.value || 1))
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
                <div>
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => updateForm("imageUrl", url)}
                    label="Student Photo"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="testimonial-youtube"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  YouTube Video URL
                </label>
                <input
                  id="testimonial-youtube"
                  type="url"
                  value={form.youtubeUrl || ""}
                  onChange={(e) => updateForm("youtubeUrl", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Paste the full YouTube URL (e.g.
                  https://www.youtube.com/watch?v=...)
                </p>
              </div>
              <label
                htmlFor="testimonial-isVisible"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <input
                  id="testimonial-isVisible"
                  type="checkbox"
                  checked={form.isVisible}
                  onChange={(e) => updateForm("isVisible", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-[#FF8A00]"
                />
                Visible on website
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-50"
                data-ocid="admin.testimonials.modal.save_button"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-3d">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Delete Testimonial?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                data-ocid="admin.testimonials.confirm_delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
