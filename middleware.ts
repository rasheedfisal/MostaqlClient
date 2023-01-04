import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookie_name = "loggedin";
  const verify = request.cookies.get(cookie_name);
  if (!verify) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/home",
    "/chat",
    "/chat/:path*",
    "/offers",
    "/offers/:path*",
    "/permissions",
    "/permissions/:path*",
    "/projects",
    "/projects/:path*",
    "/roles",
    "/roles/:path*",
    "/users",
    "/users/:path*",
    "/categories",
    "/categories/:path*",
    "/prices",
    "/prices/:path*",
  ],
};
