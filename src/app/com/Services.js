"use client";
import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  ShoppingCart,
  Cpu,
  Palette,
  ArrowRight,
  Settings,
  Megaphone,
  MessageSquareText,
} from "lucide-react";
import { TechToy, BRAND } from "../components/services/Toys";

const services = [
  {
    Icon: Monitor,
    title: "Website & Next.js Development",
    description: "Fast, SEO-ready business websites and web applications built with React, Next.js, schema markup, and Core Web Vitals in mind.",
    link: "/services/website-development",
    tags: ["Next.js", "React", "SEO", "Core Web Vitals"],
    featured: true,
  },
  {
    Icon: Smartphone,
    title: "React Native App Development",
    description: "Native-feeling Android and iOS apps using React Native, secure APIs, analytics, and touch-friendly product design.",
    link: "/services/react-native-development",
    tags: ["Android", "iOS"],
  },
  {
    Icon: ShoppingCart,
    title: "Ecommerce & Shopify Development",
    description: "Conversion-focused ecommerce websites, Shopify stores, product pages, checkout flows, and custom integrations.",
    link: "/services/ecommerce-development",
    tags: ["Shopify", "Payments"],
  },
  {
    Icon: Cpu,
    title: "AI & Machine Learning",
    description: "Intelligent automation, predictive analytics, and custom AI models to drive business growth.",
    link: "/services/ai-development",
    tags: ["Automation", "Chatbots"],
  },
  {
    Icon: Palette,
    title: "UI/UX Design",
    description: "User-centric design that creates intuitive, engaging, and beautiful digital experiences.",
    link: "/services/ui-ux-design",
    tags: ["Figma", "Prototypes"],
  },
  {
    Icon: Settings,
    title: "Custom Software Development",
    description: "Scalable dashboards, internal tools, MVPs, automation systems, and cloud-ready software for growing teams.",
    link: "/services/custom-software-development",
    tags: ["Dashboards", "APIs"],
  },
  {
    Icon: Megaphone,
    title: "Social Media Marketing",
    description: "Social media account management, content planning, ad campaign management, audience targeting, and brand promotion to increase reach, engagement, and sales.",
    link: "/book-demo",
    tags: ["Content", "Ad Campaigns", "Targeting", "Brand Growth"],
    wide: true,
  },
];

function Tags({ tags }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className="rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 px-2.5 py-0.5 text-xs font-medium text-[#6D28D9]">
          {t}
        </span>
      ))}
    </div>
  );
}

function CardToy({ Icon, size = 60 }) {
  return (
    <div className="origin-bottom transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:-rotate-6">
      <TechToy size={size} shirt={BRAND} badge={<Icon size={Math.round(size / 4)} strokeWidth={2.75} />} />
    </div>
  );
}

