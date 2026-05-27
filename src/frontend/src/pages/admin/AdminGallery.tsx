import {
  type GalleryEntry,
  type GalleryEntryInput,
  createActor,
} from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
  "Dubai",
  "Singapore",
  "Europe",
];

function getToken() {
  return localStorage.getItem("valmikiAdminToken") ?? "";
}

const EMPTY_FORM: GalleryEntryInput = {
  studentName: "",
  destinationCountry: "USA",
  universityAdmitted: "",
  visaStatus: "Approved",
  imageUrl: "",
  order: 0n,
  isVisible: true,
};

export default function AdminGallery() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<GalleryEntry | null>(null);
  const [form, setForm] = useState<GalleryEntryInput>(EMPTY_FORM);

  const { data: entries = [], isLoading } = useQuery<GalleryEntry[]>({
    queryKey: ["adminGallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryEntries();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (input: GalleryEntryInput) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.addGalleryEntry(getToken(), input);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminGallery"] });
      qc.invalidateQueries({ queryKey: ["visibleGallery"] });
      toast.success("Gallery entry added");
      setIsOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: GalleryEntryInput }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.updateGalleryEntry(getToken(), id, input);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminGallery"] });
      qc.invalidateQueries({ queryKey: ["visibleGallery"] });
      toast.success("Gallery entry updated");
      setIsOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.deleteGalleryEntry(getToken(), id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminGallery"] });
      qc.invalidateQueries({ queryKey: ["visibleGallery"] });
      toast.success("Entry deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.toggleGalleryEntryVisibility(getToken(), id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminGallery"] });
      qc.invalidateQueries({ queryKey: ["visibleGallery"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAdd = () => {
    setEditEntry(null);
    setForm(EMPTY_FORM);
    setIsOpen(true);
  };

  const openEdit = (e: GalleryEntry) => {
    setEditEntry(e);
    setForm({
      studentName: e.studentName,
      destinationCountry: e.destinationCountry,
      universityAdmitted: e.universityAdmitted,
      visaStatus: e.visaStatus,
      imageUrl: e.imageUrl,
      order: e.order,
      isVisible: e.isVisible,
    });
    setIsOpen(true);
  };

  const handleSave = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (editEntry) {
      updateMutation.mutate({ id: editEntry.id, input: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const f = <K extends keyof GalleryEntryInput>(
    k: K,
    v: GalleryEntryInput[K],
  ) => setForm((prev) => ({ ...prev, [k]: v }));

  const sorted = [...entries].sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Visa Success Gallery
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage gallery entries visible on the public gallery page.
          </p>
        </div>
        <Button
          type="button"
          onClick={openAdd}
          className="bg-[#FF8A00] text-white hover:bg-[#FF8A00]/90 gap-2"
          data-ocid="admin.gallery.add_button"
        >
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 text-center"
          data-ocid="admin.gallery.empty_state"
        >
          <GraduationCap className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-muted-foreground">
            No gallery entries yet. Click Add Entry to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Photo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">
                    University
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Visible
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((entry, i) => (
                  <tr
                    key={String(entry.id)}
                    className="hover:bg-muted/20"
                    data-ocid={`admin.gallery.row.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-muted">
                        {entry.imageUrl ? (
                          <img
                            src={entry.imageUrl}
                            alt={entry.studentName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {entry.studentName}
                      </p>
                      <Badge className="mt-0.5 bg-[#FFC247]/20 text-[#0B1F3A] border-[#FFC247]/30 text-xs">
                        <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                        {entry.visaStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {entry.destinationCountry}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                      {entry.universityAdmitted}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleMutation.mutate(entry.id)}
                        aria-label={entry.isVisible ? "Hide" : "Show"}
                        data-ocid={`admin.gallery.visibility_toggle.${i + 1}`}
                      >
                        {entry.isVisible ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(entry)}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label="Edit"
                          data-ocid={`admin.gallery.edit_button.${i + 1}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Delete this entry?"))
                              deleteMutation.mutate(entry.id);
                          }}
                          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Delete"
                          data-ocid={`admin.gallery.delete_button.${i + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-md max-h-[90vh] overflow-y-auto bg-[#0B1F3A] text-white border-white/10"
          data-ocid="admin.gallery.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-white">
              {editEntry ? "Edit Gallery Entry" : "Add Gallery Entry"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label
                htmlFor="gallery-name"
                className="block text-sm font-medium text-white/80 mb-1"
              >
                Student Name *
              </label>
              <input
                id="gallery-name"
                required
                value={form.studentName}
                onChange={(e) => f("studentName", e.target.value)}
                placeholder="Arjun Sharma"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="admin.gallery.form.name.input"
              />
            </div>
            <div>
              <label
                htmlFor="gallery-country"
                className="block text-sm font-medium text-white/80 mb-1"
              >
                Destination Country *
              </label>
              <select
                id="gallery-country"
                value={form.destinationCountry}
                onChange={(e) => f("destinationCountry", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="admin.gallery.form.country.select"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0B1F3A]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="gallery-uni"
                className="block text-sm font-medium text-white/80 mb-1"
              >
                University Admitted *
              </label>
              <input
                id="gallery-uni"
                required
                value={form.universityAdmitted}
                onChange={(e) => f("universityAdmitted", e.target.value)}
                placeholder="University of Toronto"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="admin.gallery.form.university.input"
              />
            </div>
            <div>
              <label
                htmlFor="gallery-status"
                className="block text-sm font-medium text-white/80 mb-1"
              >
                Visa Status
              </label>
              <input
                id="gallery-status"
                value={form.visaStatus}
                onChange={(e) => f("visaStatus", e.target.value)}
                placeholder="Approved"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="admin.gallery.form.status.input"
              />
            </div>
            <div>
              <label
                htmlFor="gallery-order"
                className="block text-sm font-medium text-white/80 mb-1"
              >
                Display Order
              </label>
              <input
                id="gallery-order"
                type="number"
                value={Number(form.order)}
                onChange={(e) => f("order", BigInt(e.target.value || 0))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="admin.gallery.form.order.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="gallery-visible"
                checked={form.isVisible}
                onCheckedChange={(v) => f("isVisible", v)}
                data-ocid="admin.gallery.form.visible.switch"
              />
              <label
                htmlFor="gallery-visible"
                className="text-sm text-white/80"
              >
                Visible on public gallery
              </label>
            </div>
            <ImageUpload
              label="Student Photo"
              value={form.imageUrl}
              onChange={(url) => f("imageUrl", url)}
            />
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
                data-ocid="admin.gallery.form.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FF8A00] text-white hover:bg-[#FF8A00]/90"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin.gallery.form.save_button"
              >
                {addMutation.isPending || updateMutation.isPending
                  ? "Saving…"
                  : "Save Entry"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
