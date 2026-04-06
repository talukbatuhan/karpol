import { createClient } from "@/lib/supabase-server";

export type CatalogPageAsset = {
  index: number;
  pageNumber: number;
  url: string | null;
  thumbUrl: string | null;
};

export type CatalogManifest = {
  catalogId: string;
  totalPages: number;
  pages: CatalogPageAsset[];
};

export async function getCatalogManifest(
  catalogId: string,
): Promise<CatalogManifest> {
  const supabase = await createClient();

  const bucket = "products";
  const folder = catalogId; // "catalogId" string'i

  console.log("[DEBUG] Listing:", bucket, folder);

  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, { limit: 500 });

  console.log("[DEBUG] Result:", { count: data?.length, error, sample: data?.slice(0, 3) });

  if (error) throw new Error(error.message);

  const objects = (data ?? [])
    .filter((o) => /\.(png|jpe?g|webp)$/i.test(o.name))
    .map((o) => ({
      name: o.name,
      pageNumber: parseInt(o.name, 10), // "1.png" → 1, "10.png" → 10
    }))
    .filter((o) => !isNaN(o.pageNumber))
    .sort((a, b) => a.pageNumber - b.pageNumber); // sayısal sıra: 1,2,3...10,11

  const totalPages = objects.length;
  if (!totalPages) return { catalogId, totalPages: 0, pages: [] };

  const pages: CatalogPageAsset[] = objects.map((o, idx) => {
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${folder}/${o.name}`);

    return {
      index: idx,
      pageNumber: o.pageNumber,
      url: urlData.publicUrl,
      thumbUrl: urlData.publicUrl,
    };
  });

  return { catalogId, totalPages, pages };
}