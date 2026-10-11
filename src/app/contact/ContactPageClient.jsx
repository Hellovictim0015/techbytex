"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  ArrowRight,
  Plus,
  Minus
} from "lucide-react";
import Image from "next/image";
import { contactFaqs } from "../data/contactFaqs";

// --- Contact Info Cards Data ---
const contactInfo = [
  {
    icon: <Mail size={24} />,
    title: "Email Us",
    detail: "techbytexsoftware@gmail.com",
    sub: "We reply within 24 hours",
    link: "mailto:techbytexsoftware@gmail.com"
  },
  {
    icon: <Phone size={24} />,
    title: "Call Us",
    detail: "+91-8827219873 , +91-9113782087",
    sub: "Mon-Fri, 9am - 6pm EST",
    link: "tel:+918827219873"
  },
  {
    icon: <MapPin size={24} />,
    title: "Visit Us",
    detail: "Dalli Rajhara",
    sub: "View on Google Maps",
    link: "#"
  }
];

// --- FAQ Data (also used for FAQPage schema in page.js) ---
const faqs = contactFaqs;

const ContactPage = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);


  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  projectType: "",
  message: "",
});

const [loading, setLoading] = useState(false);
const [sent, setSent] = useState(false);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) throw new Error("Failed");

    setSent(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      projectType: "",
      message: "",
    });
  } catch (err) {
    alert("Email not sent");
  } finally {
    setLoading(false);
  }
};


  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <div className="bg-white font-sans overflow-hidden">
      
      {/* --- Section 1: Hero --- */}
     <section className="relative py-20 lg:py-28 px-6 text-center mt-10 lg:mt-0">

        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6"
          >
            Contact Us
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Let&apos;s start a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-violet-500">
              conversation.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Have a project in mind? We&apos;d love to hear about it. Send us a message and we&apos;ll get back to you as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* --- Section 2: Info Cards --- */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {contactInfo.map((item, index) => (
            <motion.a 
              href={item.link}
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#7C3AED]/10 hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 mx-auto bg-[#7C3AED]/10 text-[#7C3AED] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-[#7C3AED] font-medium text-lg mb-1">{item.detail}</p>
              <p className="text-slate-400 text-sm">{item.sub}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* --- Section 3: Contact Form & Map/Image --- */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
          
          {/* Form Side */}
          <div>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Send us a message</h2>
              <p className="text-slate-500">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-slate-700">First Name</label>
                  <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-slate-700">Last Name</label>
                  <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all" />
              </div>

              <div className="space-y-2">
                <label htmlFor="projectType" className="text-sm font-semibold text-slate-700">Project Type</label>
                <select id="projectType" name="projectType" required value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all text-slate-600">
                  <option value="">Select a service</option>
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>Ecommerce Development</option>
                  <option>React Native App Development</option>
                  <option>Next.js Development</option>
                  <option>Shopify Development</option>
                  <option>Custom Software Development</option>
                  <option>UI/UX Design</option>
                  <option>Consulting</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</label>
                <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Tell us about your project..." className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all resize-none"></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-lg shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Sending...
                    <Send size={18} className="animate-spin ml-2" />
                  </>
                ) : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Image / CTA Side */}
          <div className="flex flex-col justify-between">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Connect Instantly</h3>
              <div className="space-y-4">
                <a href="https://wa.me/918827219873" className="flex items-center justify-between p-4 bg-[#F0FDF4] text-[#16A34A] rounded-xl hover:bg-[#DCFCE7] transition-colors cursor-pointer border border-transparent hover:border-[#16A34A]/20">
                  <div className="flex items-center gap-3">
                    <MessageCircle size={24} />
                    <span className="font-bold">Chat on WhatsApp</span>
                  </div>
                  <ArrowRight size={20} />
                </a>
                <a href="tel:+918827219873" className="flex items-center justify-between p-4 bg-[#F8FAFC] text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-300">
                  <div className="flex items-center gap-3">
                    <Phone size={24} />
                    <span className="font-bold">Call Support</span>
                  </div>
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>

            {/* Decorative Image */}
            <div className="relative h-full min-h-[300px] rounded-3xl overflow-hidden shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80" 
                alt="Office Meeting" 
                fill 
                className="absolute inset-0 w-full h-full object-cover"
                sizes="(max-width: 800px) 100vw, 800px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <p className="text-white font-medium text-lg">
                  &quot;TechByteX transformed our business. Their team is simply world-class.&quot;
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- Section 4: FAQ --- */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-500">Everything you need to know about working with us.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border rounded-2xl transition-all duration-300 ${
                activeAccordion === index 
                ? "bg-[#7C3AED]/5 border-[#7C3AED]" 
                : "bg-white border-slate-200 hover:border-[#7C3AED]/50"
              }`}
            >
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className={`font-bold text-lg ${activeAccordion === index ? "text-[#7C3AED]" : "text-slate-900"}`}>
                  {faq.q}
                </span>
                {activeAccordion === index ? (
                  <Minus size={20} className="text-[#7C3AED]" />
                ) : (
                  <Plus size={20} className="text-slate-400" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeAccordion === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
