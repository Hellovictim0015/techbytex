import React from "react";
import Image from "next/image";

const technologies = [
  { name: "HTML", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" },
  { name: "CSS", logo: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
  { name: "SASS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg" },
  { name: "Bootstrap", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" },
  { name: "Tailwind", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" },
  { name: "JavaScript", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" },
  { name: "Angular", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" },
  { name: "Node.js", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
  { name: "Ionic", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Ionic_Logo.svg" },
  { name: "React", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "Kotlin", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" },
  { name: "Flutter", logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/Google-flutter-logo.png" },
];

const TechnologyPartners = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden font-sans">
      
      {/* --- Background Decorative Elements (Violet Theme) --- */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            Our Tech Stack
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Powered by Modern Technology
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            We leverage the industry&apos;s most powerful frameworks and tools to build scalable, high-performance digital solutions tailored to your needs.
          </p>
        </div>

        {/* --- Grid Section --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="group relative bg-slate-50 rounded-2xl p-8 flex flex-col items-center justify-center gap-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-[#7C3AED]/10 hover:-translate-y-1 hover:bg-white transition-all duration-300 cursor-default"
            >
              {/* Logo Container */}
              <div className="h-16 w-16 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  fill
                  sizes="64px"
                  loading="lazy"
                  className="object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              {/* Tech Name */}
              <span className="text-sm font-bold text-slate-400 group-hover:text-[#7C3AED] transition-colors duration-300">
                {tech.name}
              </span>
              
              {/* Subtle Violet Border Gradient on Hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#7C3AED]/10 pointer-events-none transition-all duration-300"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechnologyPartners;