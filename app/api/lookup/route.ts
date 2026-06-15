import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ found: false });

  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return NextResponse.json({ found: false });

  try {
    const res = await fetch(
      `${webhookUrl}?phone=${encodeURIComponent(phone)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ found: false });
  }
}
