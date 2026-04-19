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

export function slugify(input: string): string {
  if (!input) return ''
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u',
  }
  return input
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
