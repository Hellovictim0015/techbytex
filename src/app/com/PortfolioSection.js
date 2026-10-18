"use client";
import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// Local images (public/ and /uploads) go through next/image; any external URL
// an admin pastes is shown as-is.
const canOptimize = (src) => src.startsWith("/");

// Projects come from Admin → Projects (passed in by the homepage).
const PortfolioSection = ({ projects = [] }) => {
  if (projects.length === 0) return null;

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
          {[...projects, ...projects, ...projects, ...projects].map((project, index) => {
            const Card = project.link ? "a" : "div";
            const linkProps = project.link
              ? { href: project.link, target: "_blank", rel: "noopener", "aria-label": `${project.title} — open live project` }
              : {};
            return (
            <Card
              key={index}
              {...linkProps}
              className={`relative block w-[260px] h-[340px] rounded-xl overflow-hidden group border border-slate-100 shadow-sm flex-shrink-0 ${project.link ? "cursor-pointer" : "cursor-default"}`}
            >
              {/* Image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="260px"
                loading="lazy"
                unoptimized={!canOptimize(project.image)}
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
                    {project.link && (
                      <div className="bg-[#7C3AED] p-1.5 rounded-full text-white shadow-md">
                        <ExternalLink size={12} />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </Card>
            );
          })}
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