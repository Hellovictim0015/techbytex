"use client";
import { motion, useReducedMotion } from "framer-motion";
import { TechToy, TECH, RocketToy, StarBurst } from "./Toys";

// Background toys are drawn a bit larger than the card toys.
const S = 1.25;

const toy = (key, extra = {}) => ({ badge: TECH[key].label, shirt: TECH[key].shirt, text: TECH[key].text, ...extra });

// Twinkling "space" dots behind everything (fixed positions so SSR matches).
const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: 2 + (i % 3),
  delay: (i % 7) * 0.6,
}));

// Astronaut toys drifting through space. `dir` 1 = left→right.
const ASTRONAUTS = [
  { props: toy("python", { helmet: true, jetpack: true }), top: "8%", duration: 24, delay: 0, dir: 1, size: 54, spin: 20 },
  { props: toy("docker", { helmet: true, jetpack: true }), top: "30%", duration: 30, delay: 6, dir: -1, size: 50, spin: -25 },
  { props: toy("swift", { helmet: true }), top: "52%", duration: 27, delay: 3, dir: 1, size: 46, spin: 360 },
  { props: toy("node", { helmet: true, jetpack: true }), top: "70%", duration: 22, delay: 11, dir: -1, size: 52, spin: 15 },
  { props: toy("mysql", { helmet: true }), top: "90%", duration: 32, delay: 8, dir: 1, size: 44, spin: -360 },
];

function Astronaut({ props, top, duration, delay, dir, size, spin }) {
  const fullTurn = Math.abs(spin) === 360;
  return (
    <motion.div
      className="absolute left-0 will-change-transform"
      style={{ top }}
      initial={{ x: dir === 1 ? "-12vw" : "104vw" }}
      animate={{
        x: dir === 1 ? ["-12vw", "104vw"] : ["104vw", "-12vw"],
        y: [0, -30, 10, -20, 0],
        rotate: fullTurn ? [0, spin] : [-spin, spin, -spin],
      }}
      transition={{
        x: { duration, delay, repeat: Infinity, ease: "linear" },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: fullTurn ? 10 : 5, repeat: Infinity, ease: fullTurn ? "linear" : "easeInOut" },
      }}
    >
      <TechToy size={size * S} {...props} />
    </motion.div>
  );
}

// AWS riding next to a rocket across the page.
function RocketRide() {
  return (
    <motion.div
      className="absolute left-0 top-[42%] flex items-end will-change-transform"
      initial={{ x: "-25vw", y: 0 }}
      animate={{ x: ["-25vw", "110vw"], y: [40, -60] }}
      transition={{ duration: 16, repeat: Infinity, repeatDelay: 5, ease: "easeIn" }}
    >
      <div className="rotate-[60deg]">
        <RocketToy size={70} />
      </div>
      <motion.div animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 1.2, repeat: Infinity }}>
        <TechToy size={48 * S} {...toy("aws", { helmet: true })} />
      </motion.div>
    </motion.div>
  );
}

// A toy that keeps jumping in place.
function Jumper({ className, props, size, delay = 0 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ y: [0, -38, 0, 0], scaleY: [1, 1.05, 0.85, 1], rotate: [0, -10, 0, 0] }}
      transition={{ duration: 1.4, repeat: Infinity, delay, times: [0, 0.4, 0.8, 1], ease: "easeOut" }}
    >
      <TechToy size={size * S} {...props} />
    </motion.div>
  );
}

// Two rival toys charge, collide with a POW, and bounce back — forever.
function Fight({ className, left, right, size = 58, delay = 0 }) {
  const cycle = { duration: 2.6, repeat: Infinity, repeatDelay: 1.2, delay, ease: "easeInOut" };
  const hit = [0, 0.42, 0.5, 0.62, 1];
  return (
    <div className={`absolute ${className}`}>
      <div className="relative" style={{ width: size * S * 4, height: size * S * 1.25 + 30 }}>
        <motion.div
          className="absolute bottom-0 left-0"
          animate={{ x: [0, size * S * 1.25, size * S * 1.05, size * S * 1.3, 0], rotate: [0, 12, -18, 6, 0] }}
          transition={{ ...cycle, times: hit }}
        >
          <TechToy size={size * S} {...left} mood="angry" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0"
          animate={{ x: [0, -size * S * 1.25, -size * S * 0.95, -size * S * 1.3, 0], rotate: [0, -12, 22, -6, 0] }}
          transition={{ ...cycle, times: hit }}
        >
          <TechToy size={size * S} {...right} mood="angry" />
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          animate={{ scale: [0, 0, 1.25, 0.9, 0], opacity: [0, 0, 1, 1, 0], rotate: [0, 0, 15, -10, 0] }}
          transition={{ ...cycle, times: [0, 0.44, 0.52, 0.66, 0.8] }}
        >
          <StarBurst size={size * S} />
        </motion.div>
      </div>
    </div>
  );
}

// Decorative animated layer behind the services hero and cards: tech toys
// floating in space, jumping and fighting. Static when reduced motion is on.
export default function ToyPlayground() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        <div className="absolute left-[5%] top-[8%]"><TechToy size={56} {...toy("js")} /></div>
        <div className="absolute right-[6%] top-[12%]"><TechToy size={56} {...toy("flutter")} /></div>
        <div className="absolute left-[45%] top-[75%]"><TechToy size={52} {...toy("aws", { helmet: true })} /></div>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#7C3AED]"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ opacity: [0.15, 0.7, 0.15], scale: [1, 1.6, 1] }}
          transition={{ duration: 2.8, delay: s.delay, repeat: Infinity }}
        />
      ))}

      {ASTRONAUTS.map((a, i) => (
        <Astronaut key={i} {...a} />
      ))}
      <RocketRide />

      <Fight className="right-[3%] top-[2%] hidden md:block" left={toy("flutter")} right={toy("reactNative")} size={60} />
      <Fight className="left-[1%] top-[24%] hidden lg:block" left={toy("js")} right={toy("ts")} size={54} delay={0.8} />
      <Fight className="right-[2%] top-[60%] hidden lg:block" left={toy("java")} right={toy("kotlin")} size={54} delay={1.6} />
      <Fight className="left-1/2 bottom-[1%] -translate-x-1/2" left={toy("cpp")} right={toy("python")} size={52} delay={0.4} />

      <Jumper className="left-[3%] top-[78%] hidden md:block" props={toy("html")} size={48} />
      <Jumper className="left-[30%] top-[4%] hidden lg:block" props={toy("next")} size={44} delay={0.5} />
      <Jumper className="right-[30%] top-[86%] hidden md:block" props={toy("react")} size={46} delay={0.9} />
    </div>
  );
}
