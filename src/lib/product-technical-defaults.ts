import type { ProductMetadata } from "@/types/product";

export const defaultTechnicalDrawing = {
  enabled: false,
  image: "",
  caption_tr: "",
  caption_en: "",
} as const;

export const defaultTechnicalTable = {
  enabled: false,
  title_tr: "",
  title_en: "",
  columns: [] as { header_tr: string; header_en: string }[],
  rows: [] as { cells_tr: string[]; cells_en: string[] }[],
} as const;

export function normalizeProductMetadata(
  metadata?: ProductMetadata | null,
): ProductMetadata {
  const base = metadata ?? {};
  return {
    ...base,
    technical_drawing: {
      ...defaultTechnicalDrawing,
      ...base.technical_drawing,
    },
    technical_table: {
      ...defaultTechnicalTable,
      ...base.technical_table,
      columns: base.technical_table?.columns ?? [],
      rows: base.technical_table?.rows ?? [],
    },
  };
}
