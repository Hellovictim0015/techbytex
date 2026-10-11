"use client";
import React from "react";
import Link from "next/link";
import { 
  Monitor, 
  Smartphone, 
  Cloud, 
  Cpu, 
  Palette, 
  ArrowRight, 
  Settings, 
  Megaphone
} from "lucide-react";

const services = [
  {
    icon: <Monitor size={32} />,
    title: "Website & Next.js Development",
    description: "Fast, SEO-ready business websites and web applications built with React, Next.js, schema markup, and Core Web Vitals in mind.",
    link: "/services/website-development"
  },
  {
    icon: <Smartphone size={32} />,
    title: "React Native App Development",
    description: "Native-feeling Android and iOS apps using React Native, secure APIs, analytics, and touch-friendly product design.",
    link: "/services/react-native-development"
  },
  {
    icon: <Cloud size={32} />,
    title: "Ecommerce & Shopify Development",
    description: "Conversion-focused ecommerce websites, Shopify stores, product pages, checkout flows, and custom integrations.",
    link: "/services/ecommerce-development"
  },
  {
    icon: <Cpu size={32} />,
    title: "AI & Machine Learning",
    description: "Intelligent automation, predictive analytics, and custom AI models to drive business growth.",
    link: "/services/ai-development"
  },
  {
    icon: <Palette size={32} />,
    title: "UI/UX Design",
    description: "User-centric design that creates intuitive, engaging, and beautiful digital experiences.",
    link: "/services/ui-ux-design"
  },
  {
    icon: <Settings size={32} />,
    title: "Custom Software Development",
    description: "Scalable dashboards, internal tools, MVPs, automation systems, and cloud-ready software for growing teams.",
    link: "/services/custom-software-development"
  },
  {
  icon: <Megaphone size={32} />,
  title: "Social Media Marketing",
  description: "Social media account management, content planning, ad campaign management, audience targeting, and brand promotion to increase reach, engagement, and sales.",
  link: "/book-demo"
}
];

const Services = () => {
  return (
    <section className="py-24 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-4">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            Explore Our Services
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            From concept to deployment, we deliver end-to-end technology solutions tailored to your business goals.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#7C3AED]/10 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-6 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#7C3AED] transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Link */}
              <Link 
                href={service.link}
                className="inline-flex items-center text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors"
              >
                Learn more <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
