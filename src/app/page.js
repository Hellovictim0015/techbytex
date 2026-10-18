import Homee from "../app/pages/Home";
import JsonLd from "./components/JsonLd";
import { breadcrumbSchema, createMetadata } from "./lib/seo";

export const metadata = createMetadata({
  title: "App Development, Website Development & Custom Software Company",
  description:
    "TechByteX builds fast websites, ecommerce stores, Shopify solutions, React Native apps, Next.js applications, AI products, and custom software that help businesses rank and convert.",
  path: "/",
});

// Re-reads homepage projects from the database at most every 5 minutes;
// admin changes also refresh it immediately.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }])} />
      <Homee/>
    </>
  );
}
