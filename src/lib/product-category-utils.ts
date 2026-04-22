import { getLocalizedField, getLocalizedSlug } from '@/lib/i18n-helpers'
import type {
  CategoryAttributeDefinition,
  CategoryFacetConfig,
  ProductCategory,
} from '@/types/database'

export type PublicCategoryTreeNode = {
  id: string
  hrefCategorySlug: string
  label: string
  children: PublicCategoryTreeNode[]
}

export function mergeFacetConfig(raw: unknown): CategoryFacetConfig {
  if (!raw || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  const custom = o.customFacetKeys
  return {
    material: typeof o.material === 'boolean' ? o.material : undefined,
    hardness: typeof o.hardness === 'boolean' ? o.hardness : undefined,
    customFacetKeys: Array.isArray(custom)
      ? custom.filter((x): x is string => typeof x === 'string')
      : undefined,
  }
}

export function effectiveFacetFlags(config: CategoryFacetConfig | null | undefined) {
  const c = config ?? {}
  return {
    material: c.material !== false,
    hardness: c.hardness !== false,
    customFacetKeys: c.customFacetKeys ?? [],
  }
}

export function buildCategoryAncestorChain(
  categoryId: string,
  all: ProductCategory[],
): ProductCategory[] {
  const byId = new Map(all.map((x) => [x.id, x]))
  const chain: ProductCategory[] = []
  let cur: ProductCategory | undefined = byId.get(categoryId)
  const guard = new Set<string>()
  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id)
    chain.unshift(cur)
    cur = cur.parent_id ? byId.get(cur.parent_id) : undefined
  }
  return chain
}

export function buildPublicCategoryTree(
  categories: ProductCategory[],
  locale: string,
): PublicCategoryTreeNode[] {
  const childrenOf = (parentId: string | null) =>
    categories
      .filter((c) => (c.parent_id ?? null) === parentId)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  const mapNode = (c: ProductCategory): PublicCategoryTreeNode => ({
    id: c.id,
    hrefCategorySlug: getLocalizedSlug(c.slugs, locale, c.slug),
    label: getLocalizedField(c.name, locale) || c.slug,
    children: childrenOf(c.id).map(mapNode),
  })

  return childrenOf(null).map(mapNode)
}

export function normalizeAttributeDefinitionRow(
  row: CategoryAttributeDefinition & { options?: unknown },
): CategoryAttributeDefinition {
  let options: string[] = []
  if (Array.isArray(row.options)) {
    options = row.options.map((x) => (typeof x === 'string' ? x : String(x)))
  }
  return { ...row, options }
}
