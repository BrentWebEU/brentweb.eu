import { locales, defaultLocale, type Locale } from '@/i18n';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Picks the best locale from an Accept-Language header.
 * Falls back to defaultLocale. Ignores q-values below 0.1.
 */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const quality = q ? Number.parseFloat(q.slice(2)) : 1;
      return {
        tag: (tag ?? '').trim().toLowerCase(),
        quality: Number.isNaN(quality) ? 0 : quality,
      };
    })
    .filter((entry) => entry.tag !== '' && entry.quality >= 0.1)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    if (tag === 'nl' || tag.startsWith('nl-')) return 'nl-BE';
    if (tag === 'en' || tag.startsWith('en-')) return 'en';
  }

  return defaultLocale;
}

/** Strips a leading locale segment, returning the locale and the remainder. */
export function splitLocalePath(pathname: string): { locale: Locale | null; rest: string } {
  const segments = pathname.split('/').filter(Boolean);
  const [first, ...others] = segments;

  if (isLocale(first)) {
    return { locale: first, rest: others.length ? `/${others.join('/')}` : '' };
  }

  return { locale: null, rest: pathname === '/' ? '' : pathname };
}

/** Builds the equivalent URL for a different locale — used by LanguageSwitcher. */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const { rest } = splitLocalePath(pathname);
  return `/${target}${rest}`;
}
