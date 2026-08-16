import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale, negotiateLocale, splitLocalePath } from '@/lib/locale';
import {
  AUDIENCE_COOKIE,
  LOCALE_COOKIE,
  PREFERENCE_COOKIE_OPTIONS,
  isAudience,
} from '@/lib/audience';

function withSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale: pathLocale, rest } = splitLocalePath(pathname);

  // 1. Path already carries a valid locale -> serve it, refresh preference hints.
  if (pathLocale) {
    const response = withSecurityHeaders(NextResponse.next());

    if (request.cookies.get(LOCALE_COOKIE)?.value !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, PREFERENCE_COOKIE_OPTIONS);
    }

    // Persist the audience preference. Business is no longer a path segment —
    // it is the site root — so only two paths are unambiguous signals: the
    // landing page itself, and anything under /tech. Shared pages such as
    // /privacy deliberately leave the existing preference alone.
    const [firstSegment] = rest.split('/').filter(Boolean);
    const inferredAudience =
      firstSegment === 'tech' ? 'tech' : rest === '' ? 'business' : null;

    if (
      inferredAudience &&
      request.cookies.get(AUDIENCE_COOKIE)?.value !== inferredAudience
    ) {
      response.cookies.set(AUDIENCE_COOKIE, inferredAudience, PREFERENCE_COOKIE_OPTIONS);
    }

    return response;
  }

  // 2. No locale in path. Resolve one: cookie hint first, then Accept-Language.
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : negotiateLocale(request.headers.get('accept-language'));

  // 3. Bare root: send a returning engineer straight to /tech. Everyone else
  //    lands on the business page, which is now the site root, so there is no
  //    longer a gateway to skip.
  const rememberedAudience = request.cookies.get(AUDIENCE_COOKIE)?.value;
  const target = request.nextUrl.clone();
  target.pathname =
    rest === '' && isAudience(rememberedAudience) && rememberedAudience === 'tech'
      ? `/${locale}/tech`
      : `/${locale}${rest}`;

  // 307, not 308: the audience shortcut makes the root's destination
  // user-dependent, so this redirect must never be permanently cached.
  return withSecurityHeaders(NextResponse.redirect(target, 307));
}

export const config = {
  // Excludes anything containing a dot, so static assets like /logo.svg,
  // /robots.txt and /sitemap.xml are never rewritten. /og is excluded too —
  // it's a locale-agnostic image route living outside the [locale] segment,
  // and would otherwise get redirected to a non-existent /{locale}/og path.
  matcher: ['/((?!api|og|_next/static|_next/image|.*\\..*).*)'],
};
