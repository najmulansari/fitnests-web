import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Invalid email or password." },
        { status: backendRes.status }
      );
    }

    const response = NextResponse.json({
      session: {
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });

    // Store JWT in an httpOnly cookie so it is inaccessible to JavaScript
    // but readable by Next.js middleware for server-side route protection.
    response.cookies.set("fitnests_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to authentication service." },
      { status: 500 }
    );
  }
}
