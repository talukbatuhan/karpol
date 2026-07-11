import type {
  ProductAssets,
  ProductMetadata,
  TechnicalTableMeta,
} from "@/types/product";
import { sortImagePathsByFilename } from "@/lib/product-image-sort";

export const defaultTechnicalDrawing = {
  enabled: false,
  image: "",
  caption_tr: "",
  caption_en: "",
} as const;

export const defaultTechnicalTable = (): TechnicalTableMeta => ({
  title_tr: "",
  title_en: "",
  columns: [],
  rows: [],
});

export const defaultProductAssets = (): ProductAssets => ({
  images: [],
  image: "",
  cad: undefined,
  pdf: undefined,
});

export function normalizeProductAssets(
  assets?: Partial<ProductAssets> | null,
): ProductAssets {
  const base = assets ?? {};
  const fromGallery = (base.images ?? [])
    .map((path) => path.trim())
    .filter(Boolean);
  const legacy = base.image?.trim();
  const images = sortImagePathsByFilename(
    fromGallery.length > 0 ? fromGallery : legacy ? [legacy] : [],
  );

  return {
    images,
    image: images[0] ?? "",
    cad: base.cad?.trim() || undefined,
    pdf: base.pdf?.trim() || undefined,
  };
}

function migrateLegacyTable(
  metadata: ProductMetadata,
): TechnicalTableMeta[] {
  if (metadata.technical_tables && metadata.technical_tables.length > 0) {
    return metadata.technical_tables.map((table) => ({
      title_tr: table.title_tr ?? "",
      title_en: table.title_en ?? "",
      columns: table.columns ?? [],
      rows: table.rows ?? [],
    }));
  }

  const legacy = metadata.technical_table;
  if (!legacy) return [];

  const hasContent =
    Boolean(legacy.enabled) ||
    (legacy.columns?.length ?? 0) > 0 ||
    (legacy.rows?.length ?? 0) > 0;

  if (!hasContent) return [];

  return [
    {
      title_tr: legacy.title_tr ?? "",
      title_en: legacy.title_en ?? "",
      columns: legacy.columns ?? [],
      rows: legacy.rows ?? [],
    },
  ];
}

export function normalizeProductMetadata(
  metadata?: ProductMetadata | null,
): ProductMetadata {
  const base = metadata ?? {};
  return {
    ...base,
    assets: normalizeProductAssets(base.assets),
    technical_drawing: {
      ...defaultTechnicalDrawing,
      ...base.technical_drawing,
    },
    technical_tables: migrateLegacyTable(base),
    // Keep legacy field cleared in normalized form used by the admin editor.
    technical_table: undefined,
  };
}
