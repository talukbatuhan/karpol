/** Production’da `.env.local` içinde gerçek domain kullanın. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}

export const DEFAULT_OG_IMAGE = "/karpol-logo-nav.png";
