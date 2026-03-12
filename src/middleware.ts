import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/navigation';
import { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase-middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Handle i18n routing (redirects, rewrites, locale handling)
  const response = handleI18nRouting(request);

  // 2. If it's a redirect (3xx), return immediately.
  // The browser will follow the redirect, and the session refresh can happen on the new request.
  if (response.status >= 300 && response.status < 400) {
    return response;
  }

  // 3. Run Supabase Auth Middleware
  // This checks/refreshes the session and returns a response with the necessary Set-Cookie headers.
  // We await it because it might perform async operations (supabase.auth.getUser).
  const supabaseResponse = await updateSession(request);

  // 4. Merge Supabase Cookies into the I18n Response
  // We take the cookies set by Supabase (like refreshed auth tokens) and apply them to the response
  // that next-intl generated (which handles the locale rewriting).
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });

  return response;
}

export const config = {
  // Matcher to catch all paths, including deep nested ones, but excluding:
  // - /api routes
  // - /_next (internal Next.js files)
  // - /_vercel (internal Vercel files)
  // - files with extensions (e.g. favicon.ico, .svg, .png, .css)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
