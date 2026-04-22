import { type NextRequest, type NextResponse } from 'next/server'
import { ApiCode, jsonError } from '@/lib/api/http'

export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null
  }

  const origin = request.headers.get('origin')
  if (!origin) {
    return jsonError('Invalid request origin', ApiCode.INVALID_ORIGIN, 403)
  }

  if (origin !== request.nextUrl.origin) {
    return jsonError('Invalid request origin', ApiCode.INVALID_ORIGIN, 403)
  }

  return null
}
