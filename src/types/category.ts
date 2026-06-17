export type CategoryRow = {
  id: string;
  slug: string;
  name_tr: string;
  name_en: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CategorySummary = Pick<
  CategoryRow,
  "id" | "slug" | "name_tr" | "name_en"
>;
