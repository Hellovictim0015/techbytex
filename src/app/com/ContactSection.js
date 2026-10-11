"use client";
import React from "react";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react"; // Imported icons

// Placeholder images
const faces = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
];

const ContactSection = () => {
  return (
    <section className="py-20 px-4 flex justify-center items-center bg-white font-sans">
      
      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-[#F4F1FF] rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-slate-100">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40" 
             style={{ backgroundImage: 'radial-gradient(#7C3AED 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        {/* Soft Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />

        {/* --- Left Side: Avatar Grid --- */}
        <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-start mb-12 lg:mb-0">
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {/* Avatars... (Same as before) */}
            {faces.map((face, i) => {
              const offsets = ["", "translate-y-4", "", "-translate-y-2", "translate-y-2", "-translate-y-2", "", "-translate-y-4", ""];
              return (
                <div
                  key={i}
                  className={`relative col-span-1 h-24 md:h-28 rounded-2xl overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 ${offsets[i]}`}
                >
                  <Image src={face} alt="TechByteX client" fill sizes="150px" loading="lazy" className="object-cover" />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Right Side: Content & Form --- */}
        <div className="relative z-10 w-full lg:w-1/2 text-center lg:text-left pl-0 lg:pl-10">
          
          <span className="inline-block py-1.5 px-4 rounded-full bg-white text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm border border-slate-100">
            Let&apos;s Initiate
          </span>
          
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Let&apos;s Discuss Your <br className="hidden md:block"/> 
            Next Big Idea
          </h2>
          
          <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
            Hundreds of businesses have trusted us. Now it&apos;s your turn to take the leap.
          </p>

          {/* Email Input Form */}
         <div className="relative max-w-md mx-auto lg:mx-0 bg-white p-2 rounded-2xl shadow-lg mb-6">
  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
    
    <input
      type="email"
      aria-label="Email address"
      placeholder="Enter your mail .."
      className="flex-1 bg-transparent px-6 py-3 text-slate-700 placeholder-slate-400 focus:outline-none rounded-full border border-slate-200 sm:border-none"
    />

    <button className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap" aria-label="Get in touch with TechByteX">
      Get In Touch
    </button>

  </div>
</div>


          {/* --- NEW: WhatsApp & Call Options --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
  <p className="text-sm font-semibold text-slate-400">
    connect
  </p>

  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
    
    {/* WhatsApp Button */}
    <a
      href="https://wa.me/918827219873"
      target="_blank"
      rel="noreferrer"
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
    >
      <MessageCircle size={18} />
      WhatsApp
    </a>

    {/* Call Button */}
    <a
      href="tel:+918827219873"
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-700 hover:bg-slate-800 hover:text-white border border-slate-200 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
    >
      <Phone size={18} />
      Call Now
    </a>

  </div>
</div>


        </div>

      </div>
    </section>
  );
};

export default ContactSection;
