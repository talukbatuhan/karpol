"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  categoryUpsertSchema,
  type CategoryUpsertInput,
} from "@/lib/schemas/category";
import type { CategoryRow } from "@/lib/types/category";

function revalidateCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  for (const locale of ["tr", "en"]) {
    revalidatePath(`/${locale}/products`);
  }
}

export async function listCategoriesAdmin(): Promise<CategoryRow[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name_tr", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CategoryRow[];
}

export async function getCategoryAdmin(id: string): Promise<CategoryRow | null> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as CategoryRow) ?? null;
}

export async function createCategory(input: CategoryUpsertInput) {
  const parsed = categoryUpsertSchema.parse(input);
  const { supabase } = await requireAdmin();

  if (parsed.parent_id) {
    await assertValidParent(parsed.parent_id, null);
  }

  const { data, error } = await supabase
    .from("categories")
    .insert(parsed)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidateCategoryPaths();
  return data;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryUpsertInput>,
) {
  const { supabase } = await requireAdmin();
  const partial = categoryUpsertSchema.partial().parse(input);

  if (partial.parent_id) {
    await assertValidParent(partial.parent_id, id);
  }

  const { data, error } = await supabase
    .from("categories")
    .update(partial)
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidateCategoryPaths();
  return data;
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) throw new Error(countError.message);
  if (count && count > 0) {
    throw new Error(
      "Bu kategoriye bağlı ürünler var. Önce ürünleri başka kategoriye taşıyın.",
    );
  }

  const { count: childCount, error: childError } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id);

  if (childError) throw new Error(childError.message);
  if (childCount && childCount > 0) {
    throw new Error(
      "Bu kategorinin alt kategorileri var. Önce alt kategorileri silin veya taşıyın.",
    );
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateCategoryPaths();
}

async function assertValidParent(parentId: string, selfId: string | null) {
  if (selfId && parentId === selfId) {
    throw new Error("Kategori kendi üst kategorisi olamaz.");
  }

  const { supabase } = await requireAdmin();
  const { data: parent, error } = await supabase
    .from("categories")
    .select("id, parent_id")
    .eq("id", parentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!parent) throw new Error("Üst kategori bulunamadı.");

  if (selfId && parent.parent_id === selfId) {
    throw new Error("Döngüsel hiyerarşi oluşturulamaz.");
  }
}
