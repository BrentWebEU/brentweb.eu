import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const host = request.headers.get('host') || '';

    // Forward to Google Analytics 4 Measurement Protocol if configured
    const MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID; // e.g. G-XXXXXXX
    const API_SECRET = process.env.GA_API_SECRET; // measurement protocol secret

    if (MEASUREMENT_ID && API_SECRET) {
      try {
        const client_id = (body.client_id as string) || (typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}`);

        const eventName = typeof body.event === 'string' ? body.event : 'page_view';

        const events = [
          {
            name: eventName,
            params: {
              page_location: body.page ? `https://${host}${body.page}` : undefined,
              page_referrer: body.referrer || undefined,
              screen_width: body.screen_width || undefined,
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
        console.warn('GA4 forward failed', e);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("portfolio track error:", error);
    return NextResponse.json({ error: "track_failed" }, { status: 500 });
  }
}
