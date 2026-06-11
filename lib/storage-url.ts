export function getPublicStorageUrl(
  bucket: "product-images" | "product-files",
  path: string,
) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !path) return "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}
