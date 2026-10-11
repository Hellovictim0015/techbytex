import Link from "next/link";
import {
  CheckCircle2,
  MapPin,
  PhoneCall,
  MessageSquareText,
  Smartphone,
  Apple,
  Zap,
  ShieldCheck,
} from "lucide-react";
import JsonLd from "../components/JsonLd";
import {
  breadcrumbSchema,
  createMetadata,
  faqPageSchema,
  localBusinessSchema,
  singleServiceSchema,
} from "../lib/seo";

export const metadata = createMetadata({
  title: "App Development Company in Bhilai, Chhattisgarh",
  description:
    "TechByteX builds React Native Android and iOS apps for Bhilai businesses — steel-ancillary field service apps, retail and loyalty apps, healthcare booking apps, and delivery apps. Free quote.",
  path: "/app-development-bhilai",
  keywords: [
    "app development Bhilai",
    "React Native app development Bhilai",
    "Android app developer Bhilai",
    "iOS app developer Bhilai",
    "mobile app development company Bhilai",
  ],
});

const faqs = [
  {
    q: "Do you build both Android and iOS apps for Bhilai businesses?",
    a: "Yes. We use React Native to build a single app codebase that ships to both Android and iOS, which is faster and more cost-effective than building two separate native apps.",
  },
  {
    q: "What kind of apps do Bhilai businesses usually need?",
    a: "Common requests include field-service apps for steel-ancillary contractors, retail and loyalty apps for local shops, appointment/booking apps for clinics, and delivery or order-tracking apps for retail and food businesses.",
  },
  {
    q: "How much does app development cost in Bhilai?",
    a: "A focused MVP app typically starts around ₹60,000–₹1,50,000 depending on features and platform. We provide a fixed quote after understanding your requirements — no hourly surprises.",
  },
  {
    q: "How long does it take to build and publish an app?",
    a: "A well-scoped MVP usually takes 6–10 weeks from kickoff to Play Store and App Store submission, including testing and store approval time.",
  },
  {
    q: "Do you handle Play Store and App Store publishing?",
    a: "Yes, we handle the full submission process for both Google Play Store and Apple App Store, including store listing assets and compliance requirements.",
  },
  {
    q: "Can you add push notifications, payments, or maps to our app?",
    a: "Yes — push notifications, payment gateway integration, live location/maps, and analytics are all standard additions we build into Bhilai business apps.",
  },
];

const industries = [
  { name: "Steel & Industrial Ancillaries", note: "Field-service and job-tracking apps for contractors and technicians serving Bhilai's steel-ancillary economy." },
  { name: "Retail", note: "Loyalty, catalog, and order apps for Bhilai's retail businesses across Supela and Nehru Nagar." },
  { name: "Healthcare", note: "Appointment booking and patient-communication apps for clinics and diagnostic centers." },
  { name: "Delivery & Local Services", note: "Order-tracking and delivery-management apps for local service businesses." },
];

const whyUs = [
  "One React Native codebase — Android and iOS apps built together, faster and cheaper than native",
  "Secure authentication, API integration, and data handling built in from the start",
  "Performance-tested on real Android and iOS devices, not just simulators",
  "Play Store and App Store submission handled end-to-end",
  "Direct WhatsApp and call access to the team building your app",
  "Post-launch support and update packages available",
];

