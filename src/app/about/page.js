import JsonLd from "../components/JsonLd";
import { team } from "../data/team";
import { services } from "../data/services";
import { cities } from "../data/cities";
import { getVisiblePortfolio } from "../lib/portfolio";
import {
  absoluteUrl,
  breadcrumbSchema,
  createMetadata,
  faqPageSchema,
  organizationSchema,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo";
import { aboutFaqs } from "../data/aboutFaqs";
import AboutPageClient from "./AboutPageClient";

export const metadata = createMetadata({
  title: "About Us — Website & App Development Company in Chhattisgarh",
  description:
    "TechByteX Software Solutions is a website, mobile app, ecommerce and custom software development company in Dalli Rajhara, Chhattisgarh, serving businesses across India. Meet the team and see how we work.",
  path: "/about",
  keywords: [
    "about TechByteX",
    "TechByteX Software Solutions",
    "software development company in Chhattisgarh",
    "website development company in Chhattisgarh",
    "app development company in Chhattisgarh",
    "web development company Dalli Rajhara",
    "website developer Balod",
    "IT company in Chhattisgarh",
    "React Native app development company India",
    "Next.js development company India",
    "custom software development company India",
  ],
});

// Re-reads the portfolio (project count, clients, tech stack) at most every 5 minutes.
export const revalidate = 300;

export default async function AboutPage() {
  const portfolio = await getVisiblePortfolio();

  const projects = portfolio.map((p) => ({
    title: p.title,
    category: p.category,
    clientType: p.clientType,
    technologies: p.technologies || [],
  }));

  const teamSchema = team.map((member) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    image: absoluteUrl(member.image),
    worksFor: { "@type": "Organization", name: SITE_NAME },
  }));

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About TechByteX Software Solutions",
    url: absoluteUrl("/about"),
    mainEntity: {
      ...organizationSchema(),
      legalName: "TechByteX Software Solutions",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dalli Rajhara",
        addressRegion: "Chhattisgarh",
        postalCode: "491228",
        addressCountry: "IN",
      },
      numberOfEmployees: { "@type": "QuantitativeValue", value: team.length },
      employee: team.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.role })),
      makesOffer: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: `${SITE_URL}/services/${s.slug}` },
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          aboutSchema,
          faqPageSchema(aboutFaqs),
          ...teamSchema,
        ]}
      />
      <AboutPageClient
        projects={projects}
        services={services.map(({ slug, title, shortDesc }) => ({ slug, title, shortDesc }))}
        cities={cities.map(({ slug, name }) => ({ slug, name }))}
        team={team}
      />
    </>
  );
}
