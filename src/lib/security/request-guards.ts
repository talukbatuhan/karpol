import { NextRequest, NextResponse } from 'next/server'

export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null
  }

  const origin = request.headers.get('origin')
  if (!origin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  if (origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 })
  }

  return null
}