export default function AppDevelopmentBhilaiPage() {
  return (
    <div className="bg-white font-sans">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "App Development in Bhilai", path: "/app-development-bhilai" },
          ]),
          localBusinessSchema({ cityName: "Bhilai", path: "/app-development-bhilai", areaServed: "Bhilai" }),
          singleServiceSchema({
            name: "App Development in Bhilai",
            description: "React Native Android and iOS app development for Bhilai businesses.",
            path: "/app-development-bhilai",
            areaServed: "Bhilai",
          }),
          faqPageSchema(faqs),
        ]}
      />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 px-6 mt-16 lg:mt-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-bold tracking-widest uppercase mb-6">
            <MapPin size={14} /> Steel city of Chhattisgarh
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            App Development Company in Bhilai, Chhattisgarh
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mb-8">
            TechByteX builds React Native Android and iOS apps for Bhilai businesses — from steel-ancillary contractors who need field-service apps to retail brands that need loyalty and ordering apps. Need a website instead? See our{" "}
            <Link href="/web-development-bhilai" className="text-[#7C3AED] font-semibold underline">
              Website Development in Bhilai
            </Link>{" "}
            page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact" className="px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-bold shadow-lg shadow-violet-200 transition-all text-center">
              Get a Free Quote
            </Link>
            <a href="tel:+918827219873" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
              <PhoneCall size={18} /> +91 8827219873
            </a>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-slate-600 leading-relaxed">
          <p>
            Bhilai is one of Chhattisgarh&apos;s largest cities, built around the Bhilai Steel Plant (SAIL) and a wide ecosystem of ancillary suppliers, contractors, retail businesses, and healthcare providers across Nehru Nagar, Supela, Vaishali Nagar, and Civic Center. As more of this economy moves onto mobile — from field-service coordination to retail loyalty programs — Bhilai businesses that ship a working app before their competitors gain a real advantage.
          </p>
          <p>
            We build with React Native so your app ships to both Android and iOS from a single codebase, which keeps development cost and timeline realistic for small and mid-sized Bhilai businesses without compromising on native-feeling performance. Every app we ship includes secure authentication, tested API integration, and a clear plan for Play Store and App Store publishing.
          </p>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Why Bhilai Businesses Choose TechByteX
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {whyUs.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle2 size={20} className="text-[#7C3AED] shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
          Apps We Build for Bhilai Industries
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {industries.map((ind, i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-2">{ind.name}</h3>
              <p className="text-slate-500">{ind.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform features */}
      <section className="py-20 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">What&apos;s Included</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <Smartphone className="text-[#7C3AED] mb-4" size={28} />
              <h3 className="font-bold text-slate-900 mb-2">Android & iOS, One Codebase</h3>
              <p className="text-slate-500 text-sm">React Native lets us ship to both platforms without doubling your budget or timeline.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <Zap className="text-[#7C3AED] mb-4" size={28} />
              <h3 className="font-bold text-slate-900 mb-2">Real-Device Performance Testing</h3>
              <p className="text-slate-500 text-sm">We test on actual Android and iOS devices, not just simulators, before launch.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <ShieldCheck className="text-[#7C3AED] mb-4" size={28} />
              <h3 className="font-bold text-slate-900 mb-2">Secure by Default</h3>
              <p className="text-slate-500 text-sm">Secure authentication, encrypted data handling, and API best practices built in.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <Apple className="text-[#7C3AED] mb-4" size={28} />
              <h3 className="font-bold text-slate-900 mb-2">Store Submission Handled</h3>
              <p className="text-slate-500 text-sm">We manage Play Store and App Store listings, assets, and compliance for you.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <CheckCircle2 className="text-[#7C3AED] mb-4" size={28} />
              <h3 className="font-bold text-slate-900 mb-2">Push Notifications & Payments</h3>
              <p className="text-slate-500 text-sm">Engagement and monetization features integrated where your app needs them.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <MessageSquareText className="text-[#7C3AED] mb-4" size={28} />
              <h3 className="font-bold text-slate-900 mb-2">Direct Team Access</h3>
              <p className="text-slate-500 text-sm">Talk to the developers building your app directly over WhatsApp or call — no account managers in between.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 text-center mb-12">
          Common questions from Bhilai businesses about app development.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-slate-200 rounded-2xl p-6 open:bg-[#7C3AED]/5 open:border-[#7C3AED]">
              <summary className="font-bold text-lg text-slate-900 cursor-pointer list-none flex items-center justify-between gap-4">
                {faq.q}
                <span className="text-[#7C3AED] group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
              </summary>
              <p className="text-slate-600 leading-relaxed mt-4">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto bg-[#7C3AED] rounded-[2.5rem] p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to build your app in Bhilai?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Get a free consultation and a clear, fixed quote — no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-4 bg-white text-[#7C3AED] rounded-full font-bold hover:bg-slate-100 transition-all shadow-lg">
                Start a Project
              </Link>
              <a
                href="https://wa.me/918827219873"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#7C3AED] border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquareText size={18} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
