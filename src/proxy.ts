import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

/** Redirects any path without a language prefix to `/{defaultLocale}/...`. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  // If the path starts with an unsupported 2-letter language code (e.g. /xx, /fr), return 404
  const firstSegment = pathname.split("/")[1];
  if (firstSegment && /^[a-z]{2}$/i.test(firstSegment) && !isLocale(firstSegment)) {
    return new NextResponse(null, { status: 404 });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API, admin, uploads, Next.js internals and any file with an extension
  matcher: ["/((?!api|admin|uploads|_next|.*\\..*).*)"],
};
