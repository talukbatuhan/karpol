import type { CategorySummary } from "@/types/category";
import type {
  ProductMetadata,
  ProductPublicView,
  ProductRow,
} from "@/types/product";
import { normalizeProductMetadata } from "@/lib/product-technical-defaults";

export function toPublicView(row: ProductRow, locale: string): ProductPublicView {
  const isEn = locale === "en";
  const metadata = normalizeProductMetadata(row.metadata as ProductMetadata);
  const specs = (metadata.specs ?? []).map((s) => ({
    label: isEn ? s.label_en : s.label_tr,
    value: isEn ? s.value_en : s.value_tr,
  }));

  const category = row.category
    ? {
        slug: row.category.slug,
        name: isEn ? row.category.name_en : row.category.name_tr,
      }
    : null;

  const drawingMeta = metadata.technical_drawing;
  const technicalDrawing =
    drawingMeta?.enabled && drawingMeta.image?.trim()
      ? {
          image: drawingMeta.image.trim(),
          caption: isEn
            ? drawingMeta.caption_en?.trim() || undefined
            : drawingMeta.caption_tr?.trim() || undefined,
        }
      : null;

  const technicalTables = (metadata.technical_tables ?? [])
    .filter((table) => table.columns.length > 0)
    .map((table) => ({
      title: isEn
        ? table.title_en?.trim() || undefined
        : table.title_tr?.trim() || undefined,
      headers: table.columns.map((column) =>
        isEn ? column.header_en : column.header_tr,
      ),
      rows: table.rows.map((tableRow) =>
        isEn ? tableRow.cells_en : tableRow.cells_tr,
      ),
    }));

  return {
    slug: row.slug,
    category,
    title: isEn ? row.title_en : row.title_tr,
    description: isEn ? row.description_en : row.description_tr,
    body: isEn ? row.body_en : row.body_tr,
    toolHref: metadata.tool_href,
    specs,
    assets: metadata.assets ?? {},
    technicalDrawing,
    technicalTables,
  };
}

export function attachCategories(
  rows: Omit<ProductRow, "category">[],
  categories: Map<string, CategorySummary>,
): ProductRow[] {
  return rows.map((row) => ({
    ...row,
    category: categories.get(row.category_id) ?? null,
  }));
}
