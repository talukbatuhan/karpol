"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  ecatalogUpsertSchema,
  type EcatalogUpsertInput,
} from "@/lib/schemas/ecatalog";
import type { EcatalogRow, EcatalogStatus } from "@/types/ecatalog";
import {
  deleteEcatalogById,
  findAllEcatalogsAdmin,
  findEcatalogByIdAdmin,
  insertEcatalog,
  updateEcatalogById,
} from "@/services/ecatalogs/ecatalog.repository";

function revalidateEcatalogPaths(slug: string) {
  for (const locale of ["tr", "en"]) {
    revalidatePath(`/${locale}/e-katalog`);
    revalidatePath(`/${locale}/e-katalog/${slug}`);
  }
  revalidatePath("/admin/ecatalogs");
}

export async function listEcatalogsAdmin(): Promise<EcatalogRow[]> {
  const { supabase } = await requireAdmin();
  return findAllEcatalogsAdmin(supabase);
}

export async function getEcatalogAdmin(id: string) {
  const { supabase } = await requireAdmin();
  return findEcatalogByIdAdmin(supabase, id);
}

export async function createEcatalog(input: EcatalogUpsertInput) {
  const parsed = ecatalogUpsertSchema.parse(input);
  const { supabase } = await requireAdmin();
  const data = await insertEcatalog(supabase, parsed);
  revalidateEcatalogPaths(parsed.slug);
  return data;
}

export async function updateEcatalog(
  id: string,
  input: Partial<EcatalogUpsertInput>,
) {
  const partial = ecatalogUpsertSchema.partial().parse(input);
  const { supabase } = await requireAdmin();
  const data = await updateEcatalogById(supabase, id, partial);
  if (data?.slug) revalidateEcatalogPaths(data.slug);
  return data;
}

export async function deleteEcatalog(id: string) {
  const { supabase } = await requireAdmin();
  const slug = await deleteEcatalogById(supabase, id);
  if (slug) revalidateEcatalogPaths(slug);
}

export async function setEcatalogStatus(id: string, status: EcatalogStatus) {
  const { supabase } = await requireAdmin();
  const data = await updateEcatalogById(supabase, id, { status });
  if (data?.slug) revalidateEcatalogPaths(data.slug);
  return data;
}

export async function listPublishedProductSlugsAdmin(): Promise<string[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published")
    .order("slug");

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.slug);
}
