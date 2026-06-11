import { z } from "zod";

export const categoryUpsertSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: küçük harf, rakam ve tire"),
  name_tr: z.string().min(1).max(120),
  name_en: z.string().min(1).max(120),
  parent_id: z.union([z.string().uuid(), z.null()]),
  sort_order: z.number().int().min(0).max(9999),
});

export type CategoryUpsertInput = z.infer<typeof categoryUpsertSchema>;
