import React from 'react'
import OurProjects from '../newcom/OurProjects'
import JsonLd from '../components/JsonLd'
import { breadcrumbSchema, createMetadata } from '../lib/seo'

export const metadata = createMetadata({
  title: "Portfolio",
  description:
    "Explore TechByteX web development, app development, ecommerce, Shopify, Next.js, and custom software projects for businesses and startups.",
  path: "/portfolio",
  keywords: ["software development portfolio", "website development projects", "app development projects"],
})

function page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Portfolio", path: "/portfolio" }])} />
      <OurProjects/>
    </>
  )
}

export default page
