import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("fitnests_token");

  // Protect all /admin routes — redirect to /login if no token
  if (pathname.startsWith("/admin")) {
    if (!token?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from /login
  if (pathname === "/login" && token?.value) {
    return NextResponse.redirect(new URL("/admin/manage-listings", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
