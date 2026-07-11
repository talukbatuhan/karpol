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
  /** Ordered gallery; first image is the cover. */
  images: string[];
  /** Cover image (kept in sync with images[0] for list/SEO). */
  image: string;
  cad: string | undefined;
  pdf: string | undefined;
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

/** One technical table (e.g. a product version). */
export type TechnicalTableMeta = {
  title_tr?: string;
  title_en?: string;
  columns: TechnicalTableColumn[];
  rows: TechnicalTableRow[];
  /** @deprecated Migrated into technical_tables; kept for reading old rows. */
  enabled?: boolean;
};

export type ProductMetadata = {
  tool_href?: string;
  specs?: ProductSpec[];
  assets?: ProductAssets;
  technical_drawing?: TechnicalDrawingMeta;
  /** Preferred: multiple version tables. */
  technical_tables?: TechnicalTableMeta[];
  /** @deprecated Use technical_tables. */
  technical_table?: TechnicalTableMeta;
};

type ProductTableRow = Tables<"products">;

export type ProductRow = Omit<ProductTableRow, "metadata"> & {
  metadata: ProductMetadata;
  category?: CategorySummary | null;
};

export type ProductPublicTechnicalTable = {
  title?: string;
  headers: string[];
  rows: string[][];
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
  technicalTables: ProductPublicTechnicalTable[];
};

export type ProductListItem = {
  slug: string;
  category: { slug: string; name: string } | null;
  status: ProductStatus;
  title: string;
  description: string;
  updatedAt: string;
};
