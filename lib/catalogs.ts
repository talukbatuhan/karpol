export const catalogIds = [
  "general",
  "marble",
  "conveyor",
  "rubber",
] as const;

export type CatalogId = (typeof catalogIds)[number];

export type CatalogMeta = {
  id: CatalogId;
  messageKey: CatalogId;
  /** public/ altındaki PDF yolu — dosyayı ekledikten sonra güncelleyin */
  pdfHref?: string;
};

export const catalogs: CatalogMeta[] = [
  {
    id: "general",
    messageKey: "general",
    pdfHref: "/catalog/karpol-genel-katalog.pdf",
  },
  {
    id: "marble",
    messageKey: "marble",
    pdfHref: "/catalog/karpol-mermer-makineleri.pdf",
  },
  {
    id: "conveyor",
    messageKey: "conveyor",
    pdfHref: "/catalog/karpol-konveyor-makara.pdf",
  },
  {
    id: "rubber",
    messageKey: "rubber",
    pdfHref: "/catalog/karpol-kaucuk-urunler.pdf",
  },
];
