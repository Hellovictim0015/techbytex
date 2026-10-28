"use client";
import React from "react";
import Link from "next/link";
import { 
  Instagram, 
  Linkedin, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight 
} from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }


  const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/techbytexx?igsh=MWU1MGNzcGc3bzFqeg==",
    label: "TechByteX on Instagram",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/chandan-bhardwaj-5132a821a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    label: "TechByteX on LinkedIn",
  },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Portfolio", href: "/portfolio" },
  { label: "Contact Us", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const serviceLinks = [
  { label: "Website Development", href: "/services/website-development" },
  { label: "Mobile App Development", href: "/services/mobile-app-development" },
  { label: "Ecommerce Development", href: "/services/ecommerce-development" },
  { label: "React Native Development", href: "/services/react-native-development" },
  { label: "Next.js Development", href: "/services/nextjs-development" },
  { label: "UI/UX Design", href: "/services/ui-ux-design" },
  { label: "Custom Software", href: "/services/custom-software-development" },
  { label: "AI Development", href: "/services/ai-development" },
];

const locationLinks = [
  { label: "Website Development in Chhattisgarh", href: "/web-development-chhattisgarh" },
  { label: "Raipur", href: "/web-development-raipur" },
  { label: "Bilaspur", href: "/web-development-bilaspur" },
  { label: "Durg", href: "/web-development-durg" },
  { label: "Bhilai", href: "/web-development-bhilai" },
];

  return (
    <footer className="bg-white text-slate-600 font-sans pt-16 pb-8 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* --- Main Grid Content --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
             {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
           
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-900 leading-none tracking-tight">TechByteX</span>
                  <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider">Software Solutions</span>
                </div>
            </Link>
            
            <p className="text-slate-500 text-sm leading-relaxed">
              Empowering businesses with scalable, high-performance technology solutions. From concept to code, we build the future of digital innovation.
            </p>
            
            {/* Social Icons */}
          <div className="flex gap-3">
  {socialLinks.map(({ icon: Icon, href, label }, i) => (
    <a
      key={i}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 border border-slate-200 hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-all duration-300"
    >
      <Icon size={16} />
    </a>
  ))}
</div>
          </div>

          {/* Column 2: Quick Links */}
        <div>
  <h3 className="text-slate-900 font-bold mb-6 text-lg">Company</h3>
  <ul className="space-y-3 text-sm">
    {companyLinks.map((item) => (
      <li key={item.label}>
        <Link
          href={item.href}
          className="hover:text-[#7C3AED] transition-colors flex items-center gap-1 group"
        >
          <ChevronRight
            size={14}
            className="text-slate-400 group-hover:text-[#7C3AED] transition-colors"
          />
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 text-lg">Services</h3>
            <ul className="space-y-3 text-sm">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-[#7C3AED] transition-colors flex items-center gap-1 group">
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-[#7C3AED] transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & Newsletter */}
          <div>
            <h3 className="text-slate-900 font-bold mb-6 text-lg">Stay Connected</h3>
            
            <ul className="space-y-4 text-sm mb-8">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded bg-[#7C3AED]/10 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <MapPin size={14} />
                </div>
                <span className="text-slate-500 group-hover:text-slate-900 transition-colors">
                 Dalli Rajhara,<br/> Chhattisgarh 491228
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded bg-[#7C3AED]/10 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-slate-500 group-hover:text-slate-900 transition-colors">+91-8827219873</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded bg-[#7C3AED]/10 text-[#7C3AED] group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-slate-500 group-hover:text-slate-900 transition-colors">techbytexsoftware@gmail.com</span>
              </li>
            </ul>

            {/* Newsletter Input */}
            <div className="relative">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input 
                id="newsletter-email"
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all placeholder:text-slate-400 shadow-sm"
              />
              <button className="absolute right-1.5 top-1.5 p-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-md transition-colors shadow-sm" aria-label="Subscribe to newsletter">
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* --- Popular Locations --- */}
        <div className="pb-10 border-t border-slate-100 pt-10">
          <h3 className="text-slate-900 font-bold mb-4 text-sm uppercase tracking-wider">Popular Locations</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {locationLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-slate-500 hover:text-[#7C3AED] transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* --- Bottom Bar --- */}
       {/* --- Bottom Bar --- */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <span>&copy; {currentYear} All rights reserved.</span>
            <span className="hidden sm:block text-slate-300">|</span>
            <span className="flex items-center gap-1">
              Designed & Developed by 
              <a 
                href="https://techbytex.in" 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline transition-colors"
              >
                TechByteX.in
              </a>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-[#7C3AED] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#7C3AED] transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-[#7C3AED] transition-colors">Cookie Policy</Link>
            <Link href="/sitemap.xml" className="hover:text-[#7C3AED] transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
