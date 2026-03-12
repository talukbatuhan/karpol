import { createClient } from "@/lib/supabase-server";
import { productCategories as staticCategories } from "@/lib/config";
import { getRichProductsByCategory, getRichProductContent } from "@/lib/product-content";
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
      // Fallback to static config if DB fails
      console.warn("Supabase error, falling back to static config:", error.message);
    }

    if (data) {
      return { data: data as ProductCategory, error: null };
    }

    // Fallback: Check static config
    const staticCategory = staticCategories.find((c) => c.slug === slug);
    if (staticCategory) {
      return {
        data: {
          id: `static-${staticCategory.slug}`,
          created_at: new Date().toISOString(),
          ...staticCategory,
          name_tr: staticCategory.name, // Placeholder
          description: "High-performance industrial component category.", // Placeholder
          description_tr: "Yüksek performanslı endüstriyel bileşen kategorisi.",
          image_url: undefined,
          sort_order: 0,
          is_active: true,
        } as ProductCategory,
        error: null,
      };
    }

    return { data: null, error: "Kategori bulunamadı." };
  } catch {
    // Fallback on crash
    const staticCategory = staticCategories.find((c) => c.slug === slug);
    if (staticCategory) {
      return {
        data: {
          id: `static-${staticCategory.slug}`,
          created_at: new Date().toISOString(),
          ...staticCategory,
          name_tr: staticCategory.name,
          description: "High-performance industrial component category.",
          description_tr: "Yüksek performanslı endüstriyel bileşen kategorisi.",
          image_url: undefined,
          sort_order: 0,
          is_active: true,
        } as ProductCategory,
        error: null,
      };
    }
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
      // Fallback to static config if DB fails
      console.warn("Supabase error (getProductsByCategorySlug), falling back to mock data:", error.message);
    }

    if (data && data.length > 0) {
      return { data: (data ?? []) as Product[], error: null };
    }

    // Fallback: Check rich content mock data
    const mockProducts = getRichProductsByCategory(slug);
    if (mockProducts.length > 0) {
      return {
        data: mockProducts.map((p, index) => ({
          id: `mock-${p.slug}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: p.slug,
          sku: `MOCK-${p.slug.toUpperCase().slice(0, 3)}-${index}`,
          name: p.name,
          name_tr: p.name, // Placeholder
          description: p.shortDescription,
          description_tr: p.shortDescription, // Placeholder
          category_id: `static-${slug}`,
          material: p.specs.find(s => s.label === "Material")?.value || "Unknown",
          is_active: true,
          is_featured: false,
          sort_order: index,
          images: p.imageGallery.map(img => img.url),
          applications: p.applications,
          compatible_machines: p.compatibleMachines,
          model_3d_url: p.modelEmbedUrl || undefined,
          technical_drawing_url: p.technicalDrawings[0]?.url,
          datasheet_url: p.documents[0]?.url,
        } as Product)),
        error: null
      };
    }

    return { data: (data ?? []) as Product[], error: null };
  } catch {
    // Fallback on crash
    const mockProducts = getRichProductsByCategory(slug);
    if (mockProducts.length > 0) {
      return {
        data: mockProducts.map((p, index) => ({
          id: `mock-${p.slug}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: p.slug,
          sku: `MOCK-${p.slug.toUpperCase().slice(0, 3)}-${index}`,
          name: p.name,
          name_tr: p.name,
          description: p.shortDescription,
          description_tr: p.shortDescription,
          category_id: `static-${slug}`,
          material: p.specs.find(s => s.label === "Material")?.value || "Unknown",
          is_active: true,
          is_featured: false,
          sort_order: index,
          images: p.imageGallery.map(img => img.url),
          applications: p.applications,
          compatible_machines: p.compatibleMachines,
          model_3d_url: p.modelEmbedUrl || undefined,
          technical_drawing_url: p.technicalDrawings[0]?.url,
          datasheet_url: p.documents[0]?.url,
        } as Product)),
        error: null
      };
    }
    return { data: [], error: "Supabase bağlantısı kurulamadı." };
  }
}

export async function getProductByCategoryAndSlug(
  categorySlug: string,
  productSlug: string,
): Promise<ItemResponse<Product>> {
  // Try to get category first, but if it fails we might still have mock product data
  const { data: category } = await getProductCategoryBySlug(categorySlug);

  try {
    const supabase = await createClient();
    let data = null;
    let error = null;

    if (category) {
      const result = await supabase
        .from("products")
        .select("*")
        .eq("category_id", category.id)
        .eq("slug", productSlug)
        .eq("is_active", true)
        .maybeSingle();
      data = result.data;
      error = result.error;
    }

    if (error) {
       console.warn("Supabase error (getProductByCategoryAndSlug), falling back to mock data:", error.message);
    }

    if (data) {
      return { data: data as Product, error: null };
    }

    // Fallback: Check rich content mock data
    const p = getRichProductContent(categorySlug, productSlug);
    if (p) {
      return {
        data: {
          id: `mock-${p.slug}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: p.slug,
          sku: `MOCK-${p.slug.toUpperCase().slice(0, 3)}-001`,
          name: p.name,
          name_tr: p.name,
          description: p.shortDescription,
          description_tr: p.shortDescription,
          category_id: category?.id ?? `static-${categorySlug}`,
          material: p.specs.find(s => s.label === "Material")?.value || "Unknown",
          is_active: true,
          is_featured: false,
          sort_order: 0,
          images: p.imageGallery.map(img => img.url),
          applications: p.applications,
          compatible_machines: p.compatibleMachines,
          model_3d_url: p.modelEmbedUrl || undefined,
          technical_drawing_url: p.technicalDrawings[0]?.url,
          datasheet_url: p.documents[0]?.url,
          size_table: p.sizeTable.map(s => ({
            size: s.size,
            wing: "-",
            width: s.width,
            innerDiameter: s.innerDiameter,
            outerDiameter: s.outerDiameter
          }))
        } as Product,
        error: null
      };
    }

    return { data: null, error: "Ürün bulunamadı." };
  } catch {
     // Fallback on crash
    const p = getRichProductContent(categorySlug, productSlug);
    if (p) {
      return {
        data: {
          id: `mock-${p.slug}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          slug: p.slug,
          sku: `MOCK-${p.slug.toUpperCase().slice(0, 3)}-001`,
          name: p.name,
          name_tr: p.name,
          description: p.shortDescription,
          description_tr: p.shortDescription,
          category_id: category?.id ?? `static-${categorySlug}`,
          material: p.specs.find(s => s.label === "Material")?.value || "Unknown",
          is_active: true,
          is_featured: false,
          sort_order: 0,
          images: p.imageGallery.map(img => img.url),
          applications: p.applications,
          compatible_machines: p.compatibleMachines,
          model_3d_url: p.modelEmbedUrl || undefined,
          technical_drawing_url: p.technicalDrawings[0]?.url,
          datasheet_url: p.documents[0]?.url,
          size_table: p.sizeTable.map(s => ({
            size: s.size,
            wing: "-",
            width: s.width,
            innerDiameter: s.innerDiameter,
            outerDiameter: s.outerDiameter
          }))
        } as Product,
        error: null
      };
    }
    return { data: null, error: "Supabase bağlantısı kurulamadı." };
  }
}
