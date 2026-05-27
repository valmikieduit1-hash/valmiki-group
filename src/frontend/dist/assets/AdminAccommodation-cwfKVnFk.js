import { u as useActor, r as reactExports, a as useQueryClient, b as useQuery, c as useMutation, j as jsxRuntimeExports, L as LoaderCircle, S as Save, I as ImageUpload, P as Plus, T as Trash2, d as ue, e as createActor } from "./index-BYL1zkwf.js";
const EMPTY_FORM = {
  heroImage: "",
  heroHeadline: "",
  heroSubheadline: "",
  overview: "",
  ctaText: "",
  ctaButtonText: "",
  processSteps: [
    { id: crypto.randomUUID(), title: "", description: "", icon: "" }
  ],
  destinationsCovered: [""]
};
function ArrayEditor({
  label,
  values,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: label }),
    values.map((val, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: stable index key
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: val,
            onChange: (e) => {
              const next = [...values];
              next[i] = e.target.value;
              onChange(next);
            },
            className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm",
            placeholder: `Item ${i + 1}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onChange(values.filter((_, j) => j !== i)),
            className: "rounded-lg border border-border p-2 text-destructive hover:bg-destructive/10",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
          }
        )
      ] }, i)
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange([...values, ""]),
        className: "flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
          " Add item"
        ]
      }
    )
  ] });
}
function AdminAccommodation() {
  const { actor } = useActor(createActor);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const queryClient = useQueryClient();
  const getToken = () => localStorage.getItem("valmikiAdminToken") ?? "";
  const { data, isLoading } = useQuery({
    queryKey: ["adminServiceDetail", "accommodation"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getServiceDetail("accommodation");
      return result != null ? result[0] ?? null : null;
    },
    enabled: !!actor,
    staleTime: 0
  });
  reactExports.useEffect(() => {
    if (data) {
      setForm({
        heroImage: data.heroImage,
        heroHeadline: data.heroHeadline,
        heroSubheadline: data.heroSubheadline,
        overview: data.overview,
        ctaText: data.ctaText,
        ctaButtonText: data.ctaButtonText,
        processSteps: data.processSteps.length ? data.processSteps.map((s) => ({
          id: crypto.randomUUID(),
          title: s.title,
          description: s.description,
          icon: s.icon
        })) : [{ id: crypto.randomUUID(), title: "", description: "", icon: "" }],
        destinationsCovered: data.whatIsIncluded.length ? data.whatIsIncluded : [""]
      });
    } else if (!isLoading) {
      setForm(EMPTY_FORM);
    }
  }, [data, isLoading]);
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.setServiceDetail(getToken(), {
        serviceId: "accommodation",
        heroImage: form.heroImage,
        heroHeadline: form.heroHeadline,
        heroSubheadline: form.heroSubheadline,
        overview: form.overview,
        ctaText: form.ctaText,
        ctaButtonText: form.ctaButtonText,
        whatIsIncluded: form.destinationsCovered.filter(Boolean),
        eligibilityCriteria: [],
        whyChooseValmiki: [],
        processSteps: form.processSteps.map((s, i) => ({
          order: BigInt(i + 1),
          title: s.title,
          description: s.description,
          icon: s.icon
        })),
        faqs: []
      });
    },
    onSuccess: () => {
      ue.success("Accommodation page saved!");
      queryClient.invalidateQueries({
        queryKey: ["adminServiceDetail", "accommodation"]
      });
      queryClient.invalidateQueries({
        queryKey: ["serviceDetail", "accommodation"]
      });
    },
    onError: () => ue.error("Save failed")
  });
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin.accommodation.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Study Abroad Accommodation Editor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => saveMutation.mutate(),
          disabled: saveMutation.isPending,
          className: "inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60",
          "data-ocid": "admin.accommodation.save_button",
          children: [
            saveMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            saveMutation.isPending ? "Saving…" : "Save"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-[#FF8A00]" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: "Hero Section" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-sm font-semibold", children: "Hero Image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageUpload,
            {
              value: form.heroImage,
              onChange: (v) => set("heroImage", v),
              label: "Hero Image"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "acc-hero-headline",
              className: "mb-1 block text-sm font-semibold",
              children: "Headline"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "acc-hero-headline",
              type: "text",
              value: form.heroHeadline,
              onChange: (e) => set("heroHeadline", e.target.value),
              className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
              "data-ocid": "admin.accommodation.hero_headline.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "acc-hero-subheadline",
              className: "mb-1 block text-sm font-semibold",
              children: "Subheadline"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "acc-hero-subheadline",
              type: "text",
              value: form.heroSubheadline,
              onChange: (e) => set("heroSubheadline", e.target.value),
              className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
              "data-ocid": "admin.accommodation.hero_subheadline.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: "Overview & CTA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "acc-overview",
              className: "mb-1 block text-sm font-semibold",
              children: "Overview"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              id: "acc-overview",
              rows: 4,
              value: form.overview,
              onChange: (e) => set("overview", e.target.value),
              className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
              "data-ocid": "admin.accommodation.overview.textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "acc-cta-text",
                className: "mb-1 block text-sm font-semibold",
                children: "CTA Text"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "acc-cta-text",
                type: "text",
                value: form.ctaText,
                onChange: (e) => set("ctaText", e.target.value),
                className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
                "data-ocid": "admin.accommodation.cta_text.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "acc-cta-btn",
                className: "mb-1 block text-sm font-semibold",
                children: "CTA Button Text"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "acc-cta-btn",
                type: "text",
                value: form.ctaButtonText,
                onChange: (e) => set("ctaButtonText", e.target.value),
                className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
                "data-ocid": "admin.accommodation.cta_button_text.input"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: "Destinations Covered" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ArrayEditor,
          {
            label: "Destinations",
            values: form.destinationsCovered,
            onChange: (v) => set("destinationsCovered", v)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-4 rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-foreground", children: "How It Works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => set("processSteps", [
                ...form.processSteps,
                {
                  id: crypto.randomUUID(),
                  title: "",
                  description: "",
                  icon: ""
                }
              ]),
              className: "flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-[#FF8A00] hover:text-[#FF8A00]",
              "data-ocid": "admin.accommodation.steps.add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 12 }),
                " Add Step"
              ]
            }
          )
        ] }),
        form.processSteps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border p-3 space-y-2",
            "data-ocid": `admin.accommodation.steps.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground", children: [
                  "Step ",
                  i + 1
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => set(
                      "processSteps",
                      form.processSteps.filter((_, j) => j !== i)
                    ),
                    className: "text-destructive hover:opacity-70",
                    "data-ocid": `admin.accommodation.steps.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: step.title,
                    placeholder: "Title",
                    onChange: (e) => {
                      const next = [...form.processSteps];
                      next[i] = { ...next[i], title: e.target.value };
                      set("processSteps", next);
                    },
                    className: "rounded-lg border border-border bg-background px-3 py-2 text-sm",
                    "data-ocid": `admin.accommodation.steps.title.input.${i + 1}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    value: step.icon,
                    placeholder: "Icon (emoji or name)",
                    onChange: (e) => {
                      const next = [...form.processSteps];
                      next[i] = { ...next[i], icon: e.target.value };
                      set("processSteps", next);
                    },
                    className: "rounded-lg border border-border bg-background px-3 py-2 text-sm",
                    "data-ocid": `admin.accommodation.steps.icon.input.${i + 1}`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  rows: 2,
                  value: step.description,
                  placeholder: "Description",
                  onChange: (e) => {
                    const next = [...form.processSteps];
                    next[i] = { ...next[i], description: e.target.value };
                    set("processSteps", next);
                  },
                  className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
                  "data-ocid": `admin.accommodation.steps.description.textarea.${i + 1}`
                }
              )
            ]
          },
          step.id
        ))
      ] })
    ] })
  ] });
}
export {
  AdminAccommodation as default
};
