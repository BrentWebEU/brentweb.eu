'use client';

import Link from 'next/link';
import type { Locale, Messages } from '@/i18n';
import { AUDIENCE_COOKIE, type Audience } from '@/lib/audience';
import { writePreferenceCookie } from '@/lib/audience-client';
import { routes } from '@/lib/routes';

/**
 * Replaces the old two-option AudienceSwitch segmented control.
 *
 * With business promoted to the site root there is no longer a symmetrical
 * pair of destinations to toggle between — the business path IS the site, and
 * the engineering path is a side door. A segmented control implied the two
 * were equal peers and pushed a technical choice at buyers who do not want
 * one. This is a single directional link to "the other side" instead.
 *
 * It still writes the audience cookie, so proxy.ts can send a returning
 * engineer straight to /tech from the bare root.
 */
export function AudienceLink({
  locale,
  current,
  nav,
}: {
  locale: Locale;
  current: Audience;
  nav: Messages['nav'];
}) {
  const target: Audience = current === 'business' ? 'tech' : 'business';

  return (
    <Link
      href={routes.audience(locale, target)}
      onClick={() => writePreferenceCookie(AUDIENCE_COOKIE, target)}
      className="group inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-xs
                 tracking-wide text-muted-foreground transition-colors duration-150 ease-out
                 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring
                 focus-visible:outline-offset-2"
    >
      {target === 'business' && (
        <span aria-hidden className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5">
          &larr;
        </span>
      )}
      {nav[target]}
      {target === 'tech' && (
        <span aria-hidden className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">
          &rarr;
        </span>
      )}
    </Link>
  );
}
