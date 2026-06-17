"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import {
  deleteFile,
  listFiles,
  uploadFile,
  type StorageBucket,
  type StorageFileItem,
} from "@/services/storage";

export async function listStorageFiles(
  bucket: StorageBucket,
  prefix = "",
): Promise<StorageFileItem[]> {
  const { supabase } = await requireAdmin();
  return listFiles(supabase, bucket, prefix);
}

export async function uploadStorageFile(
  bucket: StorageBucket,
  formData: FormData,
) {
  const { supabase } = await requireAdmin();
  return uploadFile(supabase, bucket, formData);
}

export async function deleteStorageFile(bucket: StorageBucket, path: string) {
  const { supabase } = await requireAdmin();
  return deleteFile(supabase, bucket, path);
}
