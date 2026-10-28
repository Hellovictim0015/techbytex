"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, 
  Layers, Smartphone, Globe, ShieldCheck, Zap, MessageCircle, 
  PlayCircle, Briefcase, UserCheck
} from "lucide-react";

// Projects come from Admin → Portfolio (portfolio_projects table), passed in
// by app/portfolio/page.js. Empty sections (no link, case study, etc.) are hidden.
function OurProjects({ projects = [] }) {
  const [openFeatures, setOpenFeatures] = useState({});
  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const [activeFilter, setActiveFilter] = useState("All"); // ✅ Filter State

  const toggleFeatures = (id) => {
    setOpenFeatures((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    // ✅ Added Dark Mode support (dark:bg-slate-900)
    <section className="py-24 mt-10 lg:mt-0 bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden transition-colors duration-300">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent dark:from-slate-900 pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header & SEO Keywords */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#9F7AEA] text-xs font-bold tracking-widest uppercase mb-4"
          >
            Built by TechByteX
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6"
          >
            Showcasing Digital Excellence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-4"
          >
            As a leading force in <strong className="text-slate-700 dark:text-slate-200">React Development and Web Development in India</strong>, we transform complex problems into high-performing, scalable digital solutions.
          </motion.p>
        </div>

        {/* ✅ Filter System */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === cat 
                  ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div className="space-y-32">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              
              {/* Image Side with Hover Effects */}
              <div className="w-full lg:w-1/2 group perspective relative">
                
                {/* ✅ Category Badge over Image */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold rounded-md shadow-sm flex items-center gap-1">
                    {project.category === "App" ? <Smartphone size={14}/> : <Globe size={14}/>}
                    {project.category}
                  </span>
                  {project.clientType && (
                  <span className="px-3 py-1 bg-[#7C3AED]/90 backdrop-blur-sm text-white text-xs font-bold rounded-md shadow-sm flex items-center gap-1">
                    <UserCheck size={14}/> Client: {project.clientType}
                  </span>
                  )}
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-3xl group-hover:shadow-[#7C3AED]/20">
                   <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <div className="relative aspect-[16/10] bg-slate-50 dark:bg-slate-900 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.altText} // ✅ SEO Alt Text
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized={typeof project.image === "string" && !project.image.startsWith("/")}
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                      />
                   </div>
                   
                   {/* Overlay on Hover */}
                   {(project.link || project.videoUrl) && (
                   <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                      {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#6D28D9]">
                        View Live <ExternalLink size={16} />
                      </a>
                      )}
                      {project.videoUrl && (
                        <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-slate-100">
                          Watch Demo <PlayCircle size={16} />
                        </a>
                      )}
                   </div>
                   )}
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2">
                
                {/* ✅ SEO Heading Setup */}
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {project.title} <span className="text-lg font-medium text-slate-400 block mt-1">{project.subtitle}</span>
                </h3>

                {/* ✅ Role */}
                {project.role && (
                <p className="flex items-center gap-2 text-sm font-semibold text-[#7C3AED] mb-4">
                  <Briefcase size={16} /> Role: {project.role}
                </p>
                )}

                {/* ✅ Highlights / Stats */}
                {project.stats?.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.stats.map((stat, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
                       {stat}
                     </span>
                  ))}
                </div>
                )}

                {project.description && (
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 border-l-4 border-[#7C3AED] pl-4">
                  {project.description}
                </p>
                )}

                {/* ✅ Mini Case Study */}
                {(project.caseStudy?.problem || project.caseStudy?.solution || project.caseStudy?.result) && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">Project Impact</h4>
                  {project.caseStudy.problem && <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><strong>Problem:</strong> {project.caseStudy.problem}</p>}
                  {project.caseStudy.solution && <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><strong>Solution:</strong> {project.caseStudy.solution}</p>}
                  {project.caseStudy.result && <p className="text-sm text-green-600 dark:text-green-400 font-semibold"><strong>Result:</strong> {project.caseStudy.result}</p>}
                </div>
                )}

                {/* Tech Stack */}
                {project.technologies?.length > 0 && (
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">
                    <Layers size={16} className="text-[#7C3AED]" /> Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-600 hover:border-[#7C3AED] transition-colors cursor-default shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                )}

                {/* ✅ Visible Button (Aside from hover) */}
                {project.link && (
                <div className="mb-8 flex gap-4">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors shadow-md">
                    Visit {project.category} <ExternalLink size={18} className="ml-2" />
                  </a>
                </div>
                )}

                {/* Features Accordion Mobile / Grid Desktop */}
                {project.features?.length > 0 && (
                <div>
                  <div className="hidden md:block">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide">
                      <Cpu size={16} className="text-[#7C3AED]" /> Key Features
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 size={16} className="text-[#7C3AED] mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:hidden border-t border-slate-200 dark:border-slate-700 pt-4">
                    <button onClick={() => toggleFeatures(project.id)} className="flex items-center justify-between w-full text-slate-900 dark:text-white font-bold text-sm">
                      View Key Features {openFeatures[project.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                      {openFeatures[project.id] && (
                        <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden pt-3">
                          {project.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <CheckCircle2 size={16} className="text-[#7C3AED] mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                )}

              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ Lead Generation & CTA Section */}
        <div className="mt-32 p-10 bg-[#7C3AED] rounded-3xl shadow-2xl text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
           <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
           
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Ready to build something amazing?</h2>
           <p className="text-indigo-100 mb-8 max-w-2xl mx-auto relative z-10 text-lg">Partner with TechByteX to transform your ideas into scalable, high-performance digital realities.</p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#7C3AED] rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Get a Free Quote
              </Link>
              <a href="mailto:hello@techbytex.in" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300">
                Hire TechByteX
              </a>
           </div>
        </div>

      </div>

      {/* ✅ Floating WhatsApp Button (Lead Gen) */}
      <a 
        href="https://wa.me/918827219873?text=Hi%20TechByteX,%20I%20want%20to%20discuss%20a%20project!" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-2xl hover:scale-110 hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle size={28} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 group-hover:mr-1 transition-all duration-300 font-bold">
          Chat with us
        </span>
      </a>

    </section>
  );
}

export default OurProjects;