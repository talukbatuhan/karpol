import type { LocalizedField, LocalizedArrayField, SupportedLocale } from '@/types/database'

const FALLBACK_LOCALE: SupportedLocale = 'en'

export function getLocalizedField(
  field: LocalizedField | undefined | null,
  locale: string,
  fallback = FALLBACK_LOCALE
): string {
  if (!field) return ''
  return field[locale as SupportedLocale] || field[fallback] || Object.values(field).find(Boolean) || ''
}

export function getLocalizedArray(
  field: LocalizedArrayField | undefined | null,
  locale: string,
  fallback = FALLBACK_LOCALE
): string[] {
  if (!field) return []
  return field[locale as SupportedLocale] || field[fallback] || []
}

export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "tr"];

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: "English",
  tr: "Türkçe",
};

export function getLocalizedSlug(
  field: LocalizedField | undefined | null,
  locale: string,
  canonicalFallback: string,
): string {
  if (!field) return canonicalFallback
  const direct = field[locale as SupportedLocale]
  if (direct && direct.length > 0) return direct
  const fallback = field[FALLBACK_LOCALE]
  if (fallback && fallback.length > 0) return fallback
  const anyValue = Object.values(field).find((v): v is string => Boolean(v))
  return anyValue || canonicalFallback
}

/**
 * Strips soft hyphens (Word/PDF), zero-width characters, and BOM that often
 * get pasted into slug fields. If left in place, a later sanitize pass may
 * turn each U+00AD into a real hyphen, producing "ti-tre-si-m" style slugs.
 */
export function stripSlugPasteArtifacts(input: string): string {
  return input.replace(/[\u00AD\u200B-\u200D\uFEFF\u2060]/g, '')
}

export function slugify(input: string): string {
  if (!input) return ''
  const text = stripSlugPasteArtifacts(input)
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
    'ä': 'ae', 'Ä': 'ae', 'ß': 'ss',
  }
  return text
    .split('')
    .map((ch) => trMap[ch] ?? ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
