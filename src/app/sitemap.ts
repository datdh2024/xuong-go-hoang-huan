import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/gioi-thieu`, lastModified: new Date() },
    { url: `${SITE_URL}/cong-trinh`, lastModified: new Date() },
    { url: `${SITE_URL}/lien-he`, lastModified: new Date() },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await client.fetch<{ slug: string }[]>(
      `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
    );
    projectRoutes = slugs.map((s) => ({
      url: `${SITE_URL}/cong-trinh/${s.slug}`,
      lastModified: new Date(),
    }));
  } catch {
    // If Sanity is unreachable, return static routes only
  }

  return [...staticRoutes, ...projectRoutes];
}
