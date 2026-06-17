import { getPublicStorageUrl } from "@/lib/storage-url";

function resolveStorageAssetUrl(
  bucket: "product-images" | "product-files",
  path?: string,
): string | null {
  if (!path?.trim()) return null;
  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  return getPublicStorageUrl(bucket, trimmed) || null;
}

export function resolveProductImageUrl(path?: string): string | null {
  return resolveStorageAssetUrl("product-images", path);
}

export function resolveProductFileUrl(path?: string): string | null {
  return resolveStorageAssetUrl("product-files", path);
}
