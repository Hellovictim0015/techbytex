"use client";
import { useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform, useReducedMotion } from "framer-motion";

// Code chips that fly out of the phone. x is the final offset from the phone's
// centre as % of the phone column's width (cqw), y in vh, r the final rotation.
const CHIPS = [
  { text: "<App />", x: -34, y: -26, r: -10, tone: "violet" },
  { text: "useState()", x: 30, y: -30, r: 8, tone: "pink" },
  { text: "flutter run", x: -40, y: 4, r: 6, tone: "sky" },
  { text: "await fetch('/api')", x: 36, y: 2, r: -6, tone: "amber" },
  { text: "npx expo start", x: -30, y: 28, r: 10, tone: "emerald" },
  { text: "git push origin main", x: 28, y: 30, r: -12, tone: "violet" },
  { text: "export default App;", x: -18, y: -38, r: 4, tone: "sky" },
  { text: "SELECT * FROM leads", x: 16, y: -40, r: -4, tone: "emerald" },
  { text: "<View style={s.card}>", x: -44, y: -12, r: -14, tone: "pink" },
  { text: "npm run build ✓", x: 44, y: -14, r: 12, tone: "emerald" },
  { text: "const api = createApi()", x: -16, y: 40, r: -6, tone: "amber" },
  { text: "{ ...props }", x: 18, y: 40, r: 6, tone: "violet" },
];

const TONES = {
  violet: "bg-violet-600 text-white shadow-violet-500/40",
  pink: "bg-pink-500 text-white shadow-pink-500/40",
  sky: "bg-sky-500 text-white shadow-sky-500/40",
  amber: "bg-amber-400 text-slate-900 shadow-amber-400/40",
  emerald: "bg-emerald-500 text-white shadow-emerald-500/40",
};

const STEPS = [
  { title: "Your idea, as an app", text: "Clean, fast screens your customers enjoy using." },
  { title: "Real code underneath", text: "React Native, Flutter, Next.js and Node.js — written to last." },
  { title: "Packed & shipped", text: "Tested, built and launched on Play Store, App Store and the web." },
];

