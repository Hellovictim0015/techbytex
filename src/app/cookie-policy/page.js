"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Cookie, 
  Settings, 
  ListChecks, 
  Share2, 
  SlidersHorizontal, 
  RefreshCw,
  Mail,
  ArrowRight,
  Info
} from "lucide-react";

// --- Cookie Policy Content Data ---
// CUSTOMIZE ALL BRACKETED TEXT [ ] WITH YOUR REAL DATA.
const cookieSections = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    icon: <Cookie size={20} />,
    content: (
      <>
        <p>
          Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
        </p>
        <p>
          They allow the website to remember your actions and preferences (such as login, language, font size and other display preferences) over a period of time, so you don’t have to keep re-entering them whenever you come back to the site or browse from one page to another.
        </p>
      </>
    )
  },
  {
    id: "why-we-use",
    title: "2. Why We Use Cookies",
    icon: <Settings size={20} />,
    content: (
      <>
        <p>
          We use cookies to improve your browsing experience by:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Recognizing when you log in and any preferred settings.</li>
          <li>Giving you a browsing experience that is unique to you and to serve you content which we believe improves your site experience.</li>
          <li>Analyzing how your use our site which helps us to troubleshoot any problems and to monitor our own performance.</li>
        </ul>
      </>
    )
  },
  {
    id: "types-used",
    title: "3. Types of Cookies We Use",
    icon: <ListChecks size={20} />,
    content: (
      <>
        <p>We use the following types of cookies on our website:</p>
        
        <div className="mt-6 space-y-6">
            <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-[#7C3AED]"></span> Strictly Necessary Cookies
                </h4>
                <p>These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site. These cookies will generally be first-party session cookies.</p>
            </div>
            
            <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Performance & Analytics Cookies
                </h4>
                <p>These cookies collect information about how you use our website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized.</p>
            </div>

            <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span> Functionality Cookies
                </h4>
                <p>These cookies allow our website to remember choices you have made in the past, like what language you prefer, what region you would like weather reports for, or what your user name and password are so you can automatically log in.</p>
            </div>
        </div>
      </>
    )
  },
  {
    id: "third-party",
    title: "4. Third-Party Cookies",
    icon: <Share2 size={20} />,
    content: (
      <>
        <p>
          In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
        </p>
        <p>
          This site uses [e.g., Google Analytics] which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
        </p>
      </>
    )
  },
  {
    id: "managing",
    title: "5. Managing Your Preferences",
    icon: <SlidersHorizontal size={20} />,
    content: (
      <>
        <p>
          You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
        </p>
        <p>
          To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] hover:underline font-medium">wikipedia.org, www.allaboutcookies.org, or www.aboutcookies.org.</a>
        </p>
      </>
    )
  },
  {
    id: "changes",
    title: "6. Changes to This Policy",
    icon: <RefreshCw size={20} />,
    content: (
      <>
        <p>
          We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes.
        </p>
      </>
    )
  },
  {
    id: "contact",
    title: "7. Contact Us",
    icon: <Mail size={20} />,
    content: (
      <>
        <p>If you have any questions about our use of cookies, please contact us:</p>
        <ul className="list-none pl-0 space-y-3 mt-4">
          <li className="flex items-center gap-3">
            <span className="font-bold text-slate-900">By email:</span> 
            <a href="mailto:privacy@techbytex.in" className="text-[#7C3AED] hover:underline">privacy@techbytex.in</a>
          </li>
        </ul>
      </>
    )
  },
];

const CookiePolicyPage = () => {
  return (
    <div className="bg-white font-sans min-h-screen">
      
      {/* --- Header Section --- */}
      <section className="relative pt-32 pb-20 px-6 bg-slate-50 border-b border-slate-100 overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Info size={14} /> Policy Document
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
          >
            Cookie Policy
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            Information about how we use cookies on our website.
            <br/>
            Last updated: <span className="font-semibold text-slate-700">[Month Day, Year]</span>
          </motion.p>
        </div>
      </section>

      {/* --- Main Content Layout --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Sidebar Navigation (Sticky on Desktop) */}
          <aside className="hidden lg:block sticky top-24">
            <nav className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 ml-2">On this page</h3>
              <ul className="space-y-1">
                {cookieSections.map((section) => (
                  <li key={section.id}>
                    <a 
                      href={`#${section.id}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all group"
                    >
                      <span className="text-slate-400 group-hover:text-[#7C3AED] transition-colors">
                        {section.icon}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link href="/contact" className="flex items-center gap-2 text-sm font-bold text-[#7C3AED] hover:gap-3 transition-all">
                  Have questions? <ArrowRight size={16} />
                </Link>
              </div>
            </nav>
          </aside>

          {/* Policy Content Area */}
          <div className="max-w-4xl">
            <div className="space-y-16">
              {cookieSections.map((section, index) => (
                <motion.div 
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  // scroll-mt-32 ensures the header isn't hidden behind fixed navbars when clicking sidebar links
                  className="scroll-mt-32" 
                >
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                        {section.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="text-slate-600 text-lg leading-relaxed space-y-4">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="mt-16 p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-slate-600 mb-4 font-medium">Need more details regarding cookies?</p>
                <Link href="/contact" className="inline-flex px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-bold transition-all shadow-lg shadow-violet-200/50">
                    Contact Us
                </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default CookiePolicyPage;