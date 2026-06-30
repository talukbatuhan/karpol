import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database.types";
import type { CategorySummary } from "@/types/category";
import type { ProductRow, ProductStatus } from "@/types/product";
import type { ProductUpsertInput } from "@/lib/schemas/product";
import { ServiceError, logServiceError } from "@/services/_shared/errors";
import { fetchAllPages } from "@/services/_shared/paginate-query";
import { isSupabaseConfigured } from "@/services/_shared/supabase-config";
import { attachCategories } from "@/services/products/product.mapper";

export const PRODUCT_SELECT = `
  *,
  category:categories (
    id,
    slug,
    name_tr,
    name_en
  )
`;

type DbClient = SupabaseClient<Database>;

export async function fetchCategoriesByIds(
  ids: string[],
  client?: DbClient,
): Promise<Map<string, CategorySummary>> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const supabase = client ?? createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_tr, name_en")
    .in("id", uniqueIds);

  if (error) {
    logServiceError("fetchCategoriesByIds", error);
    return new Map();
  }

  return new Map((data ?? []).map((row) => [row.id, row as CategorySummary]));
}

export async function findPublishedProducts(): Promise<ProductRow[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();

  let data: Omit<ProductRow, "category">[];
  try {
    data = await fetchAllPages(async (from, to) => {
      const result = await supabase
        .from("products")
        .select("*")
        .eq("status", "published")
        .order("updated_at", { ascending: false })
        .range(from, to);
      return { data: result.data, error: result.error };
    });
  } catch (error) {
    logServiceError("findPublishedProducts", error as { message: string });
    return [];
  }

  if (!data.length) return [];

  const categories = await fetchCategoriesByIds(
    data.map((row) => row.category_id),
    supabase,
  );

  return attachCategories(data, categories);
}

export async function findPublishedProductBySlug(
  slug: string,
): Promise<ProductRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    logServiceError("findPublishedProductBySlug", error);
    return null;
  }

  if (!data) return null;

  const categories = await fetchCategoriesByIds([data.category_id], supabase);
  const [row] = attachCategories([data as Omit<ProductRow, "category">], categories);
  return row;
}

export async function findPublishedProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();

  try {
    const data = await fetchAllPages(async (from, to) => {
      const result = await supabase
        .from("products")
        .select("slug")
        .eq("status", "published")
        .order("slug", { ascending: true })
        .range(from, to);
      return { data: result.data, error: result.error };
    });
    return data.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function findAllProductsAdmin(
  supabase: DbClient,
): Promise<ProductRow[]> {
  try {
    return await fetchAllPages(async (from, to) => {
      const result = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .order("updated_at", { ascending: false })
        .range(from, to);
      return { data: result.data as ProductRow[] | null, error: result.error };
    });
  } catch (error) {
    const err = error as { message: string; code?: string };
    throw new ServiceError(err.message, err.code);
  }
}

export async function findProductByIdAdmin(
  supabase: DbClient,
  id: string,
): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new ServiceError(error.message, error.code);
  return (data as ProductRow) ?? null;
}

export async function insertProduct(
  supabase: DbClient,
  input: ProductUpsertInput,
) {
  const { data, error } = await supabase
    .from("products")
    .insert(input)
    .select("id, slug")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  return data;
}

export async function updateProductById(
  supabase: DbClient,
  id: string,
  input: Partial<ProductUpsertInput>,
) {
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select("slug")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  return data;
}

export async function deleteProductById(supabase: DbClient, id: string) {
  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new ServiceError(error.message, error.code);

  return existing?.slug ?? null;
}

export async function updateProductStatus(
  supabase: DbClient,
  id: string,
  status: ProductStatus,
) {
  const { data, error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  return data;
}
