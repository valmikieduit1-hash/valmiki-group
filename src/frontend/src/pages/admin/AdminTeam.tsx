import { createActor } from "@/backend";
import type { TeamMember, TeamMemberInput } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

const emptyForm: TeamMemberInput = {
  name: "",
  role: "",
  bio: "",
  imageUrl: "",
  order: BigInt(0),
};

export default function AdminTeam() {
  const { actor } = useActor(createActor);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<TeamMemberInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  const fetch = () => {
    if (!actor) return;
    actor
      .getTeamMembers()
      .then((m) => {
        setMembers(m);
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

  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      imageUrl: m.imageUrl,
      order: m.order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId !== null) {
        const result = await actor.updateTeamMember(token, editingId, form);
        if (result.__kind__ === "ok") toast.success("Team member updated");
        else toast.error(result.err);
      } else {
        const result = await actor.addTeamMember(token, form);
        if (result.__kind__ === "ok") toast.success("Team member added");
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
      const result = await actor.deleteTeamMember(token, id);
      if (result.__kind__ === "ok") {
        toast.success("Deleted");
        fetch();
      } else toast.error(result.err);
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  const updateForm = (field: keyof TeamMemberInput, value: string | bigint) => {
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
          Team Members
        </h2>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90"
          data-ocid="admin.team.add_button"
        >
          <Plus className="h-4 w-4" />
          Add Member
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
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Bio
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((m) => (
              <tr key={String(m.id)} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-foreground">{String(m.order)}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {m.name}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{m.role}</td>
                <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                  {m.bio}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(m)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
                      aria-label="Edit"
                      data-ocid={`admin.team.edit_button.${String(m.id)}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(m.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                      data-ocid={`admin.team.delete_button.${String(m.id)}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No team members yet.
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
                {editingId ? "Edit Member" : "Add Member"}
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
                    htmlFor="team-name"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Name *
                  </label>
                  <input
                    id="team-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="team-role"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Role *
                  </label>
                  <input
                    id="team-role"
                    type="text"
                    value={form.role}
                    onChange={(e) => updateForm("role", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="team-bio"
                  className="mb-1.5 block text-sm font-medium text-muted-foreground"
                >
                  Bio
                </label>
                <textarea
                  id="team-bio"
                  value={form.bio}
                  onChange={(e) => updateForm("bio", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => updateForm("imageUrl", url)}
                    label="Member Photo"
                  />
                </div>
                <div>
                  <label
                    htmlFor="team-order"
                    className="mb-1.5 block text-sm font-medium text-muted-foreground"
                  >
                    Display Order
                  </label>
                  <input
                    id="team-order"
                    type="number"
                    value={String(form.order)}
                    onChange={(e) =>
                      updateForm("order", BigInt(e.target.value || 0))
                    }
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                  />
                </div>
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
                data-ocid="admin.team.modal.save_button"
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
              Delete Member?
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
                data-ocid="admin.team.confirm_delete"
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
