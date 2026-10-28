"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Globe,
  Layers,
  PlayCircle,
  Smartphone,
  Target,
  Lightbulb,
  TrendingUp,
  UserCheck,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1];
const unoptimized = (src) => typeof src === "string" && !src.startsWith("/");
const hasCaseStudy = (p) => p.caseStudy?.problem || p.caseStudy?.solution || p.caseStudy?.result;

// Image in a browser frame that tilts toward the cursor and drifts slightly
// with scroll (parallax). Hover shows the live / demo buttons.
function ProjectVisual({ project, reverse }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });

  function onMove(e) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  // The in-view trigger sits on an unclipped wrapper: a fully clipped element
  // never counts as visible, so it could never reveal itself.
  const reveal = {
    hidden: { clipPath: reverse ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", opacity: 0 },
    show: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration: 1, ease } },
  };

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative w-full"
    >
      <motion.div variants={reveal} className="relative w-full [perspective:1200px]">
        {/* soft brand backdrop card behind the frame */}
        <div
          className={`absolute -inset-3 top-6 rounded-3xl bg-[#7C3AED]/10 sm:-inset-5 sm:top-8 ${
            reverse ? "sm:-rotate-2" : "sm:rotate-2"
          }`}
        />
        <motion.div
          style={reduce ? undefined : { y: parallax, rotateX, rotateY }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-[#7C3AED]/15"
        >
          <div className="flex h-8 items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            {project.link && (
              <span className="ml-3 truncate rounded bg-white px-2 py-0.5 text-[10px] text-slate-400 ring-1 ring-slate-200">
                {project.link.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            )}
          </div>
          <div className="relative aspect-[16/10] bg-slate-50">
            <Image
              src={project.image}
              alt={project.altText || project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              unoptimized={unoptimized(project.image)}
              className="object-contain transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
          {(project.link || project.videoUrl) && (
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex translate-y-3 items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#6D28D9] group-hover:translate-y-0"
                >
                  View Live <ArrowUpRight size={16} />
                </a>
              )}
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex translate-y-3 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition-all delay-75 duration-300 group-hover:translate-y-0"
                >
                  Watch Demo <PlayCircle size={16} />
                </a>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Everything that used to make the text column too tall — shown on demand.
function Details({ project }) {
  const cs = project.caseStudy || {};
  const blocks = [
    { key: "problem", label: "Challenge", Icon: Target, text: cs.problem },
    { key: "solution", label: "Solution", Icon: Lightbulb, text: cs.solution },
    { key: "result", label: "Result", Icon: TrendingUp, text: cs.result },
  ].filter((b) => b.text);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease }}
      className="overflow-hidden"
    >
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h4 className="font-serif text-2xl italic text-slate-900">About the project</h4>
            {project.description && <p className="mt-3 leading-relaxed text-slate-600">{project.description}</p>}
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              {project.role && (
                <div className="flex items-center gap-2 text-slate-700">
                  <Briefcase size={16} className="text-[#7C3AED]" /> <dt className="sr-only">Role</dt>
                  <dd>{project.role}</dd>
                </div>
              )}
              {project.clientType && (
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck size={16} className="text-[#7C3AED]" /> <dt className="sr-only">Client</dt>
                  <dd>{project.clientType}</dd>
                </div>
              )}
            </dl>
            {project.features?.length > 0 && (
              <>
                <h5 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                  <Cpu size={16} className="text-[#7C3AED]" /> Key features
                </h5>
                <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#7C3AED]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="space-y-4">
            {blocks.map(({ key, label, Icon, text }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                className={`rounded-2xl border p-5 ${
                  key === "result" ? "border-[#7C3AED]/30 bg-[#7C3AED]/5" : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
                  <Icon size={14} /> {label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{text}</p>
              </motion.div>
            ))}
            {project.technologies?.length > 0 && (
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
                  <Layers size={14} /> Full tech stack
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span key={t} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectRow({ project, index }) {
  const [open, setOpen] = useState(false);
  const reverse = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const hasMore = Boolean(project.features?.length || hasCaseStudy(project) || project.role || project.clientType);
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

  return (
    <motion.article layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
      <div className={`grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <ProjectVisual project={project} reverse={reverse} />

        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="font-serif text-5xl italic leading-none text-[#7C3AED]/25">{number}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold text-[#7C3AED]">
              {project.category === "App" ? <Smartphone size={13} /> : <Globe size={13} />}
              {project.category}
            </span>
          </motion.div>
          <motion.h3 variants={item} className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {project.title}
          </motion.h3>
          {project.subtitle && (
            <motion.p variants={item} className="mt-1 text-lg font-medium text-[#7C3AED]">
              {project.subtitle}
            </motion.p>
          )}
          {project.description && (
            <motion.p variants={item} className="mt-4 line-clamp-3 leading-relaxed text-slate-600">
              {project.description}
            </motion.p>
          )}
          {project.stats?.length > 0 && (
            <motion.div variants={item} className="mt-5 flex flex-wrap gap-2">
              {project.stats.slice(0, 3).map((s) => (
                <span key={s} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  {s}
                </span>
              ))}
            </motion.div>
          )}
          {project.technologies?.length > 0 && (
            <motion.p variants={item} className="mt-5 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Built with </span>
              {project.technologies.slice(0, 4).join(" · ")}
              {project.technologies.length > 4 && ` +${project.technologies.length - 4}`}
            </motion.p>
          )}
          <motion.div variants={item} className="mt-7 flex flex-wrap gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#7C3AED]/25 transition-colors hover:bg-[#6D28D9]"
              >
                Visit {project.category} <ArrowUpRight size={16} />
              </a>
            )}
            {hasMore && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
              >
                {open ? "Show less" : "View more"}
                <ChevronDown size={16} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>{open && <Details project={project} />}</AnimatePresence>
    </motion.article>
  );
}

// Projects come from Admin → Portfolio (portfolio_projects table), passed in
// by app/portfolio/page.js. Empty fields (no link, case study, etc.) are hidden.
function OurProjects({ projects = [] }) {
  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  const words = ["Work", "that", "speaks"];

  return (
    <section className="relative overflow-hidden bg-[#FBFAFF] pb-24 pt-32 font-sans lg:pt-36">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[700px] opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(#7C3AED12 1px, transparent 1px), linear-gradient(90deg, #7C3AED12 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7C3AED]"
          >
            Built by TechByteX
          </motion.span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            {words.map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease }}
                className="mr-3 inline-block"
              >
                {w}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.6, ease }}
              className="inline-block font-serif font-normal italic text-[#7C3AED]"
            >
              for itself
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-lg leading-relaxed text-slate-500"
          >
            Websites, apps and software TechByteX has designed, built and launched for real businesses — from
            startups to government portals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-8 flex justify-center gap-10"
          >
            <div>
              <p className="font-serif text-4xl italic text-[#7C3AED]">{projects.length}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Projects shown</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div>
              <p className="font-serif text-4xl italic text-[#7C3AED]">{categories.length - 1}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Categories</p>
            </div>
          </motion.div>
        </div>

        {/* Filters with a sliding active pill */}
        <div className="mb-20 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeFilter === cat ? "text-white" : "border border-slate-200 bg-white text-slate-600 hover:text-[#7C3AED]"
              }`}
            >
              {activeFilter === cat && (
                <motion.span layoutId="portfolio-filter" className="absolute inset-0 rounded-full bg-[#7C3AED] shadow-lg shadow-[#7C3AED]/30" />
              )}
              <span className="relative">{cat}</span>
            </button>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-28 lg:space-y-36">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectRow key={project.id ?? project.title} project={project} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative mt-32 overflow-hidden rounded-[2.5rem] bg-[#7C3AED] p-10 text-center shadow-2xl md:p-16"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#6D28D9] blur-2xl" />
          <h2 className="relative text-3xl font-bold text-white md:text-4xl">Your project could be next.</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Tell us what you want to build — website, app or software — and get a clear, fixed quote.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-[#7C3AED] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Get a Free Quote <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/918827219873?text=${encodeURIComponent("Hi TechByteX, I want to discuss a project!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/60 px-8 py-4 font-bold text-white transition-colors hover:bg-white/10"
            >
              Discuss on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default OurProjects;
