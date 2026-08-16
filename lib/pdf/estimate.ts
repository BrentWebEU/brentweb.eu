import 'server-only';
import { createElement } from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { EstimatePdfDocument } from '@/components/calculator/EstimatePdfDocument';
import { estimate as computeEstimate } from '@/lib/calculator/pricing';
import type { ScopeKey, TimelineKey } from '@/lib/schemas/lead';
import { getMessages, type Locale } from '@/i18n';

export interface RenderEstimatePdfInput {
  name: string;
  scope: ScopeKey[];
  timeline: TimelineKey;
  /** Drives both the document copy and the generated-on date format. */
  locale: Locale;
}

/**
 * Single shared builder consumed by both the calculator's download route
 * and the lead-confirmation email attachment, so the two never drift.
 */
export async function renderEstimatePdf(input: RenderEstimatePdfInput): Promise<Buffer> {
  const result = computeEstimate({ scope: input.scope, timeline: input.timeline });
  const generatedAt = new Date().toLocaleDateString(input.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const doc = createElement(EstimatePdfDocument, {
    name: input.name,
    scope: input.scope,
    timeline: input.timeline,
    result,
    generatedAt,
    messages: getMessages(input.locale),
    locale: input.locale,
  });

  return renderToBuffer(doc as Parameters<typeof renderToBuffer>[0]);
}
