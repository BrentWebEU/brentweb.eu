// Simple i18n implementation without next-intl dependency
import enMessages from './messages/en.json';
import nlBEMessages from './messages/nl-BE.json';

export const locales = ['en', 'nl-BE'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

const messages = {
  en: enMessages,
  'nl-BE': nlBEMessages,
} as const;

export type Messages = typeof enMessages;

export function getTranslations(locale: Locale = defaultLocale) {
  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = messages[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      // Fallback to English if translation not found
      let fallback: any = messages[defaultLocale];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      value = fallback || key;
    }
    
    // Replace placeholders
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return String(params[paramKey] ?? `{${paramKey}}`);
      });
    }
    
    return value || key;
  };
  
  return { t };
}

export function getMessages(locale: Locale = defaultLocale): Messages {
  return messages[locale] || messages[defaultLocale];
}
