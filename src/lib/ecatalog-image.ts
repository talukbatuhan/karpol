import { resolveProductImageUrl } from "@/lib/product-image";

export function resolveEcatalogImageUrl(path?: string): string | null {
  return resolveProductImageUrl(path);
}
