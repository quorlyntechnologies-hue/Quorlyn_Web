import type { MetadataRoute } from "next";

import { company } from "@/content/company";
import { projects } from "@/content/projects";

/** Case study URLs are derived from the content array, so publishing one adds
 *  it to the sitemap without a second edit. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
  ).map((route) => ({ ...route, lastModified }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${company.url}/work/${project.slug}`,
    lastModified,
    priority: 0.7,
    changeFrequency: "yearly",
  }));

  return [...staticRoutes, ...projectRoutes];
}
