import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("fitnests_token")?.value;
}

export async function GET(_request, { params }) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || "Not found." }, { status: res.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to connect to the backend service." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || "Failed to update category." }, { status: res.status });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to connect to the backend service." }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const token = await getToken();
  if (!token) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const res = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json({ error: data.message || "Failed to delete category." }, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to connect to the backend service." }, { status: 500 });
  }
}
