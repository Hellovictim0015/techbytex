import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "../components/JsonLd";
import { services } from "../data/services";
import { breadcrumbSchema, createMetadata } from "../lib/seo";

export const metadata = createMetadata({
  title: "Our Services",
  description:
    "Website development, ecommerce development, mobile app development, React Native, Next.js, UI/UX design, custom software, and AI development services from TechByteX.",
  path: "/services",
  keywords: ["software development services", "website development services", "app development services"],
});

export default function ServicesIndexPage() {
  return (
    <div className="bg-white font-sans">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])} />

      <section className="relative py-20 lg:py-28 px-6 mt-16 lg:mt-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            What We Do
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Our Services
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            End-to-end technology services — from websites and apps to AI and custom software — built by a team that treats SEO and performance as part of the product, not an afterthought.
          </p>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#7C3AED]/10 hover:-translate-y-1 transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#7C3AED] transition-colors">
                {service.title}
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">{service.shortDesc}</p>
              <span className="inline-flex items-center text-sm font-semibold text-[#7C3AED]">
                Learn more <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
