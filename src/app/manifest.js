import { SITE_NAME } from "./lib/seo";

export default function manifest() {
  return {
    name: `${SITE_NAME} - Website, App & Software Development Company`,
    short_name: SITE_NAME,
    description:
      "TechByteX builds websites, mobile apps, ecommerce stores, and custom software for businesses across Chhattisgarh, India, and internationally.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7C3AED",
    icons: [
      {
        src: "/hello.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/hello.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
