import JsonLd from "../components/JsonLd";
import { contactFaqs } from "../data/contactFaqs";
import { breadcrumbSchema, createMetadata, faqPageSchema, SITE_URL } from "../lib/seo";
import ContactPageClient from "./ContactPageClient";

export const metadata = createMetadata({
  title: "Contact Us — Get a Free Quote for Your Website or App",
  description:
    "Contact TechByteX in Dalli Rajhara, Chhattisgarh for website development, mobile apps, ecommerce, React Native, Next.js and custom software. Call or WhatsApp +91 8827219873 for a free, fixed quote.",
  path: "/contact",
  keywords: [
    "contact TechByteX",
    "hire app developer",
    "hire website developer",
    "website development quote",
    "software development consultation",
    "web developer near me Chhattisgarh",
  ],
});

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact TechByteX",
    url: `${SITE_URL}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "TechByteX",
      email: "techbytexsoftware@gmail.com",
      telephone: "+91-8827219873",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dalli Rajhara",
        addressRegion: "Chhattisgarh",
        postalCode: "491228",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: "+91-8827219873",
        email: "techbytexsoftware@gmail.com",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
    },
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]), contactSchema, faqPageSchema(contactFaqs)]} />
      <ContactPageClient />
    </>
  );
}
