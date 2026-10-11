"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Placeholder data - Replace 'src' with your actual logo images
const logos = [
  { name: "Balod Eco", src: "/balod.png" },
  { name: "Rolbol", src: "/adhikar.png" },
  { name: "OTR", src: "/digi.png" },
  { name: "Robot Power", src: "/Minimalist Digital Education Logo .png" },
  { name: "Babylon", src: "/Green and Pink Illustration Henna Artist Logo (1).png" },
  { name: "Real Budget", src: "/Black Simple Monoline Travel Platform Logo.png" },
  { name: "Optri", src: "/Black and Gold Simple Online Academy Logo (2).png" },
  { name: "Pareek", src: "/rrr.png" },
  { name: "Jefnets", src: "/Frame 1000003961.png" },
  { name: "Datamatrix", src: "/Morvi Crop Science Logo.png" },
   { name: "Datamatrix", src: "/bihar.png" },
];

const MarqueeRow = ({ items, direction = "left", speed = 20 }) => {
  return (
    <div className="flex overflow-hidden relative w-full py-4 mask-fade">
      {/* We duplicate the list to create an infinite seamless loop.
         The container width must be large enough to hold all items.
      */}
      <motion.div
        className="flex gap-8 flex-shrink-0"
        initial={{ x: direction === "left" ? "0%" : "-50%" }}
        animate={{ x: direction === "left" ? "-50%" : "0%" }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {/* Render items twice for the loop */}
        {[...items, ...items].map((logo, index) => (
          <div
            key={index}
            className="w-48 h-20 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-4 hover:shadow-md transition-shadow duration-300"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={160}
              height={48}
              loading="lazy"
              className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Brand = () => {
  // Split logos into two rows for variety
  const firstRow = logos.slice(0, 5);
  const secondRow = logos.slice(5, 10);

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          Partnering with Industry Visionaries
        </h2>
        <p className="text-slate-500 mt-2">
          We work side-by-side with ambitious brands to build the future of technology.
        </p>
      </div>

      <div className="space-y-8">
        {/* Row 1: Moves Left */}
        <MarqueeRow items={logos} direction="left" speed={30} />

        {/* Row 2: Moves Right */}
        <MarqueeRow items={[...logos].reverse()} direction="right" speed={35} />
      </div>

      {/* CSS Mask to fade edges */}
      <style jsx global>{`
        .mask-fade {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
      `}</style>
    </section>
  );
};

export default Brand;