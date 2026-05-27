import { createActor } from "@/backend";
import type { BlogPost, BlogPostInput } from "@/backend";
import ImageUpload from "@/components/admin/ImageUpload";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM: BlogPostInput = {
  title: "",
  slug: "",
  content: "",
  category: "",
  featuredImageUrl: "",
  isPublished: false,
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getToken() {
  return localStorage.getItem("valmikiAdminToken") ?? "";
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

export default function AdminBlog() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogPostInput>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["admin", "blogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPostInput) => {
      if (!actor) throw new Error("No actor");
      const token = getToken();
      if (editing) {
        const res = await actor.updateBlogPost(token, editing.id, data);
        if (res.__kind__ === "err") throw new Error(res.err);
      } else {
        const res = await actor.addBlogPost(token, data);
        if (res.__kind__ === "err") throw new Error(res.err);
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Post updated" : "Post created");
      qc.invalidateQueries({ queryKey: ["admin", "blogPosts"] });
      closeForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.toggleBlogPostPublish(getToken(), id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin", "blogPosts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.deleteBlogPost(getToken(), id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["admin", "blogPosts"] });
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      category: post.category,
      featuredImageUrl: post.featuredImageUrl,
      isPublished: post.isPublished,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugify(title) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Blog Posts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your blog content
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FF8A00]/90"
          data-ocid="blog.add_button"
        >
          <Plus className="h-4 w-4" /> Add Post
        </button>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div
          className="flex justify-center py-12"
          data-ocid="blog.loading_state"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF8A00] border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div
          className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center"
          data-ocid="blog.empty_state"
        >
          <p className="text-muted-foreground">
            No blog posts yet. Add your first post.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={String(post.id)}
                  className="border-b border-border/50 hover:bg-muted/30"
                  data-ocid={`blog.item.${i + 1}`}
                >
                  <td className="max-w-[240px] truncate px-4 py-3 font-medium text-foreground">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.category || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        post.isPublished
                          ? "bg-green-500/15 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => toggleMutation.mutate(post.id)}
                        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                          post.isPublished
                            ? "bg-muted text-muted-foreground hover:bg-muted/80"
                            : "bg-green-500/15 text-green-600 hover:bg-green-500/25"
                        }`}
                        data-ocid={`blog.toggle.${i + 1}`}
                      >
                        {post.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(post)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        data-ocid={`blog.edit_button.${i + 1}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(post.id)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                        data-ocid={`blog.delete_button.${i + 1}`}
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
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          data-ocid="blog.dialog"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1F3A] p-6 shadow-2xl">
            <h2 className="mb-5 font-display text-lg font-bold text-white">
              {editing ? "Edit Post" : "Add New Post"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(form);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="blog-title"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Title
                </label>
                <input
                  id="blog-title"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                  placeholder="Post title"
                  data-ocid="blog.input"
                />
              </div>
              <div>
                <label
                  htmlFor="blog-slug"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Slug
                </label>
                <input
                  id="blog-slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                  placeholder="auto-generated-from-title"
                  data-ocid="blog.slug_input"
                />
              </div>
              <div>
                <label
                  htmlFor="blog-category"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Category
                </label>
                <input
                  id="blog-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                  placeholder="e.g. Study Abroad, Visa Updates"
                />
              </div>
              <div>
                <label
                  htmlFor="blog-content"
                  className="mb-1 block text-sm font-medium text-white/80"
                >
                  Content
                </label>
                <textarea
                  id="blog-content"
                  required
                  rows={6}
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FF8A00]/50 focus:outline-none"
                  placeholder="Write your blog post content…"
                  data-ocid="blog.textarea"
                />
              </div>
              <ImageUpload
                label="Featured Image"
                value={form.featuredImageUrl}
                onChange={(url) =>
                  setForm((f) => ({ ...f, featuredImageUrl: url }))
                }
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isPublished: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-white/20 accent-[#FF8A00]"
                  data-ocid="blog.checkbox"
                />
                <span className="text-sm font-medium text-white/80">
                  Publish immediately
                </span>
              </label>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                  data-ocid="blog.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-2 rounded-lg bg-[#FF8A00] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  data-ocid="blog.submit_button"
                >
                  {saveMutation.isPending && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {editing ? "Save Changes" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          data-ocid="blog.dialog"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0B1F3A] p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white">
              Delete Post?
            </h3>
            <p className="mt-2 text-sm text-white/60">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
                data-ocid="blog.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                data-ocid="blog.confirm_button"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
