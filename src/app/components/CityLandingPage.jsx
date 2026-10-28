import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  PhoneCall,
  MessageSquareText,
  Code2,
  ShoppingCart,
  Smartphone,
  Layers,
  Palette,
  Settings,
  Cpu,
  Rocket,
} from "lucide-react";
import JsonLd from "./JsonLd";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  singleServiceSchema,
} from "../lib/seo";

const CITY_SERVICES = [
  {
    slug: "website-development",
    icon: Code2,
    title: "Website Development",
    desc: (city) => `Fast, SEO-ready business websites built on Next.js for ${city} companies that need to rank and convert.`,
  },
  {
    slug: "ecommerce-development",
    icon: ShoppingCart,
    title: "Ecommerce Development",
    desc: (city) => `Online stores and Shopify builds for ${city} retailers who want to sell beyond their local market.`,
  },
  {
    slug: "mobile-app-development",
    icon: Smartphone,
    title: "Mobile App Development",
    desc: (city) => `Android and iOS apps for ${city} businesses that need a native mobile presence.`,
  },
  {
    slug: "react-native-development",
    icon: Layers,
    title: "React Native Development",
    desc: (city) => `Cross-platform apps from one codebase, built for ${city} startups that need fast, affordable launches.`,
  },
  {
    slug: "nextjs-development",
    icon: Rocket,
    title: "Next.js Development",
    desc: (city) => `Server-rendered, high-performance web apps for ${city} businesses that need speed and strong Core Web Vitals.`,
  },
  {
    slug: "ui-ux-design",
    icon: Palette,
    title: "UI/UX Design",
    desc: (city) => `Conversion-focused design for ${city} brands that need their product to look and feel professional.`,
  },
  {
    slug: "custom-software-development",
    icon: Settings,
    title: "Custom Software Development",
    desc: (city) => `Internal tools, dashboards, billing, and inventory systems built for ${city} businesses.`,
  },
  {
    slug: "ai-development",
    icon: Cpu,
    title: "AI Development",
    desc: (city) => `Practical AI automation — support bots, lead scoring, and reporting tools for ${city} teams.`,
  },
];

const PROCESS_STEPS = [
  { title: "Discovery Call", desc: "We understand your business, goals, and target customers before writing a single line of code." },
  { title: "Design & Content", desc: "Wireframes, UI design, and SEO-ready content structured around what your customers actually search for." },
  { title: "Development", desc: "We build on Next.js and React with technical SEO, performance, and security handled from day one." },
  { title: "Review & Launch", desc: "You review the site, we refine it, then launch with proper redirects, sitemap, and analytics in place." },
  { title: "Support & Growth", desc: "Post-launch support, maintenance, and ongoing SEO improvements to keep you ranking and converting." },
];

const WHY_US = [
  "Next.js websites built for speed — strong Core Web Vitals, not just good looks",
  "Technical SEO included by default: metadata, schema markup, sitemap, canonical URLs",
  "Mobile-first design, since most local searches happen on a phone",
  "Transparent, fixed quotes before work begins — no hidden costs",
  "Direct WhatsApp and call access to the team building your project",
  "Post-launch support and maintenance packages available",
];

// The optional props are used by admin-created location pages ([slug]/page.js);
// the hand-written Chhattisgarh city pages rely on the defaults.
export default function CityLandingPage({
  city,
  serviceLabel = "Website Development",
  path = `/web-development-${city.slug}`,
  h1 = `${serviceLabel} Company in ${city.name}, Chhattisgarh`,
  heroText,
  bodyHtml,
  relatedLinks = [],
}) {

  return (
    <div className="bg-white font-sans">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: `${serviceLabel} in ${city.name}`, path },
          ]),
          localBusinessSchema({ cityName: city.name, path, areaServed: city.name }),
          singleServiceSchema({
            name: `${serviceLabel} in ${city.name}`,
            description: city.tagline,
            path,
            areaServed: city.name,
          }),
          faqPageSchema(city.faqs),
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 px-6 mt-16 lg:mt-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            <MapPin size={14} /> {city.region}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            {h1}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mb-8">
            {heroText || (
              <>
                {city.tagline}. TechByteX builds fast, SEO-ready websites, ecommerce stores, mobile apps, and custom software for businesses in {city.name} and across {city.district} district.
              </>
            )}
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
          {city.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Long-form body (location pages only — already sanitized when saved) */}
      {bodyHtml && (
        <section className="px-6 pb-16">
          <div
            className="max-w-4xl mx-auto prose prose-slate prose-lg prose-headings:text-slate-900 prose-a:text-[#7C3AED]"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </section>
      )}

      {/* Why choose us */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Why {city.name} Businesses Choose TechByteX
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {WHY_US.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle2 size={20} className="text-[#7C3AED] shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
          Industries We Serve in {city.name}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {city.industries.map((ind, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{ind.name}</h3>
              <p className="text-slate-500">{ind.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
            Our Services in {city.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CITY_SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#7C3AED]/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-4 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-[#7C3AED] transition-colors">{svc.title}</h3>
                  <p className="text-sm text-slate-500">{svc.desc(city.name)}</p>
                </Link>
              );
            })}
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

      {/* Areas served */}
      <section className="py-16 bg-[#F8FAFC] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Areas We Serve Near {city.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {city.nearbyAreas.map((area) => (
              <span key={area} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                {area}
              </span>
            ))}
          </div>
          {relatedLinks.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4">More Services Near You</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 bg-white border border-[#7C3AED]/30 rounded-full text-sm text-[#7C3AED] hover:bg-[#7C3AED]/5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 text-center mb-12">
          Common questions from {city.name} businesses about working with TechByteX.
        </p>
        <div className="space-y-4">
          {city.faqs.map((faq, i) => (
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
              Ready to build your website in {city.name}?
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
