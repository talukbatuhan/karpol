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
  slug: string;
  name: string;
};

export async function getPublicCategoryTabs(
  locale: string,
): Promise<PublicCategoryTab[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createPublicClient();
    const rows = await findAllCategories(supabase);
    return rows.map((row) => ({
      slug: row.slug,
      name: locale === "en" ? row.name_en : row.name_tr,
    }));
  } catch {
    return [];
  }
}
