import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { handleAdminAuth } from "./lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

function stripLocaleAdminPrefix(pathname: string): string | null {
  const match = pathname.match(/^\/(tr|en)(\/admin(?:\/.*)?)$/);
  return match ? match[2] : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminWithoutLocale = stripLocaleAdminPrefix(pathname);
  if (adminWithoutLocale) {
    const url = request.nextUrl.clone();
    url.pathname = adminWithoutLocale;
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return handleAdminAuth(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/tr/admin",
    "/tr/admin/:path*",
    "/en/admin",
    "/en/admin/:path*",
    "/",
    "/(tr|en)/:path*",
    "/((?!api|_next|_vercel|admin|.*\\..*).*)",
  ],
};
