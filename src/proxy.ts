import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/verify"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const hasAccessToken = request.cookies.has(ACCESS_TOKEN_COOKIE_NAME);
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE_NAME);
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
