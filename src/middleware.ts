import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const { pathname } = req.nextUrl;

  // Nếu chưa login → chỉ cho phép vào /auth/login và /auth/register
  if (
    !token &&
    !pathname.startsWith("/auth/login") &&
    !pathname.startsWith("/auth/register") &&
    !pathname.startsWith("/test-") && // Allow test pages
    !pathname.startsWith("/courses-demo") && // Allow demo pages
    !pathname.startsWith("/debug-") && // Allow debug pages
    pathname !== "/" // Allow home page
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Nếu là user nhưng vào admin
  if (role === "user" && pathname.startsWith("/authorized/admin")) {
    return NextResponse.redirect(new URL("/authorized/dashboard", req.url));
  }

  // Nếu là admin nhưng vào dashboard user
  if (role === "admin" && pathname.startsWith("/authorized/dashboard") && !pathname.startsWith("/authorized/admin")) {
    return NextResponse.redirect(new URL("/authorized/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authorized/:path*"],
};
