import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { blogApi } from "../../api/blogApi";
import type { PostDetail } from "../../schemas/blog.schema";

export default function BlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load existing post for edit mode
  useEffect(() => {
    if (!isEdit) return;
    // find by id — fetch all admin posts then pick by id
    blogApi.getAllAdmin().then((posts) => {
      const found = posts.find((p) => p.id === Number(id)) as
        | PostDetail
        | undefined;
      if (!found) {
        toast.error("Post not found");
        navigate("/blog");
        return;
      }
      blogApi.getBySlug(found.slug).then((post) => {
        setTitle(post.title);
        setExcerpt(post.excerpt ?? "");
        setContent(post.content);
        setTags(post.tags.join(", "));
        setPublished(post.published ?? false);
        if (post.coverUrl) setCoverPreview(post.coverUrl);
      });
    });
  }, [id, isEdit, navigate]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Wrap selected text (or placeholder) with before/after markers
  const wrapSelection = (
    before: string,
    after: string,
    placeholder: string,
  ) => {
    const ta = contentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.slice(start, end);
    const inner = selected || placeholder;
    setContent(
      content.slice(0, start) + before + inner + after + content.slice(end),
    );
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(
        start + before.length,
        start + before.length + inner.length,
      );
    }, 0);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("excerpt", excerpt);
      form.append("content", content);
      form.append("tags", tags);
      form.append("published", String(published));
      if (coverFile) form.append("cover", coverFile);

      if (isEdit) {
        await blogApi.update(Number(id), form);
        toast.success("Post updated!");
      } else {
        await blogApi.create(form);
        toast.success("Post created!");
      }
      navigate("/blog");
    } catch {
      toast.error("Failed to save post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-3xl mx-auto px-6 pt-10">
        {/* Header */}
        <section className="mb-8">
          <p className="text-[10px] font-bold tracking-widest uppercase text-violet-400 mb-2">
            {isEdit ? "Edit Post" : "New Post"}
          </p>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            {isEdit ? "Edit Article" : "Create Article"}
          </h2>
          <div className="mt-4 h-px bg-zinc-800" />
        </section>

        <div className="space-y-5">
          {/* Cover image */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">
              Cover Image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="relative w-full aspect-16/7 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl overflow-hidden flex items-center justify-center hover:border-zinc-500 transition-colors hover:cursor-pointer group"
            >
              {coverPreview ? (
                <>
                  <img
                    src={coverPreview}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-black uppercase tracking-widest text-white">
                      Change Cover
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-600 group-hover:text-zinc-400 transition-colors pointer-events-none">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 9.75h18M3 6h18"
                    />
                  </svg>
                  <span className="text-xs font-bold">
                    Click to upload cover image
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-lg font-black text-white placeholder:text-zinc-700 focus:outline-none focus:border-lime-400 transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
              Excerpt{" "}
              <span className="text-zinc-700 normal-case font-normal">
                (short description, shown on card)
              </span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="A short summary of the article..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-lime-400 transition-colors resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Content
              </label>
              {/* Toolbar */}
              <div className="flex items-center gap-1.5">
                {/* Format: B I U */}
                <div className="flex items-center gap-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-0.5">
                  {[
                    {
                      label: <strong>B</strong>,
                      before: "**",
                      after: "**",
                      ph: "bold text",
                      title: "Bold",
                    },
                    {
                      label: <em>I</em>,
                      before: "*",
                      after: "*",
                      ph: "italic text",
                      title: "Italic",
                    },
                    {
                      label: <span className="underline">U</span>,
                      before: "__",
                      after: "__",
                      ph: "underlined",
                      title: "Underline",
                    },
                  ].map(({ label, before, after, ph, title }) => (
                    <button
                      key={title}
                      type="button"
                      title={title}
                      onClick={() => wrapSelection(before, after, ph)}
                      className="px-2 py-1 rounded text-xs font-black text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all hover:cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Size: S M L */}
                <div className="flex items-center gap-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-0.5">
                  {[
                    {
                      label: "S",
                      before: "[sm]",
                      after: "[/sm]",
                      ph: "small text",
                      title: "Small",
                      cls: "text-[9px]",
                    },
                    {
                      label: "M",
                      before: "[lg]",
                      after: "[/lg]",
                      ph: "medium text",
                      title: "Medium",
                      cls: "text-xs",
                    },
                    {
                      label: "L",
                      before: "[xl]",
                      after: "[/xl]",
                      ph: "large text",
                      title: "Large",
                      cls: "text-sm",
                    },
                  ].map(({ label, before, after, ph, title, cls }) => (
                    <button
                      key={title}
                      type="button"
                      title={title}
                      onClick={() => wrapSelection(before, after, ph)}
                      className={`px-2 py-1 rounded font-black text-zinc-300 hover:text-white hover:bg-zinc-700 transition-all hover:cursor-pointer ${cls}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Color: green, white */}
                <div className="flex items-center gap-0.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-0.5">
                  {[
                    {
                      color: "bg-lime-400",
                      before: "[green]",
                      after: "[/green]",
                      ph: "green text",
                      title: "Green",
                    },
                    {
                      color: "bg-white",
                      before: "[white]",
                      after: "[/white]",
                      ph: "white text",
                      title: "White",
                    },
                  ].map(({ color, before, after, ph, title }) => (
                    <button
                      key={title}
                      type="button"
                      title={title}
                      onClick={() => wrapSelection(before, after, ph)}
                      className="px-2 py-1.5 rounded hover:bg-zinc-700 transition-all hover:cursor-pointer flex items-center justify-center"
                    >
                      <span className={`w-3 h-3 rounded-full ${color} block`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder={`Write your article here...\n\nTips:\n- New line = new paragraph\n- **Bold text** = bold\n- **Section heading** on its own line = heading`}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-lime-400 transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Tags + Published row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                Tags{" "}
                <span className="text-zinc-700 normal-case font-normal">
                  (comma separated)
                </span>
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="running, training, tips"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-lime-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 block">
                Status
              </label>
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-11 h-6 rounded-full transition-colors hover:cursor-pointer ${published ? "bg-lime-400" : "bg-zinc-700"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${published ? "left-6" : "left-1"}`}
                  />
                </button>
                <span
                  className={`text-sm font-bold ${published ? "text-lime-400" : "text-zinc-500"}`}
                >
                  {published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate("/blog")}
              className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all active:scale-95 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-lime-400 text-black hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer shadow-[0_0_20px_rgba(163,230,53,0.15)]"
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Publish Post"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
