import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getProductCategories } from "@/lib/data/public-data";
import { getAllArticles } from "@/lib/data/knowledge-base";

const baseUrl = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/about",
    "/products",
    "/custom-manufacturing",
    "/knowledge",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Categories
  const { data: categories } = await getProductCategories();
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Articles
  const articles = getAllArticles();
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/knowledge/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...categoryRoutes, ...articleRoutes];
}
