'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import type { Locale, Messages } from '@/i18n';
import type { Audience } from '@/lib/audience';
import { routes } from '@/lib/routes';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { RollingLink } from './RollingLink';
import { Logo } from './Logo';
import { AudienceLink } from './AudienceLink';

/**
 * Section anchors differ per path: the business page has no experience
 * section, the engineering page has no services section. Linking to an
 * anchor that isn't rendered is a dead link, so each path gets its own set.
 */
export const SECTIONS: Record<Audience, ReadonlyArray<keyof Messages['nav']>> = {
  business: ['services', 'projects', 'process', 'contact'],
  tech: ['projects', 'experience', 'about', 'contact'],
};

export const ANCHORS: Partial<Record<keyof Messages['nav'], string>> = {
  about: '#about',
  experience: '#experience',
  services: '#services',
  projects: '#projects',
  process: '#process',
  contact: '#contact',
};

export const Navigation = ({
  locale,
  audience,
  nav,
}: {
  locale: Locale;
  audience: Audience;
  nav: Messages['nav'];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    ...SECTIONS[audience].map((key) => ({
      name: nav[key],
      href: ANCHORS[key] ?? '#',
      external: false,
    })),
    // The case-study index used to be reachable only from inside the project
    // dialog, which meant /tech/work had no entry point at all. Both paths now
    // link to it directly.
    { name: nav.work, href: routes.work(locale, audience), external: false },
    ...(audience === 'tech' ? [{ name: nav.lab, href: routes.lab(locale), external: false }] : []),
    { name: nav.blog, href: 'https://blog.brentweb.be/', external: true },
  ];

  return (
    <>
      <nav className="nav">
        <div className="nav__container">
          <Link
            href={routes.home(locale)}
            className="nav__logo"
            aria-label={nav.backToGateway}
          >
            {/* Inline rather than next/image: the mark has to follow the theme
                via currentColor, and an <img> is a closed shadow world that no
                page CSS can reach into. */}
            <Logo className="h-8 w-auto text-foreground" />
          </Link>

          <div className="nav__links">
            {navLinks.map((link) => (
              <RollingLink key={link.name} href={link.href} className="nav__link">
                {link.name}
              </RollingLink>
            ))}
          </div>

          <div className="nav__right">
            {audience === 'business' && (
              <Link href={routes.pricing(locale)} className="nav__contact-link">
                {nav.getQuote}
              </Link>
            )}
            <AudienceLink locale={locale} current={audience} nav={nav} />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav__mobile-toggle"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            type="button"
          >
            {isOpen ? (
              <X className="nav__mobile-icon" />
            ) : (
              <Menu className="nav__mobile-icon" />
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="nav__mobile-menu">
          <div className="nav__mobile-content">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="nav__mobile-link"
              >
                {link.name}
              </a>
            ))}
            {audience === 'business' && (
              <Link
                href={routes.pricing(locale)}
                onClick={() => setIsOpen(false)}
                className="nav__contact-link"
              >
                {nav.getQuote}
              </Link>
            )}
            <div className="nav__mobile-actions">
              <AudienceLink locale={locale} current={audience} nav={nav} />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
