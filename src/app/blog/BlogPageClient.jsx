"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";

// Posts come from the server page: static blogData.js + published AI posts.
const BlogPage = ({ posts: blogPosts, categories }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const showFeatured = activeCategory === "All" && searchQuery === "" && featuredPost;
  const gridPosts = filteredPosts.filter(post => !showFeatured || post.id !== featuredPost?.id);

  return (
    <div className="bg-slate-50 font-sans min-h-screen pb-24">
      
      {/* --- Header & Hero Section --- */}
      <section className="bg-white border-b border-slate-100 pt-20 pb-16 px-6 mt-10 lg:mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-4">
              TechByteX Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-5">
              App, website, AI and ecommerce development insights
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Practical guides for founders and businesses planning React Native apps, Next.js websites, Shopify stores, AI tools, and custom software.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-10">
            <label className="relative block w-full lg:max-w-md">
              <span className="sr-only">Search blog articles</span>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search articles"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategory === category
                      ? "bg-[#7C3AED] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Featured Post */}
          {showFeatured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden group">
              <Link href={`/blogg/${featuredPost.slug}`} className="grid md:grid-cols-2 bg-slate-900">
                <div className="relative h-72 md:h-auto overflow-hidden">
                  <Image src={featuredPost.image} alt={featuredPost.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-[#7C3AED] text-white text-xs font-bold uppercase tracking-wider rounded-full">Featured</span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {featuredPost.date}</span>
                    {/* ✅ Updated author access */}
                    <span className="flex items-center gap-1"><User size={14} /> {featuredPost.author.name}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight group-hover:text-[#A78BFA] transition-colors">{featuredPost.title}</h2>
                  <p className="text-slate-300 mb-6 text-lg leading-relaxed">{featuredPost.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-[#7C3AED] font-bold group-hover:gap-3 transition-all">Read Article <ArrowRight size={18} /></span>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* --- Blog Grid --- */}
      <section className="max-w-7xl mx-auto px-6 pt-16">
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {gridPosts.map((post) => (
              <motion.div layout key={post.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
                <Link href={`/blogg/${post.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#7C3AED] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                        <Tag size={12} /> {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-medium mb-3">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                      <span>•</span>
                      {/* ✅ Updated author access */}
                      <span>{post.author.name}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-[#7C3AED] transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-[#7C3AED] group-hover:gap-2 transition-all">Read More <ArrowRight size={16} /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {gridPosts.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No articles found</h2>
            <p className="text-slate-500">Try another keyword or category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogPage;
