"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const MAX_ON_HOME = 7;

// Uploaded (/uploads) and public images go through next/image; a pasted
// external URL is shown as-is. Bundled fallback images are static imports.
const unoptimized = (src) => typeof src === "string" && !src.startsWith("/");

function Chips({ items, max, tone = "light" }) {
  const cls =
    tone === "dark"
      ? "border-white/20 bg-white/10 text-white"
      : "border-[#7C3AED]/20 bg-[#7C3AED]/5 text-[#6D28D9]";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, max).map((t) => (
        <span key={t} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

function ProjectLink({ project, className, children }) {
  return project.link ? (
    <a href={project.link} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href="/portfolio" className={className}>
      {children}
    </Link>
  );
}

function Featured({ project }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.35fr_1fr]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[420px]">
        <Image
          src={project.image}
          alt={project.altText || project.title}
          fill
          sizes="(min-width: 1024px) 750px, 100vw"
          unoptimized={unoptimized(project.image)}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#7C3AED] shadow backdrop-blur">
          Featured · {project.category}
        </span>
      </div>
      <div className="flex flex-col p-7 lg:p-10">
        <span className="font-serif text-3xl italic text-[#7C3AED]/30">01</span>
        <h3 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">{project.title}</h3>
        {project.subtitle && <p className="mt-1 font-medium text-[#7C3AED]">{project.subtitle}</p>}
        {project.description && <p className="mt-4 line-clamp-4 leading-relaxed text-slate-500">{project.description}</p>}
        {project.stats?.length > 0 && (
          <ul className="mt-5 space-y-1.5">
            {project.stats.slice(0, 3).map((s) => (
              <li key={s} className="text-sm font-medium text-slate-700">
                {s}
              </li>
            ))}
          </ul>
        )}
        {project.technologies?.length > 0 && (
          <div className="mt-5">
            <Chips items={project.technologies} max={6} />
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          {project.link && (
            <ProjectLink
              project={project}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6D28D9]"
            >
              View live <ArrowUpRight size={16} />
            </ProjectLink>
          )}
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
          >
            Case study <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function Card({ project, number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
    >
      <ProjectLink
        project={project}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-xl hover:shadow-[#7C3AED]/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Image
            src={project.image}
            alt={project.altText || project.title}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            unoptimized={unoptimized(project.image)}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-[#7C3AED] backdrop-blur">
            {project.category}
          </span>
          <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-[#7C3AED] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[#7C3AED]">{project.title}</h3>
              {project.subtitle && <p className="text-sm text-slate-500">{project.subtitle}</p>}
            </div>
            <span className="font-serif text-2xl italic text-[#7C3AED]/25">{number}</span>
          </div>
          {project.technologies?.length > 0 && (
            <div className="mt-4">
              <Chips items={project.technologies} max={3} />
            </div>
          )}
        </div>
      </ProjectLink>
    </motion.article>
  );
}

// Homepage showcase of the projects managed in Admin → Portfolio.
const PortfolioSection = ({ projects = [] }) => {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(() => ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const shown = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)).slice(0, MAX_ON_HOME),
    [projects, filter]
  );

  if (projects.length === 0) return null;
  const [featured, ...rest] = shown;

  return (
    <section className="relative overflow-hidden bg-white py-24 font-sans">
      <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#7C3AED]/5 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
              Our Work
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Projects we&apos;re <span className="font-serif font-normal italic text-[#7C3AED]">proud of</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Websites, apps and software we have designed, built and launched for real businesses.
            </p>
          </div>
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    filter === c
                      ? "bg-[#7C3AED] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {featured && <Featured key={`f-${featured.id ?? featured.title}`} project={featured} />}
        </AnimatePresence>

        {rest.length > 0 && (
          <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {rest.map((p, i) => (
                <Card key={p.id ?? p.title} project={p} number={String(i + 2).padStart(2, "0")} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#7C3AED]/25 transition-colors hover:bg-[#6D28D9]"
          >
            View full portfolio ({projects.length}) <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
