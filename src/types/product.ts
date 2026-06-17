import type { Enums, Tables } from "@/types/database.types";
import type { CategorySummary } from "@/types/category";

export type ProductStatus = Enums<"product_status">;

export type ProductSpec = {
  label_tr: string;
  label_en: string;
  value_tr: string;
  value_en: string;
};

export type ProductAssets = {
  image?: string;
  cad?: string;
  pdf?: string;
};

export type TechnicalDrawingMeta = {
  enabled: boolean;
  image?: string;
  caption_tr?: string;
  caption_en?: string;
};

export type TechnicalTableColumn = {
  header_tr: string;
  header_en: string;
};

export type TechnicalTableRow = {
  cells_tr: string[];
  cells_en: string[];
};

export type TechnicalTableMeta = {
  enabled: boolean;
  title_tr?: string;
  title_en?: string;
  columns: TechnicalTableColumn[];
  rows: TechnicalTableRow[];
};

export type ProductMetadata = {
  tool_href?: string;
  specs?: ProductSpec[];
  assets?: ProductAssets;
  technical_drawing?: TechnicalDrawingMeta;
  technical_table?: TechnicalTableMeta;
};

type ProductTableRow = Tables<"products">;

export type ProductRow = Omit<ProductTableRow, "metadata"> & {
  metadata: ProductMetadata;
  category?: CategorySummary | null;
};

export type ProductPublicView = {
  slug: string;
  category: {
    slug: string;
    name: string;
  } | null;
  title: string;
  description: string;
  body: string;
  toolHref?: string;
  specs: { label: string; value: string }[];
  assets: ProductAssets;
  technicalDrawing: {
    image: string;
    caption?: string;
  } | null;
  technicalTable: {
    title?: string;
    headers: string[];
    rows: string[][];
  } | null;
};

export type ProductListItem = {
  slug: string;
  category: { slug: string; name: string } | null;
  status: ProductStatus;
  title: string;
  description: string;
  updatedAt: string;
};
