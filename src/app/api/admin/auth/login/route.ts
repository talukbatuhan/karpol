import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { logAdminActivity, logSecurityEvent } from '@/lib/data/admin-data'
import { enforceSameOrigin } from '@/lib/security/request-guards'
import { touchAdminSessionCookie } from '@/lib/security/admin-session'
import { hasUserMfa, isAdminMfaRequired } from '@/lib/auth/admin-guard'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) {
    await logSecurityEvent({
      event: 'origin_check_failed',
      severity: 'high',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'admin_auth', stage: 'login' },
    })
    return invalidOrigin
  }

  let payload: z.infer<typeof loginSchema>
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    payload = parsed.data
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const throttled = await enforceRateLimit(request, 'auth-login', payload.email.toLowerCase())
  if (throttled) {
    await logSecurityEvent({
      event: 'rate_limit_exceeded',
      severity: 'medium',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'admin_auth', stage: 'login' },
    })
    return throttled
  }

  const pendingCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }> = []
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((cookie) => pendingCookies.push(cookie))
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  })

  if (error || !data.user) {
    await logSecurityEvent({
      event: 'login_failed',
      severity: 'medium',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'admin_auth' },
    })
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  if (data.user.app_metadata?.role !== 'admin') {
    await supabase.auth.signOut()
    await logSecurityEvent({
      event: 'login_non_admin_rejected',
      severity: 'high',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userId: data.user.id,
      details: { module: 'admin_auth' },
    })
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  if (isAdminMfaRequired() && !hasUserMfa(data.user)) {
    await supabase.auth.signOut()
    await logSecurityEvent({
      event: 'login_mfa_missing',
      severity: 'high',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userId: data.user.id,
      details: { module: 'admin_auth', stage: 'login' },
    })
    return NextResponse.json(
      { error: 'Admin MFA is required for this account' },
      { status: 403 }
    )
  }

  await logAdminActivity({
    userId: data.user.id,
    action: 'status_change',
    entityType: 'contact',
    entityId: data.user.id,
    details: {
      module: 'admin_auth',
      event: 'login_success',
      securitySeverity: 'low',
    },
  })

  const response = NextResponse.json({ success: true })
  pendingCookies.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie.options)
  })
  touchAdminSessionCookie(response)
  return response
}
