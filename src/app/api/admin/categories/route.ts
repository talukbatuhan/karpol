import { NextRequest, NextResponse } from 'next/server'
import { getAdminCategories } from '@/lib/data/admin-data'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'

export async function GET(request: NextRequest) {
  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  const { data, error } = await getAdminCategories()
  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
