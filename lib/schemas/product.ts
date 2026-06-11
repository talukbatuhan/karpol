import { z } from "zod";

export const productStatusSchema = z.enum(["draft", "published"]);

export const productSpecSchema = z.object({
  label_tr: z.string().min(1),
  label_en: z.string().min(1),
  value_tr: z.string().min(1),
  value_en: z.string().min(1),
});

export const productAssetsSchema = z.object({
  image: z.string().optional(),
  cad: z.string().optional(),
  pdf: z.string().optional(),
});

export const productMetadataSchema = z.object({
  tool_href: z.string().optional(),
  specs: z.array(productSpecSchema),
  assets: productAssetsSchema,
});

export const productUpsertSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: küçük harf, rakam ve tire"),
  category_id: z.string().uuid("Geçerli bir kategori seçin"),
  status: productStatusSchema,
  title_tr: z.string().min(1),
  title_en: z.string().min(1),
  description_tr: z.string(),
  description_en: z.string(),
  body_tr: z.string(),
  body_en: z.string(),
  metadata: productMetadataSchema,
});

export type ProductUpsertInput = z.infer<typeof productUpsertSchema>;
