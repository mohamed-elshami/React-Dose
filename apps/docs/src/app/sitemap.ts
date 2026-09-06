import type { MetadataRoute } from "next";
import { DOC_ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 1,
  };

  const docs = DOC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route.path === "/docs" ? 0.9 : 0.8,
  }));

  return [home, ...docs];
}
