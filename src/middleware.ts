import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './lib/supabase-middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes bypass i18n — English-only, auth-gated
  if (pathname.startsWith('/admin')) {
    const supabaseResponse = await updateSession(request);
    return supabaseResponse;
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
