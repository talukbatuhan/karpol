'use server'

import { updateRFQStatus } from '@/lib/data/admin-data'
import { assertAdminSession } from '@/lib/auth/server-admin-session'

export async function updateRFQStatusAction(
  id: string,
  status: string,
  notes?: string,
) {
  const gate = await assertAdminSession()
  if (!gate.ok) {
    return { error: gate.message, code: gate.code }
  }
  return updateRFQStatus(id, status, notes)
}
