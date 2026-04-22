import { createClient } from "@/lib/supabase-server";
import { hasUserMfa, isAdminMfaRequired } from "@/lib/auth/admin-guard";
import { ApiCode } from "@/lib/api/http";

export type AdminSessionOk = { ok: true; userId: string };
export type AdminSessionDenied = { ok: false; message: string; code: string };

/**
 * Validates the current Supabase session for server components, server actions,
 * and route handlers that use `cookies()` (not raw `NextRequest`).
 */
export async function assertAdminSession(): Promise<
  AdminSessionOk | AdminSessionDenied
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      message: "Oturum geçersiz veya süresi dolmuş.",
      code: ApiCode.UNAUTHORIZED,
    };
  }

  if (user.app_metadata?.role !== "admin") {
    return {
      ok: false,
      message: "Bu işlem için yetkiniz yok.",
      code: ApiCode.FORBIDDEN,
    };
  }

  if (isAdminMfaRequired() && !hasUserMfa(user)) {
    return {
      ok: false,
      message: "Yönetici hesabında MFA etkin olmalıdır.",
      code: ApiCode.MFA_REQUIRED,
    };
  }

  return { ok: true, userId: user.id };
}
