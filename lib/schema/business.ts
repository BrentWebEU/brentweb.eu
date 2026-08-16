import { SITE_URL } from '@/lib/site';
import type { Locale } from '@/i18n';

export function buildBusinessSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Brent Schoenmakers, Freelance Web Development',
    description:
      'Freelance web development for small businesses in Belgium: websites, internal tools, integrations and automation, built and maintained by one person.',
    url: `${SITE_URL}/${locale}`,
    email: 'brent@brentweb.eu',
    areaServed: 'BE',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Blankenberge - Geel',
      addressCountry: 'BE',
    },
    provider: { '@id': `${SITE_URL}/#person` },
  };
}
