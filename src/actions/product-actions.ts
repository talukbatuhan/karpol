"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  productUpsertSchema,
  type ProductUpsertInput,
} from "@/lib/schemas/product";
import type { ProductRow, ProductStatus } from "@/types/product";
import {
  deleteProductById,
  findAllProductsAdmin,
  findProductByIdAdmin,
  insertProduct,
  updateProductById,
  updateProductStatus,
} from "@/services/products/product.repository";
import {
  getPublishedProductBySlug,
  getPublishedProductSlugs,
} from "@/services/products";

function revalidateProductPaths(slug: string) {
  for (const locale of ["tr", "en"]) {
    revalidatePath(`/${locale}/products`);
    revalidatePath(`/${locale}/products/${slug}`);
    revalidatePath(`/${locale}`);
  }
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}

export async function listProductsAdmin(): Promise<ProductRow[]> {
  const { supabase } = await requireAdmin();
  return findAllProductsAdmin(supabase);
}

export async function getProductAdmin(id: string): Promise<ProductRow | null> {
  const { supabase } = await requireAdmin();
  return findProductByIdAdmin(supabase, id);
}

export async function createProduct(input: ProductUpsertInput) {
  const parsed = productUpsertSchema.parse(input);
  const { supabase } = await requireAdmin();
  const data = await insertProduct(supabase, parsed);
  revalidateProductPaths(parsed.slug);
  return data;
}

export async function updateProduct(
  id: string,
  input: Partial<ProductUpsertInput>,
) {
  const partial = productUpsertSchema.partial().parse(input);
  const { supabase } = await requireAdmin();
  const data = await updateProductById(supabase, id, partial);
  if (data?.slug) revalidateProductPaths(data.slug);
  return data;
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const slug = await deleteProductById(supabase, id);
  if (slug) revalidateProductPaths(slug);
}

export async function setProductStatus(id: string, status: ProductStatus) {
  const { supabase } = await requireAdmin();
  const data = await updateProductStatus(supabase, id, status);
  if (data?.slug) revalidateProductPaths(data.slug);
  return data;
}

export async function publishProduct(id: string) {
  return setProductStatus(id, "published");
}

export async function unpublishProduct(id: string) {
  return setProductStatus(id, "draft");
}

export { getPublishedProductBySlug, getPublishedProductSlugs };
