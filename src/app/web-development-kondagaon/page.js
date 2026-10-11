import { notFound } from "next/navigation";
import { getCityBySlug } from "../data/cities";
import { createMetadata } from "../lib/seo";
import CityLandingPage from "../components/CityLandingPage";

const city = getCityBySlug("kondagaon");

export const metadata = city
  ? createMetadata({
      title: city.tagline,
      description: `TechByteX builds SEO-ready websites, ecommerce stores, Next.js apps, and custom software for businesses in ${city.name}, ${city.district} district, Chhattisgarh. Free quote.`,
      path: "/web-development-kondagaon",
      keywords: [
        `website development ${city.name}`,
        `web development company ${city.name}`,
        `website designer ${city.name}`,
        `app development ${city.name}`,
      ],
    })
  : createMetadata({ title: "Page Not Found", description: "Page not found.", path: "/" });

export default function Page() {
  if (!city) notFound();
  return <CityLandingPage city={city} />;
}
