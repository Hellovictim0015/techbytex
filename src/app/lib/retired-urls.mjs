// URLs the site has deliberately removed or merged. Shared by next.config.mjs
// (301 redirects), middleware.js (410 Gone), the sitemap and blog link clean-up.
// Plain .mjs so next.config.mjs can import it without a build step.

// The only location landing pages we keep: Chhattisgarh pages with real local
// content. Every other "<service>-<place>" page (other states, other countries,
// neighbourhoods, small districts, AI-generated location pages) returns 410.
export const KEPT_LOCATION_PAGES = new Set([
  "web-development-chhattisgarh",
  "web-development-raipur",
  "web-development-bhilai",
  "web-development-durg",
  "web-development-bilaspur",
  "web-development-dalli-rajhara",
  "app-development-bhilai",
]);

// URL prefixes used by location pages (see lib/location-pages.js URL_PREFIX).
const LOCATION_PAGE = new RegExp(
  "^/(web-development|ecommerce-website-development|app-development|react-native-development|" +
    "android-app-development|ios-app-development|react-development|nextjs-development|" +
    "nodejs-development|ui-ux-design|custom-software-development|ai-development)-[a-z0-9-]+/?$"
);

export function isRetiredLocationPath(pathname) {
  const match = LOCATION_PAGE.exec(pathname);
  if (!match) return false;
  return !KEPT_LOCATION_PAGES.has(pathname.replace(/^\/|\/$/g, ""));
}

// Blog posts merged into one stronger post on the same topic (old → kept).
// A target can also be a service / location page when that page already
// covers the keyword.
export const BLOG_MERGES = {
  "choose-web-development-company-bhilai": "/blog/website-development-company-in-bhilai-checklist",
  "choose-website-development-company-in-bhilai": "/blog/website-development-company-in-bhilai-checklist",
  "it-company-in-bilaspur-what-businesses-should-expect":
    "/blog/software-company-in-bilaspur-what-clients-should-look-for",
  "website-development-in-chhattisgarh-local-business-guide": "/web-development-chhattisgarh",
  "software-development-in-chhattisgarh-local-business-guide":
    "/blog/custom-software-development-chhattisgarh-businesses",
  "nextjs-development-india-business-expectations": "/blog/when-to-hire-nextjs-development-company-india",
  "business-website-development-complete-2026-checklist": "/blog/business-website-development-checklist-2026",
};

// Where a link to a retired location page should point instead: the matching
// service page (e.g. /ui-ux-design-pune → /services/ui-ux-design).
const SERVICE_FOR_PREFIX = {
  "web-development": "website-development",
  "ecommerce-website-development": "ecommerce-development",
  "app-development": "mobile-app-development",
};

export function replacementForRetiredLocation(pathname) {
  const prefix = LOCATION_PAGE.exec(pathname)?.[1];
  if (!prefix) return "/services";
  return `/services/${SERVICE_FOR_PREFIX[prefix] || prefix}`;
}
