import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ShoppingCart,
  Smartphone,
  Layers,
  Bot,
  Apple,
  Atom,
  Rocket,
  Server,
  Palette,
  Settings,
  Cpu,
  MessageSquareText,
} from "lucide-react";
import JsonLd from "../components/JsonLd";
import ToyPlayground from "../components/services/ToyPlayground";
import AppCodeExplode from "../components/services/AppCodeExplode";
import WebsiteBuildScroll from "../components/services/WebsiteBuildScroll";
import { TechToy, BRAND } from "../components/services/Toys";
import { services } from "../data/services";
import { breadcrumbSchema, createMetadata } from "../lib/seo";

export const metadata = createMetadata({
  title: "Our Services",
  description:
    "Website development, ecommerce development, mobile app development, React Native, Next.js, UI/UX design, custom software, and AI development services from TechByteX.",
  path: "/services",
  keywords: ["software development services", "website development services", "app development services"],
});

// Logo printed on each service toy's T-shirt.
const SERVICE_ICON = {
  "website-development": Code2,
  "ecommerce-development": ShoppingCart,
  "mobile-app-development": Smartphone,
  "react-native-development": Layers,
  "android-app-development": Bot,
  "ios-app-development": Apple,
  "react-development": Atom,
  "nextjs-development": Rocket,
  "nodejs-development": Server,
  "ui-ux-design": Palette,
  "custom-software-development": Settings,
  "ai-development": Cpu,
};

export default function ServicesIndexPage() {
  return (
    <div className="bg-white font-sans">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />

      {/* Hero + cards share one stage so the toys play behind both */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 via-white to-[#7C3AED]/5" />
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 h-[500px] w-[500px] rounded-full bg-[#7C3AED]/5 blur-[120px]" />
        <ToyPlayground />

        <section className="relative z-10 px-6 py-20 mt-16 lg:mt-0 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-6 inline-block rounded-full bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
              What We Do
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              Our{" "}
              <span className="text-[#7C3AED]">Services</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500 md:text-xl">
              End-to-end technology services — from websites and apps to AI and custom software — built by a team that treats SEO and performance as part of the product, not an afterthought.
            </p>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-32">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = SERVICE_ICON[service.slug] || Code2;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#7C3AED]/15"
                >
                  <div className="relative mb-4 origin-bottom transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <TechToy size={58} shirt={BRAND} badge={<Icon size={15} strokeWidth={2.75} />} />
                  </div>
                  <h2 className="relative mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-[#7C3AED]">
                    {service.title}
                  </h2>
                  <p className="relative mb-6 leading-relaxed text-slate-500">{service.shortDesc}</p>
                  <span className="relative inline-flex items-center text-sm font-semibold text-[#7C3AED]">
                    Learn more <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <WebsiteBuildScroll />
      <AppCodeExplode />

      <section className="px-6 pb-24 pt-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#7C3AED] p-12 text-center text-white md:p-16">
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#6D28D9] blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Have an idea? Let&apos;s build it.</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
              Tell us what you need — website, app or software — and get a clear, fixed quote.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="rounded-full bg-white px-8 py-4 font-bold text-[#7C3AED] shadow-lg transition-all hover:bg-slate-100">
                Get a Free Quote
              </Link>
              <a
                href={`https://wa.me/918827219873?text=${encodeURIComponent("Hi TechByteX, I'd like a price estimate for my project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/40 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
              >
                <MessageSquareText size={18} /> Ask Price on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
