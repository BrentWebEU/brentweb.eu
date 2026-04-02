'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTranslations, type Locale, defaultLocale } from '@/i18n';

const STORAGE_KEY = 'locale';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get locale from localStorage or browser preference
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'nl-BE')) {
      setLocaleState(stored as Locale);
    } else {
      // Try to detect from browser
      const browserLang = navigator.language;
      if (browserLang.startsWith('nl')) {
        setLocaleState('nl-BE');
      } else {
        setLocaleState('en');
      }
    }
    setIsLoading(false);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    // Update document language attribute
    document.documentElement.lang = newLocale;
    // Reload page to apply locale changes to all components
    window.location.reload();
  };

  return { locale, setLocale, isLoading };
}

export function useTranslations() {
  const { locale } = useLocale();
  return useMemo(() => getTranslations(locale), [locale]);
}
