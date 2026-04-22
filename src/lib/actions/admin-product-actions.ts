'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import {
  upsertProduct,
  deleteProduct,
  upsertCategory,
  deleteCategory,
  replaceCategoryAttributeDefinitions,
  bulkUpdateProductsCategory,
  cloneAdminProduct,
  type CategoryAttributeDefinitionInput,
} from '@/lib/data/admin-data'
import { assertAdminSession } from '@/lib/auth/server-admin-session'

export async function saveProduct(formData: Record<string, unknown>) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }

  const result = await upsertProduct(formData as Parameters<typeof upsertProduct>[0])

  if (!result.error) {
    revalidatePath('/admin/products')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
    revalidatePath('/[locale]/products/[category]', 'page')
    revalidatePath('/[locale]/products/[category]/[slug]', 'page')
    revalidateTag('product-catalog')
  }

  return result
}

export async function removeProduct(id: string) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }

  const result = await deleteProduct(id)

  if (!result.error) {
    revalidatePath('/admin/products')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
    revalidatePath('/[locale]/products/[category]', 'page')
    revalidatePath('/[locale]/products/[category]/[slug]', 'page')
    revalidateTag('product-catalog')
  }

  return result
}

export async function saveCategory(formData: Record<string, unknown>) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }

  const result = await upsertCategory(formData as Parameters<typeof upsertCategory>[0])

  if (!result.error) {
    revalidatePath('/admin/categories')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
    revalidateTag('product-catalog')
  }

  return result
}

export async function removeCategory(id: string) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }

  const result = await deleteCategory(id)

  if (!result.error) {
    revalidatePath('/admin/categories')
    revalidateTag('product-catalog')
  }

  return result
}

export async function saveCategoryAttributeDefinitionsAction(
  categoryId: string,
  definitions: CategoryAttributeDefinitionInput[],
) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }

  const { error } = await replaceCategoryAttributeDefinitions(categoryId, definitions)
  if (!error) {
    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${categoryId}`)
    revalidateTag('product-catalog')
  }
  return { error: error ?? null }
}

export async function bulkAssignProductsCategoryAction(
  productIds: string[],
  categoryId: string | null,
) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }

  if (productIds.length === 0) {
    return { error: 'Ürün seçilmedi' }
  }

  const { error: err } = await bulkUpdateProductsCategory(productIds, categoryId)
  if (!err) {
    revalidatePath('/admin/products')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
    revalidatePath('/[locale]/products/[category]', 'page')
    revalidateTag('product-catalog')
  }
  return { error: err }
}

export async function cloneProductAction(sourceId: string) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code, id: null as string | null }
  }

  const { data, error } = await cloneAdminProduct(sourceId)
  if (!error && data) {
    revalidatePath('/admin/products')
    revalidateTag('product-catalog')
  }
  return { error: error ?? null, id: data?.id ?? null }
}
