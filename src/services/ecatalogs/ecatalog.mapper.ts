import { parseEcatalogLinks } from "@/lib/ecatalog-links";
import { resolveEcatalogImageUrl } from "@/lib/ecatalog-image";
import type {
  EcatalogLinkPublicView,
  EcatalogPublicView,
  EcatalogRow,
  EcatalogSpreadPublicView,
  EcatalogSummary,
} from "@/types/ecatalog";
import type { EcatalogWithSpreads } from "@/services/ecatalogs/ecatalog.repository";

export function toEcatalogSummary(row: EcatalogRow, locale: string): EcatalogSummary {
  return row;
}

export function toEcatalogCardView(row: EcatalogRow, locale: string) {
  const isEn = locale === "en";
  return {
    slug: row.slug,
    title: isEn ? row.title_en : row.title_tr,
    description: isEn ? row.description_en : row.description_tr,
    coverImage: resolveEcatalogImageUrl(row.cover_image),
    year: row.year,
  };
}

export function toEcatalogPublicView(
  row: EcatalogWithSpreads,
  locale: string,
  productTitles: Map<string, string>,
): EcatalogPublicView {
  const isEn = locale === "en";
  return {
    slug: row.slug,
    title: isEn ? row.title_en : row.title_tr,
    description: isEn ? row.description_en : row.description_tr,
    coverImage: resolveEcatalogImageUrl(row.cover_image),
    year: row.year,
    spreads: row.spreads.map((spread) =>
      toSpreadPublicView(spread, locale, productTitles),
    ),
  };
}

function toSpreadPublicView(
  spread: EcatalogWithSpreads["spreads"][number],
  locale: string,
  productTitles: Map<string, string>,
): EcatalogSpreadPublicView {
  const isEn = locale === "en";
  const links = parseEcatalogLinks(spread.links).map((link) =>
    toLinkPublicView(link, locale, productTitles),
  );

  return {
    sortOrder: spread.sort_order,
    leftImage: resolveEcatalogImageUrl(spread.left_image),
    rightImage: resolveEcatalogImageUrl(spread.right_image),
    links,
  };
}

function toLinkPublicView(
  link: ReturnType<typeof parseEcatalogLinks>[number],
  locale: string,
  productTitles: Map<string, string>,
): EcatalogLinkPublicView {
  const isEn = locale === "en";
  const customLabel = isEn ? link.label_en : link.label_tr;
  return {
    id: link.id,
    side: link.side,
    x: link.x,
    y: link.y,
    w: link.w,
    h: link.h,
    productSlug: link.product_slug,
    label: customLabel?.trim() || undefined,
    productTitle: productTitles.get(link.product_slug),
  };
}
