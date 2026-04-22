import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { requireAdminContext } from '@/lib/auth/admin-guard'
import { enforceRateLimit } from '@/lib/security/rate-limit'
import { enforceSameOrigin } from '@/lib/security/request-guards'
import { ApiCode, jsonError, jsonSuccess } from '@/lib/api/http'

/**
 * On-demand ISR revalidation. Requires an authenticated admin session
 * (same checks as other /api/admin routes).
 */
export async function POST(request: NextRequest) {
  const invalidOrigin = enforceSameOrigin(request)
  if (invalidOrigin) return invalidOrigin

  const throttled = await enforceRateLimit(request, 'admin-api')
  if (throttled) return throttled

  const { denied } = await requireAdminContext(request)
  if (denied) return denied

  try {
    const body = await request.json()
    const { path, tag } = body as { path?: string; tag?: string }

    if (!path && !tag) {
      return jsonError(
        'Provide at least one of `path` or `tag`',
        ApiCode.VALIDATION_ERROR,
        400,
      )
    }

    if (tag) {
      revalidateTag(tag, 'default')
    }

    if (path) {
      revalidatePath(path, 'page')
    }

    return jsonSuccess({ revalidated: true, now: Date.now() })
  } catch {
    return jsonError('Invalid request body', ApiCode.BAD_REQUEST, 400)
  }
}
