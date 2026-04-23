import { NextRequest, NextResponse } from 'next/server'
import { getAdminCategoryAttributeDefinitions } from '@/lib/data/admin-data'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ categoryId: string }> },
) {
  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  const { categoryId } = await context.params
  if (!categoryId) {
    return NextResponse.json({ error: 'Missing category' }, { status: 400 })
  }

  const { data, error } = await getAdminCategoryAttributeDefinitions(categoryId)
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
  return NextResponse.json(data)
}
