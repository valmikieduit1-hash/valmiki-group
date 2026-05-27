import {
  type JobApplication,
  type JobOpening,
  type JobOpeningInput,
  createActor,
} from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function getToken() {
  return localStorage.getItem("valmikiAdminToken") ?? "";
}

const EMPTY_JOB: JobOpeningInput = {
  title: "",
  department: "",
  location: "",
  description: "",
  requirements: "",
  isActive: true,
};

export default function AdminJobs() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobOpening | null>(null);
  const [form, setForm] = useState<JobOpeningInput>(EMPTY_JOB);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<JobOpening[]>({
    queryKey: ["adminJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobOpenings();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery<
    JobApplication[]
  >({
    queryKey: ["jobApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobApplications(getToken());
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: async (input: JobOpeningInput) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.addJobOpening(getToken(), input);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminJobs"] });
      qc.invalidateQueries({ queryKey: ["activeJobs"] });
      toast.success("Job opening added");
      setIsOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: JobOpeningInput }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.updateJobOpening(getToken(), id, input);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminJobs"] });
      qc.invalidateQueries({ queryKey: ["activeJobs"] });
      toast.success("Job updated");
      setIsOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.deleteJobOpening(getToken(), id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminJobs"] });
      qc.invalidateQueries({ queryKey: ["activeJobs"] });
      toast.success("Job deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteAppMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.deleteJobApplication(getToken(), id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobApplications"] });
      toast.success("Application deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAdd = () => {
    setEditJob(null);
    setForm(EMPTY_JOB);
    setIsOpen(true);
  };

  const openEdit = (job: JobOpening) => {
    setEditJob(job);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      isActive: job.isActive,
    });
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editJob) {
      updateMutation.mutate({ id: editJob.id, input: form });
    } else {
      addMutation.mutate(form);
    }
  };

  const f = <K extends keyof JobOpeningInput>(k: K, v: JobOpeningInput[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const sortedApps = [...applications].sort(
    (a, b) => Number(b.submittedAt) - Number(a.submittedAt),
  );

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">
          Jobs & Applications
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage job openings and review candidate applications.
        </p>
      </div>

      <Tabs defaultValue="openings">
        <TabsList data-ocid="admin.jobs.tabs">
          <TabsTrigger value="openings" data-ocid="admin.jobs.tab.openings">
            Job Openings
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            data-ocid="admin.jobs.tab.applications"
          >
            Applications
            {applications.length > 0 && (
              <Badge className="ml-2 bg-[#FF8A00] text-white text-xs">
                {applications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Job Openings Tab */}
        <TabsContent value="openings" className="mt-4">
          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              onClick={openAdd}
              className="bg-[#FF8A00] text-white hover:bg-[#FF8A00]/90 gap-2"
              data-ocid="admin.jobs.add_button"
            >
              <Plus className="h-4 w-4" />
              Add Job Opening
            </Button>
          </div>
          {jobsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div
              className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 text-center"
              data-ocid="admin.jobs.openings.empty_state"
            >
              <Briefcase className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No job openings yet. Add one to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job, i) => (
                <div
                  key={String(job.id)}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                  data-ocid={`admin.jobs.job.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <Badge
                        variant={job.isActive ? "default" : "secondary"}
                        className={
                          job.isActive ? "bg-green-500/10 text-green-600" : ""
                        }
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.department} · {job.location}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {job.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(job)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Edit"
                      data-ocid={`admin.jobs.edit_button.${i + 1}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this job opening?"))
                          deleteMutation.mutate(job.id);
                      }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                      data-ocid={`admin.jobs.delete_button.${i + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="mt-4">
          {appsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : sortedApps.length === 0 ? (
            <div
              className="flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 text-center"
              data-ocid="admin.jobs.applications.empty_state"
            >
              <Briefcase className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No applications received yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Applicant
                      </th>
                      <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">
                        Position
                      </th>
                      <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">
                        Date
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Resume
                      </th>
                      <th className="px-4 py-3 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedApps.map((app, i) => (
                      <tr
                        key={String(app.id)}
                        className="hover:bg-muted/20"
                        data-ocid={`admin.jobs.application.item.${i + 1}`}
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">
                            {app.applicantName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {app.email}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell max-w-[160px] truncate">
                          {app.positionApplied}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                          {app.phone}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                          {formatDate(app.submittedAt)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#0B1F3A]/10 px-2.5 py-1 text-xs font-medium text-[#0B1F3A] hover:bg-[#0B1F3A]/20"
                              data-ocid={`admin.jobs.resume_link.${i + 1}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm("Delete this application?"))
                                  deleteAppMutation.mutate(app.id);
                              }}
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Delete"
                              data-ocid={`admin.jobs.delete_app.${i + 1}`}
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
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.jobs.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editJob ? "Edit Job Opening" : "Add Job Opening"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label
                htmlFor="job-title"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Job Title *
              </label>
              <input
                id="job-title"
                required
                value={form.title}
                onChange={(e) => f("title", e.target.value)}
                placeholder="Education Counselor"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-[#FF8A00]/50 focus:outline-none"
                data-ocid="admin.jobs.form.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="job-dept"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Department
                </label>
                <input
                  id="job-dept"
                  value={form.department}
                  onChange={(e) => f("department", e.target.value)}
                  placeholder="Counseling"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-[#FF8A00]/50 focus:outline-none"
                  data-ocid="admin.jobs.form.department.input"
                />
              </div>
              <div>
                <label
                  htmlFor="job-loc"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Location
                </label>
                <input
                  id="job-loc"
                  value={form.location}
                  onChange={(e) => f("location", e.target.value)}
                  placeholder="Hyderabad"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-[#FF8A00]/50 focus:outline-none"
                  data-ocid="admin.jobs.form.location.input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="job-desc"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Description
              </label>
              <Textarea
                id="job-desc"
                value={form.description}
                onChange={(e) => f("description", e.target.value)}
                placeholder="Brief description of the role…"
                rows={3}
                data-ocid="admin.jobs.form.description.textarea"
              />
            </div>
            <div>
              <label
                htmlFor="job-req"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Requirements
              </label>
              <Textarea
                id="job-req"
                value={form.requirements}
                onChange={(e) => f("requirements", e.target.value)}
                placeholder="List key requirements…"
                rows={3}
                data-ocid="admin.jobs.form.requirements.textarea"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="job-active"
                checked={form.isActive}
                onCheckedChange={(v) => f("isActive", v)}
                data-ocid="admin.jobs.form.active.switch"
              />
              <label htmlFor="job-active" className="text-sm text-foreground">
                Active (visible on careers page)
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
                data-ocid="admin.jobs.form.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FF8A00] text-white hover:bg-[#FF8A00]/90"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin.jobs.form.save_button"
              >
                {addMutation.isPending || updateMutation.isPending
                  ? "Saving…"
                  : "Save Job"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
