import {
  type JobApplication,
  type JobApplicationInput,
  type JobOpening,
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
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Globe,
  MapPin,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function useActiveJobs() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<JobOpening[]>({
    queryKey: ["activeJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveJobOpenings();
    },
    enabled: !!actor && !isFetching,
  });
}

const WHY_JOIN = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Structured growth paths, mentorship programs, and continuous learning opportunities to accelerate your career.",
  },
  {
    icon: Users,
    title: "Dynamic Team",
    desc: "Work alongside passionate counselors, visa experts, and education professionals who are committed to student success.",
  },
  {
    icon: Globe,
    title: "Global Exposure",
    desc: "Gain firsthand international education insights, partner with top universities worldwide, and grow a global network.",
  },
];

interface ApplyFormState {
  applicantName: string;
  email: string;
  phone: string;
  positionApplied: string;
  coverLetter: string;
  resumeUrl: string;
}

export default function Careers() {
  const [heroData, setHeroData] = useState<{
    headline: string;
    subheadline: string;
    imageUrl: string;
  } | null>(null);
  const { data: jobs = [], isLoading } = useActiveJobs();
  const { actor } = useActor(createActor);
  useEffect(() => {
    if (!actor) return;
    actor
      .getPageHeroContent("careers")
      .then(setHeroData)
      .catch(() => {});
  }, [actor]);
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ApplyFormState>({
    applicantName: "",
    email: "",
    phone: "",
    positionApplied: "",
    coverLetter: "",
    resumeUrl: "",
  });
  const [errors, setErrors] = useState<Partial<ApplyFormState>>({});

  useEffect(() => {
    document.title = "Careers | Valmiki Group";
  }, []);

  const applyMutation = useMutation({
    mutationFn: async (input: JobApplicationInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitJobApplication(input);
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
    onError: () => {
      toast.error("Failed to submit application. Please try again.");
    },
  });

  const validate = () => {
    const errs: Partial<ApplyFormState> = {};
    if (!form.applicantName.trim()) errs.applicantName = "Name is required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.resumeUrl.trim()) errs.resumeUrl = "Resume upload is required";
    return errs;
  };

  const openModal = (job: JobOpening) => {
    setSelectedJob(job);
    setForm((f) => ({ ...f, positionApplied: job.title }));
    setErrors({});
    setSubmitted(false);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    applyMutation.mutate({
      applicantName: form.applicantName,
      email: form.email,
      phone: form.phone,
      positionApplied: form.positionApplied,
      coverLetter: form.coverLetter,
      resumeUrl: form.resumeUrl,
      jobOpeningId: selectedJob?.id ?? 0n,
    });
  };

  const field = (k: keyof ApplyFormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#0B1F3A] py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-[#FF8A00]/20 text-[#FF8A00] border-[#FF8A00]/30">
            We're Hiring
          </Badge>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {heroData?.headline || "Join Our Team"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            {heroData?.subheadline ?? ""}
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-[#0B1F3A]">
              Why Join Valmiki Group?
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {WHY_JOIN.map((item, i) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                data-ocid={`careers.why_join.item.${i + 1}`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF8A00]/10">
                  <item.icon className="h-6 w-6 text-[#FF8A00]" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-[#0B1F3A]">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-[#0B1F3A]">
              Open Positions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Explore current opportunities and find your fit.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div
              className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 py-12 text-center"
              data-ocid="careers.jobs.empty_state"
            >
              <Briefcase className="h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">
                No open positions right now — check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4" data-ocid="careers.jobs.list">
              {jobs.map((job, i) => (
                <div
                  key={String(job.id)}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  data-ocid={`careers.job.item.${i + 1}`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-semibold text-[#0B1F3A]">
                        {job.title}
                      </h3>
                      <Badge className="bg-[#FFC247]/20 text-[#0B1F3A] border-[#FFC247]/30 text-xs">
                        {job.department}
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Button
                      type="button"
                      onClick={() => openModal(job)}
                      className="bg-[#FF8A00] text-white hover:bg-[#FF8A00]/90 gap-1.5"
                      data-ocid={`careers.job.apply_button.${i + 1}`}
                    >
                      Apply Now
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(o) => {
          if (!o) setIsModalOpen(false);
        }}
      >
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="careers.apply.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-[#0B1F3A]">
              Apply — {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>

          {submitted ? (
            <div
              className="flex flex-col items-center gap-4 py-8 text-center"
              data-ocid="careers.apply.success_state"
            >
              <CheckCircle2 className="h-14 w-14 text-green-500" />
              <h3 className="font-display text-lg font-semibold text-[#0B1F3A]">
                Application Submitted!
              </h3>
              <p className="text-sm text-muted-foreground">
                Thank you for applying to Valmiki Group. Our HR team will review
                your application and get in touch soon.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                data-ocid="careers.apply.close_button"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <Label htmlFor="app-name">Full Name *</Label>
                <Input
                  id="app-name"
                  value={form.applicantName}
                  onChange={(e) => field("applicantName", e.target.value)}
                  placeholder="Your full name"
                  data-ocid="careers.apply.name.input"
                />
                {errors.applicantName && (
                  <p
                    className="mt-1 text-xs text-destructive"
                    data-ocid="careers.apply.name.field_error"
                  >
                    {errors.applicantName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="app-email">Email *</Label>
                <Input
                  id="app-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  placeholder="you@email.com"
                  data-ocid="careers.apply.email.input"
                />
                {errors.email && (
                  <p
                    className="mt-1 text-xs text-destructive"
                    data-ocid="careers.apply.email.field_error"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="app-phone">Phone *</Label>
                <Input
                  id="app-phone"
                  value={form.phone}
                  onChange={(e) => field("phone", e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  data-ocid="careers.apply.phone.input"
                />
                {errors.phone && (
                  <p
                    className="mt-1 text-xs text-destructive"
                    data-ocid="careers.apply.phone.field_error"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="app-position">Position Applied For</Label>
                <Input
                  id="app-position"
                  value={form.positionApplied}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                  data-ocid="careers.apply.position.input"
                />
              </div>
              <div>
                <Label htmlFor="app-cover">Cover Letter</Label>
                <Textarea
                  id="app-cover"
                  value={form.coverLetter}
                  onChange={(e) => field("coverLetter", e.target.value)}
                  placeholder="Tell us why you'd be a great fit…"
                  rows={4}
                  data-ocid="careers.apply.cover_letter.textarea"
                />
              </div>
              <div className="rounded-xl bg-[#0B1F3A] p-4">
                <ImageUpload
                  label="Resume / CV (PDF or DOC) *"
                  value={form.resumeUrl}
                  onChange={(url) => field("resumeUrl", url)}
                />
                {errors.resumeUrl && (
                  <p
                    className="mt-1 text-xs text-red-400"
                    data-ocid="careers.apply.resume.field_error"
                  >
                    {errors.resumeUrl}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                  data-ocid="careers.apply.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#FF8A00] text-white hover:bg-[#FF8A00]/90"
                  disabled={applyMutation.isPending}
                  data-ocid="careers.apply.submit_button"
                >
                  {applyMutation.isPending
                    ? "Submitting…"
                    : "Submit Application"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
