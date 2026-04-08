'use server'

import { contactSchema } from '@/lib/validations'
import { createAdminClient } from '@/lib/supabase-admin'

export async function submitContact(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string || undefined,
    company: formData.get('company') as string || undefined,
    country: formData.get('country') as string || undefined,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
    locale: formData.get('locale') as string || undefined,
  }

  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors }
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('contact_submissions')
      .insert({ ...parsed.data, status: 'new' })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'Unexpected error' }
  }
}
