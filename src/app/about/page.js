import JsonLd from "../components/JsonLd";
import { team } from "../data/team";
import { absoluteUrl, breadcrumbSchema, createMetadata, SITE_NAME } from "../lib/seo";
import AboutPageClient from "./AboutPageClient";

export const metadata = createMetadata({
  title: "About TechByteX",
  description:
    "TechByteX is a software development company building high-performance websites, mobile apps, ecommerce platforms, Shopify stores, AI products, and custom software.",
  path: "/about",
  keywords: ["software development company", "web development company", "mobile app development company"],
});

export default function AboutPage() {
  const teamSchema = team.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    image: absoluteUrl(member.image),
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          ...teamSchema,
        ]}
      />
      <AboutPageClient />
    </>
  );
}
