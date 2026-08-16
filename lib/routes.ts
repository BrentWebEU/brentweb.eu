import type { Locale } from '@/i18n';
import type { Audience } from '@/lib/audience';

/**
 * Every internal link goes through these builders, so a future IA change
 * is a single-file edit rather than a grep across the component tree.
 *
 * The business path is now the site root: there is no `/business` segment and
 * no gateway interstitial. Business pages live in the `(business)` route group
 * so they can share a Navigation/Footer shell without appearing in the URL.
 * The engineering path stays namespaced under `/tech`.
 *
 *   /{locale}                    business landing
 *   /{locale}/work[/{slug}]      business case studies
 *   /{locale}/pricing            cost estimator
 *   /{locale}/privacy            privacy policy
 *   /{locale}/tech               engineering landing
 *   /{locale}/tech/work[/{slug}] engineering case studies
 *   /{locale}/tech/lab           interactive widgets
 *
 * `audience` is asymmetric on purpose — business resolves to the bare locale
 * root. Keeping the signature audience-shaped means AudienceLink and the
 * case-study components stay generic instead of branching at every call site.
 */
export const routes = {
  home: (l: Locale) => `/${l}`,
  audience: (l: Locale, a: Audience) => (a === 'business' ? `/${l}` : `/${l}/tech`),
  privacy: (l: Locale) => `/${l}/privacy`,
  pricing: (l: Locale) => `/${l}/pricing`,
  work: (l: Locale, a: Audience) => (a === 'business' ? `/${l}/work` : `/${l}/tech/work`),
  lab: (l: Locale) => `/${l}/tech/lab`,
  caseStudy: (l: Locale, a: Audience, slug: string) =>
    a === 'business' ? `/${l}/work/${slug}` : `/${l}/tech/work/${slug}`,
} as const;
