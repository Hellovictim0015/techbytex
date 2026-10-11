"use client";
import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// Placeholder Data
const projects = [
  {
    id: 1,
    title: "Florestawud",
    subtitle: "E-Commerce Website",
    image: "/Screenshot 2026-01-11 191907.png",
    link: "#"
  },
  {
    id: 2,
    title: "MCQ Exam",
    subtitle: "App",
    image: "/Screenshot 2025-07-30 035239.png",
    link: "#"
  },
  {
    id: 3,
    title: "ग्राम पंचायत बिहार",
    subtitle: "piblic service website",
    image: "/Screenshot 2026-01-11 192900.png",
    link: "#"
  },
  {
    id: 4,
    title: "StoreNSource",
    subtitle: "E-Commerce Website",
    image: "/Screenshot 2026-01-11 192542.png",
    link: "#"
  },
  {
    id: 5,
    title: "Indian expoeters",
    subtitle: "Manufacturing website",
    image: "/Screenshot 2026-01-11 193241.png",
    link: "#"
  },
  {
    id: 6,
    title: "Spa",
    subtitle: "website",
    image: "/Screenshot 2026-01-11 195839.png",
    link: "#"
  }
];

const PortfolioSection = () => {
  return (
    <section className="py-16 bg-white overflow-hidden font-sans">
      <div className="container mx-auto px-4 mb-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-3">
          Our Work
        </span>
        <h2 className="text-3xl font-bold text-slate-900">
          Recent Projects
        </h2>
      </div>

      {/* --- Infinite Marquee Container --- */}
      <div className="relative w-full overflow-hidden mask-fade-sides">
        
        <motion.div
          className="flex gap-5 w-max"
          // Start at -50% (halfway through the duplicated list) and move to 0% (Rightwards)
          initial={{ x: "-50%" }}
          animate={{ x: "0%" }}
          transition={{
            duration: 30, // Adjust speed (lower = faster)
            ease: "linear",
            repeat: Infinity,
          }}
          // Pause animation on hover for usability
          whileHover={{ animationPlayState: "paused" }} 
        >
          {/* Duplicate items 4 times to ensure seamless loop on large screens */}
          {[...projects, ...projects, ...projects, ...projects].map((project, index) => (
            <div 
              key={index}
              className="relative w-[260px] h-[340px] rounded-xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm flex-shrink-0"
            >
              {/* Image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="260px"
                loading="lazy"
                className="object-contain transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark Overlay (Hover Only) */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Text Content (Slides Up on Hover) */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                
                {/* Glass Panel */}
                <div className="bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                        {project.subtitle}
                      </p>
                    </div>
                    <div className="bg-[#7C3AED] p-1.5 rounded-full text-white shadow-md">
                      <ExternalLink size={12} />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CSS to pause animation on hover (framer-motion handles movement, this handles pause) */}
      <style jsx global>{`
        .mask-fade-sides {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        /* Pause the motion div on hover */
        .mask-fade-sides:hover > div {
          animation-play-state: paused !important;
        }
      `}</style>

    </section>
  );
};

export default PortfolioSection;