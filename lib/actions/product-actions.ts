"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  productUpsertSchema,
  type ProductUpsertInput,
} from "@/lib/schemas/product";
import type { ProductRow, ProductStatus } from "@/lib/types/product";
import { getPublishedProductBySlug } from "@/lib/products-db";

function revalidateProductPaths(slug: string) {
  for (const locale of ["tr", "en"]) {
    revalidatePath(`/${locale}/products`);
    revalidatePath(`/${locale}/products/${slug}`);
  }
}

const productSelect = `
  *,
  category:categories (
    id,
    slug,
    name_tr,
    name_en
  )
`;

export async function listProductsAdmin(): Promise<ProductRow[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProductRow[];
}

export async function getProductAdmin(id: string): Promise<ProductRow | null> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as ProductRow) ?? null;
}

export async function createProduct(input: ProductUpsertInput) {
  const parsed = productUpsertSchema.parse(input);
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("products")
    .insert(parsed)
    .select("id, slug")
    .single();

  if (error) throw new Error(error.message);
  revalidateProductPaths(parsed.slug);
  return data;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductUpsertInput>,
) {
  const { supabase } = await requireAdmin();
  const partial = productUpsertSchema.partial().parse(input);

  const { data, error } = await supabase
    .from("products")
    .update(partial)
    .eq("id", id)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);
  if (data?.slug) revalidateProductPaths(data.slug as string);
  return data;
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (existing?.slug) revalidateProductPaths(existing.slug as string);
}

export async function setProductStatus(id: string, status: ProductStatus) {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);
  if (data?.slug) revalidateProductPaths(data.slug as string);
  return data;
}

export async function publishProduct(id: string) {
  return setProductStatus(id, "published");
}

export async function unpublishProduct(id: string) {
  return setProductStatus(id, "draft");
}

export { getPublishedProductBySlug };
