import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// Public endpoint — no auth token needed
export async function POST(request) {
  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/analytics/category-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return NextResponse.json({ error: "Failed to record view." }, { status: res.status });
    return NextResponse.json({ ok: true });
  } catch {
    // Silent fail — never interrupt user navigation
    return NextResponse.json({ ok: false });
  }
}
