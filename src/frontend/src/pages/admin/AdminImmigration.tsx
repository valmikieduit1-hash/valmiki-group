import { createActor } from "@/backend";
import type { ImmigrationVisa } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const VISA_TYPES = [
  { id: "pr-visa", label: "PR Visa", visaType: "PR Visa" },
  { id: "work-visa", label: "Work Visa", visaType: "Work Visa" },
  { id: "tourist-visa", label: "Tourist Visa", visaType: "Tourist Visa" },
  { id: "dependent-visa", label: "Dependent Visa", visaType: "Dependent Visa" },
];

function getToken() {
  return localStorage.getItem("valmikiAdminToken") ?? "";
}

type StringArrayField =
  | "requirements"
  | "documentsRequired"
  | "eligibilityCriteria";
const ARRAY_FIELDS: { key: StringArrayField; label: string }[] = [
  { key: "requirements", label: "Requirements" },
  { key: "documentsRequired", label: "Documents Required" },
  { key: "eligibilityCriteria", label: "Eligibility Criteria" },
];

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState("");
  const add = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem("");
    }
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <label
        htmlFor={`string-list-${label}`}
        className="mb-2 block text-sm font-medium text-white/70"
      >
        {label}
      </label>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5"
          >
            <span className="flex-1 text-sm text-white/80">{item}</span>
            <button
              type="button"
              onClick={() => remove(items.indexOf(item))}
              className="text-white/40 hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          id={`string-list-${label}`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={`Add ${label.toLowerCase()}…`}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!newItem.trim()}
          className="flex items-center gap-1 rounded-lg bg-[#FF8A00]/15 px-3 py-1.5 text-sm font-semibold text-[#FF8A00] hover:bg-[#FF8A00]/25 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

export default function AdminImmigration() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("pr-visa");
  const [forms, setForms] = useState<Record<string, Partial<ImmigrationVisa>>>(
    {},
  );

  const { data: visas = [], isLoading } = useQuery<ImmigrationVisa[]>({
    queryKey: ["admin", "immigration"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getImmigrationVisas();
    },
    enabled: !!actor && !isFetching,
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      data,
    }: { visaId: string; data: Partial<ImmigrationVisa> }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.updateImmigrationVisa(
        getToken(),
        data as ImmigrationVisa,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Visa info updated");
      qc.invalidateQueries({ queryKey: ["admin", "immigration"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const getVisaByTab = (tabId: string) => {
    const vt = VISA_TYPES.find((v) => v.id === tabId);
    return visas.find((v) => v.visaType === vt?.visaType);
  };

  const getForm = (tabId: string): Partial<ImmigrationVisa> =>
    forms[tabId] ?? getVisaByTab(tabId) ?? {};

  const setField = <K extends keyof ImmigrationVisa>(
    tabId: string,
    field: K,
    value: ImmigrationVisa[K],
  ) => {
    setForms((f) => ({
      ...f,
      [tabId]: { ...(f[tabId] ?? getVisaByTab(tabId) ?? {}), [field]: value },
    }));
  };

  const activeForm = getForm(activeTab);
  const activeVisa = getVisaByTab(activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Immigration Editor
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage visa types and immigration content
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {VISA_TYPES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === id
                ? "bg-[#0B1F3A] text-[#FF8A00] shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`immigration.tab.${id}`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="immigration.loading_state"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-[#0B1F3A] p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-white">
            {VISA_TYPES.find((v) => v.id === activeTab)?.label}
          </h2>

          {!activeVisa && !forms[activeTab] && (
            <div className="mb-4 rounded-lg border border-[#FFC247]/20 bg-[#FFC247]/5 px-4 py-3 text-sm text-[#FFC247]/80">
              This visa type has not been initialized in the database yet.
            </div>
          )}

          <div className="grid gap-4">
            <div>
              <label
                htmlFor="immigration-title"
                className="mb-1 block text-sm font-medium text-white/70"
              >
                Title
              </label>
              <input
                id="immigration-title"
                value={(activeForm.title as string | undefined) ?? ""}
                onChange={(e) => setField(activeTab, "title", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="immigration.title_input"
              />
            </div>
            <div>
              <label
                htmlFor="immigration-description"
                className="mb-1 block text-sm font-medium text-white/70"
              >
                Description
              </label>
              <textarea
                id="immigration-description"
                rows={3}
                value={(activeForm.description as string | undefined) ?? ""}
                onChange={(e) =>
                  setField(activeTab, "description", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="immigration.textarea"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="immigration-processing-time"
                  className="mb-1 block text-sm font-medium text-white/70"
                >
                  Processing Time
                </label>
                <input
                  id="immigration-processing-time"
                  value={
                    (activeForm.processingTime as string | undefined) ?? ""
                  }
                  onChange={(e) =>
                    setField(activeTab, "processingTime", e.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="immigration-success-rate"
                  className="mb-1 block text-sm font-medium text-white/70"
                >
                  Success Rate
                </label>
                <input
                  id="immigration-success-rate"
                  value={(activeForm.successRate as string | undefined) ?? ""}
                  onChange={(e) =>
                    setField(activeTab, "successRate", e.target.value)
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#FF8A00]/50 focus:outline-none"
                />
              </div>
            </div>
            <ImageUpload
              label="Visa Image"
              value={(activeForm.imageUrl as string | undefined) ?? ""}
              onChange={(url) => setField(activeTab, "imageUrl", url)}
            />
            {ARRAY_FIELDS.map(({ key, label }) => (
              <StringListEditor
                key={key}
                label={label}
                items={(activeForm[key] as string[] | undefined) ?? []}
                onChange={(items) => setField(activeTab, key, items)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              saveMutation.mutate({ visaId: activeTab, data: activeForm });
            }}
            disabled={saveMutation.isPending}
            className="mt-6 flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            data-ocid="immigration.save_button"
          >
            {saveMutation.isPending && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
