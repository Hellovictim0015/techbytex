"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  MessageSquareText,
  Globe2,
  Search,
  PenTool,
  Code2,
  Rocket,
  LifeBuoy,
  Briefcase,
  Layers,
  Users,
  Building2,
} from "lucide-react";
import { TechToy, BRAND } from "../components/services/Toys";
import { aboutFaqs } from "../data/aboutFaqs";

const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease },
};

const PROCESS = [
  { Icon: Search, title: "Discovery call", text: "We understand your business, customers and goals before writing any code." },
  { Icon: PenTool, title: "Plan & design", text: "Sitemap, wireframes and UI designed around what your customers search for." },
  { Icon: Code2, title: "Build", text: "Next.js, React Native and Node.js development with SEO and speed built in." },
  { Icon: Rocket, title: "Test & launch", text: "Checked on real phones and browsers, then launched on your domain or app stores." },
  { Icon: LifeBuoy, title: "Support & growth", text: "Maintenance, updates and SEO improvements after launch." },
];

const WHY = [
  "Fixed, transparent quotes before work begins — no hidden costs",
  "Technical SEO included: metadata, schema, sitemap and fast Core Web Vitals",
  "Mobile-first design, because most customers find you on a phone",
  "Direct call and WhatsApp access to the people building your project",
  "Modern stack — Next.js, React, React Native and Node.js",
  "Post-launch support, maintenance and growth help",
];

// Industries we have actually built for (from the portfolio) plus the usual local ones.
const INDUSTRIES = [
  "Healthcare & clinics",
  "Schools & coaching institutes",
  "Real estate",
  "Retail & ecommerce",
  "Government & panchayat portals",
  "Startups & EdTech",
  "Media & news",
  "Automotive & rentals",
  "Travel & tourism",
  "Wellness & spa",
  "Furniture & interiors",
  "Manufacturing & B2B",
];

// Popular searches — each one links to the page that answers it.
const TAGS = [
  { label: "Website development company in Chhattisgarh", href: "/web-development-chhattisgarh" },
  { label: "Website developer in Raipur", href: "/web-development-raipur" },
  { label: "Website design in Bhilai", href: "/web-development-bhilai" },
  { label: "Web development company Durg", href: "/web-development-durg" },
  { label: "Website developer Balod & Dalli Rajhara", href: "/web-development-dalli-rajhara" },
  { label: "App development company Bhilai", href: "/app-development-bhilai" },
  { label: "React Native app development", href: "/services/react-native-development" },
  { label: "Android app development", href: "/services/android-app-development" },
  { label: "Next.js development company", href: "/services/nextjs-development" },
  { label: "Ecommerce website development", href: "/services/ecommerce-development" },
  { label: "Custom software development", href: "/services/custom-software-development" },
  { label: "AI chatbot development", href: "/services/ai-development" },
  { label: "UI/UX design company", href: "/services/ui-ux-design" },
  { label: "Locations we serve", href: "/locations" },
];

const PaperGrid = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute inset-0 ${className}`}
    style={{
      backgroundImage:
        "linear-gradient(#7C3AED12 1px, transparent 1px), linear-gradient(90deg, #7C3AED12 1px, transparent 1px)",
      backgroundSize: "36px 36px",
    }}
  />
);

function SectionHead({ eyebrow, title, accent, text, center = true }) {
  return (
    <motion.div {...fadeUp} className={`mb-12 max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {title} {accent && <span className="font-serif font-normal italic text-[#7C3AED]">{accent}</span>}
      </h2>
      {text && <p className="mt-4 text-lg leading-relaxed text-slate-500">{text}</p>}
    </motion.div>
  );
}

