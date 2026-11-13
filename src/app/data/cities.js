// Unique local-SEO content for the Chhattisgarh cities we keep a page for.
// Smaller districts with template-only content were removed (they now return
// 410 — see lib/retired-urls.mjs); only add a city back with real local content.
// Each entry drives /web-development-[slug] via generateStaticParams.
// Keep intros/FAQs genuinely city-specific — this is what keeps these
// pages out of "duplicate/thin content" territory with Google.

export const cities = [
  {
    slug: "raipur",
    name: "Raipur",
    district: "Raipur",
    region: "Capital of Chhattisgarh",
    tagline: "Website & App Development Company in Raipur, Chhattisgarh",
    intro: [
      "Raipur is the capital of Chhattisgarh and the state's largest commercial hub — home to corporate offices, hospitals, colleges, real estate developers, retail chains, and a fast-growing startup scene around areas like VIP Road, Shankar Nagar, Telibandha, Pandri, and Amlidih. Businesses here compete in a market where a slow or outdated website is a direct handicap against rivals who already rank on Google.",
      "TechByteX works with Raipur-based businesses — from hospitals and schools to real estate agents, manufacturers, and D2C brands — to build fast, mobile-first websites and apps on Next.js and React Native, backed by technical SEO that is built in from day one rather than bolted on later. We combine local market understanding with the same engineering standards we use for national and international clients.",
    ],
    industries: [
      { name: "Healthcare & Hospitals", note: "Appointment-ready websites with clear service pages, doctor profiles, and local SEO for terms like 'hospital website Raipur'." },
      { name: "Real Estate", note: "Property listing websites with fast image loading, lead capture forms, and location-based landing pages." },
      { name: "Education", note: "School and coaching institute websites with admission forms, result pages, and parent-friendly navigation." },
      { name: "Retail & Ecommerce", note: "Online stores and catalog sites for Raipur's retail and wholesale trading businesses." },
    ],
    nearbyAreas: ["Telibandha", "Shankar Nagar", "VIP Road", "Pandri", "Amlidih", "Devendra Nagar", "Civil Lines", "Mowa"],
    faqs: [
      {
        q: "Do you work with businesses across Raipur city and not just one area?",
        a: "Yes. We serve clients across all of Raipur — VIP Road, Shankar Nagar, Telibandha, Pandri, Devendra Nagar, and surrounding business districts — with most meetings done over call or video, and on-site visits arranged when needed.",
      },
      {
        q: "How much does website development cost in Raipur?",
        a: "A business website typically starts around ₹15,000–₹40,000 depending on pages and features, while ecommerce stores and custom web apps are quoted after a short requirement call. We share a fixed quote before any work begins — no hidden costs.",
      },
      {
        q: "Can you help a Raipur business rank on Google, not just build a website?",
        a: "Yes. Every website we build in Raipur ships with technical SEO — proper metadata, schema markup, sitemap, fast Core Web Vitals, and a content structure designed to target local search terms like 'website development company Raipur'.",
      },
      {
        q: "Do you build apps for Raipur businesses too?",
        a: "Yes, we build Android and iOS apps using React Native for Raipur businesses that need a mobile presence alongside their website — common for retail, healthcare, and service-based businesses in the city.",
      },
    ],
  },
  {
    slug: "bilaspur",
    name: "Bilaspur",
    district: "Bilaspur",
    region: "Judicial Capital of Chhattisgarh",
    tagline: "Website Development Company in Bilaspur, Chhattisgarh",
    intro: [
      "Bilaspur is home to the Chhattisgarh High Court and the South East Central Railway (SECR) headquarters, making it a hub for legal firms, government-linked services, education institutions, and a large local trading community. A professional, trustworthy website matters here as much for credibility as for lead generation — clients and patients often check a business online before making contact.",
      "TechByteX builds websites and web applications for Bilaspur businesses that need to look established and load fast on mobile, where most local searches happen. From law firm and consultancy websites to hospital portals and school admission sites, we pair clean design with technical SEO so the site actually gets found for searches like 'website developer Bilaspur'.",
    ],
    industries: [
      { name: "Legal & Consultancy", note: "Professional websites that build trust for law firms and consultants operating near the High Court." },
      { name: "Healthcare", note: "Hospital and clinic websites with appointment booking and doctor directories." },
      { name: "Education", note: "School, college, and coaching websites with clear admission and result sections." },
      { name: "Trading & Wholesale", note: "Catalog and inquiry-driven websites for Bilaspur's trading businesses." },
    ],
    nearbyAreas: ["Sarkanda", "Vyapar Vihar", "Link Road", "Torwa", "Mangla", "Sadar Bazar", "Tifra"],
    faqs: [
      {
        q: "Do you build websites for professional services like law firms in Bilaspur?",
        a: "Yes, we design professional, trust-building websites for law firms, consultants, and government-adjacent service providers in Bilaspur, with clean layouts and clear contact pathways.",
      },
      {
        q: "How long does a website project take in Bilaspur?",
        a: "Most business websites are delivered in 3–5 weeks. Larger projects like hospital portals or ecommerce stores typically take 6–10 weeks depending on scope.",
      },
      {
        q: "Can you redesign an existing outdated website?",
        a: "Yes. We regularly rebuild old, slow WordPress or template-based sites into fast Next.js websites while keeping the URLs and SEO value the old site already earned.",
      },
      {
        q: "Do you provide ongoing support after launch?",
        a: "Yes, we offer post-launch support and maintenance packages so your Bilaspur business website stays updated, secure, and fast over time.",
      },
    ],
  },
  {
    slug: "durg",
    name: "Durg",
    district: "Durg",
    region: "Twin city of Bhilai, industrial hub",
    tagline: "Website Development Company in Durg, Chhattisgarh",
    intro: [
      "Durg sits alongside Bhilai as part of one of Chhattisgarh's most industrialized regions, with a strong base of manufacturing suppliers, ancillary industries, transport and logistics businesses, and a growing retail and education sector. Buyers and B2B partners increasingly research suppliers online before calling, which makes a credible website a genuine business asset here.",
      "TechByteX builds business and ecommerce websites for Durg-based manufacturers, traders, and service providers, along with custom software for companies that need internal tools like inventory or billing systems. We focus on fast-loading, mobile-friendly sites with the technical SEO foundation needed to be found for searches like 'website development company Durg'.",
    ],
    industries: [
      { name: "Manufacturing & Ancillary Units", note: "Company profile and product catalog websites built for B2B credibility." },
      { name: "Transport & Logistics", note: "Service websites with clear fleet, route, and inquiry information." },
      { name: "Retail & Distribution", note: "Catalog and ecommerce websites for Durg's distribution businesses." },
      { name: "Education", note: "Websites for schools and institutes with admission-focused pages." },
    ],
    nearbyAreas: ["Padmanabhpur", "Supela Road", "Adarsh Nagar", "Indira Market area", "Station Road"],
    faqs: [
      {
        q: "Do you build websites for manufacturing and industrial businesses in Durg?",
        a: "Yes, we build B2B-focused company and product websites for manufacturers and ancillary units in Durg, designed to build buyer trust and generate inquiries.",
      },
      {
        q: "Can you build a billing or inventory system along with the website?",
        a: "Yes, we build custom software including billing, inventory, and order-tracking systems for Durg businesses that need more than just a website.",
      },
      {
        q: "Is the website mobile-friendly for local customers?",
        a: "Every website we build is mobile-first, since most local customers in Durg search and browse on their phones.",
      },
      {
        q: "Do you provide website content, or do we need to write it ourselves?",
        a: "We help draft SEO-friendly content for every page based on your business, then refine it with you before launch.",
      },
    ],
  },
  {
    slug: "bhilai",
    name: "Bhilai",
    district: "Durg",
    region: "Steel city of Chhattisgarh, home to Bhilai Steel Plant",
    tagline: "Website Development Company in Bhilai, Chhattisgarh",
    intro: [
      "Bhilai is one of Chhattisgarh's largest cities and home to the Bhilai Steel Plant (SAIL), which anchors a wide ecosystem of ancillary suppliers, contractors, retail businesses, hospitals, and educational institutions across sectors like Nehru Nagar, Supela, Vaishali Nagar, and Civic Center. Businesses here range from heavy-industry vendors to modern D2C and service startups.",
      "TechByteX builds websites, ecommerce stores, and mobile apps for Bhilai businesses — from steel-ancillary suppliers who need a professional B2B presence to retail and healthcare businesses that need to rank locally. For dedicated app development work in Bhilai, see our [App Development in Bhilai](/app-development-bhilai) page.",
    ],
    industries: [
      { name: "Steel & Industrial Suppliers", note: "B2B company websites that build credibility with SAIL-linked vendors and contractors." },
      { name: "Healthcare", note: "Hospital and diagnostic center websites with appointment and service pages." },
      { name: "Retail & Ecommerce", note: "Online stores for Bhilai's retail businesses across Supela and Nehru Nagar markets." },
      { name: "Real Estate", note: "Property listing and builder websites for Bhilai's growing residential sector." },
    ],
    nearbyAreas: ["Nehru Nagar", "Supela", "Vaishali Nagar", "Civic Center", "Power House", "Smriti Nagar"],
    faqs: [
      {
        q: "Do you build B2B websites for steel-ancillary suppliers in Bhilai?",
        a: "Yes, we build professional company and product websites for steel-ancillary and industrial suppliers around Bhilai, designed to build credibility with corporate buyers.",
      },
      {
        q: "What areas of Bhilai do you serve?",
        a: "We serve businesses across Bhilai including Nehru Nagar, Supela, Vaishali Nagar, Civic Center, and Smriti Nagar, and can meet on-site when needed.",
      },
      {
        q: "Do you also build mobile apps for Bhilai businesses?",
        a: "Yes — see our dedicated App Development in Bhilai page for React Native Android and iOS app development details.",
      },
      {
        q: "Can you migrate our existing website to a faster platform?",
        a: "Yes, we regularly migrate slow WordPress or template sites to fast Next.js builds while preserving SEO rankings and content.",
      },
    ],
  },
  {
    slug: "dalli-rajhara",
    name: "Dalli Rajhara",
    district: "Balod",
    region: "Home to Asia's largest mechanized iron ore mines (SAIL)",
    tagline: "Website Development Company in Dalli Rajhara, Chhattisgarh",
    intro: [
      "Dalli Rajhara, home to the SAIL iron ore mines that once fed the Bhilai Steel Plant via one of the earliest railway lines in the region, is a close-knit industrial town with a strong base of mining-linked contractors, traders, and local service businesses, alongside schools and healthcare providers serving the community.",
      "TechByteX is based near Dalli Rajhara and works closely with local businesses here — from mining-linked contractors and traders to schools, clinics, and retail shops — building fast, professional websites and, where needed, custom software and mobile apps, with the same technical standards we apply to national and international clients.",
    ],
    industries: [
      { name: "Mining & Ancillary Contractors", note: "B2B websites for contractors and suppliers linked to SAIL's mining operations." },
      { name: "Education & Healthcare", note: "Websites for local schools and clinics." },
      { name: "Retail & Local Trade", note: "Websites for shops and service businesses across the town." },
    ],
    nearbyAreas: ["Balod", "Gunderdehi", "Durg", "Bhilai"],
    faqs: [
      {
        q: "Since TechByteX is based near Dalli Rajhara, do you offer in-person meetings here?",
        a: "Yes, being based near Dalli Rajhara, we can meet in person for planning and reviews, alongside the usual remote workflow for day-to-day project updates.",
      },
      {
        q: "Do you build websites for mining-linked contractors in Dalli Rajhara?",
        a: "Yes, we build professional, credibility-focused B2B websites for contractors and suppliers connected to Dalli Rajhara's mining economy.",
      },
      {
        q: "Can you also help Balod and Durg-Bhilai businesses nearby?",
        a: "Yes — see our dedicated pages for [Balod](/web-development-balod), [Durg](/web-development-durg), and [Bhilai](/web-development-bhilai) for content tailored to those areas.",
      },
      {
        q: "What services do you offer beyond websites for local businesses?",
        a: "Alongside websites, we build custom software, mobile apps, and provide ongoing maintenance and local SEO support for businesses in and around Dalli Rajhara.",
      },
    ],
  },
];

export function getCityBySlug(slug) {
  return cities.find((c) => c.slug === slug);
}