function Chip({ chip, progress }) {
  const x = useTransform(progress, [0, 1], ["0cqw", `${chip.x * 0.8}cqw`]);
  const y = useTransform(progress, [0, 1], ["0vh", `${chip.y * 0.8}vh`]);
  const rotate = useTransform(progress, [0, 1], [0, chip.r]);
  const scale = useTransform(progress, [0, 0.4, 1], [0.2, 1.08, 1]);
  const opacity = useTransform(progress, [0, 0.15, 1], [0, 1, 1]);
  return (
    <motion.span
      style={{ x, y, rotate, scale, opacity }}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[11px] sm:text-sm font-semibold shadow-lg ${TONES[chip.tone]}`}
    >
      {chip.text}
    </motion.span>
  );
}

function Step({ step, index, progress }) {
  const start = index / STEPS.length;
  const end = (index + 1) / STEPS.length;
  const opacity = useTransform(progress, [start - 0.05, start + 0.05, end - 0.05, end + 0.05], [0.3, 1, 1, 0.3]);
  const x = useTransform(progress, [start - 0.05, start + 0.05], [-8, 0]);
  return (
    <motion.li style={{ opacity, x }} className="flex gap-4">
      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-sm font-bold text-white">
        {index + 1}
      </span>
      <div>
        <p className="text-lg font-bold text-slate-900">{step.title}</p>
        <p className="text-slate-500">{step.text}</p>
      </div>
    </motion.li>
  );
}

// A phone whose code bursts out as you scroll down and packs back in as you
// scroll up. Everything is driven by scroll position, so it is fully reversible.
export default function AppCodeExplode() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // 0 → 0.15 phone settles in, 0.15 → 0.6 code bursts out, then holds open.
  const burst = useTransform(scrollYProgress, [0.12, 0.6], [0, 1], { clamp: true });
  const phoneScale = useTransform(scrollYProgress, [0, 0.15, 0.6, 1], [0.9, 1, 0.92, 0.92]);
  const phoneTilt = useTransform(burst, [0, 1], [0, -8]);
  const screenGlow = useTransform(burst, [0, 1], [0, 1]);
  // Screen layers lift apart like an exploded view of the UI.
  const layerHeader = useTransform(burst, [0, 1], [0, -26]);
  const layerCard = useTransform(burst, [0, 1], [0, -8]);
  const layerList = useTransform(burst, [0, 1], [0, 10]);
  const layerButton = useTransform(burst, [0, 1], [0, 28]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Reduced motion: show the opened state without any scroll-linked movement.
  const opened = useMotionValue(1);
  const progress = reduce ? opened : burst;

  return (
    <section ref={ref} className={reduce ? "relative" : "relative h-[260vh]"} aria-label="How we build apps">
      <div className={`${reduce ? "" : "sticky top-0 h-screen"} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/60 to-white" />
        <div className="relative mx-auto grid h-full max-w-7xl content-center items-center gap-4 px-6 pt-20 pb-6 lg:grid-cols-[1fr_1.4fr] lg:gap-10 lg:pt-24 lg:pb-10">
          <div className="relative z-20 max-w-md">
            <span className="inline-block rounded-full bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
              Scroll to see inside
            </span>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:mt-5">
              Every app is <span className="text-[#7C3AED]">thousands of lines</span> of careful code
            </h2>
            <ol className="mt-8 hidden space-y-5 md:block">
              {STEPS.map((s, i) => (
                <Step key={s.title} step={s} index={i} progress={scrollYProgress} />
              ))}
            </ol>
            <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <motion.div style={{ width: progressWidth }} className="h-full rounded-full bg-[#7C3AED]" />
            </div>
          </div>

          <div className="relative flex h-[58vh] items-center justify-center lg:h-full" style={{ containerType: "inline-size" }}>
            {CHIPS.map((chip) => (
              <Chip key={chip.text} chip={chip} progress={progress} />
            ))}

            <motion.div
              style={{ scale: phoneScale, rotateY: phoneTilt }}
              className="relative z-10 h-[420px] w-[210px] rounded-[2.4rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl shadow-violet-500/30 sm:h-[480px] sm:w-[240px]"
            >
              <div className="absolute left-1/2 top-2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-slate-900" />
              <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-violet-50 to-white">
                <motion.div
                  style={{ opacity: screenGlow }}
                  className="absolute inset-0 bg-[#7C3AED]/10"
                />
                <motion.div style={{ y: layerHeader }} className="relative mx-3 mt-9 flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow">
                  <span className="h-2.5 w-16 rounded-full bg-violet-600" />
                  <span className="h-6 w-6 rounded-full bg-[#7C3AED]/30" />
                </motion.div>
                <motion.div style={{ y: layerCard }} className="relative mx-3 mt-4 rounded-2xl bg-[#7C3AED] p-4 shadow-lg">
                  <span className="block h-2.5 w-20 rounded-full bg-white/80" />
                  <span className="mt-2 block h-2 w-28 rounded-full bg-white/50" />
                  <span className="mt-6 block h-7 w-24 rounded-lg bg-white/90" />
                </motion.div>
                <motion.div style={{ y: layerList }} className="relative mx-3 mt-4 space-y-2.5">
                  {["bg-sky-400", "bg-emerald-400", "bg-amber-400"].map((c) => (
                    <div key={c} className="flex items-center gap-3 rounded-xl bg-white p-2.5 shadow-sm">
                      <span className={`h-7 w-7 rounded-lg ${c}`} />
                      <span className="flex-1 space-y-1.5">
                        <span className="block h-2 w-3/4 rounded-full bg-slate-200" />
                        <span className="block h-2 w-1/2 rounded-full bg-slate-100" />
                      </span>
                    </div>
                  ))}
                </motion.div>
                <motion.div style={{ y: layerButton }} className="absolute inset-x-3 bottom-5 rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white">
                  Get Started
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
