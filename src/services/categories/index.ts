export {
  deleteCategoryById,
  findAllCategories,
  findCategoryById,
  findCategoryParent,
  insertCategory,
  updateCategoryById,
} from "@/services/categories/category.repository";

import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/services/_shared/supabase-config";
import { findAllCategories } from "@/services/categories/category.repository";

export type PublicCategoryTab = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
};

export async function getPublicCategoryTabs(
  locale: string,
): Promise<PublicCategoryTab[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createPublicClient();
    const rows = await findAllCategories(supabase);
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: locale === "en" ? row.name_en : row.name_tr,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
    }));
  } catch {
    return [];
  }
}
