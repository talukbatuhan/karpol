import { NextRequest, NextResponse } from 'next/server'

const ADMIN_LAST_SEEN_COOKIE = 'karpol_admin_last_seen'

function getIdleTimeoutMs() {
  const raw = Number(process.env.ADMIN_IDLE_TIMEOUT_MINUTES ?? '30')
  const minutes = Number.isFinite(raw) && raw > 0 ? raw : 30
  return minutes * 60 * 1000
}

export function isAdminSessionIdleExpired(request: NextRequest): boolean {
  const lastSeenRaw = request.cookies.get(ADMIN_LAST_SEEN_COOKIE)?.value
  if (!lastSeenRaw) return false
  const lastSeen = Number(lastSeenRaw)
  if (!Number.isFinite(lastSeen) || lastSeen <= 0) return false
  return Date.now() - lastSeen > getIdleTimeoutMs()
}

export function touchAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_LAST_SEEN_COOKIE, String(Date.now()), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_LAST_SEEN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
