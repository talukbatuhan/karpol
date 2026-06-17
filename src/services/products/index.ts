import type { ProductPublicView } from "@/types/product";
import { toPublicView } from "@/services/products/product.mapper";
import {
  findPublishedProductBySlug,
  findPublishedProductSlugs,
  findPublishedProducts,
} from "@/services/products/product.repository";

export async function getPublishedProducts(
  locale: string,
): Promise<ProductPublicView[]> {
  const rows = await findPublishedProducts();
  return rows.map((row) => toPublicView(row, locale));
}

export async function getFeaturedPublishedProducts(
  locale: string,
  limit = 3,
): Promise<ProductPublicView[]> {
  const products = await getPublishedProducts(locale);
  return products.slice(0, limit);
}

export async function getPublishedProductBySlug(
  slug: string,
  locale: string,
): Promise<ProductPublicView | null> {
  const row = await findPublishedProductBySlug(slug);
  return row ? toPublicView(row, locale) : null;
}

export { findPublishedProductSlugs as getPublishedProductSlugs };
