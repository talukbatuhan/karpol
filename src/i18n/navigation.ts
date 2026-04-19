import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",

  pathnames: {
    "/": "/",
    "/about": {
      en: "/about",
      tr: "/hakkimizda",
    },
    "/contact": {
      en: "/contact",
      tr: "/iletisim",
    },
    "/products": {
      en: "/products",
      tr: "/urunler",
    },
    "/custom-manufacturing": {
      en: "/custom-manufacturing",
      tr: "/ozel-uretim",
    },
    "/knowledge": {
      en: "/knowledge",
      tr: "/bilgi-merkezi",
    },
    "/catalog": {
      en: "/catalog",
      tr: "/katalog",
    },
    "/catalog/[catalogId]": {
      en: "/catalog/[catalogId]",
      tr: "/katalog/[catalogId]",
    },
    "/industries": {
      en: "/industries",
      tr: "/sektorler",
    },
    "/industries/[slug]": {
      en: "/industries/[slug]",
      tr: "/sektorler/[slug]",
    },
    "/factory-technology": {
      en: "/factory-technology",
      tr: "/fabrika-teknoloji",
    },
    "/products/[category]": {
      en: "/products/[category]",
      tr: "/urunler/[category]",
    },
    "/products/[category]/[slug]": {
      en: "/products/[category]/[slug]",
      tr: "/urunler/[category]/[slug]",
    },
    "/knowledge/[slug]": {
      en: "/knowledge/[slug]",
      tr: "/bilgi-merkezi/[slug]",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
