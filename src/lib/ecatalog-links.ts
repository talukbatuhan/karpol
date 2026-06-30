import type { EcatalogLink, EcatalogLinkSide } from "@/types/ecatalog";

export function parseEcatalogLinks(raw: unknown): EcatalogLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item, index) => ({
      id: String(item.id ?? `link-${index}`),
      side: (item.side === "right" ? "right" : "left") as EcatalogLinkSide,
      x: Number(item.x) || 0,
      y: Number(item.y) || 0,
      w: Number(item.w) || 10,
      h: Number(item.h) || 10,
      product_slug: String(item.product_slug ?? "").trim(),
      label_tr: item.label_tr ? String(item.label_tr) : undefined,
      label_en: item.label_en ? String(item.label_en) : undefined,
    }))
    .filter((link) => link.product_slug.length > 0);
}
