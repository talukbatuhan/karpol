import { Product, ProductSizeRow } from "@/types/database";

export function sanitizeAssetUrl(url: string) {
  const trimmed = url.trim().replace(/[`"'<>]/g, "");
  const withoutTrailingParen = trimmed.replace(/\)+$/, "");
  if (!withoutTrailingParen) {
    return null;
  }
  try {
    return new URL(withoutTrailingParen).toString();
  } catch {
    return null;
  }
}

export function uniqueByUrl<T extends { url: string }>(items: T[]) {
  const map = new Map<string, T>();
  for (const item of items) {
    const normalizedUrl = sanitizeAssetUrl(item.url);
    if (!normalizedUrl) {
      continue;
    }
    if (!map.has(normalizedUrl)) {
      map.set(normalizedUrl, { ...item, url: normalizedUrl });
    }
  }
  return Array.from(map.values());
}

export function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(url);
}

export function normalizeVariantCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

export function normalizeGalleryItems(input: unknown) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          title: `Product Image ${index + 1}`,
          url: item,
        };
      }

      if (item && typeof item === "object") {
        const entry = item as Record<string, unknown>;
        const rawUrl = entry.url ?? entry.src ?? entry.image_url;
        if (typeof rawUrl === "string") {
          const rawTitle = entry.title ?? entry.alt;
          const rawCode = entry.code ?? entry.sku ?? entry.size ?? rawTitle;
          const rawSpecs = entry.specs;
          const specs =
            Array.isArray(rawSpecs) && rawSpecs.length > 0
              ? rawSpecs
                  .map((spec) => {
                    if (!spec || typeof spec !== "object") {
                      return null;
                    }
                    const item = spec as Record<string, unknown>;
                    return {
                      label:
                        typeof item.label === "string" ? item.label : undefined,
                      value:
                        typeof item.value === "string" ? item.value : undefined,
                    };
                  })
                  .filter(
                    (spec): spec is { label: string; value: string } =>
                      Boolean(spec?.label) && Boolean(spec?.value),
                  )
              : [];
          return {
            title:
              typeof rawTitle === "string" && rawTitle.trim().length > 0
                ? rawTitle
                : `Product Image ${index + 1}`,
            url: rawUrl,
            code:
              typeof rawCode === "string" && rawCode.trim().length > 0
                ? normalizeVariantCode(rawCode)
                : undefined,
            specs,
          };
        }
      }

      return null;
    })
    .filter((item): item is { title: string; url: string; code?: string; specs?: { label: string; value: string }[] } => item !== null);
}

export function getSupabaseJsonGallery(product: Product | null) {
  if (!product) {
    return [];
  }

  const extendedProduct = product as Product & Record<string, unknown>;
  const candidates: unknown[] = [
    product.gallery_json,
    product.gallery_images,
    product.product_gallery,
    extendedProduct.gallery,
    extendedProduct.images_json,
    extendedProduct.media_gallery,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeGalleryItems(candidate);
    if (normalized.length > 0) {
      return uniqueByUrl(normalized);
    }
  }

  return [];
}

export function normalizeSizeTableRows(input: unknown): ProductSizeRow[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const rows = input
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const row = item as Record<string, unknown>;
      const size = typeof row.size === "string" ? row.size : "";
      const width = typeof row.width === "string" ? row.width : "";
      const innerDiameter =
        typeof row.innerDiameter === "string" ? row.innerDiameter : "";
      const outerDiameter =
        typeof row.outerDiameter === "string" ? row.outerDiameter : "";
      const wing = typeof row.wing === "string" ? row.wing : "-";

      if (!size || !width || !innerDiameter || !outerDiameter) {
        return null;
      }

      return {
        size,
        wing,
        width,
        innerDiameter,
        outerDiameter,
      };
    })
    .filter(
      (row): row is NonNullable<typeof row> =>
        row !== null,
    );

  return rows;
}
