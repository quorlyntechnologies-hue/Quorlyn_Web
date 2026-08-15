import type { MetadataRoute } from "next";

import { company } from "@/content/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Neither has anything to index. robots.txt is a request, not a control —
      // /admin is additionally gated by proxy.ts, the DAL and RLS.
      disallow: ["/api/", "/admin"],
    },
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}
