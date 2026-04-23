import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { APP_LOCALES } from "./config";

// TR keeps localized slugs; EN uses canonical paths.
const p = (en: string, tr: string) => ({
  en,
  tr,
});

export const routing = defineRouting({
  locales: [...APP_LOCALES],
  defaultLocale: "en",

  pathnames: {
    "/": "/",
    "/about": p("/about", "/hakkimizda"),
    "/contact": p("/contact", "/iletisim"),
    "/products": p("/products", "/urunler"),
    "/custom-manufacturing": p("/custom-manufacturing", "/ozel-uretim"),
    "/knowledge": p("/knowledge", "/bilgi-merkezi"),
    "/catalog": p("/catalog", "/katalog"),
    "/catalog/[catalogId]": p("/catalog/[catalogId]", "/katalog/[catalogId]"),
    "/industries": p("/industries", "/sektorler"),
    "/industries/[slug]": p("/industries/[slug]", "/sektorler/[slug]"),
    "/factory-technology": p("/factory-technology", "/fabrika-teknoloji"),
    "/products/[category]": p("/products/[category]", "/urunler/[category]"),
    "/products/[category]/[slug]": p(
      "/products/[category]/[slug]",
      "/urunler/[category]/[slug]",
    ),
    "/knowledge/[slug]": p("/knowledge/[slug]", "/bilgi-merkezi/[slug]"),
  },
});

export type AppPathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
