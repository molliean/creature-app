import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"];
const PROTECTED_ROUTES = ["/home", "/explore", "/stats", "/book"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has("creature_auth");

  // Authenticated users visiting the landing/auth pages → send to /home
  if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Unauthenticated users visiting protected routes → send to /
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
