import { getTranslations } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";

type SeoPageKey = "home" | "about" | "products" | "contact" | "catalog";

const SEO_PATHS: Record<SeoPageKey, string> = {
  home: "/",
  about: "/hakkimizda",
  products: "/urunler",
  contact: "/iletisim",
  catalog: "/e-katalog",
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
