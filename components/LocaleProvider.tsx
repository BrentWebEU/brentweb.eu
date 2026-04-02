'use client';

import { useEffect } from 'react';
import { useLocale } from '@/hooks/useTranslations';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { locale, isLoading } = useLocale();

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.lang = locale;
    }
  }, [locale, isLoading]);

  return <>{children}</>;
}
