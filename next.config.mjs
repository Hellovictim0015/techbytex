import { fileURLToPath } from "url";
import { dirname } from "path";
import { BLOG_MERGES } from "./src/app/lib/retired-urls.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  async redirects() {
    return [
      // One host for search engines and admin cookies: techbytex.in → www.techbytex.in
      {
        source: "/:path*",
        has: [{ type: "host", value: "techbytex.in" }],
        destination: "https://www.techbytex.in/:path*",
        permanent: true,
      },
      // Merged duplicate articles → the one post (or page) we kept. Listed
      // before the /blogg → /blog move so each old URL redirects in one hop.
      ...Object.entries(BLOG_MERGES).flatMap(([slug, destination]) => [
        { source: `/blogg/${slug}`, destination, permanent: true },
        { source: `/blog/${slug}`, destination, permanent: true },
      ]),
      // Posts moved from the misspelt /blogg/<slug> to /blog/<slug>.
      { source: "/blogg", destination: "/blog", permanent: true },
      { source: "/blogg/:slug", destination: "/blog/:slug", permanent: true },
      // The locations hub listed pages that are now removed.
      { source: "/locations", destination: "/web-development-chhattisgarh", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
