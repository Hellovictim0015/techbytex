// Used by the /portfolio page only when the database is unreachable.
// Next.js-only (static image imports); scripts use data/portfolio.js instead.
import { portfolioSeed } from "./portfolio";
import spa from "../../img2/spa.png";
import ad from "../../img2/ad.png";
import ts from "../../img2/ts.png";
import gi from "../../img2/gi.png";
import ai from "../../img2/ai.png";

const STATIC_IMAGES = {
  "src/img2/spa.png": spa,
  "src/img2/ad.png": ad,
  "src/img2/ts.png": ts,
  "src/img2/gi.png": gi,
  "src/img2/ai.png": ai,
};

export const portfolioFallback = portfolioSeed.map((p, i) => ({
  ...p,
  id: `seed-${i + 1}`,
  image: STATIC_IMAGES[p.imageFile] || `/${p.imageFile.replace(/^public\//, "")}`,
  videoUrl: null,
}));
