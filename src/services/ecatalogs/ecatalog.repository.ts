import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { EcatalogRow, EcatalogSpreadRow } from "@/types/ecatalog";
import type { EcatalogUpsertInput } from "@/lib/schemas/ecatalog";
import { ServiceError } from "@/services/_shared/errors";
import { fetchAllPages } from "@/services/_shared/paginate-query";

type DbClient = SupabaseClient<Database>;

export type EcatalogWithSpreads = EcatalogRow & {
  spreads: EcatalogSpreadRow[];
};

export async function findAllEcatalogsAdmin(
  supabase: DbClient,
): Promise<EcatalogRow[]> {
  const { data, error } = await supabase
    .from("ecatalogs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title_tr", { ascending: true });

  if (error) throw new ServiceError(error.message, error.code);
  return (data ?? []) as EcatalogRow[];
}

export async function findEcatalogByIdAdmin(
  supabase: DbClient,
  id: string,
): Promise<EcatalogWithSpreads | null> {
  const { data, error } = await supabase
    .from("ecatalogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new ServiceError(error.message, error.code);
  if (!data) return null;

  const spreads = await findSpreadsByEcatalogId(supabase, id);
  return { ...(data as EcatalogRow), spreads };
}

async function findSpreadsByEcatalogId(
  supabase: DbClient,
  ecatalogId: string,
): Promise<EcatalogSpreadRow[]> {
  const { data, error } = await supabase
    .from("ecatalog_spreads")
    .select("*")
    .eq("ecatalog_id", ecatalogId)
    .order("sort_order", { ascending: true });

  if (error) throw new ServiceError(error.message, error.code);
  return (data ?? []) as EcatalogSpreadRow[];
}

export async function insertEcatalog(
  supabase: DbClient,
  input: EcatalogUpsertInput,
) {
  const { spreads, ...catalog } = input;
  const { data, error } = await supabase
    .from("ecatalogs")
    .insert(catalog)
    .select("id, slug")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  await replaceSpreads(supabase, data.id, spreads);
  return data;
}

export async function updateEcatalogById(
  supabase: DbClient,
  id: string,
  input: Partial<EcatalogUpsertInput>,
) {
  const { spreads, ...catalog } = input;
  const { data, error } = await supabase
    .from("ecatalogs")
    .update(catalog)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error) throw new ServiceError(error.message, error.code);
  if (spreads) await replaceSpreads(supabase, id, spreads);
  return data;
}

async function replaceSpreads(
  supabase: DbClient,
  ecatalogId: string,
  spreads: EcatalogUpsertInput["spreads"],
) {
  const { error: deleteError } = await supabase
    .from("ecatalog_spreads")
    .delete()
    .eq("ecatalog_id", ecatalogId);

  if (deleteError) throw new ServiceError(deleteError.message, deleteError.code);
  if (spreads.length === 0) return;

  const rows = spreads.map((spread, index) => ({
    ecatalog_id: ecatalogId,
    sort_order: spread.sort_order ?? index,
    left_image: spread.left_image,
    right_image: spread.right_image,
    links: spread.links,
  }));

  const { error } = await supabase.from("ecatalog_spreads").insert(rows);
  if (error) throw new ServiceError(error.message, error.code);
}

export async function deleteEcatalogById(supabase: DbClient, id: string) {
  const { data, error } = await supabase
    .from("ecatalogs")
    .delete()
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) throw new ServiceError(error.message, error.code);
  return (data as { slug: string } | null)?.slug ?? null;
}

export async function findPublishedEcatalogs(
  supabase: DbClient,
): Promise<EcatalogRow[]> {
  return fetchAllPages(async (from, to) => {
    const { data, error } = await supabase
      .from("ecatalogs")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("title_tr", { ascending: true })
      .range(from, to);

    return { data: (data ?? []) as EcatalogRow[], error };
  });
}

export async function findPublishedEcatalogBySlug(
  supabase: DbClient,
  slug: string,
): Promise<EcatalogWithSpreads | null> {
  const { data, error } = await supabase
    .from("ecatalogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new ServiceError(error.message, error.code);
  if (!data) return null;

  const spreads = await findSpreadsByEcatalogId(supabase, data.id);
  return { ...(data as EcatalogRow), spreads };
}
