import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase-middleware';
import { getRequestUserRole, hasUserMfa, isAdminMfaRequired } from './lib/auth/admin-guard';
import {
  clearAdminSessionCookie,
  isAdminSessionIdleExpired,
  touchAdminSessionCookie,
} from './lib/security/admin-session';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin UI bypasses i18n. `/api/*` is excluded from this middleware (see `config.matcher`);
  // each `/api/admin/*` handler must call `requireAdminContext` (or equivalent).
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return updateSession(request);
    }

    if (isAdminSessionIdleExpired(request)) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      clearAdminSessionCookie(response);
      return response;
    }

    const { user, role } = await getRequestUserRole(request);
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (isAdminMfaRequired() && !hasUserMfa(user)) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('mfa', 'required');
      return NextResponse.redirect(loginUrl);
    }
    const response = await updateSession(request);
    touchAdminSessionCookie(response);
    return response;
  }

  // Vanity / fixed URLs without locale prefix (next-intl would otherwise redirect e.g. → /tr/...)
  if (pathname === '/hasankara' || pathname.startsWith('/hasankara/')) {
    return updateSession(request);
  }

  const response = handleI18nRouting(request);

  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  const supabaseResponse = await updateSession(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
