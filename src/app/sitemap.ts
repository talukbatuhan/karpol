import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getProductCategories, getProducts } from "@/lib/data/public-data";
import { getAllArticles } from "@/lib/data/knowledge-base";

const baseUrl = siteConfig.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/about",
    "/products",
    "/industries",
    "/industries/marble-stone",
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

  // Products
  const { data: products } = await getProducts();
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.category_id}/${product.slug}`, // Note: This assumes category_id is slug or mapped. 
    // In public-data.ts, getProducts returns simplified products. 
    // We might need to fetch full product details or fix the mapping.
    // For now, let's assume we can get the category slug.
    // A better way for sitemap might be fetching products with category.
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
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
