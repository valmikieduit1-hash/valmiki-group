import { type backendInterface, createActor } from "@/backend";
import type { BatchTiming, TestPrepExam } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EXAM_IDS = ["ielts", "pte", "toefl", "gre", "gmat", "sat"];
const EXAM_LABELS: Record<string, string> = {
  ielts: "IELTS",
  pte: "PTE",
  toefl: "TOEFL",
  gre: "GRE",
  gmat: "GMAT",
  sat: "SAT",
};

const EMPTY_BATCH = {
  startDate: "",
  endDate: "",
  schedule: "",
  capacity: 0,
  enrolled: 0,
};

function getToken() {
  return localStorage.getItem("valmikiAdminToken") ?? "";
}

type BatchDraft = {
  startDate: string;
  endDate: string;
  schedule: string;
  capacity: number;
  enrolled: number;
};

function BatchSection({
  exam,
  actor,
}: {
  exam: TestPrepExam;
  actor: backendInterface;
}) {
  const qc = useQueryClient();
  const [addForm, setAddForm] = useState<BatchDraft>(EMPTY_BATCH);
  const [editId, setEditId] = useState<bigint | null>(null);
  const [editForm, setEditForm] = useState<BatchDraft>(EMPTY_BATCH);

  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await actor.addBatchTiming(getToken(), exam.id, {
        ...addForm,
        capacity: BigInt(addForm.capacity),
        enrolled: BigInt(addForm.enrolled),
      });
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Batch added");
      qc.invalidateQueries({ queryKey: ["admin", "testPrep"] });
      setAddForm(EMPTY_BATCH);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (batchId: bigint) => {
      const res = await actor.updateBatchTiming(getToken(), exam.id, batchId, {
        ...editForm,
        capacity: BigInt(editForm.capacity),
        enrolled: BigInt(editForm.enrolled),
      });
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Batch updated");
      qc.invalidateQueries({ queryKey: ["admin", "testPrep"] });
      setEditId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (batchId: bigint) => {
      const res = await actor.deleteBatchTiming(getToken(), exam.id, batchId);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Batch deleted");
      qc.invalidateQueries({ queryKey: ["admin", "testPrep"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openEdit = (b: BatchTiming) => {
    setEditId(b.id);
    setEditForm({
      startDate: b.startDate,
      endDate: b.endDate,
      schedule: b.schedule,
      capacity: Number(b.capacity),
      enrolled: Number(b.enrolled),
    });
  };

  return (
    <div className="mt-6">
      <h3 className="mb-3 font-display text-base font-semibold text-white">
        Batch Timings
      </h3>
      {exam.batchTimings.length === 0 ? (
        <p className="text-sm text-white/40">No batches yet.</p>
      ) : (
        <div className="space-y-2">
          {exam.batchTimings.map((b, i) => (
            <div
              key={String(b.id)}
              className="rounded-lg border border-white/10 bg-white/5 p-3"
              data-ocid={`testprep.batch.item.${i + 1}`}
            >
              {editId === b.id ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {(["startDate", "endDate", "schedule"] as const).map(
                    (field) => (
                      <input
                        key={field}
                        value={editForm[field]}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            [field]: e.target.value,
                          }))
                        }
                        placeholder={field}
                        className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                      />
                    ),
                  )}
                  <input
                    type="number"
                    value={editForm.capacity}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, capacity: +e.target.value }))
                    }
                    placeholder="Capacity"
                    className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:outline-none"
                  />
                  <input
                    type="number"
                    value={editForm.enrolled}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, enrolled: +e.target.value }))
                    }
                    placeholder="Enrolled"
                    className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:outline-none"
                  />
                  <div className="flex gap-2 sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => updateMutation.mutate(b.id)}
                      className="rounded bg-[#FF8A00] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="rounded border border-white/10 px-3 py-1.5 text-xs text-white/60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm text-white/80">
                    <span className="font-medium">{b.startDate}</span> →{" "}
                    <span className="font-medium">{b.endDate}</span>
                    <span className="ml-3 text-white/50">{b.schedule}</span>
                    <span className="ml-3 text-white/40">
                      Capacity: {String(b.capacity)} | Enrolled:{" "}
                      {String(b.enrolled)}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(b)}
                      className="rounded p-1 text-[#FF8A00]/80 hover:text-[#FF8A00]"
                      aria-label="Edit batch"
                      data-ocid={`testprep.batch.edit_button.${i + 1}`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(b.id)}
                      className="rounded p-1 text-white/40 hover:text-red-400"
                      data-ocid={`testprep.batch.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add batch */}
      <div className="mt-3 rounded-lg border border-dashed border-white/10 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
          Add New Batch
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(["startDate", "endDate", "schedule"] as const).map((field) => (
            <input
              key={field}
              value={addForm[field]}
              onChange={(e) =>
                setAddForm((f) => ({ ...f, [field]: e.target.value }))
              }
              placeholder={field}
              className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          ))}
          <input
            type="number"
            value={addForm.capacity}
            onChange={(e) =>
              setAddForm((f) => ({ ...f, capacity: +e.target.value }))
            }
            placeholder="Capacity"
            className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:outline-none"
          />
          <input
            type="number"
            value={addForm.enrolled}
            onChange={(e) =>
              setAddForm((f) => ({ ...f, enrolled: +e.target.value }))
            }
            placeholder="Enrolled"
            className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending || !addForm.startDate}
            className="flex items-center gap-1.5 rounded bg-[#FF8A00] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 sm:col-span-2"
            data-ocid="testprep.batch.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Batch
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTestPrep() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("ielts");
  const [forms, setForms] = useState<Record<string, Partial<TestPrepExam>>>({});

  const { data: exams = [], isLoading } = useQuery<TestPrepExam[]>({
    queryKey: ["admin", "testPrep"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestPrepExams();
    },
    enabled: !!actor && !isFetching,
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      data,
    }: { examId: string; data: Partial<TestPrepExam> }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.updateTestPrepExam(
        getToken(),
        data as TestPrepExam,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Exam updated");
      qc.invalidateQueries({ queryKey: ["admin", "testPrep"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const getExam = (id: string) => exams.find((e) => e.id === id);
  const getForm = (id: string): Partial<TestPrepExam> =>
    forms[id] ?? getExam(id) ?? {};
  const setField = (
    examId: string,
    field: keyof TestPrepExam,
    value: string,
  ) => {
    setForms((f) => ({
      ...f,
      [examId]: { ...(f[examId] ?? getExam(examId) ?? {}), [field]: value },
    }));
  };

  const activeExam = getExam(activeTab);
  const activeForm = getForm(activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Test Preparation
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage exam content and batch timings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {EXAM_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === id
                ? "bg-[#0B1F3A] text-[#FF8A00] shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`testprep.tab.${id}`}
          >
            {EXAM_LABELS[id]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="testprep.loading_state"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-[#0B1F3A] p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-white">
            {EXAM_LABELS[activeTab]}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              ["name", "duration", "cost", "scoreRange", "successRate"] as const
            ).map((field) => (
              <div key={field}>
                <label
                  htmlFor={`testprep-${activeTab}-${field}`}
                  className="mb-1 block text-sm font-medium capitalize text-white/70"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  id={`testprep-${activeTab}-${field}`}
                  value={(activeForm[field] as string | undefined) ?? ""}
                  onChange={(e) => setField(activeTab, field, e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label
                htmlFor={`testprep-${activeTab}-description`}
                className="mb-1 block text-sm font-medium text-white/70"
              >
                Description
              </label>
              <textarea
                id={`testprep-${activeTab}-description`}
                rows={3}
                value={(activeForm.description as string | undefined) ?? ""}
                onChange={(e) =>
                  setField(activeTab, "description", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <ImageUpload
                label="Exam Image"
                value={(activeForm.imageUrl as string | undefined) ?? ""}
                onChange={(url) => setField(activeTab, "imageUrl", url)}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              saveMutation.mutate({ examId: activeTab, data: activeForm })
            }
            disabled={saveMutation.isPending}
            className="mt-5 flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            data-ocid="testprep.save_button"
          >
            {saveMutation.isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Save Changes
          </button>

          {activeExam && (
            <BatchSection
              exam={{ ...activeExam, ...activeForm } as TestPrepExam}
              actor={actor!}
            />
          )}
        </div>
      )}
    </div>
  );
}
