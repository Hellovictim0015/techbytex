"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  Loader2,
  PhoneCall,
  FileText,
  Rocket,
} from "lucide-react";
import { contactFaqs } from "../data/contactFaqs";
import { TechToy, BRAND } from "../components/services/Toys";

const ease = [0.22, 1, 0.36, 1];
const WHATSAPP = `https://wa.me/918827219873?text=${encodeURIComponent("Hi TechByteX, I'd like to discuss a project.")}`;
const MAPS = "https://www.google.com/maps/search/?api=1&query=Dalli+Rajhara+Chhattisgarh+491228";

const PROJECT_TYPES = [
  "Web Development",
  "Mobile App Development",
  "Ecommerce Development",
  "React Native App Development",
  "Next.js Development",
  "Shopify Development",
  "Custom Software Development",
  "AI Development",
  "UI/UX Design",
  "Consulting",
  "Other",
];

const BUDGETS = ["Under ₹25,000", "₹25,000 – ₹75,000", "₹75,000 – ₹2,00,000", "Above ₹2,00,000", "Not sure yet"];

const QUICK = [
  { Icon: MessageCircle, label: "WhatsApp", value: "Chat now", href: WHATSAPP, external: true },
  { Icon: Phone, label: "Call", value: "+91 8827219873", href: "tel:+918827219873" },
  { Icon: Mail, label: "Email", value: "techbytexsoftware@gmail.com", href: "mailto:techbytexsoftware@gmail.com" },
];

const NEXT_STEPS = [
  { Icon: Mail, title: "We reply", text: "Usually the same day, within 24 hours at most." },
  { Icon: PhoneCall, title: "Free call", text: "A short call to understand your business and goals." },
  { Icon: FileText, title: "Fixed quote", text: "A clear scope, timeline and price — no hidden costs." },
  { Icon: Rocket, title: "We build", text: "Design, development and launch, with updates all along." },
];

const EMPTY = { firstName: "", lastName: "", email: "", phone: "", projectType: "", budget: "", message: "" };

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/10";

function Field({ label, htmlFor, optional, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-700">
        {label} {optional && <span className="font-normal text-slate-400">(optional)</span>}
      </label>
      {children}
    </div>
  );
}

