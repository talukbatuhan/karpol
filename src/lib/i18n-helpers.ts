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

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'tr', 'de', 'ar']

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
  ar: 'العربية',
}

export const RTL_LOCALES: SupportedLocale[] = ['ar']

export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as SupportedLocale)
}
