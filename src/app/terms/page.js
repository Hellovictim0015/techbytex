"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Scale, 
  CheckCircle, 
  RefreshCw, 
  User, 
  ShieldAlert, 
  Ban,
  Gavel,
  Mail,
  ArrowRight,
  ScrollText
} from "lucide-react";

// --- Terms of Service Content Data ---
// CUSTOMIZE ALL BRACKETED TEXT [ ] WITH YOUR REAL DATA.
const termsSections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: <CheckCircle size={20} />,
    content: (
      <>
        <p>
          By accessing or using the website located at techbytex.in (the &quot;Site&quot;) and any services provided by TechByteX (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), collectively referred to as the &quot;Services,&quot; you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
        </p>
        <p className="font-medium text-slate-900">
          If you do not agree to all of these Terms, do not access or use the Services.
        </p>
        <p>
          We reserve the right to refuse service to anyone for any reason at any time.
        </p>
      </>
    )
  },
  {
    id: "changes",
    title: "2. Changes to Terms",
    icon: <RefreshCw size={20} />,
    content: (
      <>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        <p>
          By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
        </p>
      </>
    )
  },
  {
    id: "accounts",
    title: "3. User Accounts & Conduct",
    icon: <User size={20} />,
    content: (
      <>
        <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
        <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">You agree not to:</h3>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Use the Services for any illegal purpose or in violation of any local, state, national, or international law.</li>
          <li>Violate, or encourage others to violate, any right of a third party, including by infringing or misappropriating any third-party intellectual property right.</li>
          <li>Interfere with security-related features of the Services, including by disabling or circumventing features that prevent or limit use or copying of any content.</li>
        </ul>
      </>
    )
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    icon: <ScrollText size={20} />,
    content: (
      <>
        <p>
          The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of TechByteX and its licensors. The Service is protected by copyright, trademark, and other laws of both [Your Country] and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TechByteX.
        </p>
      </>
    )
  },
  {
    id: "liability",
    title: "5. Limitation of Liability",
    icon: <ShieldAlert size={20} />,
    content: (
      <>
        <p className="uppercase text-sm font-bold text-slate-900 tracking-wider mb-2">Read this section carefully.</p>
        <p>
          In no event shall TechByteX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service; and</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.</li>
        </ul>
      </>
    )
  },
  {
    id: "termination",
    title: "6. Termination",
    icon: <Ban size={20} />,
    content: (
      <>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p>
          Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
        </p>
      </>
    )
  },
  {
    id: "governing-law",
    title: "7. Governing Law",
    icon: <Gavel size={20} />,
    content: (
      <>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </p>
      </>
    )
  },
  {
    id: "contact",
    title: "8. Contact Us",
    icon: <Mail size={20} />,
    content: (
      <>
        <p>If you have any questions about these Terms, please contact us:</p>
        <ul className="list-none pl-0 space-y-3 mt-4">
          <li className="flex items-center gap-3">
            <span className="font-bold text-slate-900">By email:</span> 
            <a href="mailto:legal@techbytex.in" className="text-[#7C3AED] hover:underline">legal@techbytex.in</a>
          </li>
        </ul>
      </>
    )
  },
];

const TermsOfServicePage = () => {
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
            <Scale size={14} /> Legal Document
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
          >
            Terms of Service
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            Please read these terms carefully before using our services.
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
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 ml-2">Agreement</h3>
              <ul className="space-y-1">
                {termsSections.map((section) => (
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

          {/* Terms Content Area */}
          <div className="max-w-4xl">
            <div className="space-y-16">
              {termsSections.map((section, index) => (
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
                <p className="text-slate-600 mb-4 font-medium">Not sure about something in these terms?</p>
                <Link href="/contact" className="inline-flex px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-bold transition-all shadow-lg shadow-violet-200/50">
                    Contact Our Legal Team
                </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default TermsOfServicePage;