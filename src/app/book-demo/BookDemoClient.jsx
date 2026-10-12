"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

// The services you offer (customize these)
const serviceOptions = [
  "Web Development",
  "Mobile App Development",
  "Ecommerce Development",
  "React Native App Development",
  "Next.js Development",
  "Shopify Development",
  "UI/UX Design",
  "Custom Software Development",
  "AI Development",
  "Consulting/Strategy",
];

const ConsultationForm = () => {
  // 1. State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    number: "",
    serviceType: "",
    message: "",
  });

  // 2. State for UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, formType: "book_demo" }),
      });

      if (!res.ok) {
        throw new Error("Failed to send email");
      }

      // Reset form and show success message
      setFormData({ fullName: "", email: "", number: "", serviceType: "", message: "" });
      setIsSubmitting(false);
      setIsSuccess(true);

      // Hide success message after 5 seconds (optional)
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <section className="py-16 bg-slate-50 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="inline-block py-1 px-3 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-sm font-semibold mb-4">
          Get Started
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Book Your Free Consultation
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Tell us a little about your project. We&apos;ll review your needs and get back
          to you within 24 hours to schedule a chat.
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        
        {/* Success Message Overlay */}
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Request Sent!
            </h3>
            <p className="text-slate-600">
              Thank you. We have received your details and will be in touch
              shortly to coordinate a time.
            </p>
          </div>
        ) : (
          /* The Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Chandan Bhardwaj"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all"
              />
            </div>


            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="techbytexsoftware@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="number"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="e.g. +91 88XXXXXXXX"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Service Type Select */}
            <div>
              <label
                htmlFor="serviceType"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                What service are you interested in? <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceType"
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all text-slate-600"
              >
                <option value="" disabled>
                  Select a service...
                </option>
                {serviceOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Project Details & Preferred Times
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Briefly describe your project needs and list a few times that work best for you..."
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Sending Request...
                </>
              ) : (
                <>
                  Request Consultation <Send size={18} />
                </>
              )}
            </button>
            {/* <p className="text-center text-xs text-slate-500 mt-4">
                We respect your privacy. No spam, ever.
            </p> */}
          </form>
        )}
      </div>
    </section>
  );
};

export default ConsultationForm;
