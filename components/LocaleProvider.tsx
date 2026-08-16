'use client';

import { createContext, useContext, useMemo } from 'react';
import { getTranslations, type Locale, type Messages } from '@/i18n';

type Translate = ReturnType<typeof getTranslations>['t'];

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  t: Translate;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Carries the locale resolved on the server (from the URL segment) into the
 * client tree. Replaces the previous localStorage lookup, which meant every
 * consumer rendered English on first paint before correcting itself.
 */
export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, messages, t: getTranslations(locale).t }),
    [locale, messages]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}
