import {
  useUpdateWebsiteTheme,
  useWebsiteTheme,
} from "@/hooks/useBackendContent";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingTextColor: string;
  bodyTextColor: string;
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  footerBgColor: string;
  footerTextColor: string;
}

const defaultTheme: ThemeColors = {
  primaryColor: "#0B1F3A",
  secondaryColor: "#FF8A00",
  accentColor: "#FFC247",
  headingTextColor: "#0B1F3A",
  bodyTextColor: "#333333",
  buttonColor: "#FF8A00",
  buttonTextColor: "#FFFFFF",
  backgroundColor: "#FFFFFF",
  footerBgColor: "#0B1F3A",
  footerTextColor: "#FFFFFF",
};

const colorFields: {
  key: keyof ThemeColors;
  label: string;
  hint: string;
}[] = [
  {
    key: "primaryColor",
    label: "Primary Color",
    hint: "Navbar, headings, footer background",
  },
  {
    key: "secondaryColor",
    label: "Secondary Color",
    hint: "Buttons, CTAs, highlight icons",
  },
  {
    key: "accentColor",
    label: "Accent Color",
    hint: "Badges, counters, star ratings",
  },
  {
    key: "headingTextColor",
    label: "Heading Text Color",
    hint: "All heading text color",
  },
  {
    key: "bodyTextColor",
    label: "Body Text Color",
    hint: "Paragraph and description text",
  },
  {
    key: "buttonColor",
    label: "Button Color",
    hint: "Primary button background",
  },
  {
    key: "buttonTextColor",
    label: "Button Text Color",
    hint: "Text on primary buttons",
  },
  {
    key: "backgroundColor",
    label: "Background Color",
    hint: "Page/section background",
  },
  {
    key: "footerBgColor",
    label: "Footer Background",
    hint: "Footer section background",
  },
  {
    key: "footerTextColor",
    label: "Footer Text Color",
    hint: "Footer text and links",
  },
];

function applyThemeToDocument(theme: ThemeColors) {
  document.documentElement.style.setProperty(
    "--color-primary",
    theme.primaryColor,
  );
  document.documentElement.style.setProperty(
    "--color-secondary",
    theme.secondaryColor,
  );
  document.documentElement.style.setProperty(
    "--color-accent",
    theme.accentColor,
  );
  document.documentElement.style.setProperty(
    "--color-heading-text",
    theme.headingTextColor,
  );
  document.documentElement.style.setProperty(
    "--color-body-text",
    theme.bodyTextColor,
  );
  document.documentElement.style.setProperty(
    "--color-button",
    theme.buttonColor,
  );
  document.documentElement.style.setProperty(
    "--color-button-text",
    theme.buttonTextColor,
  );
  document.documentElement.style.setProperty(
    "--color-background",
    theme.backgroundColor,
  );
  document.documentElement.style.setProperty(
    "--color-footer-bg",
    theme.footerBgColor,
  );
  document.documentElement.style.setProperty(
    "--color-footer-text",
    theme.footerTextColor,
  );
}

export default function AdminTheme() {
  const { data: storedTheme } = useWebsiteTheme();
  const updateMutation = useUpdateWebsiteTheme();

  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    if (storedTheme) {
      const t = { ...defaultTheme, ...storedTheme } as ThemeColors;
      setTheme(t);
      applyThemeToDocument(t);
    }
  }, [storedTheme]);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("valmikiAdminToken");
    if (!token) {
      toast.error("Admin token not found. Please log in again.");
      return;
    }
    try {
      await updateMutation.mutateAsync({ token, theme });
      applyThemeToDocument(theme);
      toast.success(
        "Theme saved! Colors are now live across your entire website.",
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to save theme");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0B1F3A]">
          Website Theme
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize colors across your entire website. Changes apply instantly
          site-wide.
        </p>
      </div>

      {/* Color Pickers Grid */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-semibold text-[#0B1F3A]">
          Color Palette
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {colorFields.map(({ key, label, hint }) => (
            <div key={key} className="space-y-2">
              <label
                htmlFor={`color-${key}`}
                className="block text-sm font-medium text-foreground"
              >
                {label}
              </label>
              <p className="text-xs text-muted-foreground">{hint}</p>
              <div className="flex items-center gap-3">
                <input
                  id={`color-${key}`}
                  type="color"
                  value={theme[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded-lg border border-border bg-transparent p-1"
                  data-ocid={`admin.theme.${key}.picker`}
                />
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:border-[#FF8A00] focus:outline-none focus:ring-1 focus:ring-[#FF8A00]"
                  data-ocid={`admin.theme.${key}.input`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <h2 className="mb-4 font-display text-lg font-semibold text-[#0B1F3A]">
          Live Preview
        </h2>
        <div
          className="rounded-lg border border-border p-6"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <h3
            className="mb-2 font-display text-xl font-bold"
            style={{ color: theme.headingTextColor }}
          >
            Sample Heading
          </h3>
          <p className="mb-4 text-sm" style={{ color: theme.bodyTextColor }}>
            This is a sample paragraph to preview your body text color and
            background color combination. Make sure the contrast is comfortable
            for reading.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-full px-5 py-2 text-sm font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
              }}
            >
              Primary Button
            </button>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: theme.accentColor,
                color: "#0B1F3A",
              }}
            >
              Badge
            </span>
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: theme.secondaryColor,
                color: "#FFFFFF",
              }}
            >
              CTA Label
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full rounded-lg bg-[#FF8A00] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#e67d00] hover:shadow-md disabled:opacity-60"
          data-ocid="admin.theme.save_button"
        >
          {updateMutation.isPending ? "Saving..." : "Save Theme"}
        </button>
      </div>
    </div>
  );
}
