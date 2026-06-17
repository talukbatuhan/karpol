/** Sitemap ve SEO için locale dışı statik public yollar. */
export const STATIC_SEO_PATHS = [
  "/",
  "/about",
  "/products",
  "/contact",
  "/e-katalog",
  "/tools",
  "/tools/makara",
  "/tools/kaucuk-titresim-takozlari",
  "/tools/silim-lastigi",
] as const;

export type StaticSeoPath = (typeof STATIC_SEO_PATHS)[number];
