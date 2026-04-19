import {
  EMPTY_SIZE_TABLE,
  Product,
  ProductSizeRow,
  SizeColumn,
  SizeRow,
  SizeTable,
} from "@/types/database";

export type GalleryItem = {
  title: string;
  url: string;
  code?: string;
  specs?: { label: string; value: string }[];
};

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

          const galleryItem: GalleryItem = {
            title:
              typeof rawTitle === "string" && rawTitle.trim().length > 0
                ? rawTitle
                : `Product Image ${index + 1}`,
            url: rawUrl,
          };

          if (typeof rawCode === "string" && rawCode.trim().length > 0) {
            galleryItem.code = normalizeVariantCode(rawCode);
          }

          if (specs.length > 0) {
            galleryItem.specs = specs;
          }

          return galleryItem;
        }
      }

      return null;
    })
    .filter((item): item is GalleryItem => item !== null);
}

export function getSupabaseJsonGallery(product: Product | null): GalleryItem[] {
  if (!product) {
    return [];
  }

  const extendedProduct = product as Product & Record<string, unknown>;
  const candidates: unknown[] = [
    product.gallery,
    extendedProduct.gallery_json,
    extendedProduct.gallery_images,
    extendedProduct.product_gallery,
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

/**
 * @deprecated Yeni kod `normalizeSizeTable` kullanmalı. Bu fonksiyon eski sabit
 * şemalı kullanım için tutuldu (legacy `ProductSizeRow[]` döndürür).
 */
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

/** Eski 5-kolonlu ölçü tablosu için varsayılan sütun şeması. */
export const LEGACY_SIZE_COLUMNS: SizeColumn[] = [
  { key: "size", label: { tr: "Ölçü", en: "Size" }, align: "left" },
  { key: "wing", label: { tr: "Kanat", en: "Wing" }, align: "center" },
  { key: "width", label: { tr: "Genişlik", en: "Width" }, unit: "mm", align: "right" },
  { key: "innerDiameter", label: { tr: "İç Çap", en: "Inner Ø" }, unit: "mm", align: "right" },
  { key: "outerDiameter", label: { tr: "Dış Çap", en: "Outer Ø" }, unit: "mm", align: "right" },
];

function isSizeColumn(value: unknown): value is SizeColumn {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.key === "string" && obj.key.length > 0;
}

function sanitizeAutoFill(input: unknown): SizeColumn["autoFill"] {
  if (!input || typeof input !== "object") return undefined;
  const raw = input as Record<string, unknown>;
  if (raw.enabled !== true) return undefined;
  const prefix = typeof raw.prefix === "string" ? raw.prefix : "";
  const paddingRaw = Number(raw.padding);
  const startRaw = Number(raw.start);
  return {
    enabled: true,
    prefix,
    padding: Number.isFinite(paddingRaw)
      ? Math.max(1, Math.min(6, Math.trunc(paddingRaw)))
      : 2,
    start: Number.isFinite(startRaw) ? Math.max(0, Math.trunc(startRaw)) : 1,
  };
}

function sanitizeColumns(input: unknown): SizeColumn[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: SizeColumn[] = [];
  for (const raw of input) {
    if (!isSizeColumn(raw)) continue;
    const key = String(raw.key).trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const label =
      raw.label && typeof raw.label === "object"
        ? (raw.label as SizeColumn["label"])
        : { tr: key, en: key };
    out.push({
      key,
      label,
      unit: typeof raw.unit === "string" ? raw.unit : undefined,
      align:
        raw.align === "left" || raw.align === "center" || raw.align === "right"
          ? raw.align
          : undefined,
      autoFill: sanitizeAutoFill((raw as { autoFill?: unknown }).autoFill),
    });
  }
  return out;
}

function sanitizeRows(input: unknown, columns: SizeColumn[]): SizeRow[] {
  if (!Array.isArray(input)) return [];
  const allowedKeys = new Set(columns.map((c) => c.key));
  return input
    .map((raw) => {
      if (!raw || typeof raw !== "object") return null;
      const row = raw as Record<string, unknown>;
      const out: SizeRow = {};
      for (const key of allowedKeys) {
        const v = row[key];
        out[key] = typeof v === "string" ? v : v == null ? "" : String(v);
      }
      const hasAnyValue = Object.values(out).some((v) => v && v.trim().length > 0);
      return hasAnyValue ? out : null;
    })
    .filter((r): r is SizeRow => r !== null);
}

/**
 * Esnek ölçü tablosunu normalize eder. Üç giriş formatını da destekler:
 *  - Yeni format: `{ columns: SizeColumn[], rows: SizeRow[] }`
 *  - Eski format: `ProductSizeRow[]` → `LEGACY_SIZE_COLUMNS` ile haritalanır.
 *  - Diğer/boş: `EMPTY_SIZE_TABLE` döndürür.
 */
export function normalizeSizeTable(input: unknown): SizeTable {
  if (!input) return EMPTY_SIZE_TABLE;

  if (Array.isArray(input)) {
    if (input.length === 0) return EMPTY_SIZE_TABLE;
    const legacyRows = normalizeSizeTableRows(input);
    if (legacyRows.length === 0) return EMPTY_SIZE_TABLE;
    return {
      columns: LEGACY_SIZE_COLUMNS,
      rows: legacyRows.map((r) => ({
        size: r.size,
        wing: r.wing ?? "-",
        width: r.width,
        innerDiameter: r.innerDiameter,
        outerDiameter: r.outerDiameter,
      })),
    };
  }

  if (typeof input === "object") {
    const obj = input as { columns?: unknown; rows?: unknown };
    const columns = sanitizeColumns(obj.columns);
    if (columns.length === 0) return EMPTY_SIZE_TABLE;
    const rows = sanitizeRows(obj.rows, columns);
    return { columns, rows };
  }

  return EMPTY_SIZE_TABLE;
}
