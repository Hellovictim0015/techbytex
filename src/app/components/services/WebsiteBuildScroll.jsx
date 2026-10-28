"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useScroll, useTransform, useReducedMotion } from "framer-motion";

const BRAND = "#7C3AED";

// Code that pours out of the browser while the site is being built. x and y
// are offsets from the browser's centre as % of the column width (cqw), so
// the chips land just outside the window on every screen size.
const CODE = [
  { text: "<header>", x: -36, y: -34, r: -8 },
  { text: "<meta name=\"description\">", x: -6, y: -40, r: 3 },
  { text: "<nav class=\"menu\">", x: 26, y: -35, r: 6 },
  { text: "display: grid;", x: 42, y: -24, r: -6 },
  { text: "<h1>TechByteX</h1>", x: -46, y: -6, r: 5 },
  { text: "next build ✓", x: 46, y: 6, r: 10 },
  { text: "<section class=\"hero\">", x: -38, y: 30, r: 8 },
  { text: "@media (max-width: 768px)", x: -4, y: 38, r: -4 },
  { text: "export default Page", x: 30, y: 33, r: -10 },
  { text: "<footer>", x: -46, y: 20, r: -12 },
];

const STEPS = [
  { title: "Plan the layout", text: "Pages, sections and content mapped around what your customers search for." },
  { title: "Write the code", text: "HTML, CSS and React / Next.js — hand-written, fast and SEO-ready." },
  { title: "Launch the website", text: "Tested on every screen size, then live on your domain." },
];

