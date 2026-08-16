'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { type Locale, locales } from '@/i18n';
import { useLocale } from '@/hooks/useTranslations';
import { swapLocaleInPath } from '@/lib/locale';
import { LOCALE_COOKIE } from '@/lib/audience';
import { writePreferenceCookie } from '@/lib/audience-client';
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
  const { locale } = useLocale();
  const pathname = usePathname();

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
          {locales.map((loc) => {
            const isActive = locale === loc;

            return (
              <DropdownMenuItem key={loc} asChild>
                {/* A real href, so the alternates are crawlable and
                    middle-clickable rather than JS-only. */}
                <Link
                  href={swapLocaleInPath(pathname, loc)}
                  hrefLang={loc}
                  lang={loc}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => writePreferenceCookie(LOCALE_COOKIE, loc)}
                  className={`language-switcher__item ${
                    isActive ? 'language-switcher__item--active' : ''
                  }`}
                >
                  <span className="language-switcher__label">
                    {languageNames[loc]}
                  </span>
                  {isActive && <Check className="language-switcher__check" />}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
