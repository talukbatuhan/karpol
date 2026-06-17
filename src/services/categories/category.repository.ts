import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { CategoryRow } from "@/types/category";
import type { CategoryUpsertInput } from "@/lib/schemas/category";
import { ServiceError } from "@/services/_shared/errors";

type DbClient = SupabaseClient<Database>;

export async function findAllCategories(
  supabase: DbClient,
): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name_tr", { ascending: true });

  if (error) throw new ServiceError(error.message, error.code);
  return (data ?? []) as CategoryRow[];
}

export async function findCategoryById(
  supabase: DbClient,
  id: string,
): Promise<CategoryRow | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new ServiceError(error.message, error.code);
  return (data as CategoryRow) ?? null;
}

export async function insertCategory(
  supabase: DbClient,
  input: CategoryUpsertInput,
) {
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select("id")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  return data;
}

export async function updateCategoryById(
  supabase: DbClient,
  id: string,
  input: Partial<CategoryUpsertInput>,
) {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  return data;
}

export async function deleteCategoryById(supabase: DbClient, id: string) {
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) throw new ServiceError(countError.message, countError.code);
  if (count && count > 0) {
    throw new ServiceError(
      "Bu kategoriye bağlı ürünler var. Önce ürünleri başka kategoriye taşıyın.",
    );
  }

  const { count: childCount, error: childError } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true })
    .eq("parent_id", id);

  if (childError) throw new ServiceError(childError.message, childError.code);
  if (childCount && childCount > 0) {
    throw new ServiceError(
      "Bu kategorinin alt kategorileri var. Önce alt kategorileri silin veya taşıyın.",
    );
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new ServiceError(error.message, error.code);
}

export async function findCategoryParent(
  supabase: DbClient,
  parentId: string,
): Promise<Pick<CategoryRow, "id" | "parent_id"> | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, parent_id")
    .eq("id", parentId)
    .maybeSingle();

  if (error) throw new ServiceError(error.message, error.code);
  return (data as Pick<CategoryRow, "id" | "parent_id">) ?? null;
}
