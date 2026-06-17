import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { ServiceError } from "@/services/_shared/errors";

type DbClient = SupabaseClient<Database>;

export type StorageBucket = "product-images" | "product-files";

export type StorageFileItem = {
  name: string;
  path: string;
  bucket: StorageBucket;
  size?: number;
  updatedAt?: string;
};

export async function listFiles(
  supabase: DbClient,
  bucket: StorageBucket,
  prefix = "",
): Promise<StorageFileItem[]> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 200,
    sortBy: { column: "updated_at", order: "desc" },
  });

  if (error) throw new ServiceError(error.message, error.name);

  return (data ?? [])
    .filter((f) => f.name && !f.name.endsWith("/"))
    .map((f) => ({
      name: f.name as string,
      path: prefix ? `${prefix}/${f.name}` : (f.name as string),
      bucket,
      size: f.metadata?.size as number | undefined,
      updatedAt: f.updated_at ?? undefined,
    }));
}

export async function uploadFile(
  supabase: DbClient,
  bucket: StorageBucket,
  formData: FormData,
) {
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "").trim();

  if (!file || file.size === 0) {
    return { error: "Dosya seçilmedi." } as const;
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = folder ? `${folder}/${safeName}` : safeName;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) return { error: error.message } as const;
  return { path, bucket } as const;
}

export async function deleteFile(
  supabase: DbClient,
  bucket: StorageBucket,
  path: string,
) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new ServiceError(error.message, error.name);
}
