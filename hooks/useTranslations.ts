'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type { Locale } from '@/i18n';
import { useLocaleContext } from '@/components/LocaleProvider';
import { swapLocaleInPath } from '@/lib/locale';
import { LOCALE_COOKIE } from '@/lib/audience';
import { writePreferenceCookie } from '@/lib/audience-client';

export function useLocale() {
  const { locale } = useLocaleContext();
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (next: Locale) => {
      writePreferenceCookie(LOCALE_COOKIE, next);
      router.push(swapLocaleInPath(pathname, next));
    },
    [pathname, router]
  );

  // isLoading is kept for call-site compatibility. The locale is now always
  // known on first render because the server supplies it via LocaleProvider.
  return { locale, setLocale, isLoading: false };
}

export function useTranslations() {
  const { t } = useLocaleContext();
  return { t };
}
