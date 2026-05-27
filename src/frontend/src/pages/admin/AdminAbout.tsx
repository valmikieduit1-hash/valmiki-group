import { createActor } from "@/backend";
import type {
  AboutPageContent,
  Achievement,
  LeadershipMember,
  TimelineEntry,
} from "@/backend";
import { useLeadershipMembers } from "@/hooks/useBackendContent";
import { useActor } from "@caffeineai/core-infrastructure";
import { Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ImageUpload from "../../components/admin/ImageUpload";

const defaultContent: AboutPageContent = {
  companyStory: "",
  vision: "",
  mission: "",
  imageUrl: "",
  achievements: [],
  timeline: [],
};

const DEFAULT_LEADERS: LeadershipMember[] = [
  {
    id: BigInt(1),
    name: "Surya Ganesh Valmiki",
    role: "Chairman & Managing Director",
    bio: "The visionary force behind Valmiki Group, Surya Ganesh Valmiki has been transforming the landscape of foreign education and immigration services for more than two decades. As an educationist, entrepreneur, and philanthropist, he has successfully created a platform that empowers aspiring students to explore prestigious universities worldwide.",
    imageUrl: "",
    order: BigInt(1),
  },
  {
    id: BigInt(2),
    name: "Hari Kishan Valmiki",
    role: "Director",
    bio: "As the Director of the Valmiki Group, Hari Kishan Valmiki's scope encompasses driving growth initiatives, overseeing operations within the organization, and steering the Valmiki Tours and Travels Services and the Valmiki Foundation.",
    imageUrl: "",
    order: BigInt(2),
  },
  {
    id: BigInt(3),
    name: "Pushpa Valmiki",
    role: "Director",
    bio: "As the Director, she oversees the growth initiatives of the Valmiki Foreign Education Services, while leading the operations of the Valmiki Group and the Valmiki Foundation.",
    imageUrl: "",
    order: BigInt(3),
  },
  {
    id: BigInt(4),
    name: "Nirupama Das",
    role: "Director",
    bio: "Nirupama is responsible for overseeing all business aspects — from strategic development and operational oversight to developing best-in-class teams and fostering creativity in the workplace. With fifteen years of experience at the forefront of the education and corporate sector, she is a veteran in the industry.",
    imageUrl: "",
    order: BigInt(4),
  },
];

export default function AdminAbout() {
  const { actor } = useActor(createActor);
  const [content, setContent] = useState<AboutPageContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("valmikiAdminToken") ?? "";

  // Timeline inline add form
  const [timelineForm, setTimelineForm] = useState<Omit<TimelineEntry, "id">>({
    year: "",
    milestone: "",
    description: "",
  });
  const [editTimelineId, setEditTimelineId] = useState<bigint | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);

  // Achievement inline add form
  const [achieveForm, setAchieveForm] = useState<Omit<Achievement, "id">>({
    metric: "",
    description: "",
    icon: "",
  });
  const [editAchieveId, setEditAchieveId] = useState<bigint | null>(null);
  const [showAchieveForm, setShowAchieveForm] = useState(false);

  // Leadership state
  const [showLeaderForm, setShowLeaderForm] = useState(false);
  const [leaderForm, setLeaderForm] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    order: 1,
  });
  const [localLeaders, setLocalLeaders] = useState<LeadershipMember[]>([]);
  const [editLeaderId, setEditLeaderId] = useState<bigint | null>(null);
  const [showEditLeaderModal, setShowEditLeaderModal] = useState(false);
  const [editLeaderForm, setEditLeaderForm] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    order: 1,
  });

  const { data: backendLeaders, refetch: refetchLeaders } =
    useLeadershipMembers();

  useEffect(() => {
    if (backendLeaders !== undefined) {
      if (backendLeaders.length > 0) {
        setLocalLeaders(backendLeaders as LeadershipMember[]);
      } else {
        // Pre-populate with default 4 members if backend is empty
        setLocalLeaders(DEFAULT_LEADERS);
      }
    }
  }, [backendLeaders]);

  useEffect(() => {
    if (!actor) return;
    actor
      .getAboutPageContent()
      .then((c) => {
        setContent(c);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const handleAddLeader = () => {
    const newLeader: LeadershipMember = {
      id: BigInt(Date.now()),
      name: leaderForm.name,
      role: leaderForm.role,
      bio: leaderForm.bio,
      imageUrl: leaderForm.imageUrl,
      order: BigInt(leaderForm.order),
    };
    setLocalLeaders((prev) => [...prev, newLeader]);
    setLeaderForm({ name: "", role: "", bio: "", imageUrl: "", order: 1 });
    setShowLeaderForm(false);
  };

  const handleDeleteLeader = (id: bigint) => {
    setLocalLeaders((prev) => prev.filter((l) => l.id !== id));
  };

  const openEditLeader = (leader: LeadershipMember) => {
    setEditLeaderId(leader.id);
    setEditLeaderForm({
      name: leader.name,
      role: leader.role,
      bio: leader.bio,
      imageUrl: leader.imageUrl,
      order: Number(leader.order),
    });
    setShowEditLeaderModal(true);
  };

  const handleUpdateLeader = () => {
    if (!editLeaderForm.name.trim() || !editLeaderForm.role.trim()) {
      toast.error("Name and role are required");
      return;
    }
    setLocalLeaders((prev) =>
      prev.map((l) =>
        l.id === editLeaderId
          ? {
              ...l,
              name: editLeaderForm.name,
              role: editLeaderForm.role,
              bio: editLeaderForm.bio,
              imageUrl: editLeaderForm.imageUrl,
              order: BigInt(editLeaderForm.order),
            }
          : l,
      ),
    );
    setShowEditLeaderModal(false);
    setEditLeaderId(null);
  };

  const handleSaveAll = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      const result = await actor.updateAboutPageContent(token, content);
      if (result.__kind__ === "ok") {
        await actor.updateLeadershipMembers(token, localLeaders);
        toast.success("About page saved!");
        await refetchLeaders();
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  // ── Timeline helpers ──────────────────────────────────────────────
  const openAddTimeline = () => {
    setEditTimelineId(null);
    setTimelineForm({ year: "", milestone: "", description: "" });
    setShowTimelineForm(true);
  };
  const openEditTimeline = (entry: TimelineEntry) => {
    setEditTimelineId(entry.id);
    setTimelineForm({
      year: entry.year,
      milestone: entry.milestone,
      description: entry.description,
    });
    setShowTimelineForm(true);
  };
  const saveTimeline = () => {
    if (!timelineForm.year.trim() || !timelineForm.milestone.trim()) {
      toast.error("Year and milestone are required");
      return;
    }
    if (editTimelineId !== null) {
      setContent((prev) => ({
        ...prev,
        timeline: prev.timeline.map((t) =>
          t.id === editTimelineId ? { ...t, ...timelineForm } : t,
        ),
      }));
    } else {
      const newEntry: TimelineEntry = {
        id: BigInt(Date.now()),
        ...timelineForm,
      };
      setContent((prev) => ({
        ...prev,
        timeline: [...prev.timeline, newEntry].sort((a, b) =>
          a.year.localeCompare(b.year),
        ),
      }));
    }
    setShowTimelineForm(false);
  };
  const deleteTimeline = (id: bigint) => {
    setContent((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((t) => t.id !== id),
    }));
  };

  // ── Achievement helpers ───────────────────────────────────────────
  const openAddAchieve = () => {
    setEditAchieveId(null);
    setAchieveForm({ metric: "", description: "", icon: "" });
    setShowAchieveForm(true);
  };
  const openEditAchieve = (a: Achievement) => {
    setEditAchieveId(a.id);
    setAchieveForm({
      metric: a.metric,
      description: a.description,
      icon: a.icon,
    });
    setShowAchieveForm(true);
  };
  const saveAchieve = () => {
    if (!achieveForm.metric.trim()) {
      toast.error("Metric is required");
      return;
    }
    if (editAchieveId !== null) {
      setContent((prev) => ({
        ...prev,
        achievements: prev.achievements.map((a) =>
          a.id === editAchieveId ? { ...a, ...achieveForm } : a,
        ),
      }));
    } else {
      const newAch: Achievement = { id: BigInt(Date.now()), ...achieveForm };
      setContent((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAch],
      }));
    }
    setShowAchieveForm(false);
  };
  const deleteAchieve = (id: bigint) => {
    setContent((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
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
    <div className="space-y-6" data-ocid="admin.about.page">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">
          About Page Editor
        </h2>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.about.save_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {/* Main Text Fields */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <h3 className="font-semibold text-foreground">Main Content</h3>

        <div className="space-y-2">
          <label
            htmlFor="about-story"
            className="block text-sm font-medium text-foreground"
          >
            Company Story
          </label>
          <textarea
            id="about-story"
            rows={5}
            value={content.companyStory}
            onChange={(e) =>
              setContent((p) => ({ ...p, companyStory: e.target.value }))
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
            placeholder="Tell the company story..."
            data-ocid="admin.about.company_story.textarea"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="about-vision"
              className="block text-sm font-medium text-foreground"
            >
              Vision
            </label>
            <textarea
              id="about-vision"
              rows={3}
              value={content.vision}
              onChange={(e) =>
                setContent((p) => ({ ...p, vision: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              placeholder="Our vision..."
              data-ocid="admin.about.vision.textarea"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="about-mission"
              className="block text-sm font-medium text-foreground"
            >
              Mission
            </label>
            <textarea
              id="about-mission"
              rows={3}
              value={content.mission}
              onChange={(e) =>
                setContent((p) => ({ ...p, mission: e.target.value }))
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
              placeholder="Our mission..."
              data-ocid="admin.about.mission.textarea"
            />
          </div>
        </div>

        <ImageUpload
          label="About Page Image"
          value={content.imageUrl}
          onChange={(url) => setContent((p) => ({ ...p, imageUrl: url }))}
        />
      </div>

      {/* Timeline Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Company Timeline</h3>
          <button
            type="button"
            onClick={openAddTimeline}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.about.timeline.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Entry
          </button>
        </div>

        {showTimelineForm && (
          <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="timeline-year"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Year *
                </label>
                <input
                  id="timeline-year"
                  type="text"
                  value={timelineForm.year}
                  onChange={(e) =>
                    setTimelineForm((p) => ({ ...p, year: e.target.value }))
                  }
                  placeholder="e.g. 2001"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.timeline.year.input"
                />
              </div>
              <div>
                <label
                  htmlFor="timeline-milestone"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Milestone *
                </label>
                <input
                  id="timeline-milestone"
                  type="text"
                  value={timelineForm.milestone}
                  onChange={(e) =>
                    setTimelineForm((p) => ({
                      ...p,
                      milestone: e.target.value,
                    }))
                  }
                  placeholder="Milestone title"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.timeline.milestone.input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="timeline-desc"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="timeline-desc"
                rows={2}
                value={timelineForm.description}
                onChange={(e) =>
                  setTimelineForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                data-ocid="admin.about.timeline.description.textarea"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveTimeline}
                className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                data-ocid="admin.about.timeline.save_button"
              >
                {editTimelineId !== null ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowTimelineForm(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                data-ocid="admin.about.timeline.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {content.timeline.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.about.timeline.empty_state"
          >
            No timeline entries yet.
          </p>
        ) : (
          <div className="space-y-2">
            {[...content.timeline]
              .sort((a, b) => a.year.localeCompare(b.year))
              .map((entry, idx) => (
                <div
                  key={String(entry.id)}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                  data-ocid={`admin.about.timeline.item.${idx + 1}`}
                >
                  <span className="shrink-0 rounded-md bg-[#FFC247]/20 px-2.5 py-0.5 text-xs font-bold text-[#0B1F3A]">
                    {entry.year}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {entry.milestone}
                    </p>
                    {entry.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditTimeline(entry)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Edit"
                      data-ocid={`admin.about.timeline.edit_button.${idx + 1}`}
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTimeline(entry.id)}
                      className="rounded p-1 text-red-500 hover:bg-red-50"
                      aria-label="Delete"
                      data-ocid={`admin.about.timeline.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Achievements</h3>
          <button
            type="button"
            onClick={openAddAchieve}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.about.achievements.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Achievement
          </button>
        </div>

        {showAchieveForm && (
          <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="achieve-metric"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Metric *
                </label>
                <input
                  id="achieve-metric"
                  type="text"
                  value={achieveForm.metric}
                  onChange={(e) =>
                    setAchieveForm((p) => ({ ...p, metric: e.target.value }))
                  }
                  placeholder="e.g. 1 Lakh+"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.achieve.metric.input"
                />
              </div>
              <div>
                <label
                  htmlFor="achieve-desc"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Description
                </label>
                <input
                  id="achieve-desc"
                  type="text"
                  value={achieveForm.description}
                  onChange={(e) =>
                    setAchieveForm((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Students Guided"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.achieve.description.input"
                />
              </div>
              <div>
                <label
                  htmlFor="achieve-icon"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Icon (emoji / text)
                </label>
                <input
                  id="achieve-icon"
                  type="text"
                  value={achieveForm.icon}
                  onChange={(e) =>
                    setAchieveForm((p) => ({ ...p, icon: e.target.value }))
                  }
                  placeholder="🎓"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.achieve.icon.input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveAchieve}
                className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                data-ocid="admin.about.achieve.save_button"
              >
                {editAchieveId !== null ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => setShowAchieveForm(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                data-ocid="admin.about.achieve.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {content.achievements.length === 0 ? (
          <p
            className="text-sm text-muted-foreground"
            data-ocid="admin.about.achievements.empty_state"
          >
            No achievements yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.achievements.map((a, idx) => (
              <div
                key={String(a.id)}
                className="relative rounded-lg border border-border bg-background p-4"
                data-ocid={`admin.about.achievements.item.${idx + 1}`}
              >
                <div className="flex items-start gap-2">
                  {a.icon && <span className="text-lg">{a.icon}</span>}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#FF8A00]">{a.metric}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.description}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEditAchieve(a)}
                    className="rounded p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Edit"
                    data-ocid={`admin.about.achievements.edit_button.${idx + 1}`}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteAchieve(a.id)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                    aria-label="Delete"
                    data-ocid={`admin.about.achievements.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leadership Team */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Leadership Team</h3>
          <button
            type="button"
            onClick={() => setShowLeaderForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1F3A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0B1F3A]/80"
            data-ocid="admin.about.leadership.add_button"
          >
            <Plus className="h-3.5 w-3.5" /> Add Member
          </button>
        </div>

        <div className="space-y-3">
          {localLeaders
            .sort((a, b) => Number(a.order) - Number(b.order))
            .map((leader, idx) => (
              <div
                key={String(leader.id)}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                data-ocid={`admin.about.leadership.item.${idx + 1}`}
              >
                <img
                  src={
                    leader.imageUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=0B1F3A&color=fff&size=200`
                  }
                  alt={leader.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=0B1F3A&color=fff&size=200`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm truncate">
                    {leader.name}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: "#FF8A00" }}
                  >
                    {leader.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEditLeader(leader)}
                  className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Edit member"
                  data-ocid={`admin.about.leadership.edit_button.${idx + 1}`}
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLeader(leader.id)}
                  className="rounded p-1 text-red-500 hover:bg-red-50"
                  aria-label="Delete member"
                  data-ocid={`admin.about.leadership.delete_button.${idx + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          {localLeaders.length === 0 && (
            <p
              className="text-sm text-muted-foreground"
              data-ocid="admin.about.leadership.empty_state"
            >
              No team members yet. Click Add Member to get started.
            </p>
          )}
        </div>

        {/* Edit Leader Modal */}
        {showEditLeaderModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            data-ocid="admin.about.leadership.edit.dialog"
          >
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h4 className="font-semibold text-foreground">
                  Edit Team Member
                </h4>
                <button
                  type="button"
                  onClick={() => setShowEditLeaderModal(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Close"
                  data-ocid="admin.about.leadership.edit.close_button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="edit-leader-name"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Full Name *
                    </label>
                    <input
                      id="edit-leader-name"
                      type="text"
                      placeholder="Full Name"
                      value={editLeaderForm.name}
                      onChange={(e) =>
                        setEditLeaderForm((p) => ({
                          ...p,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.about.leadership.edit.name.input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-leader-role"
                      className="mb-1 block text-xs font-medium text-foreground"
                    >
                      Role / Title *
                    </label>
                    <input
                      id="edit-leader-role"
                      type="text"
                      placeholder="e.g. Chairman & Managing Director"
                      value={editLeaderForm.role}
                      onChange={(e) =>
                        setEditLeaderForm((p) => ({
                          ...p,
                          role: e.target.value,
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                      data-ocid="admin.about.leadership.edit.role.input"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="edit-leader-bio"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Bio
                  </label>
                  <textarea
                    id="edit-leader-bio"
                    rows={4}
                    placeholder="Bio"
                    value={editLeaderForm.bio}
                    onChange={(e) =>
                      setEditLeaderForm((p) => ({ ...p, bio: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid="admin.about.leadership.edit.bio.textarea"
                  />
                </div>
                <ImageUpload
                  value={editLeaderForm.imageUrl}
                  onChange={(url) =>
                    setEditLeaderForm((p) => ({ ...p, imageUrl: url }))
                  }
                  label="Member Photo"
                />
                <div>
                  <label
                    htmlFor="edit-leader-order"
                    className="mb-1 block text-xs font-medium text-foreground"
                  >
                    Display Order
                  </label>
                  <input
                    id="edit-leader-order"
                    type="number"
                    min={1}
                    value={editLeaderForm.order}
                    onChange={(e) =>
                      setEditLeaderForm((p) => ({
                        ...p,
                        order: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                    data-ocid="admin.about.leadership.edit.order.input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowEditLeaderModal(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                  data-ocid="admin.about.leadership.edit.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateLeader}
                  className="rounded-lg bg-[#FF8A00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#FF8A00]/90"
                  data-ocid="admin.about.leadership.edit.confirm_button"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {showLeaderForm && (
          <div className="rounded-lg border border-[#FF8A00]/30 bg-[#FF8A00]/5 p-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="leader-name"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Full Name *
                </label>
                <input
                  id="leader-name"
                  type="text"
                  placeholder="Full Name"
                  value={leaderForm.name}
                  onChange={(e) =>
                    setLeaderForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.leadership.name.input"
                />
              </div>
              <div>
                <label
                  htmlFor="leader-role"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Role / Title *
                </label>
                <input
                  id="leader-role"
                  type="text"
                  placeholder="e.g. Chairman & Managing Director"
                  value={leaderForm.role}
                  onChange={(e) =>
                    setLeaderForm((p) => ({ ...p, role: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.leadership.role.input"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="leader-bio"
                className="mb-1 block text-xs font-medium text-foreground"
              >
                Bio
              </label>
              <textarea
                id="leader-bio"
                rows={3}
                placeholder="Bio"
                value={leaderForm.bio}
                onChange={(e) =>
                  setLeaderForm((p) => ({ ...p, bio: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                data-ocid="admin.about.leadership.bio.textarea"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <ImageUpload
                  value={leaderForm.imageUrl}
                  onChange={(url) =>
                    setLeaderForm((p) => ({ ...p, imageUrl: url }))
                  }
                  label="Member Photo"
                />
              </div>
              <div>
                <label
                  htmlFor="leader-order"
                  className="mb-1 block text-xs font-medium text-foreground"
                >
                  Display Order
                </label>
                <input
                  id="leader-order"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={leaderForm.order}
                  onChange={(e) =>
                    setLeaderForm((p) => ({
                      ...p,
                      order: Number.parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]/30"
                  data-ocid="admin.about.leadership.order.input"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddLeader}
                className="rounded-lg bg-[#FF8A00] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#FF8A00]/90"
                data-ocid="admin.about.leadership.confirm_button"
              >
                Add Member
              </button>
              <button
                type="button"
                onClick={() => setShowLeaderForm(false)}
                className="rounded-lg border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                data-ocid="admin.about.leadership.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Save */}
      <div className="flex justify-end pb-4">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FF8A00] px-6 py-3 font-semibold text-white shadow-lg hover:bg-[#FF8A00]/90 disabled:opacity-60"
          data-ocid="admin.about.save_bottom_button"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
