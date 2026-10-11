"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  FileText, 
  Mail,
  ArrowRight
} from "lucide-react";

// --- Policy Content Data ---
// Customize the [Bracketed Text] with your actual details.
const policySections = [
  {
    id: "introduction",
    title: "1. Introduction",
    icon: <Shield size={20} />,
    content: (
      <>
        <p>
          Welcome to TechByteX (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (techbytex.in) or use our services, and tell you about your privacy rights and how the law protects you.
        </p>
        <p>
          By using our Services, you agree to the collection and use of information in accordance with this policy.
        </p>
      </>
    )
  },
  {
    id: "collection",
    title: "2. Information We Collect",
    icon: <Database size={20} />,
    content: (
      <>
        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">Personal Data</h3>
        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (&quot;Personal Data&quot;). Generally, this includes:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Business name and job title</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">Usage Data</h3>
        <p>We may also collect information how the Service is accessed and used (&quot;Usage Data&quot;). This Usage Data may include information such as your computer&apos;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
      </>
    )
  },
  {
    id: "use-of-data",
    title: "3. How We Use Your Data",
    icon: <FileText size={20} />,
    content: (
      <>
        <p>TechByteX uses the collected data for various purposes:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>To provide and maintain the Service.</li>
          <li>To notify you about changes to our Service.</li>
          <li>To allow you to participate in interactive features of our Service when you choose to do so.</li>
          <li>To provide customer care and support.</li>
          <li>To provide analysis or valuable information so that we can improve the Service.</li>
          <li>To monitor the usage of the Service.</li>
          <li>To detect, prevent and address technical issues.</li>
        </ul>
      </>
    )
  },
  {
    id: "sharing",
    title: "4. Data Sharing & Disclosure",
    icon: <Eye size={20} />,
    content: (
      <>
        <p>We do not sell your personal data to third parties. We may employ third party companies and individuals to facilitate our Service (&quot;Service Providers&quot;), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
        <p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
        <p>We may also disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
      </>
    )
  },
  {
    id: "security",
    title: "5. Data Security",
    icon: <Lock size={20} />,
    content: (
      <>
        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        <p>We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption of data in transit and at rest where appropriate.</p>
      </>
    )
  },
  {
    id: "rights",
    title: "6. Your Data Rights",
    icon: <UserCheck size={20} />,
    content: (
      <>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
          <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
        </ul>
      </>
    )
  },
  {
    id: "contact",
    title: "7. Contact Us",
    icon: <Mail size={20} />,
    content: (
      <>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul className="list-none pl-0 space-y-3 mt-4">
          <li className="flex items-center gap-3">
            <span className="font-bold text-slate-900">By email:</span> 
            <a href="mailto:privacy@techbytex.in" className="text-[#7C3AED] hover:underline">privacy@techbytex.in</a>
          </li>
          <li className="flex items-start gap-3">
             <span className="font-bold text-slate-900 whitespace-nowrap">By mail:</span>
             <span>TechByteX Inc., [Your Physical Address Building], [City, State, Zip Code]</span>
          </li>
        </ul>
      </>
    )
  },
];

const PrivacyPolicyPage = () => {
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
            <Shield size={14} /> Legal Document
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
          >
            Privacy Policy
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto"
          >
            Last updated: <span className="font-semibold text-slate-700">[Month Day, Year]</span>
            <br />
            We are committed to protecting your data and your privacy.
          </motion.p>
        </div>
      </section>

      {/* --- Main Content Layout --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Sidebar Navigation (Sticky on Desktop) */}
          <aside className="hidden lg:block sticky top-24">
            <nav className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 ml-2">Contents</h3>
              <ul className="space-y-1">
                {policySections.map((section) => (
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
              {policySections.map((section, index) => (
                <motion.div 
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="scroll-mt-24" // Offset for sticky header if you have one
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
                <p className="text-slate-600 mb-4">Still have questions about how we handle your data?</p>
                <Link href="/contact" className="inline-flex px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full font-bold transition-all shadow-lg shadow-violet-200/50">
                    Contact Our Privacy Team
                </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicyPage;