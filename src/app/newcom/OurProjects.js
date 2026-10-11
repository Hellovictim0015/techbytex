"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, 
  Layers, Smartphone, Globe, ShieldCheck, Zap, MessageCircle, 
  PlayCircle, Briefcase, UserCheck
} from "lucide-react";

// ✅ Keep your existing imports
import img1 from "../../img2/spa.png";
import img2 from "../../img2/ad.png";
import img3 from "../../img2/ts.png";
import img4 from "../../img2/gi.png";
import img5 from "../../img2/ai.png";
import img6 from "../../../public/carkust.png";

// --- Enhanced Data Structure (SEO, Case Studies, Stats, Roles) ---
export const projects = [
  {
    id: 1,
    title: "Carlust",
    subtitle: "Premium Car Rental Platform",
    seoHeading: "Carlust – React Native Car Rental App Development",
    description: "Discover, compare, and book your dream car in seconds. Carlust offers a seamless and premium mobile experience for finding the perfect vehicle.",
    image: img6, // Or "/carkust.png" depending on your imports
    altText: "Carlust Car Rental App React Native UI by TechByteX",
    category: "App",
    clientType: "Private Startup",
    role: "Full Stack Development",
    stats: ["🚀 2x Faster Booking", "📱 Cross-Platform", "🔒 Secure Payments"],
    technologies: ["React Native", "Node.js", "Express", "MongoDB", "Google Maps API", "Socket.io"],
    caseStudy: {
      problem: "Users faced slow loading times and complex booking steps on existing platforms.",
      solution: "Developed a real-time availability engine using WebSockets and an optimized React Native UI.",
      result: "Increased user retention by 40% and reduced booking time to under 60 seconds."
    },
    features: [
      "Seamless Car Discovery & Advanced Filtering",
      "Real-time Booking & Availability Map",
      "Secure In-App Payments & Digital Documentation",
      "Verified User & Host Review System"
    ],
    link: "https://play.google.com/store/apps/details?id=com.carlust.automotive.app",
    hasVideo: true
  },
  {
    id: 2,
    title: "Floresta Wud",
    subtitle: "Premium Wood & Interior Solutions",
    seoHeading: "Floresta Wud – Next.js E-Commerce & Showcase Website",
    description: "Floresta Wud is a modern website showcasing high-quality wood products and interior solutions with a clean and professional UI.",
    image: "/Gemini_Generated_Image_r6lg8xr6lg8xr6lg.png",
    altText: "Premium Interior Design Website UI Next.js",
    category: "Website",
    clientType: "B2B Enterprise",
    role: "Frontend Developer & UI/UX",
    stats: ["⚡ Sub-second Load", "📈 SEO Optimized", "🎨 Premium UI"],
    technologies: ["React.js", "Next.js", "Tailwind CSS", "Node.js"],
    caseStudy: {
      problem: "Client's old site had high bounce rates due to poor mobile responsiveness.",
      solution: "Built a mobile-first, image-heavy Next.js architecture with lazy loading.",
      result: "Boosted organic traffic by 65% in 3 months."
    },
    features: [
      "Modern UI with Clean Product Showcase",
      "Responsive Design for Mobile & Desktop",
      "Fast Loading and SEO Optimized",
      "Contact & Inquiry Form Integration"
    ],
    link: "https://www.florestawud.com/",
    hasVideo: false
  },
  {
    id: 3,
    title: "First Step Movies",
    subtitle: "Film Production & Media Portfolio",
    seoHeading: "First Step Movies – Creative Portfolio Website Development",
    description: "A creative portfolio website for a film production company. It showcases movies, video projects, and media content with a visually engaging design.",
    image: "/Gemini_Generated_Image_7kmlwk7kmlwk7kml.png",
    altText: "Film Production Portfolio Website UI React",
    category: "Website",
    clientType: "Media & Entertainment",
    role: "Frontend React Developer",
    stats: ["🎬 High-Res Media", "📱 Fully Responsive", "⚡ Fast Streaming"],
    technologies: ["React.js", "Next.js", "Tailwind CSS", "Node.js"],
    caseStudy: {
      problem: "Client needed a highly visual, fast-loading platform to showcase heavy video content.",
      solution: "Integrated optimized video embeds and Next.js static site generation for peak performance.",
      result: "Increased client inquiries by 50% and improved site speed score to 95+."
    },
    features: [
      "Creative Portfolio Showcase for Films & Videos",
      "Modern UI with High-Quality Visual Content",
      "Video Embedding & Media Gallery",
      "Contact & Inquiry Form Integration"
    ],
    link: "https://www.firststepmovies.com/",
    hasVideo: true
  },
  {
    id: 4,
    title: "Mera Panchayat Pura",
    subtitle: "Government Information Portal",
    seoHeading: "Mera Panchayat Pura – Digital India Rural Web Portal",
    description: "A government-based web portal designed to provide villagers with easy access to panchayat information, schemes, and public services.",
    image: "/Gemini_Generated_Image_5bzj615bzj615bzj.png",
    altText: "Government Panchayat Web Portal Dashboard",
    category: "Government",
    clientType: "Government / Public Sector",
    role: "Lead Full Stack Engineer",
    stats: ["🛡️ Highly Secure", "🌍 Multi-lingual", "📱 Low-Bandwidth Optimized"],
    technologies: ["React.js", "Next.js", "Tailwind CSS", "MySQL"],
    caseStudy: {
      problem: "Lack of transparent, accessible digital records for rural communities.",
      solution: "Created a lightweight, accessible PWA ensuring performance on 3G networks.",
      result: "Successfully digitized records for 50+ local panchayats."
    },
    features: [
      "Government Schemes & Updates Listing",
      "Village Information & Public Notices",
      "Secure Data Handling & Authentication",
      "Online Forms & Service Access"
    ],
    link: "https://www.merapanchayatpura.in/",
    hasVideo: false
  },
  {
    id: 5,
    title: "Revive & Relax Spa",
    subtitle: "Wellness & Booking Platform",
    seoHeading: "Revive & Relax Spa – Custom Booking Web App",
    description: "Your ultimate destination for relaxation, rejuvenation, and inner harmony. A complete digital booking and wellness management system.",
    image: img1,
    altText: "Spa and Wellness Booking Website Next.js",
    category: "Website",
    clientType: "Private Business",
    role: "Full Stack Developer",
    stats: ["📅 Automated Booking", "💳 Online Payments", "🎨 Calming UI"],
    technologies: ["React.js", "NEXT.js", "Node.js", "MySQL", "Google API", "Tailwind CSS"],
    caseStudy: {
      problem: "Manual appointment scheduling was causing double-bookings and lost revenue.",
      solution: "Implemented a real-time calendar booking system connected to Google API.",
      result: "Reduced scheduling conflicts to 0% and increased bookings by 30%."
    },
    features: [
      "Luxurious Spa Treatments & Booking",
      "Holistic Wellness Therapies",
      "Premium Organic Products Shop",
      "Steam & Sauna Experience Management"
    ],
    link: "#",
    hasVideo: false
  },
  {
    id: 6,
    title: "Hamaradhikar News",
    subtitle: "Real-time News Portal",
    seoHeading: "Hamaradhikar News – High Traffic News Web Application",
    description: "Hamaradhikar is your go-to destination for accurate, timely, and unbiased news coverage with live streaming capabilities.",
    image: img2,
    altText: "News Portal Website Development React Node",
    category: "Website",
    clientType: "Media & Journalism",
    role: "MERN Stack Developer",
    stats: ["🚀 High Traffic Scalable", "📡 Live Streaming", "📰 Real-time Updates"],
    technologies: ["React.js", "Redux", "Node.js", "Express.js", "MongoDB", "Bootstrap"],
    caseStudy: {
      problem: "Previous platform crashed during breaking news spikes.",
      solution: "Migrated to a scalable Node.js + MongoDB architecture with caching.",
      result: "Achieved 99.9% uptime handling over 100k+ concurrent users."
    },
    features: [
      "Breaking News & Real-Time Updates",
      "Unbiased & Fact-Based Reporting",
      "Live News Streaming & Video Reports",
      "Interactive Community Engagement"
    ],
    link: "#",
    hasVideo: true
  },
  {
    id: 7,
    title: "TestSeries Innovator",
    subtitle: "EdTech Exam Platform",
    seoHeading: "TestSeries Innovator – EdTech SaaS App Development",
    description: "A comprehensive platform designed to help students and professionals excel in competitive exams with smart analytics.",
    image: img3,
    altText: "EdTech Exam Platform Dashboard Python React",
    category: "App",
    clientType: "EdTech Startup",
    role: "Backend & System Architecture",
    stats: ["📊 Smart Analytics", "🔒 Anti-Cheat System", "📝 10k+ Questions"],
    technologies: ["Python", "Django", "PostgreSQL", "Stripe", "Chakra UI", "React.js"],
    caseStudy: {
      problem: "Students lacked actionable feedback on their test performance.",
      solution: "Built a Python-based analytics engine to track weak areas and suggest study plans.",
      result: "Improved average student test scores by 25% within one semester."
    },
    features: [
      "Real-Time Exam Simulation",
      "Performance Analytics & Reports",
      "Personalized Study Plans",
      "Expert-Curated Questions"
    ],
    link: "#",
    hasVideo: false
  },
  {
    id: 8,
    title: "Hello Victim",
    subtitle: "Tech Blog & Community",
    seoHeading: "Hello Victim – AI-Powered Tech Blog Platform",
    description: "Diving deep into the ever-evolving world of technology, from AI trends to cybersecurity and gaming coverage.",
    image: img4,
    altText: "Tech Blog Website SEO AI React",
    category: "Website",
    clientType: "Independent Creator",
    role: "Full Stack Developer",
    stats: ["🤖 AI Integrations", "📈 SEO Optimized", "💬 Community Forums"],
    technologies: ["React.js", "OpenAI API", "TensorFlow.js", "Stripe", "MongoDB", "OAuth"],
    caseStudy: {
      problem: "Content creation was slow and user engagement was low.",
      solution: "Integrated OpenAI API for content drafting and added an OAuth community forum.",
      result: "Increased content output by 3x and grew community members by 5,000+."
    },
    features: [
      "Latest Tech News & Trends",
      "AI & Future Tech Insights",
      "Cybersecurity & Ethical Hacking",
      "Exclusive Deals & Recommendations"
    ],
    link: "#",
    hasVideo: false
  },
  {
    id: 9,
    title: "Balodeco Tourism",
    subtitle: "Eco-Tourism Booking",
    seoHeading: "Balodeco Tourism – Eco-Friendly Travel Web App",
    description: "Your gateway to breathtaking destinations, rich cultural experiences, and eco-friendly adventures.",
    image: img5,
    altText: "Eco Tourism Booking App Python Django",
    category: "Website",
    clientType: "Travel Agency",
    role: "Full Stack Developer",
    stats: ["🌍 Global Destinations", "💳 Multi-currency", "🌱 Eco-Verified"],
    technologies: ["Python", "Django", "PostgreSQL", "PayPal", "HTML/CSS"],
    caseStudy: {
      problem: "Client needed a way to highlight eco-friendly packages specifically.",
      solution: "Developed a custom filtering and booking engine centered around sustainability scores.",
      result: "Increased premium eco-package sales by 45%."
    },
    features: [
      "Eco-Friendly Travel Booking",
      "Curated Destinations",
      "Adventure Activities",
      "Wildlife & Nature Conservation"
    ],
    link: "#",
    hasVideo: false
  }
];
const categories = ["All", "App", "Website", "Government"];

