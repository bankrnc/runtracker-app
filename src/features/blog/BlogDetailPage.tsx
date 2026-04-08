import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { toast } from "sonner";
import { blogApi } from "../../api/blogApi";
import type { PostDetail } from "../../schemas/blog.schema";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Render content: lines starting with **text** = bold heading, otherwise paragraph
function renderContent(content: string) {
  return content.split("\n").filter((l) => l.trim() !== "").map((line, i) => {
    // Bold heading: **Some text**
    if (/^\*\*(.+)\*\*$/.test(line.trim())) {
      return (
        <h3 key={i} className="text-lg font-black text-white mt-6 mb-2">
          {line.trim().replace(/^\*\*|\*\*$/g, "")}
        </h3>
      );
    }
    // Inline bold: mix of **bold** and normal text
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-zinc-400 leading-relaxed text-sm">
        {parts.map((part, j) =>
          /^\*\*[^*]+\*\*$/.test(part) ? (
            <strong key={j} className="text-zinc-200 font-bold">
              {part.replace(/^\*\*|\*\*$/g, "")}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogApi
      .getBySlug(slug)
      .then(setPost)
      .catch(() => toast.error("Post not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500">Post not found.</p>
        <Link to="/blog" className="text-lime-400 text-sm font-bold hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans pb-20">
      {/* Cover */}
      {post.coverUrl && (
        <div className="w-full max-h-80 overflow-hidden">
          <img src={post.coverUrl} alt={post.title} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 pointer-events-none" />
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 pt-10">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-black uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Blog
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter leading-tight mb-4">
          {post.title}
        </h1>

        {/* Author + date */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800">
          {post.author?.profile?.imageUrl ? (
            <img src={post.author.profile.imageUrl} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm">👤</div>
          )}
          <div>
            <p className="text-sm font-bold text-zinc-200">
              {post.author?.profile
                ? `${post.author.profile.firstName} ${post.author.profile.lastName}`
                : "StridePilot Team"}
            </p>
            <p className="text-[10px] text-zinc-600">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-zinc-400 text-base leading-relaxed mb-6 italic border-l-2 border-lime-400/50 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="space-y-4">
          {renderContent(post.content)}
        </div>
      </main>
    </div>
  );
}
