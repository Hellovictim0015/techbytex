import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ArrowRight, ArrowUpRight, CalendarCheck, MapPin, PhoneCall, BadgeIndianRupee } from 'lucide-react';

// Real, checkable facts instead of decorative claims.
const FACTS = [
  { Icon: MapPin, text: 'Based in Dalli Rajhara, Chhattisgarh' },
  { Icon: PhoneCall, text: 'Reply within 24 hours on call or WhatsApp' },
  { Icon: BadgeIndianRupee, text: 'Clear, fixed quote before work starts' },
];

const unoptimized = (src) => typeof src === 'string' && !src.startsWith('/');

// `projects` are the visible Admin → Portfolio projects (same as /portfolio).
const HeroSection = ({ projects = [] }) => {
  const brandColorClass = "text-[#7C3AED]";
  const brandBgClass = "bg-[#7C3AED]";
  const recent = projects.slice(0, 3);

  return (
    <section className="relative min-h-screen mt-10 lg:mt-0 bg-white text-slate-900 overflow-hidden font-sans selection:bg-[#7C3AED]/20 selection:text-[#7C3AED]">      
      {/* --- Light Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Purple Glow Top Right */}
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#7C3AED]/5 rounded-full blur-[100px]" />
        {/* Soft Blue/Purple Glow Bottom Left */}
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
        
        {/* Grid Pattern (Subtle Grey) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 lg:pt-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Content --- */}
          <div className="space-y-10">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-white shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${brandBgClass}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${brandBgClass}`}></span>
              </span>
              <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
                Website &amp; App Development · Chhattisgarh, India
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
                App, Website & Custom Software Development by TechByte
                <span className={`text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-violet-500`}>
                  X
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg">
                We build SEO-ready websites, Next.js platforms, React Native apps, ecommerce stores, Shopify solutions, AI products, and custom software that scale.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href='/portfolio' className={`group w-full sm:w-auto px-8 py-4 ${brandBgClass} hover:opacity-90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-200`}>
                  View Portfolio
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href='/book-demo' className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                  <CalendarCheck size={18} />
                  Book a Free Consultation
              </Link>
            </div>

            
          </div>

          {/* --- Right Column: recent work + facts --- */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-fuchsia-500 rounded-2xl blur-2xl opacity-10"></div>
            <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">Recent work</p>
              {recent.length > 0 ? (
                <ul className="mt-4 divide-y divide-slate-100">
                  {recent.map((p) => (
                    <li key={p.id ?? p.title}>
                      <Link href={p.slug ? `/portfolio/${p.slug}` : '/portfolio'} className="group flex items-center gap-4 py-3">
                        <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                          {p.image && (
                            <Image
                              src={p.image}
                              alt={p.altText || p.title}
                              fill
                              sizes="80px"
                              unoptimized={unoptimized(p.image)}
                              className="object-cover"
                            />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-slate-900 group-hover:text-[#7C3AED]">{p.title}</span>
                          <span className="block truncate text-sm text-slate-500">{p.subtitle || p.category}</span>
                        </span>
                        <ArrowUpRight size={18} className="shrink-0 text-slate-300 group-hover:text-[#7C3AED]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-500">See our projects on the portfolio page.</p>
              )}
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                {FACTS.map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <Icon size={18} className={brandColorClass} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
        <span className="text-[10px] uppercase tracking-widest text-slate-400">Scroll</span>
        <ChevronDown className={brandColorClass} size={20} />
      </div>

    </section>
  );
};

export default HeroSection;
