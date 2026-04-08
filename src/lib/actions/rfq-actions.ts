'use server'

import { rfqSchema } from '@/lib/validations'
import { createAdminClient } from '@/lib/supabase-admin'

export async function submitRFQ(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || undefined,
    company: formData.get('company') as string || undefined,
    country: formData.get('country') as string || undefined,
    industry: formData.get('industry') as string || undefined,
    product_interest: formData.get('product_interest') as string || undefined,
    quantity: formData.get('quantity') as string || undefined,
    material_preference: formData.get('material_preference') as string || undefined,
    hardness_requirement: formData.get('hardness_requirement') as string || undefined,
    urgency: (formData.get('urgency') as string) || 'standard',
    message: formData.get('message') as string,
    source_page: formData.get('source_page') as string || undefined,
    locale: formData.get('locale') as string || undefined,
    file_urls: JSON.parse((formData.get('file_urls') as string) || '[]'),
  }

  const parsed = rfqSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors }
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('rfq_submissions')
      .insert({ ...parsed.data, status: 'new' })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Unexpected error' }
  }
}
