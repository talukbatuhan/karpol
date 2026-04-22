import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { ApiCode, jsonError } from '@/lib/api/http'

function createRequestScopedSupabase(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  return { supabase, response }
}

export async function getRequestUserRole(request: NextRequest) {
  const { supabase, response } = createRequestScopedSupabase(request)
  const { data, error } = await supabase.auth.getUser()
  const user = data.user
  const role = user?.app_metadata?.role

  return { user, role, error, response }
}

export function isAdminMfaRequired(): boolean {
  return String(process.env.ADMIN_REQUIRE_MFA ?? 'false').toLowerCase() === 'true'
}

export function hasUserMfa(user: { factors?: unknown[]; app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> } | null | undefined): boolean {
  if (!user) return false
  if (Array.isArray(user.factors) && user.factors.length > 0) return true
  if (user.app_metadata?.mfa_enabled === true) return true
  if (user.user_metadata?.mfa_enabled === true) return true
  return false
}

export async function requireAdminApi(request: NextRequest): Promise<NextResponse | null> {
  const { user, role } = await getRequestUserRole(request)

  if (!user) {
    return jsonError('Unauthorized', ApiCode.UNAUTHORIZED, 401)
  }

  if (role !== 'admin') {
    return jsonError('Forbidden', ApiCode.FORBIDDEN, 403)
  }

  return null
}

export async function requireAdminContext(request: NextRequest): Promise<{
  denied: NextResponse | null
  userId: string | null
}> {
  const { user, role } = await getRequestUserRole(request)

  if (!user) {
    return {
      denied: jsonError('Unauthorized', ApiCode.UNAUTHORIZED, 401),
      userId: null,
    }
  }

  if (role !== 'admin') {
    return {
      denied: jsonError('Forbidden', ApiCode.FORBIDDEN, 403),
      userId: null,
    }
  }

  if (isAdminMfaRequired() && !hasUserMfa(user)) {
    return {
      denied: jsonError(
        'MFA required for this environment',
        ApiCode.MFA_REQUIRED,
        403,
      ),
      userId: user.id,
    }
  }

  return { denied: null, userId: user.id }
}
