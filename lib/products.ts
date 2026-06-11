/**
 * Public products facade — reads published rows from Supabase.
 */
export {
  getPublishedProducts,
  getPublishedProductBySlug,
  getPublishedProductSlugs,
} from "@/lib/products-db";

export type { ProductPublicView as ProductView } from "@/lib/types/product";

/** @deprecated Use getPublishedProductSlugs — kept for gradual migration */
export async function getProductSlugs(): Promise<string[]> {
  const { getPublishedProductSlugs } = await import("@/lib/products-db");
  return getPublishedProductSlugs();
}