function CodeChip({ chip, progress }) {
  const x = useTransform(progress, [0, 1], ["0cqw", `${chip.x}cqw`]);
  const y = useTransform(progress, [0, 1], ["0cqw", `${chip.y}cqw`]);
  const rotate = useTransform(progress, [0, 1], [0, chip.r]);
  const scale = useTransform(progress, [0, 0.4, 1], [0.2, 1.06, 1]);
  const opacity = useTransform(progress, [0, 0.15, 1], [0, 1, 1]);
  return (
    <motion.span
      style={{ x, y, rotate, scale, opacity }}
      className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-[#7C3AED]/30 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold text-[#6D28D9] shadow-md shadow-[#7C3AED]/10 sm:text-xs"
    >
      {chip.text}
    </motion.span>
  );
}

// A block of the demo website that appears once scroll passes `at`.
function Build({ progress, at, className, children }) {
  const opacity = useTransform(progress, [at, at + 0.06], [0, 1]);
  const y = useTransform(progress, [at, at + 0.06], [14, 0]);
  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

function Step({ step, index, progress }) {
  const start = index / STEPS.length;
  const end = (index + 1) / STEPS.length;
  const opacity = useTransform(progress, [start - 0.05, start + 0.05, end - 0.05, end + 0.05], [0.35, 1, 1, 0.35]);
  return (
    <motion.li style={{ opacity }} className="flex gap-4">
      <span className="mt-0.5 font-serif text-2xl italic text-[#7C3AED]">0{index + 1}</span>
      <div>
        <p className="font-serif text-lg font-semibold text-slate-900">{step.title}</p>
        <p className="text-sm text-slate-500">{step.text}</p>
      </div>
    </motion.li>
  );
}

// Line-art developer at a desk, typing away. Hands bob continuously; the
// laptop screen fills with code lines as the page scrolls.
function Developer({ progress, still }) {
  const lines = [0.15, 0.3, 0.45, 0.6, 0.75];
  const typing = still ? {} : { animate: { y: [0, -3, 0, -2, 0] }, transition: { duration: 0.45, repeat: Infinity } };
  const typingAlt = still ? {} : { animate: { y: [0, -2, 0, -3, 0] }, transition: { duration: 0.4, repeat: Infinity, delay: 0.1 } };
  return (
    <svg viewBox="0 0 260 170" className="h-full w-full" aria-hidden="true">
      {/* desk */}
      <line x1="20" y1="120" x2="250" y2="120" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="120" x2="60" y2="165" stroke="#334155" strokeWidth="3" />
      <line x1="225" y1="120" x2="225" y2="165" stroke="#334155" strokeWidth="3" />
      {/* plant + mug */}
      <rect x="226" y="98" width="14" height="22" rx="3" fill="none" stroke="#334155" strokeWidth="2.5" />
      <path d="M233 98 C226 84 230 76 233 70 C236 78 242 84 233 98" fill={BRAND} opacity="0.25" stroke={BRAND} strokeWidth="2" />
      <rect x="28" y="106" width="13" height="14" rx="2" fill="none" stroke="#334155" strokeWidth="2.5" />
      <path d="M41 110 q6 3 0 7" fill="none" stroke="#334155" strokeWidth="2" />
      {!still && (
        <motion.path
          d="M33 102 q-3 -5 0 -10"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="1.5"
          animate={{ opacity: [0, 0.8, 0], y: [2, -4, -8] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      )}
      {/* laptop */}
      <path d="M150 120 L165 72 L222 72 L208 120 Z" fill="#F5F3FF" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
      {lines.map((at, i) => (
        <LaptopLine key={i} progress={progress} at={at} i={i} />
      ))}
      <line x1="120" y1="120" x2="212" y2="120" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
      {/* chair */}
      <path d="M48 70 L52 128 L98 128" fill="none" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      <line x1="76" y1="128" x2="76" y2="160" stroke="#94A3B8" strokeWidth="4" />
      <line x1="60" y1="162" x2="92" y2="162" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
      {/* person */}
      <path d="M74 66 C64 82 64 104 70 122 L104 122" fill="none" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
      <path d="M100 122 L112 122 L114 158" fill="none" stroke="#334155" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M110 160 L124 160" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 68 C66 82 66 100 72 116" fill="none" stroke={BRAND} strokeWidth="18" strokeLinecap="round" />
      <circle cx="82" cy="46" r="15" fill="#FDE2C4" stroke="#334155" strokeWidth="2.5" />
      <path d="M68 44 C68 28 92 26 97 40 C90 36 80 36 72 48 Z" fill="#1E293B" />
      <circle cx="90" cy="47" r="1.8" fill="#0F172A" />
      <path d="M88 54 q4 2 7 -1" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
      {/* arms typing */}
      <motion.g {...typing}>
        <path d="M76 82 L104 100 L140 112" fill="none" stroke={BRAND} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="142" cy="112" r="5" fill="#FDE2C4" stroke="#334155" strokeWidth="2" />
      </motion.g>
      <motion.g {...typingAlt}>
        <path d="M80 86 L110 104 L152 114" fill="none" stroke="#6D28D9" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="154" cy="114" r="5" fill="#FDE2C4" stroke="#334155" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

function LaptopLine({ progress, at, i }) {
  const scaleX = useTransform(progress, [at - 0.08, at], [0, 1]);
  const widths = [34, 24, 40, 28, 20];
  return (
    <motion.rect
      x={172 - i * 3}
      y={80 + i * 7}
      width={widths[i]}
      height="3"
      rx="1.5"
      fill={i % 2 ? "#A78BFA" : BRAND}
      style={{ scaleX, transformOrigin: `${172 - i * 3}px 0px`, transformBox: "view-box" }}
    />
  );
}

// Scroll-driven scene: a developer builds a website. Scrolling down builds
// the page section by section and pours its code out; scrolling up packs the
// code back in and un-builds the page.
export default function WebsiteBuildScroll() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const burst = useTransform(scrollYProgress, [0.12, 0.65], [0, 1], { clamp: true });
  const build = useTransform(scrollYProgress, [0.05, 0.75], [0, 1], { clamp: true });
  const done = useMotionValue(1);
  const codeProgress = reduce ? done : burst;
  const buildProgress = reduce ? done : build;
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className={reduce ? "relative" : "relative h-[280vh]"} aria-label="How we build websites">
      <div className={`${reduce ? "" : "sticky top-0 h-screen"} overflow-hidden bg-[#FBFAFF]`}>
        {/* classic paper grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(#7C3AED14 1px, transparent 1px), linear-gradient(90deg, #7C3AED14 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto grid h-full max-w-7xl content-center items-center gap-4 px-6 pt-20 pb-6 lg:grid-cols-[1fr_1.35fr] lg:gap-12 lg:pt-24 lg:pb-10">
          <div className="relative z-30 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Website Development</span>
            <h2 className="mt-3 font-serif text-2xl leading-tight text-slate-900 md:text-5xl">
              Watch a website come to life, <em className="text-[#7C3AED]">line by line</em>
            </h2>
            <ol className="mt-6 hidden space-y-4 md:block">
              {STEPS.map((s, i) => (
                <Step key={s.title} step={s} index={i} progress={scrollYProgress} />
              ))}
            </ol>
            <div className="mt-5 h-px w-full bg-slate-200">
              <motion.div style={{ width: barWidth }} className="h-px bg-[#7C3AED]" />
            </div>
            <div className="mt-2 h-[18vh] w-full max-w-sm md:h-[22vh]">
              <Developer progress={buildProgress} still={reduce} />
            </div>
          </div>

          <div className="relative flex h-[44vh] items-center justify-center lg:h-full" style={{ containerType: "inline-size" }}>
            {CODE.map((chip) => (
              <CodeChip key={chip.text} chip={chip} progress={codeProgress} />
            ))}

            {/* browser window */}
            <div className="relative z-10 w-[78%] max-w-[520px] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl shadow-[#7C3AED]/15">
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                <span className="ml-3 flex-1 truncate rounded bg-white px-2 py-0.5 text-[10px] text-slate-500 ring-1 ring-slate-200">
                  https://www.techbytex.in
                </span>
              </div>
              <div className="relative p-3 sm:p-4">
                {/* empty canvas hint before anything is built */}
                <div className="absolute inset-3 rounded-lg border border-dashed border-slate-200 sm:inset-4" />
                {/* A miniature of the real techbytex.in home page, built piece by piece */}
                <Build progress={buildProgress} at={0.02} className="relative flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Image src="/hello.png" alt="" width={16} height={16} className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-[8px] font-bold leading-none text-slate-900 sm:text-[11px]">TechByteX</span>
                  </span>
                  <span className="hidden gap-2 text-[7px] text-slate-500 sm:flex">
                    {["Home", "Services", "Portfolio", "About", "Contact Us", "Blog"].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </span>
                  <span className="rounded bg-[#7C3AED] px-1.5 py-0.5 text-[6px] font-semibold text-white sm:text-[8px]">
                    Let&apos;s Connect
                  </span>
                </Build>
                <div className="relative mt-2 grid grid-cols-[1.25fr_1fr] gap-2 sm:mt-3 sm:gap-3">
                  <div>
                    <Build progress={buildProgress} at={0.12}>
                      <span className="inline-block rounded-full bg-[#7C3AED]/10 px-1.5 py-0.5 text-[5px] font-bold uppercase tracking-wider text-[#7C3AED] sm:text-[7px]">
                        Trusted by 500+ enterprises
                      </span>
                      <p className="mt-1 text-[9px] font-bold leading-[1.15] text-slate-900 sm:text-[15px]">
                        App, Website &amp; Custom Software Development by TechByte<span className="text-[#7C3AED]">X</span>
                      </p>
                      <p className="mt-1 hidden text-[7px] leading-snug text-slate-500 sm:block">
                        SEO-ready websites, Next.js platforms, React Native apps and custom software that scale.
                      </p>
                    </Build>
                    <Build progress={buildProgress} at={0.22} className="mt-1.5 flex gap-1 sm:mt-2">
                      <span className="rounded bg-[#7C3AED] px-1.5 py-0.5 text-[6px] font-bold text-white sm:text-[8px]">Portfolio View →</span>
                      <span className="rounded border border-slate-200 px-1.5 py-0.5 text-[6px] font-semibold text-slate-600 sm:text-[8px]">View Solutions</span>
                    </Build>
                  </div>
                  <Build progress={buildProgress} at={0.3} className="rounded-md bg-slate-900 p-1.5 font-mono text-[5px] leading-relaxed text-slate-300 sm:p-2 sm:text-[7px]">
                    <p className="mb-1 font-sans font-semibold text-white">Cloud Architecture</p>
                    <p className="text-slate-500">{"// Scalable Microservices"}</p>
                    <p>
                      <span className="text-[#A78BFA]">const</span> infrastructure = {"{"}
                    </p>
                    <p className="pl-2">region: <span className="text-emerald-300">&apos;us-east-1&apos;</span>,</p>
                    <p className="pl-2">scaling: <span className="text-emerald-300">&apos;auto&apos;</span>,</p>
                    <p>{"};"}</p>
                  </Build>
                </div>
                <div className="relative mt-2 grid grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
                  {[
                    { at: 0.42, title: "Website Development" },
                    { at: 0.5, title: "App Development" },
                    { at: 0.58, title: "Custom Software" },
                  ].map((c) => (
                    <Build key={c.title} progress={buildProgress} at={c.at} className="rounded-md border border-slate-200 p-1.5 sm:p-2">
                      <span className="block h-2.5 w-2.5 rounded bg-[#7C3AED] sm:h-3.5 sm:w-3.5" />
                      <span className="mt-1 block text-[6px] font-semibold leading-tight text-slate-800 sm:text-[8px]">{c.title}</span>
                      <span className="mt-1 block h-1 w-full rounded-full bg-slate-100" />
                    </Build>
                  ))}
                </div>
                <Build progress={buildProgress} at={0.68} className="relative mt-2 flex items-center justify-between rounded-md bg-slate-900 px-2 py-1 sm:mt-3 sm:px-3 sm:py-1.5">
                  <span className="text-[7px] font-bold text-white sm:text-[9px]">TechByteX</span>
                  <span className="text-[6px] text-slate-400 sm:text-[8px]">© 2026 TechByteX · www.techbytex.in</span>
                </Build>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
