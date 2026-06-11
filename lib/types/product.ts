import type { CategoryRow } from "@/lib/types/category";

export type ProductStatus = "draft" | "published";

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

export type ProductMetadata = {
  tool_href?: string;
  specs?: ProductSpec[];
  assets?: ProductAssets;
};

export type ProductRow = {
  id: string;
  slug: string;
  category_id: string;
  status: ProductStatus;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  body_tr: string;
  body_en: string;
  metadata: ProductMetadata;
  created_at: string;
  updated_at: string;
  category?: Pick<CategoryRow, "id" | "slug" | "name_tr" | "name_en"> | null;
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
};

export type ProductListItem = {
  slug: string;
  category: { slug: string; name: string } | null;
  status: ProductStatus;
  title: string;
  description: string;
  updatedAt: string;
};