const ContactPage = () => {
  const [formData, setFormData] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectType) {
      setError("Please pick what you need help with.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, formType: "contact" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.error || "Could not send your message.");
      setSent(true);
      setFormData(EMPTY);
    } catch (err) {
      setError(`${err.message} Please try again, or WhatsApp / call us at +91 8827219873.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-[#FBFAFF] px-6 pb-16 pt-32 lg:pt-36">
        <div
          className="pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(#7C3AED12 1px, transparent 1px), linear-gradient(90deg, #7C3AED12 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[120px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block rounded-full bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#7C3AED]"
          >
            Contact TechByteX
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl"
          >
            Let&apos;s build something <span className="font-serif font-normal italic text-[#7C3AED]">together</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-slate-500"
          >
            Tell us about your website, app or software idea. We usually reply the same day with next steps and a clear,
            fixed quote.
          </motion.p>

          {/* quick contact pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            {QUICK.map(({ Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:shadow-lg hover:shadow-[#7C3AED]/10"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] transition-colors group-hover:bg-[#7C3AED] group-hover:text-white">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</span>
                  <span className="block truncate text-sm font-bold text-slate-800">{value}</span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- Form + info ---------------- */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.35fr_1fr]">
          {/* form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-[#7C3AED]/5 sm:p-10"
          >
            {/* No exit animation: the success card must appear even in a background tab. */}
            <>
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                    <TechToy size={84} shirt={BRAND} badge={<CheckCircle2 size={20} strokeWidth={2.75} />} />
                  </motion.div>
                  <h2 className="mt-6 text-3xl font-bold text-slate-900">Message received!</h2>
                  <p className="mt-3 max-w-md text-slate-500">
                    Thanks for reaching out. Our team will reply within 24 hours — usually much sooner. For anything urgent,
                    WhatsApp us.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#7C3AED] px-6 py-3 font-bold text-white hover:bg-[#6D28D9]"
                    >
                      <MessageCircle size={18} /> WhatsApp us
                    </a>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-600 hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
                    >
                      Send another message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                      Tell us about your <span className="font-serif font-normal italic text-[#7C3AED]">project</span>
                    </h2>
                    <p className="mt-2 text-slate-500">Takes under a minute. We&apos;ll get back to you within 24 hours.</p>
                  </div>

                  {/* what do you need — clickable chips */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-700">What do you need?</p>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project type">
                      {PROJECT_TYPES.map((t) => {
                        const active = formData.projectType === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => {
                              setFormData({ ...formData, projectType: t });
                              setError("");
                            }}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                              active
                                ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30"
                                : "border border-slate-200 bg-white text-slate-600 hover:border-[#7C3AED]/40 hover:text-[#7C3AED]"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="First name" htmlFor="firstName">
                      <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="Rahul" className={inputCls} />
                    </Field>
                    <Field label="Last name" htmlFor="lastName" optional>
                      <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Sharma" className={inputCls} />
                    </Field>
                    <Field label="Email" htmlFor="email">
                      <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@business.com" className={inputCls} />
                    </Field>
                    <Field label="Phone / WhatsApp" htmlFor="phone" optional>
                      <input id="phone" name="phone" type="tel" inputMode="tel" value={formData.phone} onChange={handleChange} placeholder="98XXXXXXXX" className={inputCls} />
                    </Field>
                  </div>

                  <Field label="Budget" htmlFor="budget" optional>
                    <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={`${inputCls} text-slate-600`}>
                      <option value="">Select a range</option>
                      {BUDGETS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Project details" htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What are you building? Any features, deadline or reference websites/apps you like?"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>

                  {error && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] py-4 font-bold text-white shadow-lg shadow-[#7C3AED]/25 transition-all hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        Sending <Loader2 size={18} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Send message <Send size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400">We never share your details. No spam, ever.</p>
                </motion.form>
              )}
            </>
          </motion.div>

          {/* info column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#7C3AED]/40 blur-3xl" />
              <h3 className="relative font-serif text-2xl italic">What happens next?</h3>
              <ol className="relative mt-6 space-y-5">
                {NEXT_STEPS.map(({ Icon, title, text }, i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED] text-white">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="font-bold">
                        <span className="mr-1 font-serif italic text-[#A78BFA]">{i + 1}.</span> {title}
                      </p>
                      <p className="text-sm text-slate-400">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8">
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
                  <MapPin size={18} />
                </span>
                <span>
                  <span className="block font-bold text-slate-900">Office</span>
                  <span className="block text-sm text-slate-500">Dalli Rajhara, Balod, Chhattisgarh 491228</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#7C3AED] group-hover:underline">
                    Open in Google Maps <ArrowRight size={14} />
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#7C3AED]">
                  <Clock size={18} />
                </span>
                <span>
                  <span className="block font-bold text-slate-900">Working hours</span>
                  <span className="block text-sm text-slate-500">Monday – Saturday, 9 AM – 6 PM (IST)</span>
                  <span className="block text-sm text-slate-500">WhatsApp messages answered every day</span>
                </span>
              </div>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-[#F0FDF4] p-4 font-bold text-[#16A34A] transition-colors hover:bg-[#DCFCE7]"
              >
                <span className="flex items-center gap-3">
                  <MessageCircle size={22} /> Chat on WhatsApp
                </span>
                <ArrowRight size={18} />
              </a>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <iframe
                title="TechByteX location — Dalli Rajhara, Chhattisgarh"
                src="https://www.google.com/maps?q=Dalli+Rajhara,+Chhattisgarh+491228&output=embed"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-[#FBFAFF] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#7C3AED]">FAQ</span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Before you <span className="font-serif font-normal italic text-[#7C3AED]">reach out</span>
            </h2>
          </div>
          <div className="space-y-3">
            {contactFaqs.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border bg-white transition-colors ${open ? "border-[#7C3AED]/40" : "border-slate-200 hover:border-[#7C3AED]/30"}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className={`font-bold ${open ? "text-[#7C3AED]" : "text-slate-900"}`}>{faq.q}</span>
                    <Plus size={20} className={`shrink-0 text-[#7C3AED] transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 leading-relaxed text-slate-600">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
