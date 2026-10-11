// One-off generator: creates a literal /web-development-{slug}/page.js for every
// city in src/app/data/cities.js. Next.js App Router does not support partial
// dynamic segments (e.g. "web-development-[city]"), so each city needs its own
// literal folder — this script just avoids writing 21 nearly-identical files by hand.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "..", "src", "app");

const citiesSrc = readFileSync(path.join(appDir, "data", "cities.js"), "utf-8");
const slugMatches = [...citiesSrc.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);

if (slugMatches.length === 0) {
  console.error("No city slugs found — check data/cities.js");
  process.exit(1);
}

for (const slug of slugMatches) {
  const dir = path.join(appDir, `web-development-${slug}`);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `import { notFound } from "next/navigation";
import { getCityBySlug } from "../data/cities";
import { createMetadata } from "../lib/seo";
import CityLandingPage from "../components/CityLandingPage";

const city = getCityBySlug("${slug}");

export const metadata = city
  ? createMetadata({
      title: city.tagline,
      description: \`TechByteX builds SEO-ready websites, ecommerce stores, Next.js apps, and custom software for businesses in \${city.name}, \${city.district} district, Chhattisgarh. Free quote.\`,
      path: "/web-development-${slug}",
      keywords: [
        \`website development \${city.name}\`,
        \`web development company \${city.name}\`,
        \`website designer \${city.name}\`,
        \`app development \${city.name}\`,
      ],
    })
  : createMetadata({ title: "Page Not Found", description: "Page not found.", path: "/" });

export default function Page() {
  if (!city) notFound();
  return <CityLandingPage city={city} />;
}
`;

  writeFileSync(path.join(dir, "page.js"), content, "utf-8");
  console.log(`Wrote web-development-${slug}/page.js`);
}

console.log(`Done — generated ${slugMatches.length} city pages.`);
