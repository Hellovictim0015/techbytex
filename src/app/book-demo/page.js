import JsonLd from "../components/JsonLd";
import { breadcrumbSchema, createMetadata } from "../lib/seo";
import BookDemoClient from "./BookDemoClient";

export const metadata = createMetadata({
  title: "Book a Free Software Development Consultation",
  description:
    "Book a free consultation with TechByteX for website development, app development, ecommerce development, React Native apps, Next.js development, Shopify stores, and custom software.",
  path: "/book-demo",
  keywords: ["software development consultation", "hire Next.js developer", "hire React Native developer"],
});

export default function BookDemoPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Book Demo", path: "/book-demo" }])} />
      <BookDemoClient />
    </>
  );
}
