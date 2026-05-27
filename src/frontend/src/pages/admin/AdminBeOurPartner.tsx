import { createActor } from "@/backend";
import type { BeOurPartnerContent, BeOurPartnerInquiry } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getToken = () => localStorage.getItem("valmikiAdminToken") ?? "";

type PartnerType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
};

type FormState = {
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  formDescription: string;
  generalBenefits: string[];
  partnershipTypes: PartnerType[];
};

const EMPTY: FormState = {
  heroImage: "",
  heroHeadline: "",
  heroSubheadline: "",
  formDescription: "",
  generalBenefits: [""],
  partnershipTypes: [
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      icon: "",
      benefits: [""],
    },
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      icon: "",
      benefits: [""],
    },
    {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      icon: "",
      benefits: [""],
    },
  ],
};

export default function AdminBeOurPartner() {
  const { actor } = useActor(createActor);
  const [form, setForm] = useState<FormState>(EMPTY);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<BeOurPartnerContent | null>({
    queryKey: ["adminBeOurPartner"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getBeOurPartnerContent();
      return result != null ? (result[0] ?? null) : null;
    },
    enabled: !!actor,
    staleTime: 0,
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<
    BeOurPartnerInquiry[]
  >({
    queryKey: ["partnerInquiries"],
    queryFn: () =>
      actor ? actor.getPartnerInquiries(getToken()) : Promise.resolve([]),
    staleTime: 0,
    enabled: !!getToken() && !!actor,
  });

  useEffect(() => {
    if (data) {
      setForm({
        heroImage: data.heroImage,
        heroHeadline: data.heroHeadline,
        heroSubheadline: data.heroSubheadline,
        formDescription: data.formDescription,
        generalBenefits: data.generalBenefits.length
          ? data.generalBenefits
          : [""],
        partnershipTypes:
          data.partnershipTypes.length > 0
            ? data.partnershipTypes.map((t) => ({
                id: crypto.randomUUID(),
                title: t.title,
                description: t.description,
                icon: t.icon,
                benefits: t.benefits.length ? t.benefits : [""],
              }))
            : EMPTY.partnershipTypes,
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.setBeOurPartnerContent(getToken(), {
        heroImage: form.heroImage,
        heroHeadline: form.heroHeadline,
        heroSubheadline: form.heroSubheadline,
        formDescription: form.formDescription,
        generalBenefits: form.generalBenefits.filter(Boolean),
        partnershipTypes: form.partnershipTypes.map((t) => ({
          ...t,
          benefits: t.benefits.filter(Boolean),
        })),
      });
    },
    onSuccess: () => {
      toast.success("Saved!");
      queryClient.invalidateQueries({ queryKey: ["adminBeOurPartner"] });
      queryClient.invalidateQueries({ queryKey: ["beOurPartnerContent"] });
    },
    onError: () => toast.error("Save failed"),
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const updateType = (i: number, patch: Partial<PartnerType>) => {
    const next = [...form.partnershipTypes];
    next[i] = { ...next[i], ...patch };
    set("partnershipTypes", next);
  };

  return (
    <div className="space-y-6" data-ocid="admin.be_our_partner.panel">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Be Our Partner
          </h2>
          <p className="text-sm text-muted-foreground">
            Edit the partnership page content
          </p>
        </div>
        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#FF8A00]/90 disabled:opacity-50"
          data-ocid="admin.be_our_partner.save_button"
        >
          <Save size={14} />
          {saveMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground">
              Hero Section
            </h3>
            <div>
              <p className="mb-1 text-sm font-semibold">Hero Image</p>
              <ImageUpload
                value={form.heroImage}
                onChange={(v) => set("heroImage", v)}
                label="Hero Image"
              />
            </div>
            <div>
              <label
                htmlFor="bop-headline"
                className="mb-1 block text-sm font-semibold"
              >
                Headline
              </label>
              <input
                id="bop-headline"
                type="text"
                value={form.heroHeadline}
                onChange={(e) => set("heroHeadline", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="bop-subheadline"
                className="mb-1 block text-sm font-semibold"
              >
                Subheadline
              </label>
              <input
                id="bop-subheadline"
                type="text"
                value={form.heroSubheadline}
                onChange={(e) => set("heroSubheadline", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="bop-form-desc"
                className="mb-1 block text-sm font-semibold"
              >
                Form Description
              </label>
              <textarea
                id="bop-form-desc"
                rows={3}
                value={form.formDescription}
                onChange={(e) => set("formDescription", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </section>

          {/* General Benefits */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">
              General Benefits
            </h3>
            {form.generalBenefits.map((b, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: stable index key
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const next = [...form.generalBenefits];
                    next[i] = e.target.value;
                    set("generalBenefits", next);
                  }}
                  placeholder={`Benefit ${i + 1}`}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "generalBenefits",
                      form.generalBenefits.filter((_, j) => j !== i),
                    )
                  }
                  className="rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                set("generalBenefits", [...form.generalBenefits, ""])
              }
              className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]"
            >
              <Plus size={14} /> Add Benefit
            </button>
          </section>

          {/* Partnership Types */}
          <section className="rounded-xl border border-border bg-card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">
                Partnership Types
              </h3>
              <button
                type="button"
                onClick={() =>
                  set("partnershipTypes", [
                    ...form.partnershipTypes,
                    {
                      id: crypto.randomUUID(),
                      title: "",
                      description: "",
                      icon: "",
                      benefits: [""],
                    },
                  ])
                }
                className="flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]"
              >
                <Plus size={12} /> Add Type
              </button>
            </div>
            {form.partnershipTypes.map((pt, i) => (
              <div
                key={pt.id}
                className="rounded-lg border border-border bg-background p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Type {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "partnershipTypes",
                        form.partnershipTypes.filter((_, j) => j !== i),
                      )
                    }
                    className="text-destructive hover:opacity-70"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={pt.title}
                    placeholder="Title"
                    onChange={(e) => updateType(i, { title: e.target.value })}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    value={pt.icon}
                    placeholder="Icon (emoji or name)"
                    onChange={(e) => updateType(i, { icon: e.target.value })}
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>
                <textarea
                  rows={2}
                  value={pt.description}
                  placeholder="Description"
                  onChange={(e) =>
                    updateType(i, { description: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                />
                {/* Benefits */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Benefits
                  </p>
                  {pt.benefits.map((b, bi) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable index key
                    <div key={bi} className="flex gap-2">
                      <input
                        type="text"
                        value={b}
                        placeholder={`Benefit ${bi + 1}`}
                        onChange={(e) => {
                          const nb = [...pt.benefits];
                          nb[bi] = e.target.value;
                          updateType(i, { benefits: nb });
                        }}
                        className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateType(i, {
                            benefits: pt.benefits.filter((_, bj) => bj !== bi),
                          })
                        }
                        className="text-destructive hover:opacity-70"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateType(i, { benefits: [...pt.benefits, ""] })
                    }
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[#FF8A00]"
                  >
                    <Plus size={11} /> Add benefit
                  </button>
                </div>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Partner Inquiries */}
      <section className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="font-semibold text-sm text-foreground">
          Partner Inquiries
        </h3>
        {inquiriesLoading ? (
          <div className="flex h-16 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
          </div>
        ) : !inquiries || inquiries.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.be_our_partner.inquiries.empty_state"
          >
            No inquiries yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 pr-4 font-semibold">Company</th>
                  <th className="pb-2 pr-4 font-semibold">Contact</th>
                  <th className="pb-2 pr-4 font-semibold">Email</th>
                  <th className="pb-2 pr-4 font-semibold">Phone</th>
                  <th className="pb-2 pr-4 font-semibold">Type</th>
                  <th className="pb-2 pr-4 font-semibold">Message</th>
                  <th className="pb-2 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item, idx) => (
                  <tr
                    key={String(item.id)}
                    className="border-b border-border/50"
                    data-ocid={`admin.be_our_partner.inquiry.item.${idx + 1}`}
                  >
                    <td className="py-2 pr-4 font-medium">
                      {item.companyName}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {item.contactName}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {item.email}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {item.phone}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="rounded-full bg-[#FF8A00]/10 px-2 py-0.5 text-xs font-medium text-[#FF8A00]">
                        {item.partnershipType}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground max-w-[160px] truncate">
                      {item.message}
                    </td>
                    <td className="py-2 text-muted-foreground whitespace-nowrap">
                      {new Date(Number(item.submittedAt)).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
