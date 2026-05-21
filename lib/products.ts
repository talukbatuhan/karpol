export const productSlugs = ["makara", "damper", "silim"] as const;

export type ProductSlug = (typeof productSlugs)[number];

export type ProductMeta = {
  slug: ProductSlug;
  toolHref?:
    | "/tools/makara"
    | "/tools/kaucuk-titresim-takozlari"
    | "/tools/silim-lastigi";
  messageKey: ProductSlug;
};

export const products: ProductMeta[] = [
  {
    slug: "makara",
    messageKey: "makara",
    toolHref: "/tools/makara",
  },
  {
    slug: "damper",
    messageKey: "damper",
    toolHref: "/tools/kaucuk-titresim-takozlari",
  },
  {
    slug: "silim",
    messageKey: "silim",
    toolHref: "/tools/silim-lastigi",
  },
];

export function getProduct(slug: string): ProductMeta | undefined {
  return products.find((p) => p.slug === slug);
}
