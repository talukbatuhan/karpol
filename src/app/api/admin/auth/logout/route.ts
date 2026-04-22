import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { jsonSuccess } from '@/lib/api/http'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { enforceSameOrigin } from '@/lib/security/request-guards'
import { getRequestUserRole } from '@/lib/auth/admin-guard'
import { logAdminActivity, logSecurityEvent } from '@/lib/data/admin-data'
import { clearAdminSessionCookie } from '@/lib/security/admin-session'

export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) {
    await logSecurityEvent({
      event: 'origin_check_failed',
      severity: 'high',
      requestPath: request.nextUrl.pathname,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      details: { module: 'admin_auth', stage: 'logout' },
    })
    return invalidOrigin
  }

  const throttled = await enforceRateLimit(request, 'auth-login', 'logout')
  if (throttled) return throttled

  const { user } = await getRequestUserRole(request)

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

  await supabase.auth.signOut()

  if (user?.id) {
    await logAdminActivity({
      userId: user.id,
      action: 'status_change',
      entityType: 'page_content',
      entityId: user.id,
      details: {
        module: 'admin_auth',
        event: 'logout_success',
        securitySeverity: 'low',
      },
    })
  }

  const response = jsonSuccess()
  pendingCookies.forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie.options)
  })
  clearAdminSessionCookie(response)
  return response
}
