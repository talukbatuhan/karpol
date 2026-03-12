import { createClient } from "@/lib/supabase-server";
import type { Industry, Product, ProductCategory } from "@/types/database";

type DataResponse<T> = {
  data: T[];
  error: string | null;
};

type ItemResponse<T> = {
  data: T | null;
  error: string | null;
};

export async function getProductCategories(): Promise<DataResponse<ProductCategory>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data ?? []) as ProductCategory[], error: null };
  } catch {
    return { data: [], error: "Supabase bağlantısı kurulamadı." };
  }
}

export async function getIndustries(): Promise<DataResponse<Industry>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data ?? []) as Industry[], error: null };
  } catch {
    return { data: [], error: "Supabase bağlantısı kurulamadı." };
  }
}

export async function getProductCategoryBySlug(
  slug: string,
): Promise<ItemResponse<ProductCategory>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: "Kategori bulunamadı." };
    }

    return { data: data as ProductCategory, error: null };
  } catch {
    return { data: null, error: "Supabase bağlantısı kurulamadı." };
  }
}

export async function getProductsByCategorySlug(
  slug: string,
): Promise<DataResponse<Product>> {
  const { data: category, error: categoryError } =
    await getProductCategoryBySlug(slug);

  if (categoryError || !category) {
    return { data: [], error: categoryError ?? "Kategori bulunamadı." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data ?? []) as Product[], error: null };
  } catch {
    return { data: [], error: "Supabase bağlantısı kurulamadı." };
  }
}

export async function getProductByCategoryAndSlug(
  categorySlug: string,
  productSlug: string,
): Promise<ItemResponse<Product>> {
  const { data: category, error: categoryError } =
    await getProductCategoryBySlug(categorySlug);

  if (categoryError || !category) {
    return { data: null, error: categoryError ?? "Kategori bulunamadı." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("slug", productSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: "Ürün bulunamadı." };
    }

    return { data: data as Product, error: null };
  } catch {
    return { data: null, error: "Supabase bağlantısı kurulamadı." };
  }
}
