import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/seo/site";
import { STATIC_SEO_PATHS } from "@/lib/seo/routes";

function pathPriority(path: string): number {
  if (path === "/") return 1;
  if (path === "/products") return 0.9;
  if (path.startsWith("/tools/")) return 0.75;
  return 0.7;
}

function pathChangeFrequency(
  path: string,
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/" || path === "/products") return "weekly";
  return "monthly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_SEO_PATHS) {
    for (const locale of routing.locales) {
      const url =
        path === "/"
          ? `${siteUrl}/${locale}`
          : `${siteUrl}/${locale}${path}`;

      entries.push({
        url,
        lastModified,
        changeFrequency: pathChangeFrequency(path),
        priority: pathPriority(path),
      });
    }
  }

  try {
    const { getPublishedProductSlugs } = await import("@/lib/products-db");
    const slugs = await getPublishedProductSlugs();

    for (const slug of slugs) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${siteUrl}/${locale}/products/${slug}`,
          lastModified,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  } catch {
    // Supabase yapılandırılmamışsa yalnızca statik rotalar.
  }

  return entries;
}