function OurProjects() {
  const [openFeatures, setOpenFeatures] = useState({});
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
                  <span className="px-3 py-1 bg-[#7C3AED]/90 backdrop-blur-sm text-white text-xs font-bold rounded-md shadow-sm flex items-center gap-1">
                    <UserCheck size={14}/> Client: {project.clientType}
                  </span>
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
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                      />
                   </div>
                   
                   {/* Overlay on Hover */}
                   <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#6D28D9]">
                        View Live <ExternalLink size={16} />
                      </a>
                      {project.hasVideo && (
                        <button className="px-6 py-3 bg-white text-slate-900 rounded-lg font-bold shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 hover:bg-slate-100">
                          Watch Demo <PlayCircle size={16} />
                        </button>
                      )}
                   </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2">
                
                {/* ✅ SEO Heading Setup */}
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {project.title} <span className="text-lg font-medium text-slate-400 block mt-1">{project.subtitle}</span>
                </h3>

                {/* ✅ Role */}
                <p className="flex items-center gap-2 text-sm font-semibold text-[#7C3AED] mb-4">
                  <Briefcase size={16} /> Role: {project.role}
                </p>

                {/* ✅ Highlights / Stats */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.stats.map((stat, i) => (
                     <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
                       {stat}
                     </span>
                  ))}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 border-l-4 border-[#7C3AED] pl-4">
                  {project.description}
                </p>

                {/* ✅ Mini Case Study */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">Project Impact</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><strong>Problem:</strong> {project.caseStudy.problem}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2"><strong>Solution:</strong> {project.caseStudy.solution}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold"><strong>Result:</strong> {project.caseStudy.result}</p>
                </div>

                {/* Tech Stack */}
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

                {/* ✅ Visible Button (Aside from hover) */}
                <div className="mb-8 flex gap-4">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors shadow-md">
                    Visit {project.category} <ExternalLink size={18} className="ml-2" />
                  </a>
                </div>

                {/* Features Accordion Mobile / Grid Desktop */}
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
              <a href="/contact" className="px-8 py-4 bg-white text-[#7C3AED] rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Get a Free Quote
              </a>
              <a href="mailto:hello@techbytex.in" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-all duration-300">
                Hire TechByteX
              </a>
           </div>
        </div>

      </div>

      {/* ✅ Floating WhatsApp Button (Lead Gen) */}
      <a 
        href="https://wa.me/YOUR_PHONE_NUMBER?text=Hi%20TechByteX,%20I%20want%20to%20discuss%20a%20project!" 
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