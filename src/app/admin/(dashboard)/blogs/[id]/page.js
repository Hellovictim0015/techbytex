import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/app/lib/db";
import { stripHtml } from "@/app/lib/sanitize-html";
import BlogStatusButtons from "../BlogStatusButtons";

export const metadata = {
  title: "Review Blog | TechByteX Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBlogReviewPage({ params }) {
  const { id } = await params;
  const rows = await query("SELECT * FROM ai_blog_posts WHERE id = ?", [id]);
  const post = rows[0];
  if (!post) notFound();

  const words = stripHtml(post.content).split(" ").length;
  const faq = Array.isArray(post.faq) ? post.faq : [];
  const keywords = Array.isArray(post.keywords) ? post.keywords : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/blogs" className="text-xs text-slate-500 hover:text-slate-300">
            ← All blogs
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-white">{post.title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {post.status} · {post.category} · {words} words · created {post.created_at}
            {post.status === "published" && (
              <>
                {" · "}
                <a href={`/blogg/${post.slug}`} target="_blank" className="text-violet-300 hover:underline">
                  View live ↗
                </a>
              </>
            )}
          </p>
        </div>
        <BlogStatusButtons id={post.id} status={post.status} />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2 text-sm">
        <p className="text-xs uppercase tracking-wide text-slate-500">Google preview</p>
        <p className="text-xs text-emerald-400">www.techbytex.in › blogg › {post.slug}</p>
        <p className="text-lg text-sky-300">{post.meta_title}</p>
        <p className="text-slate-400">{post.meta_description}</p>
        <p className="pt-2 text-xs text-slate-500">
          Title {post.meta_title?.length || 0}/60 · Description {post.meta_description?.length || 0}/160 ·
          Keywords: {keywords.join(", ") || "—"}
        </p>
      </div>

      {post.featured_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featured_image_url}
          alt={post.featured_image_alt || post.title}
          className="w-full max-h-96 rounded-lg border border-slate-800 object-cover"
        />
      ) : (
        <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-sm text-slate-500">
          No featured image (the default site image will be used).
        </div>
      )}

      <div className="rounded-lg bg-white p-6 md:p-10">
        <p className="text-lg text-slate-600 mb-6">{post.excerpt}</p>
        <article
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {faq.length > 0 && (
          <div className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <div key={i}>
                  <p className="font-semibold text-slate-900">{f.q}</p>
                  <p className="text-slate-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
