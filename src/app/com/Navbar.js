"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, ArrowRight, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // The specific purple from your "Let's Connect" image
  // Using a custom class or Tailwind's closest match (violet-600/700)
  const brandColor = "bg-[#7C3AED]"; // Vivid Violet
  const brandHover = "hover:bg-[#6D28D9]";
  const brandText = "text-[#7C3AED]";

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    // { name: 'Insights', path: '/technology-insights' },
    { name: 'Contact Us', path: '/contact' },
     { name: 'Blog', path: '/blog' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Spacer to prevent layout shift when navbar becomes fixed/changes height */}
      <div className={`${isScrolled ? 'h-[72px]' : 'h-[112px]'} transition-all duration-300 hidden lg:block`} />

      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 font-sans ${
        isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-sm' : 'bg-white'
      }`}>
        
        {/* --- Top Banner (Hides on Scroll) --- */}
        <div className={`bg-[#7C3AED] text-slate-300 text-xs font-medium overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <a href="tel:+918827219873" className="flex items-center text-white transition-colors">
                <Phone size={12} className="mr-2" /> +91 8827219873
              </a>
              <span className="hidden sm:inline text-slate-600">|</span>
              <a href="mailto:techbytexsoftware@gmail.com" className="hidden sm:flex items-center text-white transition-colors">
                <Mail size={12} className="mr-2" /> techbytexsoftware@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Ready to scale?</span>
              <Link href="/book-demo" className="flex items-center text-white hover:text-[#A78BFA] transition-colors">
                Book a consultation <ArrowRight size={12} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* --- Main Header --- */}
        <div className="border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[72px]">
              
            <Link
  href="/"
  className="flex items-center gap-2 group"
  onClick={() => setIsMenuOpen(false)}
>
  {/* Logo Image */}
  <Image
    src="/hello.png"      // put logo in /public/logo.png
    alt="TechByteX Logo"
    width={40}
    height={40}
    className="rounded-md"
    priority
  />

  {/* Brand Text */}
  <div className="flex flex-col">
    <span className="text-xl font-bold text-slate-900 leading-none tracking-tight">
      TechByteX
    </span>
    <span className={`text-[10px] font-bold uppercase tracking-wider ${brandText}`}>
      Software Solutions
    </span>
  </div>
</Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center space-x-4">
                {/* <Link 
                  href="/login" 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link> */}
                <Link
                  href="/book-demo"
                  className={`${brandColor} ${brandHover} text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2`}
                >
                  <Calendar size={16} />
                  <span>Let&apos;s Connect</span>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Drawer (Slide Over) --- */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer Content */}
        <div className={`absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            
            {/* Drawer Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <span className="text-lg font-bold text-slate-900">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close navigation menu">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
                >
                  <span className="font-medium text-base">{item.name}</span>
                  <ChevronDown size={16} className={`transform -rotate-90 text-slate-300 group-hover:${brandText}`} />
                </Link>
              ))}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-5 border-t border-slate-100 space-y-3 bg-slate-50/50">
              <Link
                href="/book-demo"
                onClick={() => setIsMenuOpen(false)}
                className={`w-full ${brandColor} ${brandHover} text-white py-3.5 rounded-xl font-bold shadow-lg shadow-violet-200 flex items-center justify-center gap-2 transition-all`}
              >
                Let&apos;s Connect <ArrowRight size={18} />
              </Link>
              {/* <div className="text-center">
                <p className="text-xs text-slate-400 mt-2">Existing client? <Link href="/login" className={`font-semibold ${brandText}`}>Log in here</Link></p>
              </div> */}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
