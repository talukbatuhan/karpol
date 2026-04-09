import { NextRequest, NextResponse } from 'next/server'
import { getAdminProductById } from '@/lib/data/admin-data'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'

export async function GET(request: NextRequest) {
  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { data, error } = await getAdminProductById(id)
  if (error || !data) {
    return NextResponse.json({ error: error || 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
