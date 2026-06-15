import { NextRequest, NextResponse } from "next/server";

// Extend function timeout to 60s (Vercel Hobby max)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { success: false, error: "Webhook URL not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Abort the Apps Script call after 55s so we can still respond within 60s.
  // Apps Script writes the sheet row first — if it times out, the row is
  // already saved and only the Drive signature upload is still running.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55000);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const text = await res.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      data = { success: true };
    }
    return NextResponse.json(data);

  } catch (err: unknown) {
    clearTimeout(timer);
    const e = err as Error;

    if (e.name === "AbortError") {
      // Timed out waiting for Drive upload — row was already written, treat as success
      console.log("Apps Script timed out on signature upload — row already written");
      return NextResponse.json({ success: true });
    }

    console.error("Submit proxy error:", e.message);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
