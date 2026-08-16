import { SITE_URL } from '@/lib/site';
import type { Audience } from '@/lib/audience';

/**
 * Single builder for every OG image URL, mirroring lib/routes.ts's
 * centralization pattern — one place to change the query-string shape.
 */
export function buildOgImageUrl(params: { title: string; subtitle?: string; audience?: Audience }): string {
  const search = new URLSearchParams({ title: params.title });
  if (params.subtitle) search.set('subtitle', params.subtitle);
  if (params.audience) search.set('audience', params.audience);
  return `${SITE_URL}/og?${search.toString()}`;
}
