import { createClient } from "@/lib/supabase-server";

export type CatalogPageAsset = {
  index: number; // 0-based
  pageNumber: number; // 1-based
  url: string | null;
  thumbUrl: string | null;
};

export type CatalogManifest = {
  catalogId: string;
  totalPages: number;
  pages: CatalogPageAsset[];
};

const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp)$/i;

function extractLastNumber(path: string): number | null {
  // Extracts the last numeric segment before the extension, e.g. "page-001.webp" -> 1
  const fileName = path.split("/").pop() ?? path;
  const match = fileName.match(/(\d{1,4})(?=\.[a-z0-9]+$)/i);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

function isThumbPath(path: string): boolean {
  const p = path.toLowerCase();
  return p.includes("thumb") || p.includes("thumbnail") || p.includes("/thumbs/");
}

export async function getCatalogManifest(
  catalogId: string,
): Promise<CatalogManifest> {
  const supabase = await createClient();

  const bucket = process.env.NEXT_PUBLIC_CATALOG_STORAGE_BUCKET || "catalogs";
  const basePath = process.env.NEXT_PUBLIC_CATALOG_STORAGE_BASE_PATH || "";

  const prefix = [basePath, catalogId].filter(Boolean).join("/");
  const listPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;

  // #region agent log: catalog storage list inputs
  console.log("[CatalogStorage] getCatalogManifest inputs", {
    catalogId,
    bucket,
    basePath,
    prefix,
    listPrefix,
  });
  // #endregion

  const { data, error } = await supabase.storage.from(bucket).list(listPrefix, {
    limit: 2000,
  });

  if (error) {
    // #region agent log: catalog storage list error
    console.error("[CatalogStorage] storage.list error", {
      bucket,
      listPrefix,
      message: error.message,
    });
    // #endregion
    throw new Error(error.message);
  }

  const objects = data ?? [];

  // #region agent log: catalog storage list results
  console.log("[CatalogStorage] storage.list objects count", {
    listPrefix,
    count: objects.length,
    sampleNames: (objects as any[])
      .slice(0, 6)
      .map((o) => o?.name)
      .filter(Boolean),
  });
  // #endregion

  // Map: pageNumber -> { fullPath, thumbPath }
  const pagesByNumber = new Map<
    number,
    { fullPath: string | null; thumbPath: string | null }
  >();

  for (const obj of objects) {
    const name = (obj as any).name as string | undefined;
    if (!name) continue;
    const fullPath = `${listPrefix}${name}`;

    if (!IMAGE_EXT_REGEX.test(fullPath)) continue;

    const pageNumber = extractLastNumber(fullPath);
    if (!pageNumber) continue;

    const entry =
      pagesByNumber.get(pageNumber) ||
      ({ fullPath: null, thumbPath: null } as {
        fullPath: string | null;
        thumbPath: string | null;
      });

    if (isThumbPath(fullPath)) entry.thumbPath = entry.thumbPath ?? fullPath;
    else entry.fullPath = entry.fullPath ?? fullPath;

    pagesByNumber.set(pageNumber, entry);
  }

  const pageNumbers = Array.from(pagesByNumber.keys()).sort((a, b) => a - b);
  const totalPages = pageNumbers.length ? pageNumbers[pageNumbers.length - 1] : 0;

  const getPublicUrl = (path: string) => {
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  };

  const pages: CatalogPageAsset[] = [];
  for (let p = 1; p <= totalPages; p++) {
    const entry = pagesByNumber.get(p);
    const fullUrl = entry?.fullPath ? getPublicUrl(entry.fullPath) : null;
    const thumbUrl = entry?.thumbPath
      ? getPublicUrl(entry.thumbPath)
      : fullUrl;

    pages.push({
      index: p - 1,
      pageNumber: p,
      url: fullUrl,
      thumbUrl: thumbUrl,
    });
  }

  if (!pages.length || totalPages === 0) {
    return { catalogId, totalPages: 0, pages: [] };
  }

  return { catalogId, totalPages, pages };
}