export default function AboutPageClient({ projects = [], services = [], cities = [], team = [] }) {
  // Unique by name, ignoring case ("Next.js" and "NEXT.js" are the same).
  const techByKey = new Map();
  for (const t of projects.flatMap((p) => p.technologies)) {
    const key = t.trim().toLowerCase();
    if (!techByKey.has(key)) techByKey.set(key, t.trim());
  }
  const techStack = [...techByKey.values()].slice(0, 24);
  const stats = [
    { value: services.length, label: "Services we offer", Icon: Layers },
    { value: projects.length, label: "Projects in our portfolio", Icon: Briefcase },
    { value: cities.length, label: "Chhattisgarh cities served", Icon: MapPin },
    { value: team.length, label: "People on the core team", Icon: Users },
  ];

  return (
    <div className="bg-white font-sans">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-[#FBFAFF] px-6 pb-20 pt-32 lg:pt-36">
        <PaperGrid className="opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7C3AED]"
            >
              <Building2 size={14} /> About TechByteX Software Solutions
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease }}
              className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 md:text-6xl"
            >
              We build websites, apps &amp; software that{" "}
              <span className="font-serif font-normal italic text-[#7C3AED]">grow businesses</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
            >
              TechByteX Software Solutions is a <strong className="text-slate-800">website, mobile app and custom software
              development company</strong> based in Dalli Rajhara, Chhattisgarh. We help shops, clinics, schools, startups,
              manufacturers and public-sector teams get online and grow — with fast, SEO-ready websites, Android &amp; iOS
              apps and software built around how they actually work.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#7C3AED]/25 transition-colors hover:bg-[#6D28D9]"
              >
                Get a free quote <ArrowRight size={18} />
              </Link>
              <a
                href={`https://wa.me/918827219873?text=${encodeURIComponent("Hi TechByteX, I'd like to discuss a project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#7C3AED]/30 bg-white px-6 py-3.5 font-semibold text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/5"
              >
                <MessageSquareText size={18} /> WhatsApp us
              </a>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-2 text-sm"
            >
              {["Based in Dalli Rajhara, Chhattisgarh", "Clients across India & abroad", "Next.js · React Native · Node.js · AI"].map(
                (t) => (
                  <li key={t} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">
                    {t}
                  </li>
                )
              )}
            </motion.ul>
          </div>

          {/* Toy "team" on a desk card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-4 rotate-2 rounded-[2rem] bg-[#7C3AED]/10" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-[#7C3AED]/15">
              <p className="font-serif text-2xl italic text-slate-900">Your tech team, on call.</p>
              <p className="mt-2 text-sm text-slate-500">Design, development, SEO and support — one team, one point of contact.</p>
              <div className="mt-8 flex items-end justify-around">
                {[
                  { Icon: Globe2, delay: 0 },
                  { Icon: Code2, delay: 0.4 },
                  { Icon: Rocket, delay: 0.8 },
                ].map(({ Icon, delay }) => (
                  <motion.div
                    key={delay}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay, ease: "easeInOut" }}
                  >
                    <TechToy size={68} shirt={BRAND} badge={<Icon size={17} strokeWidth={2.75} />} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-500">
                <span>Websites</span>
                <span>Software</span>
                <span>Apps</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Stats (real, computed from site data) ---------------- */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4">
          {stats.map(({ value, label, Icon }, i) => (
            <motion.div key={label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
                <Icon size={22} />
              </span>
              <div>
                <p className="font-serif text-4xl italic text-[#7C3AED]">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Story ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-start gap-14 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Our story</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              From Chhattisgarh, <span className="font-serif font-normal italic text-[#7C3AED]">for every business</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="space-y-5 text-lg leading-relaxed text-slate-600">
            <p>
              TechByteX started with a simple idea: small and growing businesses deserve the same quality of websites and
              apps that big brands get — without confusing jargon or surprise bills.
            </p>
            <p>
              Today we build <Link href="/services/website-development" className="font-semibold text-[#7C3AED] hover:underline">business websites</Link>,{" "}
              <Link href="/services/ecommerce-development" className="font-semibold text-[#7C3AED] hover:underline">ecommerce stores</Link>,{" "}
              <Link href="/services/react-native-development" className="font-semibold text-[#7C3AED] hover:underline">React Native mobile apps</Link>,{" "}
              <Link href="/services/custom-software-development" className="font-semibold text-[#7C3AED] hover:underline">custom software</Link> and{" "}
              <Link href="/services/ai-development" className="font-semibold text-[#7C3AED] hover:underline">AI automation</Link> for clients in
              Raipur, Bhilai, Durg, Bilaspur, Balod and across India — from a car-rental app and an EdTech test-series app to a
              village panchayat portal, news sites and travel websites.
            </p>
            <p>
              Every project gets technical SEO, fast performance and a mobile-first design from day one, so your website
              doesn&apos;t just look good — it shows up on Google and brings enquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="relative overflow-hidden bg-[#FBFAFF] py-24">
        <PaperGrid className="opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHead eyebrow="What we do" title="Everything you need to" accent="go digital" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <motion.div key={s.slug} {...fadeUp} transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:shadow-lg hover:shadow-[#7C3AED]/10"
                >
                  <span className="font-serif text-2xl italic text-[#7C3AED]/30">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#7C3AED]">{s.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{s.shortDesc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Process ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead eyebrow="How we work" title="A simple, clear" accent="process" text="You always know what is being built, when it will be ready and what it costs." />
        <div className="relative grid gap-8 md:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent md:block" />
          {PROCESS.map(({ Icon, title, text }, i) => (
            <motion.div key={title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="relative text-center">
              <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30">
                <Icon size={20} />
              </span>
              <p className="mt-4 font-bold text-slate-900">
                <span className="mr-1 font-serif italic text-[#7C3AED]">{i + 1}.</span> {title}
              </p>
              <p className="mt-1 text-sm text-slate-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Why us + industries ---------------- */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#A78BFA]">Why TechByteX</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Built right, <span className="font-serif font-normal italic text-[#A78BFA]">priced fairly</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {WHY.map((w) => (
                <li key={w} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#A78BFA]" />
                  {w}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#A78BFA]">Industries we serve</span>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Experience across <span className="font-serif font-normal italic text-[#A78BFA]">many sectors</span>
            </h2>
            <div className="mt-8 flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <span key={ind} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  {ind}
                </span>
              ))}
            </div>
            {techStack.length > 0 && (
              <>
                <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] text-[#A78BFA]">Technologies in our projects</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {techStack.map((t) => (
                    <span key={t} className="rounded-md bg-[#7C3AED]/20 px-2.5 py-1 font-mono text-xs text-[#DDD6FE]">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* ---------------- Clients from the portfolio ---------------- */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <SectionHead eyebrow="Our work" title="Businesses that" accent="trust us" text="A few of the projects we have designed and built." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-5"
              >
                <div>
                  <p className="font-bold text-slate-900">{p.title}</p>
                  <p className="text-sm text-slate-500">{p.clientType || p.category}</p>
                </div>
                <span className="rounded-full bg-[#7C3AED]/10 px-2.5 py-0.5 text-xs font-bold text-[#7C3AED]">{p.category}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/portfolio" className="inline-flex items-center gap-2 font-semibold text-[#7C3AED] hover:underline">
              See the full portfolio <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ---------------- Team ---------------- */}
      <section className="relative overflow-hidden bg-[#FBFAFF] py-24">
        <PaperGrid className="opacity-40" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHead eyebrow="Our team" title="The people behind" accent="TechByteX" />
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {team.map((m, i) => (
              <motion.div key={m.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image
                    src={m.image}
                    alt={`${m.name}, ${m.role} at TechByteX`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
                    <p className="font-bold text-white">{m.name}</p>
                    <p className="text-sm text-[#DDD6FE]">{m.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Where we work + tags ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-2">
          <motion.div {...fadeUp}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Where we work</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Local in Chhattisgarh, <span className="font-serif font-normal italic text-[#7C3AED]">online everywhere</span>
            </h2>
            <p className="mt-4 text-slate-500">
              We meet clients in person around Dalli Rajhara, Balod, Durg and Bhilai, and work with businesses across India and
              abroad over calls and video meetings.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/web-development-${c.slug}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition-colors hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp}>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">Popular searches</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              People find us <span className="font-serif font-normal italic text-[#7C3AED]">for</span>
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="rounded-full bg-[#7C3AED]/5 px-3 py-1.5 text-sm font-medium text-[#6D28D9] ring-1 ring-[#7C3AED]/15 transition-colors hover:bg-[#7C3AED] hover:text-white"
                >
                  #{t.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-[#FBFAFF] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHead eyebrow="FAQ" title="Questions about" accent="TechByteX" />
          <div className="space-y-3">
            {aboutFaqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-[#7C3AED]/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-slate-900">
                  {f.q}
                  <span className="text-2xl leading-none text-[#7C3AED] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Contact CTA ---------------- */}
      <section className="px-6 py-24">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#7C3AED] p-10 text-white md:p-14"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#6D28D9] blur-2xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Let&apos;s build something for your business.</h2>
              <p className="mt-3 text-white/80">Tell us what you need — we&apos;ll reply with ideas and a clear, fixed quote.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[#7C3AED] shadow-lg">
                  Get a free quote <ArrowRight size={18} />
                </Link>
                <Link href="/book-demo" className="rounded-full border-2 border-white/60 px-7 py-3.5 font-bold text-white hover:bg-white/10">
                  Book a consultation
                </Link>
              </div>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#DDD6FE]" />
                <a href="tel:+918827219873" className="hover:underline">+91 8827219873</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#DDD6FE]" />
                <a href="mailto:techbytexsoftware@gmail.com" className="hover:underline">techbytexsoftware@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-[#DDD6FE]" />
                Dalli Rajhara, Balod, Chhattisgarh 491228
              </li>
              <li className="flex items-center gap-3">
                <Globe2 size={18} className="text-[#DDD6FE]" />
                www.techbytex.in
              </li>
            </ul>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
