"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";

// The server page resolves the post (static or published AI post) and its
// related posts, so this component only renders.
const BlogDetailsPage = ({ post, relatedPosts = [] }) => {
  // Fallback if post is not found
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Article not found</h2>
        <Link href="/blog" className="px-6 py-3 bg-[#7C3AED] text-white rounded-full font-bold">
          Go back to Blog
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white font-sans min-h-screen pb-24">
      
      {/* --- Hero & Header --- */}
      <section className="relative pt-32 pb-20 px-6 bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#7C3AED] font-medium mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
          <div className="flex items-center justify-center gap-4 text-sm mb-6">
            <span className="px-3 py-1 bg-[#7C3AED]/10 text-[#7C3AED] font-bold uppercase tracking-wider rounded-full">{post.category}</span>
            <span className="text-slate-400 flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-3">
              <Image src={post.author.image} alt={post.author.name} width={40} height={40} className="rounded-full border-2 border-white shadow-sm" />
              <span>{post.author.name}</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
          </div>
        </div>
      </section>

      {/* --- Main Image --- */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        </motion.div>
      </section>

      {/* --- Content & Sidebar --- */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="grid lg:grid-cols-[1fr_320px] gap-16">
          
          <article className="prose prose-lg prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {post.faq?.length > 0 && (
              <section className="not-prose mt-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {post.faq.map((item, i) => (
                    <details key={i} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <summary className="cursor-pointer list-none font-semibold text-slate-900 group-open:text-[#7C3AED]">
                        {item.q}
                      </summary>
                      <p className="mt-3 text-slate-600 leading-relaxed">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Share Buttons */}
            <div className="border-t border-b border-slate-100 py-6 my-12">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Share this article</h3>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin, LinkIcon].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-[#7C3AED] hover:text-white transition-all">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-12">
            
            {/* Author Widget */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <Image src={post.author.image} alt={post.author.name} width={64} height={64} className="rounded-full border-2 border-white shadow-md" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{post.author.name}</h3>
                  <p className="text-[#7C3AED] text-sm font-medium">{post.author.role}</p>
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{post.author.bio}</p>
            </div>

            {/* Dynamic Related Posts Widget */}
            {relatedPosts.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">Related Articles</h3>
                <div className="space-y-6">
                  {relatedPosts.map((related, index) => (
                    <Link href={`/blogg/${related.slug}`} key={index} className="group flex gap-4 items-start">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        <Image src={related.image} alt={related.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div>
                        <span className="text-[#7C3AED] text-xs font-bold uppercase tracking-wider block mb-1">{related.category}</span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <span className="text-slate-400 text-xs mt-2 block">{related.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </section>
    </motion.div>
  );
};

export default BlogDetailsPage;
