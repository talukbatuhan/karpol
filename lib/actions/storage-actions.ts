"use server";

import { requireAdmin } from "@/lib/auth/require-admin";

export type StorageFileItem = {
  name: string;
  path: string;
  bucket: string;
  size?: number;
  updatedAt?: string;
};

export async function listStorageFiles(
  bucket: "product-images" | "product-files",
  prefix = "",
): Promise<StorageFileItem[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 200,
    sortBy: { column: "updated_at", order: "desc" },
  });

  if (error) throw new Error(error.message);

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

export async function uploadStorageFile(
  bucket: "product-images" | "product-files",
  formData: FormData,
) {
  const { supabase } = await requireAdmin();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "").trim();

  if (!file || file.size === 0) {
    return { error: "Dosya seçilmedi." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = folder ? `${folder}/${safeName}` : safeName;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });

  if (error) return { error: error.message };
  return { path, bucket };
}

export async function deleteStorageFile(
  bucket: "product-images" | "product-files",
  path: string,
) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}
