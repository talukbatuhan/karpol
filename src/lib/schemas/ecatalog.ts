import { z } from "zod";

const ecatalogLinkSchema = z.object({
  id: z.string().min(1),
  side: z.enum(["left", "right"]),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  w: z.number().min(1).max(100),
  h: z.number().min(1).max(100),
  product_slug: z
    .string()
    .min(1, "Ürün slug gerekli")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Geçersiz ürün slug"),
  label_tr: z.string().optional(),
  label_en: z.string().optional(),
});

const ecatalogSpreadSchema = z.object({
  id: z.string().uuid().optional(),
  sort_order: z.number().int().min(0),
  left_image: z.string(),
  right_image: z.string(),
  links: z.array(ecatalogLinkSchema),
});

export const ecatalogUpsertSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: küçük harf, rakam ve tire"),
  status: z.enum(["draft", "published"]),
  title_tr: z.string().min(1, "Türkçe başlık gerekli"),
  title_en: z.string().min(1, "İngilizce başlık gerekli"),
  description_tr: z.string(),
  description_en: z.string(),
  cover_image: z.string(),
  year: z.string(),
  sort_order: z.number().int(),
  spreads: z.array(ecatalogSpreadSchema),
});

export type EcatalogUpsertInput = z.infer<typeof ecatalogUpsertSchema>;
