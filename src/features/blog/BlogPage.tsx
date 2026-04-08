import { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { blogApi } from "../../api/blogApi";
import { useAuthStore } from "../../store/useAuthStore";
import type { PostCard } from "../../schemas/blog.schema";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AuthorName({ author }: { author: PostCard["author"] }) {
  if (!author?.profile) return <span>StridePilot Team</span>;
  return <span>{author.profile.firstName} {author.profile.lastName}</span>;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<PostCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string>("all");
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetcher = isAdmin ? blogApi.getAllAdmin : blogApi.getAll;
    fetcher()
      .then(setPosts)
      .catch(() => toast.error("Failed to load posts"))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const allTags = ["all", ...Array.from(new Set(posts.flatMap((p) => p.tags)))];
  const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tags.includes(activeTag));

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10">

        {/* Header */}
        <section className="mb-8">
          <p className="text-[10px] font-bold tracking-widest uppercase text-lime-400 mb-2">
            Articles & Guides
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter">
              Blog
            </h2>
            {isAdmin && (
              <Link
                to="/blog/new"
                className="shrink-0 bg-lime-400 text-black px-6 py-2.5 rounded-full font-black text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(163,230,53,0.2)] active:scale-95"
              >
                + New Post
              </Link>
            )}
          </div>
          <div className="mt-4 h-px bg-zinc-800" />
        </section>

        {/* Tag filter */}
        {allTags.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest transition-all hover:cursor-pointer ${
                  activeTag === tag
                    ? "bg-lime-400 text-black"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Posts grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <p className="text-zinc-600 text-sm">
              {isAdmin ? "No posts yet. Create the first one!" : "No posts published yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} isAdmin={isAdmin} featured={i === 0} onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PostCard({
  post,
  isAdmin,
  featured,
  onDelete,
}: {
  post: PostCard;
  isAdmin: boolean;
  featured: boolean;
  onDelete: (id: number) => void;
}) {
  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await blogApi.delete(post.id);
    onDelete(post.id);
    toast.success("Post deleted");
  };

  return (
    <div className={`group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col hover:border-zinc-700 transition-colors ${featured ? "md:col-span-2 xl:col-span-1" : ""}`}>
      {/* Draft badge */}
      {isAdmin && post.published === false && (
        <span className="absolute top-3 left-3 z-10 bg-zinc-800 border border-zinc-700 text-zinc-400 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full">
          Draft
        </span>
      )}

      {/* Admin actions */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to={`/blog/edit/${post.id}`}
            className="bg-zinc-900/90 border border-zinc-700 text-zinc-300 hover:text-lime-400 hover:border-lime-400/30 text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg transition-all"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-zinc-900/90 border border-zinc-700 text-zinc-600 hover:text-red-400 hover:border-red-400/20 px-2 py-1.5 rounded-lg transition-all hover:cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Cover image */}
      <Link to={`/blog/${post.slug}`}>
        <div className="w-full aspect-[16/9] bg-zinc-800 overflow-hidden">
          {post.coverUrl ? (
            <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-zinc-700 text-xs font-bold uppercase tracking-widest">No cover</span>
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-black text-base leading-snug hover:text-lime-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            {post.author?.profile?.imageUrl ? (
              <img src={post.author.profile.imageUrl} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px]">👤</div>
            )}
            <span className="text-[10px] text-zinc-500 font-bold">
              <AuthorName author={post.author} />
            </span>
          </div>
          <span className="text-[10px] text-zinc-600">{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
