import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

type SeoPageKey =
  | "home"
  | "about"
  | "products"
  | "contact"
  | "catalog"
  | "tools"
  | "toolMakara"
  | "toolKaucuk"
  | "toolSilim"
  | "toolRubberBellows";

const SEO_PATHS: Record<SeoPageKey, string> = {
  home: "/",
  about: "/about",
  products: "/products",
  contact: "/contact",
  catalog: "/e-katalog",
  tools: "/tools",
  toolMakara: "/tools/makara",
  toolKaucuk: "/tools/kaucuk-titresim-takozlari",
  toolSilim: "/tools/silim-lastigi",
  toolRubberBellows: "/tools/rubber-bellows",
};

export async function buildStaticPageMetadata(
  locale: string,
  page: SeoPageKey,
) {
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    path: SEO_PATHS[page],
    title: t(`pages.${page}.title`),
    description: t(`pages.${page}.description`),
  });
}
