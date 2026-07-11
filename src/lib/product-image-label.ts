/**
 * Display label from a storage path, e.g. `folder/KRP-KAP-003.jpg` → `KRP-KAP-003`.
 */
export function imagePathToLabel(path: string): string {
  const base = path.split("/").pop() ?? path;
  const withoutExt = base.replace(/\.[^.]+$/u, "");
  return withoutExt.replace(/_/g, "-").trim() || base;
}
