import { NextResponse } from "next/server";
import { insertPortfolioAnalyticsEvent } from "@/lib/portfolio-analytics";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() ?? null;
    const userAgent = request.headers.get("user-agent");

    await insertPortfolioAnalyticsEvent({
      ...body,
      ip,
      userAgent,
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("portfolio track error:", error);
    return NextResponse.json({ error: "track_failed" }, { status: 500 });
  }
}
