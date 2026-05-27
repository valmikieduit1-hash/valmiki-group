import { createActor } from "@/backend";
import type { ServiceItem, ServiceItemInput } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const emptyService: ServiceItemInput = {
  name: "",
  description: "",
  icon: "",
  features: [],
  ctaLink: "",
  order: BigInt(0),
};

export default function AdminServices() {
  const { actor } = useActor(createActor);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ServiceItemInput>(emptyService);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  const fetchServices = () => {
    if (!actor) return;
    actor
      .getServices()
      .then((s) => {
        setServices(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    fetchServices();
  }, [actor]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyService);
    setModalOpen(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setEditingId(svc.id);
    setForm({
      name: svc.name,
      description: svc.description,
      icon: svc.icon,
      features: svc.features,
      ctaLink: svc.ctaLink,
      order: svc.order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        const result = await actor.updateService(token, editingId, form);
        if (result.__kind__ === "ok") {
          toast.success("Service updated");
        } else {
          toast.error(result.err);
        }
      } else {
        const result = await actor.addService(token, form);
        if (result.__kind__ === "ok") {
          toast.success("Service added");
        } else {
          toast.error(result.err);
        }
      }
      setModalOpen(false);
      fetchServices();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!actor) return;
    try {
      const result = await actor.deleteService(token, id);
      if (result.__kind__ === "ok") {
        toast.success("Service deleted");
        fetchServices();
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  const updateForm = (
    field: keyof ServiceItemInput,
    value: string | string[] | bigint,
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
          Services
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90"
          data-ocid="admin.services.add_button"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-subtle">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Order
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Description
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Icon
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((svc) => (
              <tr key={String(svc.id)} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-foreground">
                  {String(svc.order)}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {svc.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {svc.description}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{svc.icon}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(svc)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                      aria-label="Edit"
                      data-ocid={`admin.services.edit_button.${String(svc.id)}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(svc.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                      data-ocid={`admin.services.delete_button.${String(svc.id)}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No services yet. Click "Add Service" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-3d">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {editingId ? "Edit Service" : "Add Service"}
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
              <div>
                <label
                  htmlFor="service-name"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Name *
                </label>
                <input
                  id="service-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div>
                <label
                  htmlFor="service-description"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Description *
                </label>
                <input
                  id="service-description"
                  type="text"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="service-icon"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Icon (emoji/text)
                  </label>
                  <input
                    id="service-icon"
                    type="text"
                    value={form.icon}
                    onChange={(e) => updateForm("icon", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="service-order"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Display Order
                  </label>
                  <input
                    id="service-order"
                    type="number"
                    value={String(form.order)}
                    onChange={(e) =>
                      updateForm("order", BigInt(e.target.value || 0))
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="service-features"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Features (comma-separated)
                </label>
                <input
                  id="service-features"
                  type="text"
                  value={form.features.join(", ")}
                  onChange={(e) =>
                    updateForm(
                      "features",
                      e.target.value
                        .split(",")
                        .map((f) => f.trim())
                        .filter(Boolean),
                    )
                  }
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div>
                <label
                  htmlFor="service-ctaLink"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  CTA Link
                </label>
                <input
                  id="service-ctaLink"
                  type="text"
                  value={form.ctaLink}
                  onChange={(e) => updateForm("ctaLink", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
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
                data-ocid="admin.services.modal.save_button"
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
              Delete Service?
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
                data-ocid="admin.services.confirm_delete"
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
