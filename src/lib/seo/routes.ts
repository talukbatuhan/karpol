/** Sitemap ve SEO için locale dışı statik public yollar. */
export const STATIC_SEO_PATHS = [
  "/",
  "/hakkimizda",
  "/urunler",
  "/iletisim",
  "/e-katalog",
] as const;

export type StaticSeoPath = (typeof STATIC_SEO_PATHS)[number];
