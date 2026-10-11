import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "../../data/services";
import { createMetadata } from "../../lib/seo";
import ServiceLandingPage from "../../components/ServiceLandingPage";

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return createMetadata({
      title: "Service Not Found",
      description: "The requested TechByteX service page could not be found.",
      path: "/services",
    });
  }

  return createMetadata({
    title: service.h1,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({ params }) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return <ServiceLandingPage service={service} />;
}
