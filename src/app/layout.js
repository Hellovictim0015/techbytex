import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./com/Navbar";
import Footer from "./com/Footer";
import FloatingContact from "./com/FloatingContact";
import JsonLd from "./components/JsonLd";
import {
  createMetadata,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
  websiteSchema,
} from "./lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  ...createMetadata({
    title: "App, Website, Ecommerce & Custom Software Development Company",
    description:
      "TechByteX builds SEO-ready websites, React Native apps, Next.js applications, Shopify stores, ecommerce platforms, AI products, and custom software for growing businesses.",
    path: "/",
  }),
  metadataBase: new URL("https://www.techbytex.in"),
  authors: [{ name: "TechByteX Team" }],
  creator: "TechByteX",
  publisher: "TechByteX Digital Solutions",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "geo.region": "IN-CT", 
    "geo.placename": "Dalli Rajhara, Raipur, Bhilai", 
  },
};

export default function RootLayout({ children }) {
  return (
    // Added lang="en-IN" for better regional targeting
    <html lang="en-IN">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5031668136033398" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen`}
      >
        <Navbar />
        <JsonLd data={[organizationSchema(), localBusinessSchema(), websiteSchema(), serviceSchema()]} />
        {children}

        <FloatingContact />

        <Footer />
      </body>
    </html>
  );
}
