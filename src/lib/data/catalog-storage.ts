import { createAdminClient } from "@/lib/supabase-admin";

export type CatalogPageAsset = {
  index: number;
  pageNumber: number;
  url: string | null;
  thumbUrl: string | null;
};

export type CatalogManifest = {
  schemaVersion: number;
  catalogId: string;
  title?: string;
  updatedAt?: string;
  totalPages: number;
  pages: CatalogPageAsset[];
};

const CATALOG_BUCKET = "catalogs";
const IMAGE_REGEX = /\.(png|jpe?g|webp)$/i;

function normalizePageNumber(value: string): number | null {
  const parsed = parseInt(value.replace(/\D/g, ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function createFallbackManifest(catalogId: string): CatalogManifest {
  return {
    schemaVersion: 1,
    catalogId,
    totalPages: 0,
    pages: [],
    updatedAt: new Date().toISOString(),
  };
}

export async function getCatalogManifest(catalogId: string): Promise<CatalogManifest> {
  const supabase = createAdminClient();

  // Preferred: read manifest.json
  const { data: manifestBlob } = await supabase.storage
    .from(CATALOG_BUCKET)
    .download(`${catalogId}/manifest.json`);

  if (manifestBlob) {
    const parsed = JSON.parse(await manifestBlob.text()) as Partial<CatalogManifest>;
    const pages = (parsed.pages ?? []).map((p, idx) => ({
      index: typeof p.index === "number" ? p.index : idx,
      pageNumber:
        typeof p.pageNumber === "number"
          ? p.pageNumber
          : idx + 1,
      url: p.url ?? null,
      thumbUrl: p.thumbUrl ?? p.url ?? null,
    }));

    if (pages.length > 0) {
      return {
        schemaVersion: parsed.schemaVersion ?? 1,
        catalogId: parsed.catalogId ?? catalogId,
        title: parsed.title,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
        totalPages: parsed.totalPages ?? pages.length,
        pages,
      };
    }

    // Self-heal: manifest exists but empty -> infer from pages folder
    return buildCatalogManifestFromStorage(catalogId, parsed.title);
  }

  // Fallback: infer from /pages folder
  return buildCatalogManifestFromStorage(catalogId);
}

export async function listCatalogIds(): Promise<string[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(CATALOG_BUCKET).list("", { limit: 200 });
  if (error) return [];
  return Array.from(
    new Set(
      (data ?? [])
        .map((entry) => entry.name)
        .filter((name): name is string => Boolean(name))
        // Keep likely folder names; avoid root files like ".emptyFolderPlaceholder"
        .filter((name) => !name.includes("."))
    )
  ).sort((a, b) => a.localeCompare(b));
}

export async function saveCatalogManifest(manifest: CatalogManifest): Promise<void> {
  const supabase = createAdminClient();
  const payload = JSON.stringify({
    ...manifest,
    schemaVersion: manifest.schemaVersion ?? 1,
    updatedAt: new Date().toISOString(),
    totalPages: manifest.totalPages ?? manifest.pages.length,
  });

  const { error } = await supabase.storage
    .from(CATALOG_BUCKET)
    .upload(`${manifest.catalogId}/manifest.json`, payload, {
      contentType: "application/json",
      upsert: true,
      cacheControl: "60",
    });

  if (error) throw new Error(error.message);
}

export async function createEmptyCatalog(
  catalogId: string,
  title?: string,
): Promise<CatalogManifest> {
  const manifest: CatalogManifest = {
    schemaVersion: 1,
    catalogId,
    title,
    totalPages: 0,
    pages: [],
    updatedAt: new Date().toISOString(),
  };
  await saveCatalogManifest(manifest);
  return manifest;
}

export async function deleteCatalog(catalogId: string): Promise<void> {
  const supabase = createAdminClient();

  const folders = [`${catalogId}/pages`, `${catalogId}/thumbs`];
  for (const folder of folders) {
    const { data: files } = await supabase.storage
      .from(CATALOG_BUCKET)
      .list(folder, { limit: 1000 });

    if (files && files.length > 0) {
      const paths = files.map((f) => `${folder}/${f.name}`);
      await supabase.storage.from(CATALOG_BUCKET).remove(paths);
    }
  }

  await supabase.storage
    .from(CATALOG_BUCKET)
    .remove([`${catalogId}/manifest.json`]);
}

export async function buildCatalogManifestFromStorage(
  catalogId: string,
  title?: string,
): Promise<CatalogManifest> {
  const supabase = createAdminClient();
  const { data: files, error } = await supabase.storage
    .from(CATALOG_BUCKET)
    .list(`${catalogId}/pages`, { limit: 500 });

  if (error) return createFallbackManifest(catalogId);

  const pageFiles = (files ?? [])
    .filter((o) => IMAGE_REGEX.test(o.name))
    .map((o) => ({
      name: o.name,
      pageNumber: normalizePageNumber(o.name),
    }))
    .filter((o): o is { name: string; pageNumber: number } => o.pageNumber !== null)
    .sort((a, b) => a.pageNumber - b.pageNumber);

  const pages: CatalogPageAsset[] = pageFiles.map((file, idx) => {
    const { data: pageUrl } = supabase.storage
      .from(CATALOG_BUCKET)
      .getPublicUrl(`${catalogId}/pages/${file.name}`);
    const { data: thumbUrl } = supabase.storage
      .from(CATALOG_BUCKET)
      .getPublicUrl(`${catalogId}/thumbs/${file.name}`);

    return {
      index: idx,
      pageNumber: file.pageNumber,
      url: pageUrl.publicUrl,
      thumbUrl: thumbUrl.publicUrl || pageUrl.publicUrl,
    };
  });

  return {
    schemaVersion: 1,
    catalogId,
    title,
    totalPages: pages.length,
    pages,
    updatedAt: new Date().toISOString(),
  };
}