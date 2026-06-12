import { getEcardSlugs } from "@/lib/ecard/cards";

const ECARD_SLUGS = new Set(getEcardSlugs());

/** Kök URL: /hasankara */
export function getPublicEcardSlug(pathname: string): string | null {
  const match = pathname.match(/^\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = match[1];
  return ECARD_SLUGS.has(slug) ? slug : null;
}

/** Dahili rota: /ecard/hasankara */
export function getInternalEcardSlug(pathname: string): string | null {
  const match = pathname.match(/^\/ecard\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = match[1];
  return ECARD_SLUGS.has(slug) ? slug : null;
}

/** Eski locale'li yol: /tr/kart/hasankara */
export function getLegacyLocaleEcardSlug(pathname: string): string | null {
  const match = pathname.match(/^\/(tr|en)\/kart\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = match[2];
  return ECARD_SLUGS.has(slug) ? slug : null;
}

/** Locale önekli kısa yol: /tr/hasankara */
export function getLocalePrefixedEcardSlug(pathname: string): string | null {
  const match = pathname.match(/^\/(tr|en)\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = match[2];
  return ECARD_SLUGS.has(slug) ? slug : null;
}

export function getEcardPublicPath(slug: string): string {
  return `/${slug}`;
}
