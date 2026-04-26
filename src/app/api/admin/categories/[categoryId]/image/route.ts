import { NextRequest, NextResponse } from 'next/server'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { enforceSameOrigin } from '@/lib/security/request-guards'
import { createAdminClient } from '@/lib/supabase-admin'

type Params = {
  params: Promise<{ categoryId: string }>
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) return invalidOrigin

  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  const { categoryId } = await params
  const body = await request.json().catch(() => ({})) as { imageUrl?: string | null }
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : null

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('product_categories')
    .update({ image_url: imageUrl })
    .eq('id', categoryId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
