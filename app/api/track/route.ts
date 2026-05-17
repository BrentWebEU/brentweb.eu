import { NextResponse } from "next/server";
import { insertPortfolioAnalyticsEvent } from "@/lib/portfolio-analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() ?? null;
    const userAgent = request.headers.get("user-agent");

    // persist to local analytics DB
    await insertPortfolioAnalyticsEvent({
      ...body,
      ip,
      userAgent,
    });

    // Optionally forward to Google Analytics 4 Measurement Protocol if configured
    const MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID; // e.g. G-XXXXXXX
    const API_SECRET = process.env.GA_API_SECRET; // measurement protocol secret

    if (MEASUREMENT_ID && API_SECRET) {
      try {
        const client_id = (body.client_id as string) || (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}`);
        const events = [
          {
            name: typeof body.event === 'string' ? body.event : 'page_view',
            params: {
              page_location: body.page ? `https://${request.headers.get('host') || ''}${body.page}` : undefined,
              page_referrer: body.referrer || undefined,
            },
          },
        ];

        const mpBody = {
          client_id,
          events,
        };

        // fire-and-forget
        fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mpBody),
        }).catch(() => {});
      } catch (e) {
        // do not fail the request if forwarding fails
        console.warn('GA4 forward failed', e);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("portfolio track error:", error);
    return NextResponse.json({ error: "track_failed" }, { status: 500 });
  }
}
