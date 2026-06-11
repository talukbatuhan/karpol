import { createPublicClient } from "@/lib/supabase/public";
import type { CategoryRow } from "@/lib/types/category";
import type {
  ProductMetadata,
  ProductPublicView,
  ProductRow,
} from "@/lib/types/product";

type CategorySummary = Pick<CategoryRow, "id" | "slug" | "name_tr" | "name_en">;

function logQueryError(context: string, error: { message?: string; code?: string }) {
  console.error(context, error.message ?? "Unknown error", error.code ?? "");
}

function mapRowToPublic(
  row: ProductRow,
  locale: string,
): ProductPublicView {
  const isEn = locale === "en";
  const metadata = (row.metadata ?? {}) as ProductMetadata;
  const specs = (metadata.specs ?? []).map((s) => ({
    label: isEn ? s.label_en : s.label_tr,
    value: isEn ? s.value_en : s.value_tr,
  }));

  const category = row.category
    ? {
        slug: row.category.slug,
        name: isEn ? row.category.name_en : row.category.name_tr,
      }
    : null;

  return {
    slug: row.slug,
    category,
    title: isEn ? row.title_en : row.title_tr,
    description: isEn ? row.description_en : row.description_tr,
    body: isEn ? row.body_en : row.body_tr,
    toolHref: metadata.tool_href,
    specs,
    assets: metadata.assets ?? {},
  };
}

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

async function fetchCategoriesByIds(
  ids: string[],
): Promise<Map<string, CategorySummary>> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return new Map();

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_tr, name_en")
    .in("id", uniqueIds);

  if (error) {
    logQueryError("fetchCategoriesByIds", error);
    return new Map();
  }

  return new Map(
    (data ?? []).map((row) => [row.id as string, row as CategorySummary]),
  );
}

function attachCategories(
  rows: Omit<ProductRow, "category">[],
  categories: Map<string, CategorySummary>,
): ProductRow[] {
  return rows.map((row) => ({
    ...row,
    category: categories.get(row.category_id) ?? null,
  }));
}

export async function getPublishedProducts(
  locale: string,
): Promise<ProductPublicView[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    logQueryError("getPublishedProducts", error);
    return [];
  }

  if (!data?.length) return [];

  const categories = await fetchCategoriesByIds(
    data.map((row) => row.category_id as string),
  );
  const rows = attachCategories(data as Omit<ProductRow, "category">[], categories);
  return rows.map((row) => mapRowToPublic(row, locale));
}

export async function getPublishedProductBySlug(
  slug: string,
  locale: string,
): Promise<ProductPublicView | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    logQueryError("getPublishedProductBySlug", error);
    return null;
  }
  if (!data) return null;

  const categories = await fetchCategoriesByIds([data.category_id as string]);
  const [row] = attachCategories([data as Omit<ProductRow, "category">], categories);
  return mapRowToPublic(row, locale);
}

export async function getPublishedProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published");

  if (error || !data) return [];
  return data.map((r) => r.slug as string);
}
