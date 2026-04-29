import { APP_LOCALES, type AppLocale } from "@/i18n/config";

/** Product category URL segment (TR uses `/urunler/...`). */
export function productsPathSegment(locale: string): string {
  return locale === "tr" ? "urunler" : "products";
}

/**
 * `alternates.languages` for hreflang: all app locales + `x-default` → English.
 */
export function buildAlternatesLanguages(
  buildHref: (locale: AppLocale) => string,
): Record<string, string> {
  const languages: Record<string, string> = {
    "x-default": buildHref("en"),
  };
  for (const loc of APP_LOCALES) {
    languages[loc] = buildHref(loc);
  }
  return languages;
}
