import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "your_google_maps_api_key_here" || apiKey.trim() === "") {
    return NextResponse.json({ apiKey: null });
  }

  return NextResponse.json({ apiKey });
}
