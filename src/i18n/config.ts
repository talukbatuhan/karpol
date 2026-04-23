/** Public site locales (next-intl + static generation). */
export const APP_LOCALES = ["en", "tr"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export function isAppLocale(s: string | undefined): s is AppLocale {
  return !!s && (APP_LOCALES as readonly string[]).includes(s);
}
