/** Araç çalışma alanı: /tools hub hariç alt sayfalar (ör. /tools/makara). */
export function isToolSubpagePath(pathname: string): boolean {
  return pathname.includes("/tools/") && pathname !== "/tools";
}
