import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fitnests_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();

    const res = await fetch(`${BACKEND_URL}/api/analytics/category-views${qs ? `?${qs}` : ""}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      let message = "Failed to fetch analytics.";
      try { message = JSON.parse(text).message || message; } catch { /* non-JSON */ }
      return NextResponse.json({ error: message }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to connect to the backend service." }, { status: 500 });
  }
}
