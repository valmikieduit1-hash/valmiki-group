import { createActor } from "@/backend";
import type { PartnerUniversity } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

type UniversityForm = {
  name: string;
  logoUrl: string;
  country: string;
  website: string;
  order: number;
};

const emptyForm: UniversityForm = {
  name: "",
  logoUrl: "",
  country: "",
  website: "",
  order: 1,
};

export default function AdminPartnerUniversities() {
  const { actor } = useActor(createActor);
  const [universities, setUniversities] = useState<PartnerUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<UniversityForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  const fetchList = () => {
    if (!actor) return;
    actor
      .getPartnerUniversities()
      .then((list) => {
        setUniversities(
          [...list].sort((a, b) => Number(a.order) - Number(b.order)),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    fetchList();
  }, [actor]);

  const handleAdd = async () => {
    if (!actor) return;
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const uni: PartnerUniversity = {
        id: BigInt(0),
        name: form.name,
        logoUrl: form.logoUrl,
        country: form.country,
        website: form.website,
        order: BigInt(form.order),
      };
      const result = await actor.addPartnerUniversity(token, uni);
      if (result.__kind__ === "ok") {
        toast.success("University added");
        setShowAddForm(false);
        setForm(emptyForm);
        fetchList();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: bigint) => {
    if (!actor) return;
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const uni: PartnerUniversity = {
        id,
        name: form.name,
        logoUrl: form.logoUrl,
        country: form.country,
        website: form.website,
        order: BigInt(form.order),
      };
      const result = await actor.updatePartnerUniversity(token, id, uni);
      if (result.__kind__ === "ok") {
        toast.success("University updated");
        setEditingId(null);
        fetchList();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    try {
      const result = await actor.deletePartnerUniversity(token, id);
      if (result.__kind__ === "ok") {
        toast.success("Deleted");
        fetchList();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteConfirmId(null);
  };

  const handleReorder = async (fromIdx: number, toIdx: number) => {
    if (!actor) return;
    const reordered = [...universities];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    setUniversities(reordered);
    try {
      const orderedIds = reordered.map((u) => u.id);
      const result = await actor.reorderPartnerUniversities(token, orderedIds);
      if (result.__kind__ !== "ok") toast.error(result.err);
    } catch {
      toast.error("Failed to reorder");
      fetchList();
    }
  };

  const openEdit = (u: PartnerUniversity) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      logoUrl: u.logoUrl,
      country: u.country,
      website: u.website,
      order: Number(u.order),
    });
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5" data-ocid="admin.partners.page">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Partner Universities
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90"
          data-ocid="admin.partners.add_button"
        >
          <Plus className="h-4 w-4" /> Add University
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-xl border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Add New University
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
              data-ocid="admin.partners.add_form.close_button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="partner-name"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Name *
              </label>
              <input
                id="partner-name"
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                placeholder="University of Melbourne"
                data-ocid="admin.partners.name.input"
              />
            </div>
            <div>
              <label
                htmlFor="partner-country"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Country
              </label>
              <input
                id="partner-country"
                type="text"
                value={form.country}
                onChange={(e) =>
                  setForm((p) => ({ ...p, country: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                placeholder="Australia"
                data-ocid="admin.partners.country.input"
              />
            </div>
            <div>
              <label
                htmlFor="partner-website"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Website
              </label>
              <input
                id="partner-website"
                type="url"
                value={form.website}
                onChange={(e) =>
                  setForm((p) => ({ ...p, website: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                placeholder="https://unimelb.edu.au"
                data-ocid="admin.partners.website.input"
              />
            </div>
            <div>
              <label
                htmlFor="partner-order"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Display Order
              </label>
              <input
                id="partner-order"
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((p) => ({ ...p, order: Number(e.target.value) }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                min={1}
                data-ocid="admin.partners.order.input"
              />
            </div>
          </div>
          <ImageUpload
            label="University Logo"
            value={form.logoUrl}
            onChange={(url) => setForm((p) => ({ ...p, logoUrl: url }))}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving}
              className="rounded-lg bg-[#FF8A00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-60"
              data-ocid="admin.partners.add_submit_button"
            >
              {saving ? "Saving..." : "Add University"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
              data-ocid="admin.partners.add_cancel_button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Universities List */}
      {universities.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="admin.partners.empty_state"
        >
          <p className="text-muted-foreground">
            No partner universities yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">
                  Order
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Logo
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                  Country
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {universities.map((u, idx) => (
                <Fragment key={String(u.id)}>
                  <tr
                    key={String(u.id)}
                    className="hover:bg-muted/20"
                    data-ocid={`admin.partners.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => idx > 0 && handleReorder(idx, idx - 1)}
                          disabled={idx === 0}
                          className="rounded p-0.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          aria-label="Move up"
                          data-ocid={`admin.partners.move_up.${idx + 1}`}
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            idx < universities.length - 1 &&
                            handleReorder(idx, idx + 1)
                          }
                          disabled={idx === universities.length - 1}
                          className="rounded p-0.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
                          aria-label="Move down"
                          data-ocid={`admin.partners.move_down.${idx + 1}`}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.logoUrl ? (
                        <img
                          src={u.logoUrl}
                          alt={u.name}
                          className="h-10 w-16 rounded object-contain bg-muted"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="h-10 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          No logo
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {u.country}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                          aria-label="Edit"
                          data-ocid={`admin.partners.edit_button.${idx + 1}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50"
                          aria-label="Delete"
                          data-ocid={`admin.partners.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === u.id && (
                    <tr>
                      <td colSpan={5} className="bg-[#FF8A00]/5 px-4 py-4">
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="edit-partner-name"
                                className="mb-1 block text-xs font-medium text-foreground"
                              >
                                Name *
                              </label>
                              <input
                                id="edit-partner-name"
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                  setForm((p) => ({
                                    ...p,
                                    name: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="edit-partner-country"
                                className="mb-1 block text-xs font-medium text-foreground"
                              >
                                Country
                              </label>
                              <input
                                id="edit-partner-country"
                                type="text"
                                value={form.country}
                                onChange={(e) =>
                                  setForm((p) => ({
                                    ...p,
                                    country: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="edit-partner-website"
                                className="mb-1 block text-xs font-medium text-foreground"
                              >
                                Website
                              </label>
                              <input
                                id="edit-partner-website"
                                type="url"
                                value={form.website}
                                onChange={(e) =>
                                  setForm((p) => ({
                                    ...p,
                                    website: e.target.value,
                                  }))
                                }
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="edit-partner-order"
                                className="mb-1 block text-xs font-medium text-foreground"
                              >
                                Order
                              </label>
                              <input
                                id="edit-partner-order"
                                type="number"
                                value={form.order}
                                onChange={(e) =>
                                  setForm((p) => ({
                                    ...p,
                                    order: Number(e.target.value),
                                  }))
                                }
                                min={1}
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                              />
                            </div>
                          </div>
                          <ImageUpload
                            label="Logo"
                            value={form.logoUrl}
                            onChange={(url) =>
                              setForm((p) => ({ ...p, logoUrl: url }))
                            }
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdate(u.id)}
                              disabled={saving}
                              className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-60"
                              data-ocid={`admin.partners.update_button.${idx + 1}`}
                            >
                              {saving ? "Saving..." : "Update"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                              data-ocid={`admin.partners.edit_cancel_button.${idx + 1}`}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirmId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          data-ocid="admin.partners.delete.dialog"
        >
          <div className="rounded-xl bg-card border border-border p-6 shadow-xl max-w-sm w-full mx-4 space-y-4">
            <h3 className="font-semibold text-foreground">
              Delete University?
            </h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                data-ocid="admin.partners.delete.confirm_button"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                data-ocid="admin.partners.delete.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
