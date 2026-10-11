import Link from "next/link";
import { CheckCircle2, PhoneCall, MessageSquareText, ArrowRight, MapPin } from "lucide-react";
import JsonLd from "./JsonLd";
import { cities } from "../data/cities";
import {
  breadcrumbSchema,
  faqPageSchema,
  singleServiceSchema,
} from "../lib/seo";

const PROCESS_STEPS = [
  { title: "Discovery Call", desc: "We understand your goals, users, and constraints before proposing an approach." },
  { title: "Scope & Quote", desc: "A clear, fixed quote and timeline — no open-ended hourly billing surprises." },
  { title: "Design & Build", desc: "Iterative development with regular check-ins so there are no surprises at delivery." },
  { title: "Testing & Launch", desc: "Real-device and real-world testing before we ship, then a clean launch." },
  { title: "Support & Growth", desc: "Post-launch support and improvements based on real usage data." },
];

const FEATURED_CITIES = ["raipur", "bilaspur", "durg", "bhilai", "korba", "jagdalpur"];

export default function ServiceLandingPage({ service }) {
  const path = `/services/${service.slug}`;
  const featuredCities = cities.filter((c) => FEATURED_CITIES.includes(c.slug));

  return (
    <div className="bg-white font-sans">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path },
          ]),
          singleServiceSchema({
            name: service.title,
            description: service.shortDesc,
            path,
          }),
          faqPageSchema(service.faqs),
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 px-6 mt-16 lg:mt-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            Our Services
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            {service.h1}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mb-8">
            {service.shortDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold shadow-lg shadow-violet-200 transition-all text-center">
              Get a Free Quote
            </Link>
            <a href="tel:+918827219873" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <PhoneCall size={18} /> +91 8827219873
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-slate-600 leading-relaxed">
          {service.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            What&apos;s Included
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {service.features.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle2 size={20} className="text-[#7C3AED] shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
          Who This Is For
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {service.useCases.map((uc, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{uc.name}</h3>
              <p className="text-slate-500">{uc.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Technology We Use</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {service.techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Process</h2>
        <div className="grid md:grid-cols-5 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#7C3AED] text-white font-bold flex items-center justify-center mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available across Chhattisgarh */}
      <section className="py-16 bg-[#F8FAFC] px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center justify-center gap-2">
            <MapPin size={20} className="text-[#7C3AED]" /> Available Across Chhattisgarh
          </h2>
          <p className="text-slate-500 mb-8">
            We serve businesses across every major city in Chhattisgarh, with local content built for each market.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {featuredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/web-development-${city.slug}`}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
          <Link href="/web-development-chhattisgarh" className="inline-flex items-center text-sm font-semibold text-[#7C3AED]">
            View all cities we serve <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {service.faqs.map((faq, i) => (
            <details key={i} className="group border border-slate-200 rounded-2xl p-6 open:bg-[#7C3AED]/5 open:border-[#7C3AED]">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between gap-4">
                {faq.q}
                <span className="text-[#7C3AED] group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
              </summary>
              <p className="text-slate-600 leading-relaxed mt-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#7C3AED] rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to start your {service.title.toLowerCase()} project?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Get a free consultation and a clear, fixed quote — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#7C3AED] rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg">
                Start a Project
              </Link>
              <a
                href="https://wa.me/918827219873"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#7C3AED] border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquareText size={18} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
