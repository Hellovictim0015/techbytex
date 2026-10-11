import JsonLd from "../components/JsonLd";
import { contactFaqs } from "../data/contactFaqs";
import { breadcrumbSchema, createMetadata, faqPageSchema, SITE_URL } from "../lib/seo";
import ContactPageClient from "./ContactPageClient";

export const metadata = createMetadata({
  title: "Contact TechByteX",
  description:
    "Contact TechByteX for app development, website development, ecommerce development, React Native apps, Next.js development, Shopify development, and custom software projects.",
  path: "/contact",
  keywords: ["hire app developer", "hire website developer", "software development consultation"],
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
    },
  };

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]), contactSchema, faqPageSchema(contactFaqs)]} />
      <ContactPageClient />
    </>
  );
}
