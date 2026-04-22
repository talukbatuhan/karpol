import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { logAdminActivity, logSecurityEvent } from '@/lib/data/admin-data'
import { enforceSameOrigin } from '@/lib/security/request-guards'
import { touchAdminSessionCookie } from '@/lib/security/admin-session'
import { hasUserMfa, isAdminMfaRequired } from '@/lib/auth/admin-guard'
import { ApiCode, jsonError, jsonSuccess } from '@/lib/api/http'

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
      return jsonError('Invalid request', ApiCode.VALIDATION_ERROR, 400, parsed.error.flatten())
    }
    payload = parsed.data
  } catch {
    return jsonError('Invalid request', ApiCode.BAD_REQUEST, 400)
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
    return jsonError('Invalid email or password', ApiCode.UNAUTHORIZED, 401)
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
    return jsonError('Invalid email or password', ApiCode.UNAUTHORIZED, 401)
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
    return jsonError(
      'Admin MFA is required for this account',
      ApiCode.MFA_REQUIRED,
      403,
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

  const response = jsonSuccess()
  pendingCookies.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie.options)
  })
  touchAdminSessionCookie(response)
  return response
}
