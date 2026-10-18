"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Phone, MessageCircle, CheckCircle2 } from "lucide-react"; // Imported icons

const ContactSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  // Quick email capture — saved to Admin → Leads and emailed to the team.
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, formType: "get_in_touch", message: "Requested a call back from the homepage." }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || "Could not send. Please try WhatsApp or call.");
        setStatus("error");
        return;
      }
      setEmail("");
      setStatus("sent");
    } catch {
      setError("Could not send. Please try WhatsApp or call.");
      setStatus("error");
    }
  }

  return (
    <section className="py-20 px-4 flex justify-center items-center bg-white font-sans">

      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-[#F4F1FF] rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-slate-100">

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
             style={{ backgroundImage: 'radial-gradient(#7C3AED 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        {/* Soft Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />

        {/* --- Left Side: Showcase Image --- */}
        <div className="relative z-10 w-full lg:w-1/2 flex justify-center lg:justify-start mb-12 lg:mb-0">
          <div className="relative w-full max-w-lg aspect-[3/2] rounded-3xl overflow-hidden shadow-xl ring-1 ring-[#7C3AED]/10">
            <Image
              src="/techbytex-build-your-ideas.webp"
              alt="TechByteX web development, mobile app, UI/UX design and software solutions on desktop, laptop and phone"
              fill
              sizes="(max-width: 1024px) 100vw, 512px"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </div>

        {/* --- Right Side: Content & Form --- */}
        <div className="relative z-10 w-full lg:w-1/2 text-center lg:text-left pl-0 lg:pl-10">

          <span className="inline-block py-1.5 px-4 rounded-full bg-white text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6 shadow-sm border border-slate-100">
            Let&apos;s Initiate
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Let&apos;s Discuss Your <br className="hidden md:block"/>
            Next Big Idea
          </h2>

          <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
            Hundreds of businesses have trusted us. Now it&apos;s your turn to take the leap.
          </p>

          {/* Email Input Form */}
          {status === "sent" ? (
            <div className="max-w-md mx-auto lg:mx-0 bg-white p-4 rounded-2xl shadow-lg mb-6 flex items-center gap-3 text-left">
              <CheckCircle2 className="shrink-0 text-green-600" size={22} />
              <p className="text-slate-700 text-sm">
                Thanks! We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto lg:mx-0 bg-white p-2 rounded-2xl shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email address"
                  placeholder="Enter your mail .."
                  className="flex-1 bg-transparent px-6 py-3 text-slate-700 placeholder-slate-400 focus:outline-none rounded-full border border-slate-200 sm:border-none"
                />

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
                  aria-label="Get in touch with TechByteX"
                >
                  {status === "sending" ? "Sending..." : "Get In Touch"}
                </button>
              </div>
              {status === "error" && <p className="px-4 pt-2 text-sm text-red-600 text-left">{error}</p>}
            </form>
          )}


          {/* --- NEW: WhatsApp & Call Options --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
  <p className="text-sm font-semibold text-slate-400">
    connect
  </p>

  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

    {/* WhatsApp Button */}
    <a
      href="https://wa.me/918827219873"
      target="_blank"
      rel="noreferrer"
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
    >
      <MessageCircle size={18} />
      WhatsApp
    </a>

    {/* Call Button */}
    <a
      href="tel:+918827219873"
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-700 hover:bg-slate-800 hover:text-white border border-slate-200 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
    >
      <Phone size={18} />
      Call Now
    </a>

  </div>
</div>


        </div>

      </div>
    </section>
  );
};

export default ContactSection;
