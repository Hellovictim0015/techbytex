"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Terminal, Zap, ArrowRight, Server, Smartphone, Code2 } from 'lucide-react';

const HeroSection = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);

  // The specific brand color requested
  const brandColorClass = "text-[#7C3AED]";
  const brandBgClass = "bg-[#7C3AED]";
  const brandBorderClass = "border-[#7C3AED]";

  const animations = [
    {
      label: 'Backend',
      title: 'Cloud Architecture',
      icon: <Server size={20} className={brandColorClass} />,
      code: `// Scalable Microservices
const infrastructure = {
  region: 'us-east-1',
  scaling: 'auto',
  database: { 
    type: 'PostgreSQL', 
    replicas: 5 
  }
};`
    },
    {
      label: 'AI / ML',
      title: 'Neural Pipelines',
      icon: <Zap size={20} className={brandColorClass} />,
      code: `# Training Model v2.4
import tensorflow as tf

model.compile(
  optimizer='adam',
  loss='sparse_categorical',
  metrics=['accuracy']
);`
    },
    {
      label: 'Frontend',
      title: 'Mobile & Web',
      icon: <Smartphone size={20} className={brandColorClass} />,
      code: `// Cross-platform UI
export default function App() {
  const [user] = useAuth();
  
  return (
    <View style={styles.container}>
      <Dashboard data={user} />
    </View>
  );
}`
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [animations.length]);

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
                Trusted by 500+ Enterprises
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
                  Portfolio View
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href='/book-demo' className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                  <Terminal size={18} />
                  View Solutions
              </Link>
            </div>

            
          </div>

          {/* --- Right Column: The "Terminal" Visual --- */}
          <div className="relative">
            {/* Glow behind terminal (Purple) */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-fuchsia-500 rounded-2xl blur-2xl opacity-10 animate-pulse`}></div>
            
            {/* Terminal Container (Kept Dark for Contrast) */}
            <div className="relative bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                  <Code2 size={12} />
                  techbytex_console
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 h-[340px] flex flex-col justify-between">
                
                {/* Dynamic Content */}
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 ${brandColorClass} mb-4`}>
                    {animations[currentAnimation].icon}
                    <span className="text-sm font-semibold tracking-wide text-slate-200">
                      {animations[currentAnimation].title}
                    </span>
                  </div>

                  <div className="font-mono text-sm leading-relaxed relative">
                    {/* Simulated typing cursor */}
                    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-slate-700"></div>
                    
                    <div className="text-slate-400">
                      <span className="text-purple-400">import</span> {`{ ${animations[currentAnimation].label} }`} <span className="text-purple-400">from</span> <span className={brandColorClass}>&apos;@techbytex/core&apos;</span>;
                    </div>
                    <div className="mt-4 text-slate-300">
                      <pre className="whitespace-pre-wrap font-mono">
                        {animations[currentAnimation].code}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${brandBgClass} animate-pulse`}></span>
                    System Online
                  </span>
                  <span>v2.4.0</span>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
          
            

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
