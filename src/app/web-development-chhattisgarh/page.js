import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import JsonLd from "../components/JsonLd";
import { cities } from "../data/cities";
import {
  breadcrumbSchema,
  createMetadata,
  localBusinessSchema,
  singleServiceSchema,
} from "../lib/seo";

export const metadata = createMetadata({
  title: "Website Development Company in Chhattisgarh (All Cities)",
  description:
    "TechByteX builds websites, ecommerce stores, mobile apps, and custom software for businesses across Chhattisgarh — Raipur, Bilaspur, Durg, Bhilai, Korba, Jagdalpur, and 15+ more cities.",
  path: "/web-development-chhattisgarh",
  keywords: [
    "website development Chhattisgarh",
    "web development company Chhattisgarh",
    "website designer Chhattisgarh",
    "app development Chhattisgarh",
  ],
});

export default function ChhattisgarhHubPage() {
  return (
    <div className="bg-white font-sans">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Website Development in Chhattisgarh", path: "/web-development-chhattisgarh" },
          ]),
          localBusinessSchema({ cityName: "Chhattisgarh", path: "/web-development-chhattisgarh", areaServed: "Chhattisgarh" }),
          singleServiceSchema({
            name: "Website Development in Chhattisgarh",
            description: "Website, ecommerce, app, and software development for businesses across Chhattisgarh.",
            path: "/web-development-chhattisgarh",
            areaServed: "Chhattisgarh",
          }),
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 px-6 mt-16 lg:mt-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            <MapPin size={14} /> Serving all of Chhattisgarh
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Website Development Company in Chhattisgarh
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mb-8">
            TechByteX builds fast, SEO-ready websites, ecommerce stores, mobile apps, and custom software for
            businesses across every major city and district in Chhattisgarh — from the capital Raipur to
            Bastar, Surguja, and every industrial town in between. Pick your city below for content and
            pricing built specifically around your local market.
          </p>
          <Link href="/contact" className="inline-block px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold shadow-lg shadow-violet-200 transition-all">
            Get a Free Quote
          </Link>
        </div>
      </section>

      {/* City grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Choose Your City
        </h2>
        <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
          Every city page below has content, FAQs, and pricing guidance written specifically for that local market — not a generic copy-paste page.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/web-development-${city.slug}`}
              className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#7C3AED]/10 hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#7C3AED] transition-colors">
                {city.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{city.region}</p>
              <span className="inline-flex items-center text-sm font-semibold text-[#7C3AED]">
                View {city.name} page <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