// Mini techbytex.in window shown on the featured (website) card.
function BrowserPreview() {
  const reduce = useReducedMotion();
  const float = (delay) =>
    reduce ? {} : { animate: { y: [0, -6, 0] }, transition: { duration: 3, repeat: Infinity, delay, ease: "easeInOut" } };
  return (
    <div className="relative mt-8">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-[#7C3AED]/10">
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span className="ml-2 rounded bg-white px-2 py-0.5 text-[10px] text-slate-500 ring-1 ring-slate-200">
            https://www.techbytex.in
          </span>
        </div>
        <div className="grid grid-cols-[1.3fr_1fr] gap-3 p-4">
          <div>
            <span className="inline-block rounded-full bg-[#7C3AED]/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#7C3AED]">
              Fast · SEO-ready
            </span>
            <p className="mt-2 text-sm font-bold leading-tight text-slate-900">
              Websites that rank and convert
            </p>
            <span className="mt-2 block h-1.5 w-11/12 rounded-full bg-slate-100" />
            <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-slate-100" />
            <span className="mt-3 inline-block rounded-md bg-[#7C3AED] px-2.5 py-1 text-[9px] font-bold text-white">Get a Quote</span>
          </div>
          <div className="rounded-lg bg-slate-900 p-2 font-mono text-[8px] leading-relaxed text-slate-300">
            <p className="text-slate-500">{"// app/page.js"}</p>
            <p>
              <span className="text-[#A78BFA]">export default</span> Page
            </p>
            <p className="pl-2">{"<Hero />"}</p>
            <p className="pl-2">{"<Services />"}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          {["Websites", "Apps", "Software"].map((t) => (
            <div key={t} className="rounded-lg border border-slate-100 p-2">
              <span className="block h-3 w-3 rounded bg-[#7C3AED]" />
              <span className="mt-1.5 block text-[9px] font-semibold text-slate-700">{t}</span>
              <span className="mt-1 block h-1 w-full rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
      <motion.span
        {...float(0)}
        className="absolute -right-2 -top-4 rounded-md border border-[#7C3AED]/30 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#6D28D9] shadow-md"
      >
        {"<Next.js />"}
      </motion.span>
      <motion.span
        {...float(1.2)}
        className="absolute -bottom-3 left-6 rounded-md border border-[#7C3AED]/30 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#6D28D9] shadow-md"
      >
        SEO-ready ✓
      </motion.span>
    </div>
  );
}

const cardBase =
  "group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40 hover:shadow-xl hover:shadow-[#7C3AED]/10";

const Services = () => {
  return (
    <section className="relative overflow-hidden bg-[#FBFAFF] py-24 font-sans">
      {/* classic paper grid + soft brand glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#7C3AED12 1px, transparent 1px), linear-gradient(90deg, #7C3AED12 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#7C3AED]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
            What We Do
          </span>
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Explore Our <span className="font-serif font-normal italic text-[#7C3AED]">Services</span>
          </h2>
          <p className="text-lg leading-relaxed text-slate-500">
            From concept to deployment, we deliver end-to-end technology solutions tailored to your business goals.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const number = String(i + 1).padStart(2, "0");

            if (s.featured) {
              return (
                <Link key={s.title} href={s.link} className={`${cardBase} md:col-span-2 lg:row-span-2 lg:p-9`}>
                  <span className="absolute right-7 top-6 font-serif text-3xl italic text-[#7C3AED]/25">{number}</span>
                  <div className="flex items-end gap-4">
                    <CardToy Icon={s.Icon} size={78} />
                    <span className="mb-2 rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-bold text-white">Most popular</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold text-slate-900 transition-colors group-hover:text-[#7C3AED] md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-slate-500">{s.description}</p>
                  <div className="mt-4">
                    <Tags tags={s.tags} />
                  </div>
                  <BrowserPreview />
                  <span className="mt-auto inline-flex items-center pt-8 text-sm font-semibold text-[#7C3AED]">
                    Learn more <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            }

            if (s.wide) {
              return (
                <Link
                  key={s.title}
                  href={s.link}
                  className={`${cardBase} lg:col-span-3 lg:flex-row lg:items-center lg:gap-8 lg:pr-24`}
                >
                  <span className="absolute right-7 top-6 font-serif text-3xl italic text-[#7C3AED]/25">{number}</span>
                  <CardToy Icon={s.Icon} size={64} />
                  <div className="mt-4 flex-1 lg:mt-0">
                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-[#7C3AED]">{s.title}</h3>
                    <p className="mt-2 max-w-2xl leading-relaxed text-slate-500">{s.description}</p>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:w-64">
                    <Tags tags={s.tags} />
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#7C3AED]">
                      Plan my campaign <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={s.title} href={s.link} className={cardBase}>
                <span className="absolute right-7 top-6 font-serif text-3xl italic text-[#7C3AED]/25">{number}</span>
                <CardToy Icon={s.Icon} />
                <h3 className="mt-4 text-xl font-bold text-slate-900 transition-colors group-hover:text-[#7C3AED]">{s.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-slate-500">{s.description}</p>
                <div className="mt-4">
                  <Tags tags={s.tags} />
                </div>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-[#7C3AED]">
                  Learn more <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-7 py-3.5 font-bold text-white shadow-lg shadow-[#7C3AED]/25 transition-colors hover:bg-[#6D28D9]"
          >
            View all services <ArrowRight size={18} />
          </Link>
          <a
            href={`https://wa.me/918827219873?text=${encodeURIComponent("Hi TechByteX, I'd like a price estimate for my project.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[#7C3AED]/30 bg-white px-7 py-3.5 font-semibold text-[#7C3AED] transition-colors hover:bg-[#7C3AED]/5"
          >
            <MessageSquareText size={18} /> Ask price on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
