"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Users, 
  Trophy, 
  Target,
  Zap,
  Heart
} from "lucide-react";
import { team } from "../data/team";

// --- Data: Stats ---
const stats = [
  { label: "Years Experience", value: "10+" },
  { label: "Projects Delivered", value: "500+" },
  { label: "Team Members", value: "50+" },
  { label: "Global Clients", value: "20+" },
];

// --- Data: Core Values ---
const values = [
  {
    icon: <Target size={24} />,
    title: "Innovation First",
    desc: "We don't just follow trends; we set them by adopting the latest technologies."
  },
  {
    icon: <Users size={24} />,
    title: "Client Centric",
    desc: "Your success is our success. We build solutions that drive real business growth."
  },
  {
    icon: <Zap size={24} />,
    title: "Agile Execution",
    desc: "Rapid deployment without compromising quality. We move fast and break barriers."
  },
  {
    icon: <Heart size={24} />,
    title: "Transparency",
    desc: "No hidden costs, no jargon. Just honest collaboration and clear communication."
  },
];


const AboutPage = () => {
  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* --- Section 1: Hero --- */}
     <section className="relative py-20 lg:py-28 px-6 mt-16 lg:mt-0">

        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6"
          >
            Who We Are
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
          >
            We build technology that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-violet-500">
              empowers the future.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            TechByteX is a global digital transformation agency. We partner with ambitious brands to create digital products that people love.
          </motion.p>
        </div>
      </section>

      {/* --- Section 2: Stats Banner --- */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-extrabold text-[#7C3AED] mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Our Story (Split Layout) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <Image 
                src="/hello.png" 
                alt="TechByteX software development team"
                width={900}
                height={650}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full object-cover"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#7C3AED]/10 rounded-full flex items-center justify-center text-[#7C3AED]">
                  <Trophy size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Top Rated</div>
                  <div className="text-sm text-slate-500">Agency 2024</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Driven by passion, <br/> defined by results.
            </h2>
            <div className="space-y-6 text-lg text-slate-500 leading-relaxed">
              <p>
                Founded in 2015, TechByteX started with a simple mission: to bridge the gap between complex technology and real-world business needs. 
              </p>
              <p>
                What began as a small team of three developers has grown into a full-service digital powerhouse. We don&apos;t just write code; we solve problems. We take the time to understand your business model, your challenges, and your goals.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {['Scalable Architecture', 'User-Centric Design', '24/7 Support', 'Security First'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle size={18} className="text-[#7C3AED]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Section 4: Core Values --- */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              The principles that guide every decision we make and every product we build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-[#7C3AED]/5 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#7C3AED]/10 text-[#7C3AED] rounded-xl flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 5: The Team --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet the Minds</h2>
          <p className="text-slate-500">The talented people behind TechByteX.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="group relative">
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/5] bg-slate-100">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  width={400}
                  height={500}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Social Overlay */}
                {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a href="#" className="p-2 bg-white rounded-full hover:text-[#7C3AED] transition-colors"><Linkedin size={18} /></a>
                  <a href="#" className="p-2 bg-white rounded-full hover:text-[#7C3AED] transition-colors"><Twitter size={18} /></a>
                </div> */}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-[#7C3AED] text-sm font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 6: CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#7C3AED] rounded-[2.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to start your journey?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of companies that trust TechByteX to transform their digital presence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#7C3AED] rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg">
                Start a Project
              </Link>
              <Link href="/portfolio" className="px-8 py-4 bg-[#7C3AED] border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
