import { SITE_URL } from "@/lib/seo";

// robots.txt: permite indexar todo MENOS /admin. Apunta al sitemap.
// Coherente con §7.4: lo bloqueado aquí no aparece en el sitemap.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
