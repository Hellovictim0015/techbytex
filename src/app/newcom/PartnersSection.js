"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Server, Settings, CreditCard } from "lucide-react";

// Data
const cloudPartners = [
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/640px-Amazon_Web_Services_Logo.svg.png" },
  { name: "GCP", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Google_Cloud_logo_text.png" },
  { name: "Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/Microsoft_Azure_Linux_logo.png" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Oracle_Logo.svg" },
];

const devOpsPartners = [
  { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" },
  { name: "Jenkins", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Jenkins_logo_with_title.svg" },
  { name: "GitLab", logo: "https://upload.wikimedia.org/wikipedia/commons/3/35/GitLab_icon.svg" },
  { name: "Jira", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Jira_Logo.svg" },
  { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
  { name: "Docker", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
  { name: "Kubernetes", logo: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
];

const paymentPartners = [
  { name: "Paystack", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Paystack_Logo.png" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/1280px-Razorpay_logo.svg.png?20171127075036" },
];

// Reusable Marquee Component
const MarqueeRow = ({ items, speed = 20, direction = "left" }) => {
  return (
    <div className="flex overflow-hidden relative w-full py-6 mask-fade">
      <motion.div
        className="flex gap-8 flex-shrink-0 items-center"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : "0%" }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {/* Render items 3 times to ensure smooth infinite loop on wide screens */}
        {[...items, ...items, ...items].map((partner, index) => (
          <div
            key={index}
            className="w-48 h-20 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center p-5 hover:border-[#7C3AED]/30 hover:shadow-lg transition-all duration-300 group"
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={144}
              height={48}
              loading="lazy"
              className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const PartnersSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 mb-12 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-4">
          Ecosystem
        </span>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Our Technology Partners
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          We integrate with the best-in-class tools to build robust, scalable, and secure platforms for your business.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* ROW 1: CLOUD (Left Scroll) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div className="flex items-center justify-center gap-2 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
            <Server size={14} className="text-[#7C3AED]" /> Cloud Infrastructure
          </div>
          <MarqueeRow items={cloudPartners} speed={30} direction="left" />
        </div>

        {/* ROW 2: DEVOPS (Right Scroll) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div className="flex items-center justify-center gap-2 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
            <Settings size={14} className="text-[#7C3AED]" /> DevOps Tools
          </div>
          <MarqueeRow items={devOpsPartners} speed={40} direction="right" />
        </div>

        {/* ROW 3: PAYMENTS (Left Scroll) */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div className="flex items-center justify-center gap-2 mb-2 text-sm font-semibold text-slate-400 uppercase tracking-widest">
            <CreditCard size={14} className="text-[#7C3AED]" /> Payment Gateways
          </div>
          <MarqueeRow items={paymentPartners} speed={35} direction="left" />
        </div>

      </div>

    </section>
  );
};

export default PartnersSection;