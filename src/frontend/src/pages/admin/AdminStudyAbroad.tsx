import { createActor } from "@/backend";
import type {
  ProcessStep,
  ScholarshipInfo,
  StudyAbroadContent,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

const defaultContent: StudyAbroadContent = {
  headline: "",
  introduction: "",
  intakeInfo: "",
  imageUrl: "",
  processSteps: [],
  scholarships: [],
};

export default function AdminStudyAbroad() {
  const { actor } = useActor(createActor);
  const [content, setContent] = useState<StudyAbroadContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  // Process step form
  const [stepForm, setStepForm] = useState<Omit<ProcessStep, "id">>({
    order: BigInt(1),
    title: "",
    description: "",
    icon: "",
  });
  const [editStepId, setEditStepId] = useState<bigint | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);

  // Scholarship form
  const [scholForm, setScholForm] = useState<Omit<ScholarshipInfo, "id">>({
    name: "",
    amount: "",
    eligibility: "",
    deadline: "",
  });
  const [editScholId, setEditScholId] = useState<bigint | null>(null);
  const [showScholForm, setShowScholForm] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getStudyAbroadContent()
      .then((c) => {
        setContent(c);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateStudyAbroadContent(token, content);
      if (result.__kind__ === "ok")
        toast.success("Study Abroad content saved!");
      else toast.error(result.err);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Process Step helpers ──────────────────────────────────────────
  const openAddStep = () => {
    setEditStepId(null);
    const nextOrder = BigInt(content.processSteps.length + 1);
    setStepForm({ order: nextOrder, title: "", description: "", icon: "" });
    setShowStepForm(true);
  };
  const openEditStep = (s: ProcessStep) => {
    setEditStepId(s.id);
    setStepForm({
      order: s.order,
      title: s.title,
      description: s.description,
      icon: s.icon,
    });
    setShowStepForm(true);
  };
  const saveStep = () => {
    if (!stepForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editStepId !== null) {
      setContent((p) => ({
        ...p,
        processSteps: p.processSteps.map((s) =>
          s.id === editStepId ? { ...s, ...stepForm } : s,
        ),
      }));
    } else {
      const ns: ProcessStep = { id: BigInt(Date.now()), ...stepForm };
      setContent((p) => ({ ...p, processSteps: [...p.processSteps, ns] }));
    }
    setShowStepForm(false);
  };
  const deleteStep = (id: bigint) => {
    setContent((p) => ({
      ...p,
      processSteps: p.processSteps.filter((s) => s.id !== id),
    }));
  };

  // ── Scholarship helpers ───────────────────────────────────────────
  const openAddSchol = () => {
    setEditScholId(null);
    setScholForm({ name: "", amount: "", eligibility: "", deadline: "" });
    setShowScholForm(true);
  };
  const openEditSchol = (s: ScholarshipInfo) => {
    setEditScholId(s.id);
    setScholForm({
      name: s.name,
      amount: s.amount,
      eligibility: s.eligibility,
      deadline: s.deadline,
    });
    setShowScholForm(true);
  };
  const saveSchol = () => {
    if (!scholForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editScholId !== null) {
      setContent((p) => ({
        ...p,
        scholarships: p.scholarships.map((s) =>
          s.id === editScholId ? { ...s, ...scholForm } : s,
        ),
      }));
    } else {
      const ns: ScholarshipInfo = { id: BigInt(Date.now()), ...scholForm };
      setContent((p) => ({ ...p, scholarships: [...p.scholarships, ns] }));
    }
    setShowScholForm(false);
  };
  const deleteSchol = (id: bigint) => {
    setContent((p) => ({
      ...p,
      scholarships: p.scholarships.filter((s) => s.id !== id),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="admin.studyabroad.page">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Study Abroad Editor
        </h2>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.studyabroad.save_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Main fields */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="font-semibold text-foreground">Page Content</h3>
        <div className="space-y-2">
          <label
            htmlFor="studyabroad-headline"
            className="block text-sm font-medium text-foreground"
          >
            Headline
          </label>
          <input
            id="studyabroad-headline"
            type="text"
            value={content.headline}
            onChange={(e) =>
              setContent((p) => ({ ...p, headline: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
            placeholder="Your Global Journey Starts Here"
            data-ocid="admin.studyabroad.headline.input"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="studyabroad-introduction"
            className="block text-sm font-medium text-foreground"
          >
            Introduction
          </label>
          <textarea
            id="studyabroad-introduction"
            rows={4}
            value={content.introduction}
            onChange={(e) =>
              setContent((p) => ({ ...p, introduction: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
            placeholder="Introductory paragraph..."
            data-ocid="admin.studyabroad.introduction.textarea"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="studyabroad-intakeinfo"
            className="block text-sm font-medium text-foreground"
          >
            Intake Information
          </label>
          <textarea
            id="studyabroad-intakeinfo"
            rows={3}
            value={content.intakeInfo}
            onChange={(e) =>
              setContent((p) => ({ ...p, intakeInfo: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
            placeholder="January / September intakes available..."
            data-ocid="admin.studyabroad.intakeinfo.textarea"
          />
        </div>
        <ImageUpload
          label="Page Image"
          value={content.imageUrl}
          onChange={(url) => setContent((p) => ({ ...p, imageUrl: url }))}
        />
      </div>

      {/* Process Steps */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Process Steps</h3>
          <button
            type="button"
            onClick={openAddStep}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.studyabroad.steps.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Step
          </button>
        </div>

        {showStepForm && (
          <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="step-order"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Order
                </label>
                <input
                  id="step-order"
                  type="number"
                  value={Number(stepForm.order)}
                  onChange={(e) =>
                    setStepForm((p) => ({
                      ...p,
                      order: BigInt(e.target.value || 1),
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.step.order.input"
                />
              </div>
              <div>
                <label
                  htmlFor="step-title"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Title *
                </label>
                <input
                  id="step-title"
                  type="text"
                  value={stepForm.title}
                  onChange={(e) =>
                    setStepForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.step.title.input"
                />
              </div>
              <div>
                <label
                  htmlFor="step-icon"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Icon (emoji)
                </label>
                <input
                  id="step-icon"
                  type="text"
                  value={stepForm.icon}
                  onChange={(e) =>
                    setStepForm((p) => ({ ...p, icon: e.target.value }))
                  }
                  placeholder="📋"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.step.icon.input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="step-description"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="step-description"
                rows={2}
                value={stepForm.description}
                onChange={(e) =>
                  setStepForm((p) => ({ ...p, description: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                data-ocid="admin.studyabroad.step.description.textarea"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveStep}
                className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                data-ocid="admin.studyabroad.step.save_button"
              >
                {editStepId !== null ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowStepForm(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                data-ocid="admin.studyabroad.step.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {content.processSteps.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.studyabroad.steps.empty_state"
          >
            No steps added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {[...content.processSteps]
              .sort((a, b) => Number(a.order) - Number(b.order))
              .map((s, idx) => (
                <div
                  key={String(s.id)}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                  data-ocid={`admin.studyabroad.steps.item.${idx + 1}`}
                >
                  <span className="shrink-0 rounded-md bg-[#0B1F3A]/10 px-2 py-0.5 text-xs font-bold text-[#0B1F3A]">
                    #{Number(s.order)}
                  </span>
                  <span className="text-lg shrink-0">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditStep(s)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted"
                      aria-label="Edit"
                      data-ocid={`admin.studyabroad.steps.edit_button.${idx + 1}`}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteStep(s.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                      data-ocid={`admin.studyabroad.steps.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Scholarships */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Scholarships</h3>
          <button
            type="button"
            onClick={openAddSchol}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.studyabroad.scholarships.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Scholarship
          </button>
        </div>

        {showScholForm && (
          <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="schol-name"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Name *
                </label>
                <input
                  id="schol-name"
                  type="text"
                  value={scholForm.name}
                  onChange={(e) =>
                    setScholForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.schol.name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="schol-amount"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Amount
                </label>
                <input
                  id="schol-amount"
                  type="text"
                  value={scholForm.amount}
                  onChange={(e) =>
                    setScholForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  placeholder="$10,000"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.schol.amount.input"
                />
              </div>
              <div>
                <label
                  htmlFor="schol-eligibility"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Eligibility
                </label>
                <input
                  id="schol-eligibility"
                  type="text"
                  value={scholForm.eligibility}
                  onChange={(e) =>
                    setScholForm((p) => ({ ...p, eligibility: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.schol.eligibility.input"
                />
              </div>
              <div>
                <label
                  htmlFor="schol-deadline"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Deadline
                </label>
                <input
                  id="schol-deadline"
                  type="text"
                  value={scholForm.deadline}
                  onChange={(e) =>
                    setScholForm((p) => ({ ...p, deadline: e.target.value }))
                  }
                  placeholder="March 31, 2025"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.studyabroad.schol.deadline.input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveSchol}
                className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                data-ocid="admin.studyabroad.schol.save_button"
              >
                {editScholId !== null ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowScholForm(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                data-ocid="admin.studyabroad.schol.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {content.scholarships.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.studyabroad.scholarships.empty_state"
          >
            No scholarships added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {content.scholarships.map((s, idx) => (
              <div
                key={String(s.id)}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                data-ocid={`admin.studyabroad.scholarships.item.${idx + 1}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.amount} · {s.deadline}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.eligibility}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEditSchol(s)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Edit"
                    data-ocid={`admin.studyabroad.scholarships.edit_button.${idx + 1}`}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSchol(s.id)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                    data-ocid={`admin.studyabroad.scholarships.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-6 py-3 font-semibold text-white shadow-lg hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.studyabroad.save_bottom_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
