import Link from "next/link";
import { MapPin } from "lucide-react";
import JsonLd from "../components/JsonLd";
import { cities } from "../data/cities";
import { breadcrumbSchema, createMetadata } from "../lib/seo";
import { getPublishedLocationsByPlace } from "../lib/location-pages";

export const metadata = createMetadata({
  title: "Locations We Serve — Website & App Development Across India",
  description:
    "TechByteX builds websites, mobile apps, ecommerce stores and custom software for businesses across Chhattisgarh, India and abroad. Find the page for your city.",
  path: "/locations",
});

// Picks up newly published location pages (publishing also refreshes it immediately).
export const revalidate = 300;

export default async function LocationsPage() {
  const places = await getPublishedLocationsByPlace();

  return (
    <div className="bg-white font-sans">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ])}
      />

      <section className="px-6 pt-28 pb-12 lg:pt-32">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            <MapPin size={14} /> Locations
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Website &amp; App Development — Locations We Serve
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-3xl">
            TechByteX is based in Dalli Rajhara, Chhattisgarh and works with businesses across India and abroad —
            in person nearby, and over calls, video meetings and WhatsApp everywhere else. Pick your city to see how
            we help local businesses there.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Chhattisgarh</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/web-development-chhattisgarh"
              className="px-4 py-2 rounded-full bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9]"
            >
              All of Chhattisgarh
            </Link>
            {cities.map((c) => (
              <Link
                key={c.slug}
                href={`/web-development-${c.slug}`}
                className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:border-[#7C3AED] hover:text-[#7C3AED]"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/app-development-bhilai"
              className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:border-[#7C3AED] hover:text-[#7C3AED]"
            >
              App Development in Bhilai
            </Link>
          </div>
        </div>
      </section>

      {places.length > 0 && (
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto space-y-10">
            <h2 className="text-2xl font-bold text-slate-900">More cities</h2>
            {places.map((place) => (
              <div key={`${place.city}-${place.state}-${place.country}`}>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{place.city}</h3>
                <p className="text-sm text-slate-500 mb-4">{[place.state, place.country].filter(Boolean).join(", ")}</p>
                <div className="flex flex-wrap gap-3">
                  {place.pages.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-700 hover:border-[#7C3AED] hover:text-[#7C3AED]"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
