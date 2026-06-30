import type { Enums, Tables } from "@/types/database.types";

export type EcatalogStatus = Enums<"product_status">;
export type EcatalogRow = Tables<"ecatalogs">;
export type EcatalogSpreadRow = Tables<"ecatalog_spreads">;

export type EcatalogLinkSide = "left" | "right";

export type EcatalogLink = {
  id: string;
  side: EcatalogLinkSide;
  /** 0–100 (% of page width/height) */
  x: number;
  y: number;
  w: number;
  h: number;
  product_slug: string;
  label_tr?: string;
  label_en?: string;
};

export type EcatalogSpread = {
  id?: string;
  sort_order: number;
  left_image: string;
  right_image: string;
  links: EcatalogLink[];
};

export type EcatalogPublicView = {
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  year: string;
  spreads: EcatalogSpreadPublicView[];
};

export type EcatalogSpreadPublicView = {
  sortOrder: number;
  leftImage: string | null;
  rightImage: string | null;
  links: EcatalogLinkPublicView[];
};

export type EcatalogLinkPublicView = {
  id: string;
  side: EcatalogLinkSide;
  x: number;
  y: number;
  w: number;
  h: number;
  productSlug: string;
  label?: string;
  productTitle?: string;
};

export type EcatalogSummary = Pick<
  EcatalogRow,
  | "id"
  | "slug"
  | "status"
  | "title_tr"
  | "title_en"
  | "description_tr"
  | "description_en"
  | "cover_image"
  | "year"
  | "sort_order"
>;
