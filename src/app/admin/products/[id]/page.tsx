'use client'

import { use } from 'react'
import ProductEditorForm from '@/components/admin/ProductForm/ProductEditorForm'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <ProductEditorForm mode="edit" productId={id} />
}
