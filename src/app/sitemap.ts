import type { MetadataRoute } from "next";

import { company } from "@/content/company";
import { projects } from "@/content/projects";

/** Published project URLs are derived from the content array, so adding one adds
 *  it to the sitemap without a second edit. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${company.url}/`, priority: 1, changeFrequency: "monthly" },
      { url: `${company.url}/services`, priority: 0.9, changeFrequency: "monthly" },
      { url: `${company.url}/about`, priority: 0.8, changeFrequency: "yearly" },
      { url: `${company.url}/work`, priority: 0.8, changeFrequency: "monthly" },
      { url: `${company.url}/contact`, priority: 0.9, changeFrequency: "yearly" },
      { url: `${company.url}/privacy`, priority: 0.2, changeFrequency: "yearly" },
      { url: `${company.url}/terms`, priority: 0.2, changeFrequency: "yearly" },
    ] satisfies MetadataRoute.Sitemap
  );

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${company.url}/work/${project.slug}`,
    priority: 0.7,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...projectRoutes];
}
