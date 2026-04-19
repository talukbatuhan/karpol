'use server'

import { revalidatePath } from 'next/cache'
import { upsertProduct, deleteProduct, upsertCategory, deleteCategory } from '@/lib/data/admin-data'

export async function saveProduct(formData: Record<string, unknown>) {
  const result = await upsertProduct(formData as Parameters<typeof upsertProduct>[0])

  if (!result.error) {
    revalidatePath('/admin/products')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
    revalidatePath('/[locale]/products/[category]', 'page')
    revalidatePath('/[locale]/products/[category]/[slug]', 'page')
  }

  return result
}

export async function removeProduct(id: string) {
  const result = await deleteProduct(id)

  if (!result.error) {
    revalidatePath('/admin/products')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
    revalidatePath('/[locale]/products/[category]', 'page')
    revalidatePath('/[locale]/products/[category]/[slug]', 'page')
  }

  return result
}

export async function saveCategory(formData: Record<string, unknown>) {
  const result = await upsertCategory(formData as Parameters<typeof upsertCategory>[0])

  if (!result.error) {
    revalidatePath('/admin/categories')
    revalidatePath('/en/products')
    revalidatePath('/tr/products')
  }

  return result
}

export async function removeCategory(id: string) {
  const result = await deleteCategory(id)

  if (!result.error) {
    revalidatePath('/admin/categories')
  }

  return result
}
