import { NextRequest, NextResponse } from 'next/server'

type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || now > existing.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      retryAfterSec: Math.ceil(windowMs / 1000),
    }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  store.set(key, existing)

  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  }
}

type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSec: number }

async function checkUpstashRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const now = Date.now()
  const windowKey = `ratelimit:${key}:${Math.floor(now / windowMs)}`
  try {
    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(windowKey)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!incrRes.ok) return null
    const incrData = (await incrRes.json()) as { result?: number }
    const count = Number(incrData?.result ?? 0)
    if (!Number.isFinite(count) || count <= 0) return null

    if (count === 1) {
      await fetch(`${url}/pexpire/${encodeURIComponent(windowKey)}/${windowMs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
    }

    const remaining = Math.max(0, limit - count)
    const retryAfterSec = Math.max(1, Math.ceil(windowMs / 1000))
    return {
      allowed: count <= limit,
      remaining,
      retryAfterSec,
    }
  } catch {
    return null
  }
}

export async function enforceRateLimit(
  request: NextRequest,
  scope: 'admin-api' | 'upload' | 'auth-login',
  identifier?: string
): Promise<NextResponse | null> {
  const ip = getClientIp(request)
  const path = request.nextUrl.pathname
  const limit = scope === 'upload' ? 45 : scope === 'auth-login' ? 10 : 180
  const windowMs = 60_000
  const key = `${scope}:${ip}:${path}:${identifier ?? 'default'}`
  const distributed = await checkUpstashRateLimit(key, limit, windowMs)
  const result = distributed ?? checkRateLimit(key, limit, windowMs)

  if (result.allowed) return null

  return NextResponse.json(
    { error: 'Too many requests. Please retry shortly.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfterSec),
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(result.remaining),
      },
    }
  )
}
