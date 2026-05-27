import { createActor } from "@/backend";
import type { ContactInfo } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { RotateCcw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const defaultContact: ContactInfo = {
  phone1: "+91-9090 4747 77",
  phone2: "+91-9090 4242 22",
  phone3: "040-2789-9994",
  email: "enquiry@valmikigroup.com",
  branch1Name: "Secunderabad",
  address1: "Near Clock Tower, Secunderabad, Hyderabad",
  branch2Name: "Jubilee Hills",
  address2: "Road 37, Jubilee Hills, Hyderabad, Telangana",
  branch3Name: "Jubilee Hills",
  address3: "Jubilee Hills, Hyderabad, Telangana",
};

export default function AdminContactInfo() {
  const { actor } = useActor(createActor);
  const [info, setInfo] = useState<ContactInfo>(defaultContact);
  const [original, setOriginal] = useState<ContactInfo>(defaultContact);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  useEffect(() => {
    if (!actor) return;
    actor
      .getContactInfo()
      .then((c) => {
        setInfo(c);
        setOriginal(c);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const changed = JSON.stringify(info) !== JSON.stringify(original);

  const handleSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateContactInfo(token, info);
      if (result.__kind__ === "ok") {
        setOriginal(info);
        toast.success("Contact info saved");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setInfo(original);
    toast.info("Changes reverted");
  };

  const update = (field: keyof ContactInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          Contact Information
        </h2>
        {changed && (
          <span className="rounded-full bg-[#FFC247]/15 px-3 py-1 text-xs font-medium text-[#FFC247]">
            Unsaved changes
          </span>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-subtle">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Phone Numbers
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="contact-phone1"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Phone 1
            </label>
            <input
              id="contact-phone1"
              type="text"
              value={info.phone1}
              onChange={(e) => update("phone1", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.contact.phone1"
            />
          </div>
          <div>
            <label
              htmlFor="contact-phone2"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Phone 2
            </label>
            <input
              id="contact-phone2"
              type="text"
              value={info.phone2}
              onChange={(e) => update("phone2", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.contact.phone2"
            />
          </div>
          <div>
            <label
              htmlFor="contact-phone3"
              className="mb-1.5 block text-sm font-medium text-muted-foreground"
            >
              Phone 3
            </label>
            <input
              id="contact-phone3"
              type="text"
              value={info.phone3}
              onChange={(e) => update("phone3", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
              data-ocid="admin.contact.phone3"
            />
          </div>
        </div>

        <div className="pt-2">
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-medium text-muted-foreground"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="text"
            value={info.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
            data-ocid="admin.contact.email"
          />
        </div>

        <h3 className="pt-4 text-sm font-semibold text-muted-foreground">
          Branches
        </h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-branch1Name"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Branch 1 Name
              </label>
              <input
                id="contact-branch1Name"
                type="text"
                value={info.branch1Name}
                onChange={(e) => update("branch1Name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.contact.branch1_name"
              />
            </div>
            <div>
              <label
                htmlFor="contact-address1"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Branch 1 Address
              </label>
              <input
                id="contact-address1"
                type="text"
                value={info.address1}
                onChange={(e) => update("address1", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.contact.address1"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-branch2Name"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Branch 2 Name
              </label>
              <input
                id="contact-branch2Name"
                type="text"
                value={info.branch2Name}
                onChange={(e) => update("branch2Name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.contact.branch2_name"
              />
            </div>
            <div>
              <label
                htmlFor="contact-address2"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Branch 2 Address
              </label>
              <input
                id="contact-address2"
                type="text"
                value={info.address2}
                onChange={(e) => update("address2", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.contact.address2"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="contact-branch3Name"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Branch 3 Name
              </label>
              <input
                id="contact-branch3Name"
                type="text"
                value={info.branch3Name}
                onChange={(e) => update("branch3Name", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.contact.branch3_name"
              />
            </div>
            <div>
              <label
                htmlFor="contact-address3"
                className="mb-1.5 block text-sm font-medium text-muted-foreground"
              >
                Branch 3 Address
              </label>
              <input
                id="contact-address3"
                type="text"
                value={info.address3}
                onChange={(e) => update("address3", e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-[#FF8A00] focus:ring-1 focus:ring-[#FF8A00]"
                data-ocid="admin.contact.address3"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !changed}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#FF8A00]/90 disabled:opacity-50"
          data-ocid="admin.contact.save_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!changed}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
          data-ocid="admin.contact.reset_button"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
