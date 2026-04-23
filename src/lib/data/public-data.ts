import { createClient } from "@/lib/supabase-server";
import type {
  Product,
  ProductCategory,
  CategoryAttributeDefinition,
  Industry,
  Article,
} from "@/types/database";
import { normalizeAttributeDefinitionRow } from "@/lib/product-category-utils";

type DataResponse<T> = {
  data: T[];
  error: string | null;
};

type ItemResponse<T> = {
  data: T | null;
  error: string | null;
};

// ─── Product Categories ─────────────────────────────────────
export async function getProductCategories(): Promise<DataResponse<ProductCategory>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as ProductCategory[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

export async function getProductCategoryBySlug(slug: string): Promise<ItemResponse<ProductCategory>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as ProductCategory | null, error: null };
  } catch {
    return { data: null, error: "Database connection failed" };
  }
}

export async function getProductCategoryByLocalizedSlug(
  slug: string,
  locale: string,
): Promise<ItemResponse<ProductCategory>> {
  try {
    const supabase = await createClient();
    // Locale-aware slug üzerinden ara, sonra canonical slug üzerinden fallback
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .or(`slugs->>${locale}.eq.${slug},slug.eq.${slug}`)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as ProductCategory | null, error: null };
  } catch {
    return { data: null, error: "Database connection failed" };
  }
}

export async function getCategoryAttributeDefinitionsForCategory(
  categoryId: string,
): Promise<DataResponse<CategoryAttributeDefinition>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("category_attribute_definitions")
      .select("*")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true });

    if (error) return { data: [], error: error.message };
    const rows = (data ?? []) as CategoryAttributeDefinition[];
    return {
      data: rows.map((r) => normalizeAttributeDefinitionRow(r)),
      error: null,
    };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

// ─── Products ───────────────────────────────────────────────
export async function getProductsByCategorySlug(slug: string): Promise<DataResponse<Product>> {
  const { data: category, error: catError } = await getProductCategoryBySlug(slug);
  if (catError || !category) return { data: [], error: catError ?? "Category not found" };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Product[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

export async function getProductByCategoryAndSlug(
  categorySlug: string,
  productSlug: string
): Promise<ItemResponse<Product>> {
  const { data: category } = await getProductCategoryBySlug(categorySlug);

  try {
    const supabase = await createClient();
    if (!category) return { data: null, error: "Category not found" };

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("slug", productSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as Product | null, error: null };
  } catch {
    return { data: null, error: "Database connection failed" };
  }
}

export async function getProductByLocalizedSlug(
  categorySlug: string,
  productSlug: string,
  locale: string,
): Promise<ItemResponse<Product>> {
  const { data: category } = await getProductCategoryByLocalizedSlug(categorySlug, locale);
  if (!category) return { data: null, error: "Category not found" };

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .or(`slugs->>${locale}.eq.${productSlug},slug.eq.${productSlug}`)
      .eq("is_active", true)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as Product | null, error: null };
  } catch {
    return { data: null, error: "Database connection failed" };
  }
}

export async function getProductCountsByCategory(): Promise<Record<string, number>> {
  // Canonical slug bazlı sayı haritası — her zaman canonical slug'a göre key.
  try {
    const supabase = await createClient();

    const { data: categories, error: catErr } = await supabase
      .from("product_categories")
      .select("id, slug")
      .eq("is_active", true);

    if (catErr || !categories) return {};

    const { data: products, error: prodErr } = await supabase
      .from("products")
      .select("category_id")
      .eq("is_active", true);

    if (prodErr || !products) {
      return Object.fromEntries(
        (categories as { id: string; slug: string }[]).map((c) => [c.slug, 0])
      );
    }

    const idToSlug = new Map<string, string>();
    for (const c of categories as { id: string; slug: string }[]) {
      idToSlug.set(c.id, c.slug);
    }

    const counts: Record<string, number> = {};
    for (const c of categories as { id: string; slug: string }[]) {
      counts[c.slug] = 0;
    }
    for (const p of products as { category_id: string }[]) {
      const slug = idToSlug.get(p.category_id);
      if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

export async function getRelatedProductsByCategory(
  categoryId: string,
  excludeProductSlug: string,
  limit = 4,
): Promise<DataResponse<Product>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("slug", excludeProductSlug)
      .order("sort_order", { ascending: true })
      .limit(limit);

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Product[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

export async function getFeaturedProducts(): Promise<DataResponse<Product>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(8);

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Product[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

// ─── Industries ─────────────────────────────────────────────
export async function getIndustries(): Promise<DataResponse<Industry>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Industry[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

export async function getIndustriesBySlugs(
  slugs: string[],
): Promise<DataResponse<Industry>> {
  if (slugs.length === 0) return { data: [], error: null };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .in("slug", slugs);

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Industry[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

export async function getIndustryBySlug(slug: string): Promise<ItemResponse<Industry>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as Industry | null, error: null };
  } catch {
    return { data: null, error: "Database connection failed" };
  }
}

export async function getIndustriesForProduct(productId: string): Promise<DataResponse<Industry>> {
  try {
    const supabase = await createClient();
    const { data: links, error: e1 } = await supabase
      .from("industry_products")
      .select("industry_id")
      .eq("product_id", productId);

    if (e1) return { data: [], error: e1.message };
    const ids = [...new Set((links ?? []).map((l) => l.industry_id as string))];
    if (ids.length === 0) return { data: [], error: null };

    const { data: rows, error: e2 } = await supabase
      .from("industries")
      .select("*")
      .in("id", ids);

    if (e2) return { data: [], error: e2.message };
    return { data: (rows ?? []) as Industry[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

/** Map of product_id -> industry slugs (for category facet filtering). */
export async function getIndustrySlugsByProductIds(
  productIds: string[],
): Promise<Map<string, string[]>> {
  const out = new Map<string, string[]>();
  if (productIds.length === 0) return out;
  try {
    const supabase = await createClient();
    const { data: links, error: e1 } = await supabase
      .from("industry_products")
      .select("product_id, industry_id")
      .in("product_id", productIds);
    if (e1 || !links?.length) return out;
    const indIds = [...new Set(links.map((l) => l.industry_id as string))];
    const { data: inds, error: e2 } = await supabase
      .from("industries")
      .select("id, slug")
      .in("id", indIds);
    if (e2 || !inds) return out;
    const idToSlug = new Map(inds.map((i) => [i.id as string, i.slug as string]));
    for (const l of links) {
      const sid = l.product_id as string;
      const slug = idToSlug.get(l.industry_id as string);
      if (!slug) continue;
      const cur = out.get(sid) ?? [];
      if (!cur.includes(slug)) cur.push(slug);
      out.set(sid, cur);
    }
    return out;
  } catch {
    return out;
  }
}

// ─── Articles ───────────────────────────────────────────────
export async function getPublishedArticles(): Promise<DataResponse<Article>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as Article[], error: null };
  } catch {
    return { data: [], error: "Database connection failed" };
  }
}

export async function getArticleBySlug(slug: string): Promise<ItemResponse<Article>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) return { data: null, error: error.message };
    return { data: data as Article | null, error: null };
  } catch {
    return { data: null, error: "Database connection failed" };
  }
}
