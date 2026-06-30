import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/services/_shared/supabase-config";
import {
  findPublishedEcatalogBySlug,
  findPublishedEcatalogs,
} from "@/services/ecatalogs/ecatalog.repository";
import {
  toEcatalogCardView,
  toEcatalogPublicView,
} from "@/services/ecatalogs/ecatalog.mapper";
import { parseEcatalogLinks } from "@/lib/ecatalog-links";

export async function getPublishedEcatalogCards(locale: string) {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createPublicClient();
    const rows = await findPublishedEcatalogs(supabase);
    return rows.map((row) => toEcatalogCardView(row, locale));
  } catch {
    return [];
  }
}

export async function getPublishedEcatalogBySlug(slug: string, locale: string) {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createPublicClient();
    const row = await findPublishedEcatalogBySlug(supabase, slug);
    if (!row) return null;

    const slugs = new Set<string>();
    for (const spread of row.spreads) {
      for (const link of parseEcatalogLinks(spread.links)) {
        slugs.add(link.product_slug);
      }
    }

    const productTitles = await fetchProductTitles(supabase, [...slugs], locale);
    return toEcatalogPublicView(row, locale, productTitles);
  } catch {
    return null;
  }
}

async function fetchProductTitles(
  supabase: ReturnType<typeof createPublicClient>,
  slugs: string[],
  locale: string,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (slugs.length === 0) return map;

  const { data, error } = await supabase
    .from("products")
    .select("slug, title_tr, title_en")
    .in("slug", slugs)
    .eq("status", "published");

  if (error || !data) return map;

  const isEn = locale === "en";
  for (const row of data) {
    map.set(row.slug, isEn ? row.title_en : row.title_tr);
  }
  return map;
}
