export const SITE_URL = "https://www.techbytex.in";
export const SITE_NAME = "TechByteX";
export const DEFAULT_OG_IMAGE = "/website-development-india-2026.jpg";

export const targetKeywords = [
  "app development",
  "website development",
  "ecommerce development",
  "React Native app development",
  "Next.js development",
  "Shopify development",
  "custom software development",
];

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
  modifiedTime,
} = {}) {
  const canonical = absoluteUrl(path);
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | App, Website & Custom Software Development`;
  const metaDescription =
    description ||
    "TechByteX builds high-performance websites, mobile apps, ecommerce stores, Shopify solutions, React Native apps, Next.js platforms, and custom software.";

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: [...new Set([...targetKeywords, ...keywords])],
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} software development company`,
        },
      ],
      locale: "en_IN",
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/hello.png"),
    email: "techbytexsoftware@gmail.com",
    telephone: "+91-8827219873",
    sameAs: [
      "https://www.instagram.com/techbytexx",
      "https://www.linkedin.com/in/chandan-bhardwaj-5132a821a",
    ],
    areaServed: ["India", "Chhattisgarh", "Raipur", "Bhilai", "Dalli Rajhara", "Durg"],
    knowsAbout: targetKeywords,
  };
}

export function localBusinessSchema({
  cityName,
  path = "/",
  areaServed,
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: cityName ? `${SITE_NAME} - Website Development in ${cityName}` : SITE_NAME,
    image: absoluteUrl("/hello.png"),
    url: absoluteUrl(path),
    telephone: "+91-8827219873",
    email: "techbytexsoftware@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dalli Rajhara",
      addressRegion: "Chhattisgarh",
      postalCode: "491228",
      addressCountry: "IN",
    },
    areaServed: areaServed || cityName || "Chhattisgarh",
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-18:00",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function singleServiceSchema({ name, description, path, areaServed = "India" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed,
  };
}

export function serviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "TechByteX development services",
    itemListElement: [
      "Website Development",
      "App Development",
      "Ecommerce Development",
      "React Native App Development",
      "Next.js Development",
      "Shopify Development",
      "Custom Software Development",
      "AI Development",
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name,
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        areaServed: "India",
      },
    })),
  };
}
