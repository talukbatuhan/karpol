import { z } from 'zod'
import type { CategoryAttributeDefinition, LocalizedField } from '@/types/database'
import {
  EMPTY_SIZE_TABLE,
  type ProductSpecificationTable,
  type SizeTableBlock,
} from '@/types/database'
import { specificationsToDbPayload, sizeTablesToDbPayload } from '@/lib/product-utils'

const localeKeys: (keyof LocalizedField)[] = ['en', 'tr']

const localizedFieldSchema = z
  .record(z.string(), z.string().optional())
  .optional()
  .default({})

function hasCanonicalSlug(slugs: LocalizedField | undefined): boolean {
  if (!slugs) return false
  return localeKeys.some((k) => (slugs[k] ?? '').trim().length > 0)
}

export const productFormBaseSchema = z.object({
  name: localizedFieldSchema,
  description: localizedFieldSchema,
  short_description: localizedFieldSchema,
  slugs: localizedFieldSchema,
  sku: z.string().min(1, 'SKU gerekli'),
  category_id: z.string().optional(),
  material: z.string().optional(),
  hardness: z.string().optional(),
  hardness_unit: z.string().optional(),
  color: z.string().optional(),
  weight: z.string().optional(),
  temperature_min: z.string().optional(),
  temperature_max: z.string().optional(),
  compatible_machines: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.string().optional(),
  structured_attributes: z.record(z.string(), z.unknown()).optional().default({}),
})

export function buildProductFormSchema(definitions: CategoryAttributeDefinition[]) {
  return productFormBaseSchema
    .superRefine((data, ctx) => {
      if (!hasCanonicalSlug(data.slugs as LocalizedField)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['slugs'], message: 'En az bir dil için URL slug girin' })
      }
      const name = data.name as LocalizedField | undefined
      if (!name || !Object.values(name).some((v) => (v ?? '').trim().length > 0)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['name'], message: 'Ürün adı en az bir dilde girilmelidir' })
      }
      const struct = (data.structured_attributes ?? {}) as Record<string, unknown>
      for (const d of definitions) {
        if (!d.is_required_for_publish) continue
        const v = struct[d.key]
        const empty =
          v == null ||
          v === '' ||
          (Array.isArray(v) && v.length === 0) ||
          (typeof v === 'number' && Number.isNaN(v))
        if (empty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['structured_attributes', d.key],
            message: `${d.label_tr || d.key} gerekli`,
          })
        }
      }
    })
}

export type ProductFormInput = z.infer<typeof productFormBaseSchema>

export function canonicalProductSlug(slugs: LocalizedField | undefined | null): string {
  if (!slugs) return ''
  const primary = (slugs.en || slugs.tr || '').trim()
  if (primary) return primary
  const any = Object.values(slugs).find(
    (v) => typeof v === 'string' && v.trim().length > 0,
  ) as string | undefined
  return (any || '').trim()
}

export function productFormToServerPayload(
  data: ProductFormInput,
  extra: {
    id?: string
    modules: import('@/types/database').ProductModules
    specificationTables: ProductSpecificationTable[]
    sizeTableBlocks: SizeTableBlock[]
    gallery: import('@/types/database').ProductGalleryAsset[]
    technical_drawings: import('@/types/database').ProductTechnicalDrawing[]
    model_3d: import('@/types/database').ProductModel3D
    datasheets: import('@/types/database').ProductDatasheet[]
    applications: import('@/types/database').LocalizedArrayField
    images: string[]
  },
) {
  const struct = { ...(data.structured_attributes as Record<string, unknown> | undefined) }
  for (const k of Object.keys(struct)) {
    const v = struct[k]
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      delete struct[k]
    }
  }

  return {
    ...(extra.id ? { id: extra.id } : {}),
    name: data.name as LocalizedField,
    description: data.description as LocalizedField,
    short_description: data.short_description as LocalizedField,
    slug: canonicalProductSlug(data.slugs as LocalizedField),
    slugs: data.slugs as LocalizedField,
    sku: data.sku,
    category_id: data.category_id || undefined,
    material: data.material || undefined,
    hardness: data.hardness || undefined,
    hardness_unit: data.hardness_unit,
    color: data.color || undefined,
    weight: data.weight || undefined,
    temperature_min: data.temperature_min ? Number(data.temperature_min) : undefined,
    temperature_max: data.temperature_max ? Number(data.temperature_max) : undefined,
    modules: extra.modules,
    specifications: extra.modules.specifications
      ? specificationsToDbPayload(extra.specificationTables)
      : [],
    size_table: extra.modules.size_table
      ? sizeTablesToDbPayload(extra.sizeTableBlocks)
      : EMPTY_SIZE_TABLE,
    gallery: extra.modules.gallery ? extra.gallery : [],
    technical_drawings: extra.modules.technical_drawing ? extra.technical_drawings : [],
    model_3d: extra.modules.model_3d ? extra.model_3d : {},
    datasheets: extra.modules.datasheet ? extra.datasheets : [],
    applications: extra.modules.applications ? extra.applications : {},
    compatible_machines: (data.compatible_machines || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    is_active: data.is_active,
    is_featured: data.is_featured,
    images: extra.images,
    sort_order: Number.isFinite(Number(data.sort_order)) ? Number(data.sort_order) : 0,
    structured_attributes: Object.keys(struct).length > 0 ? struct : null,
  }
}
