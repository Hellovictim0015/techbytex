import { notFound } from "next/navigation";
import CityLandingPage from "../components/CityLandingPage";
import { createMetadata } from "../lib/seo";
import { getPublishedLocationPage, toLandingProps } from "../lib/location-pages";

// Admin-created location pages (Admin → Location Pages), e.g. /web-development-indore.
// Real folders like /about or /web-development-raipur always win over this
// route, so it only ever serves slugs stored in location_pages.
// Rendered on first request and cached; publishing refreshes it immediately.
export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPublishedLocationPage(slug);
  if (!page) {
    return createMetadata({ title: "Page Not Found", description: "Page not found.", path: "/" });
  }
  const keywords = Array.isArray(page.secondary_keywords) ? page.secondary_keywords : [];
  return createMetadata({
    title: page.meta_title || page.h1,
    description: page.meta_description,
    path: `/${page.slug}`,
    keywords: [page.target_keyword, ...keywords],
  });
}

export default async function LocationPage({ params }) {
  const { slug } = await params;
  const page = await getPublishedLocationPage(slug);
  if (!page) notFound();
  return <CityLandingPage {...toLandingProps(page)} />;
}
