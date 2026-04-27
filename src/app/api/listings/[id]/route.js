import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/listings/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.message || "Listing not found." },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to the backend service." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("fitnests_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to update listing." },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to the backend service." },
      { status: 500 }
    );
  }
}
