import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/i18n';

/**
 * The Person node every other schema on the site points at via
 * `{ '@id': `${SITE_URL}/#person` }`.
 *
 * It used to be emitted only by the gateway page at /{locale}. That page was
 * removed when the business landing took over the root, which left
 * buildBusinessSchema's `provider` reference dangling — pointing at an @id
 * that no document declared. Emitting it from the locale layout instead means
 * the node exists on every page, so the reference always resolves and
 * crawlers see one consistent entity rather than a per-page copy.
 */
export function buildPersonSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Brent Schoenmakers',
    url: `${SITE_URL}/${locale}`,
    email: 'brent@brentweb.eu',
    jobTitle: 'Full-stack developer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Geel',
      addressCountry: 'BE',
    },
    sameAs: [
      'https://github.com/BrentWebEU',
      'https://www.linkedin.com/in/brent-schoenmakers-3793a8262/',
      'https://www.instagram.com/brentweb.eu/',
    ],
    knowsAbout: [
      'Web development',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Docker',
      'Linux',
      'Network security',
      'Distributed systems',
    ],
  };
}
