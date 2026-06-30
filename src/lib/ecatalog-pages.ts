import type { EcatalogLink } from "@/types/ecatalog";
import type { EcatalogUpsertInput } from "@/lib/schemas/ecatalog";
import { parseEcatalogLinks } from "@/lib/ecatalog-links";
import type { EcatalogSpreadRow } from "@/types/ecatalog";

/** DB satırını admin formundaki tek sayfaya çevirir (eski sol/sağ çiftlerini ayırır). */
export function spreadRowToFormPages(
  spreads: EcatalogSpreadRow[],
): EcatalogUpsertInput["spreads"] {
  const pages: EcatalogUpsertInput["spreads"] = [];

  for (const spread of spreads) {
    const links = parseEcatalogLinks(spread.links);
    const hasLeft = Boolean(spread.left_image?.trim());
    const hasRight = Boolean(spread.right_image?.trim());

    if (hasLeft && hasRight) {
      pages.push({
        id: spread.id,
        sort_order: pages.length,
        left_image: spread.left_image,
        right_image: "",
        links: links.filter((link) => link.side === "left"),
      });
      pages.push({
        sort_order: pages.length,
        left_image: spread.right_image,
        right_image: "",
        links: links.filter((link) => link.side === "right"),
      });
      continue;
    }

    const image = hasLeft ? spread.left_image : spread.right_image;
    if (!image?.trim()) continue;

    pages.push({
      id: spread.id,
      sort_order: pages.length,
      left_image: image,
      right_image: "",
      links: links.map((link) => ({ ...link, side: "left" as const })),
    });
  }

  return pages;
}

/** Form sayfalarını DB spread satırlarına yazar (her sayfa = bir satır, görsel left_image). */
export function formPagesToSpreadRows(
  pages: EcatalogUpsertInput["spreads"],
): EcatalogUpsertInput["spreads"] {
  return pages
    .filter((page) => page.left_image?.trim())
    .map((page, index) => ({
      ...page,
      sort_order: index,
      right_image: "",
      links: (page.links ?? []).map((link) => ({ ...link, side: "left" as const })),
    }));
}

export function sortFilesNaturally(files: File[]): File[] {
  return [...files].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
  );
}

export async function uploadEcatalogImage(file: File): Promise<string | null> {
  const { uploadStorageFile } = await import("@/actions/storage-actions");
  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", "ecatalog");
  const result = await uploadStorageFile("product-images", formData);
  if ("error" in result && result.error) return null;
  return "path" in result && result.path ? result.path : null;
}
