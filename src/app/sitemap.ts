import { MetadataRoute } from "next";
import { APP_LOCALES } from "@/i18n/config";
import { siteConfig } from "@/lib/config";
import { getProductCategories, getPublishedArticles, getIndustries } from "@/lib/data/public-data";

const baseUrl = siteConfig.url;

const locales = [...APP_LOCALES];

function generateAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${baseUrl}/${locale}${path}`;
  }
  languages["x-default"] = `${baseUrl}/en${path}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/about",
    "/products",
    "/custom-manufacturing",
    "/knowledge",
    "/contact",
    "/industries",
    "/catalog",
    "/factory-technology",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: generateAlternates(path),
    }))
  );

  const showcaseAlternates = {
    languages: {
      en: `${baseUrl}/en/showcase`,
      tr: `${baseUrl}/tr/urun-gorselleri`,
      "x-default": `${baseUrl}/en/showcase`,
    },
  };
  const showcaseRoutes: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${baseUrl}/${locale}${locale === "tr" ? "/urun-gorselleri" : "/showcase"}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
    alternates: showcaseAlternates,
  }));

  const { data: categories } = await getProductCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap((cat) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/products/${cat.slug}`,
      lastModified: cat.updated_at || new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: generateAlternates(`/products/${cat.slug}`),
    }))
  );

  const { data: articles } = await getPublishedArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.flatMap((article) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/knowledge/${article.slug}`,
      lastModified: article.updated_at || article.published_at || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: generateAlternates(`/knowledge/${article.slug}`),
    }))
  );

  const { data: industries } = await getIndustries();
  const industryRoutes: MetadataRoute.Sitemap = industries.flatMap((ind) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/industries/${ind.slug}`,
      lastModified: ind.updated_at || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: generateAlternates(`/industries/${ind.slug}`),
    }))
  );

  return [
    ...staticRoutes,
    ...showcaseRoutes,
    ...categoryRoutes,
    ...articleRoutes,
    ...industryRoutes,
  ];
}
