import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { AUDIENCES } from '@/lib/audience';
import { SITE_URL } from '@/lib/site';
import { getProjectSlugs } from '@/lib/case-studies';
import { routes } from '@/lib/routes';

/**
 * Built from lib/routes.ts rather than hand-written path strings, so the
 * sitemap cannot drift out of sync with the actual IA the way it did when
 * /business was a real segment.
 */
function alternates(build: (locale: (typeof locales)[number]) => string) {
  return {
    languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${build(l)}`])),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Business landing — the site root.
    entries.push({
      url: `${SITE_URL}${routes.home(locale)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: alternates((l) => routes.home(l)),
    });

    entries.push({
      url: `${SITE_URL}${routes.pricing(locale)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: alternates((l) => routes.pricing(l)),
    });

    entries.push({
      url: `${SITE_URL}${routes.audience(locale, 'tech')}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      alternates: alternates((l) => routes.audience(l, 'tech')),
    });

    entries.push({
      url: `${SITE_URL}${routes.lab(locale)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: alternates((l) => routes.lab(l)),
    });

    entries.push({
      url: `${SITE_URL}${routes.privacy(locale)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
      alternates: alternates((l) => routes.privacy(l)),
    });

    for (const audience of AUDIENCES) {
      entries.push({
        url: `${SITE_URL}${routes.work(locale, audience)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: alternates((l) => routes.work(l, audience)),
      });

      for (const slug of getProjectSlugs()) {
        entries.push({
          url: `${SITE_URL}${routes.caseStudy(locale, audience, slug)}`,
          lastModified: now,
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: alternates((l) => routes.caseStudy(l, audience, slug)),
        });
      }
    }
  }

  return entries;
}
