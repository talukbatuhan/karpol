import { z } from "zod";
import { sortImagePathsByFilename } from "@/lib/product-image-sort";

export const productStatusSchema = z.enum(["draft", "published"]);

export const productSpecSchema = z.object({
  label_tr: z.string().min(1),
  label_en: z.string().min(1),
  value_tr: z.string().min(1),
  value_en: z.string().min(1),
});

const productSpecDraftSchema = z.object({
  label_tr: z.string(),
  label_en: z.string(),
  value_tr: z.string(),
  value_en: z.string(),
});

const technicalDrawingSchema = z.object({
  enabled: z.boolean(),
  image: z.string().optional(),
  caption_tr: z.string().optional(),
  caption_en: z.string().optional(),
});

const technicalTableColumnSchema = z.object({
  header_tr: z.string().min(1),
  header_en: z.string().min(1),
});

const technicalTableColumnDraftSchema = z.object({
  header_tr: z.string(),
  header_en: z.string(),
});

const technicalTableRowSchema = z.object({
  cells_tr: z.array(z.string()),
  cells_en: z.array(z.string()),
});

const technicalTableItemSchema = z.object({
  title_tr: z.string().optional(),
  title_en: z.string().optional(),
  columns: z
    .array(technicalTableColumnDraftSchema)
    .transform((columns) =>
      columns.filter(
        (column) => column.header_tr.trim() && column.header_en.trim(),
      ),
    )
    .pipe(z.array(technicalTableColumnSchema)),
  rows: z
    .array(technicalTableRowSchema)
    .transform((rows) =>
      rows.filter(
        (row) =>
          row.cells_tr.some((cell) => cell.trim()) ||
          row.cells_en.some((cell) => cell.trim()),
      ),
    ),
});

export const productAssetsSchema = z
  .object({
    images: z.array(z.string()).optional(),
    image: z.string().optional(),
    cad: z.string().optional(),
    pdf: z.string().optional(),
  })
  .transform((assets) => {
    const fromGallery = (assets.images ?? [])
      .map((path) => path.trim())
      .filter(Boolean);
    const legacy = assets.image?.trim();
    const images = sortImagePathsByFilename(
      fromGallery.length > 0 ? fromGallery : legacy ? [legacy] : [],
    );

    return {
      images,
      image: images[0] ?? "",
      cad: assets.cad?.trim() || undefined,
      pdf: assets.pdf?.trim() || undefined,
    };
  });

export const productMetadataSchema = z
  .object({
    tool_href: z.string().optional(),
    specs: z
      .array(productSpecDraftSchema)
      .transform((specs) =>
        specs.filter(
          (spec) =>
            spec.label_tr.trim() &&
            spec.label_en.trim() &&
            spec.value_tr.trim() &&
            spec.value_en.trim(),
        ),
      )
      .pipe(z.array(productSpecSchema)),
    assets: productAssetsSchema,
    technical_drawing: technicalDrawingSchema,
    technical_tables: z
      .array(technicalTableItemSchema)
      .transform((tables) => tables.filter((table) => table.columns.length > 0)),
  })
  .superRefine((metadata, ctx) => {
    if (metadata.technical_drawing.enabled && !metadata.technical_drawing.image?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["technical_drawing", "image"],
        message: "Teknik resim açıkken dosya yolu veya yükleme gerekli",
      });
    }
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

export type ProductUpsertInput = z.output<typeof productUpsertSchema>;
export type ProductUpsertFormValues = z.input<typeof productUpsertSchema>;
