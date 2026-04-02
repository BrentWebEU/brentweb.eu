'use client';

import { useLocale } from '@/hooks/useTranslations';
import { Globe, Check } from 'lucide-react';
import { type Locale, locales } from '@/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import '@/styles/components/language-switcher.css';

const languageNames: Record<Locale, string> = {
  en: 'EN',
  'nl-BE': 'NL',
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="language-switcher">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="language-switcher__trigger"
            aria-label="Select language"
            type="button"
          >
            <Globe className="language-switcher__icon" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="language-switcher__menu">
          {locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className={`language-switcher__item ${locale === loc ? 'language-switcher__item--active' : ''}`}
            >
              <span className="language-switcher__label">{languageNames[loc]}</span>
              {locale === loc && (
                <Check className="language-switcher__check" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
