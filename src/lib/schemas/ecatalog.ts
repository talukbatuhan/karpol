import { z } from "zod";

function parsePercent(value: string | number): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const n = Number(trimmed.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function percentField(min: number, max: number) {
  return z
    .union([z.number(), z.string()])
    .transform(parsePercent)
    .pipe(z.number().min(min).max(max));
}

const ecatalogLinkSchema = z.object({
  id: z.string().min(1),
  side: z.enum(["left", "right"]),
  x: percentField(0, 100),
  y: percentField(0, 100),
  w: percentField(1, 100),
  h: percentField(1, 100),
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
export type EcatalogUpsertFormValues = z.input<typeof ecatalogUpsertSchema>;
