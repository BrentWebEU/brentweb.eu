import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SCOPE_KEYS, TIMELINE_KEYS } from '@/lib/schemas/lead';
import { locales } from '@/i18n';
import { renderEstimatePdf } from '@/lib/pdf/estimate';
import { consume, RATE_LIMITS } from '@/lib/rate-limit';

const bodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  scope: z.array(z.enum(SCOPE_KEYS)).min(1),
  timeline: z.enum(TIMELINE_KEYS),
  // Defaulted rather than required so an older client (or a bookmarked
  // request) still gets a valid PDF instead of a 400.
  locale: z.enum(locales).default('en'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { allowed } = consume(`${ip}:pdf-download`, RATE_LIMITS.calculator);
  if (!allowed) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  const pdf = await renderEstimatePdf(parsed.data);

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="project-estimate.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}
