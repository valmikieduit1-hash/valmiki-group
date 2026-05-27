import { createActor } from "@/backend";
import type { EventItem, EventItemInput } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

const emptyForm: EventItemInput = {
  title: "",
  date: "",
  description: "",
  isActive: true,
  imageUrl: "",
  registrationLink: "",
  location: "",
};

export default function AdminEvents() {
  const { actor } = useActor(createActor);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<EventItemInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  const fetch = () => {
    if (!actor) return;
    actor
      .getEvents()
      .then((e) => {
        setEvents(e);
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

  const openEdit = (ev: EventItem) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      description: ev.description,
      isActive: ev.isActive,
      imageUrl: ev.imageUrl,
      registrationLink: ev.registrationLink,
      location: ev.location,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    if (!form.title.trim() || !form.date.trim()) {
      toast.error("Title and date are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        const result = await actor.updateEvent(token, editingId, form);
        if (result.__kind__ === "ok") toast.success("Event updated");
        else toast.error(result.err);
      } else {
        const result = await actor.addEvent(token, form);
        if (result.__kind__ === "ok") toast.success("Event added");
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
      const result = await actor.deleteEvent(token, id);
      if (result.__kind__ === "ok") {
        toast.success("Deleted");
        fetch();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  const toggleActive = async (ev: EventItem) => {
    if (!actor) return;
    const updated = { ...ev, isActive: !ev.isActive };
    try {
      const result = await actor.updateEvent(token, ev.id, updated);
      if (result.__kind__ === "ok") {
        toast.success(updated.isActive ? "Activated" : "Deactivated");
        fetch();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to update");
    }
  };

  const updateForm = (field: keyof EventItemInput, value: string | boolean) => {
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
          Events & Webinars
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90"
          data-ocid="admin.events.add_button"
        >
          <Plus className="h-4 w-4" />
          Add Event
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-subtle">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Title
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Location
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((ev) => (
              <tr key={String(ev.id)} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  {ev.title}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{ev.date}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {ev.location}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(ev)}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      ev.isActive
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-ocid={`admin.events.status.${String(ev.id)}`}
                  >
                    {ev.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(ev)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                      aria-label="Edit"
                      data-ocid={`admin.events.edit_button.${String(ev.id)}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(ev.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                      data-ocid={`admin.events.delete_button.${String(ev.id)}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No events yet.
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
                {editingId ? "Edit Event" : "Add Event"}
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
                  htmlFor="event-title"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Title *
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="event-date"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Date *
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => updateForm("date", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="event-location"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Location
                  </label>
                  <input
                    id="event-location"
                    type="text"
                    value={form.location}
                    onChange={(e) => updateForm("location", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="event-description"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Description
                </label>
                <textarea
                  id="event-description"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => updateForm("imageUrl", url)}
                    label="Event Image"
                  />
                </div>
                <div>
                  <label
                    htmlFor="event-registrationLink"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Registration Link
                  </label>
                  <input
                    id="event-registrationLink"
                    type="text"
                    value={form.registrationLink}
                    onChange={(e) =>
                      updateForm("registrationLink", e.target.value)
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>
              <label
                htmlFor="event-isActive"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <input
                  id="event-isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateForm("isActive", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-[#FF8A00]"
                />
                Active
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
                data-ocid="admin.events.modal.save_button"
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
              Delete Event?
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
                data-ocid="admin.events.confirm_delete"
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
