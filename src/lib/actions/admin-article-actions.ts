'use server'

import { revalidatePath } from 'next/cache'
import { upsertArticle, deleteArticle } from '@/lib/data/admin-data'

export async function saveArticle(formData: Record<string, unknown>) {
  const result = await upsertArticle(formData as Parameters<typeof upsertArticle>[0])

  if (!result.error) {
    revalidatePath('/admin/articles')
    revalidatePath('/en/knowledge')
    revalidatePath('/tr/knowledge')
  }

  return result
}

export async function removeArticle(id: string) {
  const result = await deleteArticle(id)

  if (!result.error) {
    revalidatePath('/admin/articles')
    revalidatePath('/en/knowledge')
    revalidatePath('/tr/knowledge')
  }

  return result
}
