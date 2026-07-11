"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  categoryUpsertSchema,
  type CategoryUpsertInput,
} from "@/lib/schemas/category";
import type { CategoryRow } from "@/types/category";
import { ServiceError } from "@/services/_shared/errors";
import {
  deleteCategoryById,
  findAllCategories,
  findCategoryById,
  findCategoryParent,
  insertCategory,
  updateCategoryById,
} from "@/services/categories";

function revalidateCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  for (const locale of ["tr", "en"]) {
    revalidatePath(`/${locale}/urunler`);
  }
}

async function assertValidParent(parentId: string, selfId: string | null) {
  if (selfId && parentId === selfId) {
    throw new ServiceError("Kategori kendi üst kategorisi olamaz.");
  }

  const { supabase } = await requireAdmin();
  const parent = await findCategoryParent(supabase, parentId);

  if (!parent) throw new ServiceError("Üst kategori bulunamadı.");

  if (selfId && parent.parent_id === selfId) {
    throw new ServiceError("Döngüsel hiyerarşi oluşturulamaz.");
  }
}

export async function listCategoriesAdmin(): Promise<CategoryRow[]> {
  const { supabase } = await requireAdmin();
  return findAllCategories(supabase);
}

export async function getCategoryAdmin(id: string): Promise<CategoryRow | null> {
  const { supabase } = await requireAdmin();
  return findCategoryById(supabase, id);
}

export async function createCategory(input: CategoryUpsertInput) {
  const parsed = categoryUpsertSchema.parse(input);
  const { supabase } = await requireAdmin();

  if (parsed.parent_id) {
    await assertValidParent(parsed.parent_id, null);
  }

  const data = await insertCategory(supabase, parsed);
  revalidateCategoryPaths();
  return data;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryUpsertInput>,
) {
  const partial = categoryUpsertSchema.partial().parse(input);
  const { supabase } = await requireAdmin();

  if (partial.parent_id) {
    await assertValidParent(partial.parent_id, id);
  }

  const data = await updateCategoryById(supabase, id, partial);
  revalidateCategoryPaths();
  return data;
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();
  await deleteCategoryById(supabase, id);
  revalidateCategoryPaths();
}
