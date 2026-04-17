import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";

/** Routes anyone can visit (authenticated or not). */
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/verify"];

/** Routes that authenticated users are bounced away from (back to "/"). */
const GUEST_ONLY_ROUTES = ["/sign-in", "/sign-up"];

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some(route =>
    route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isGuestOnlyRoute = matchesRoute(pathname, GUEST_ONLY_ROUTES);
  const hasAccessToken = request.cookies.has(ACCESS_TOKEN_COOKIE_NAME);
  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE_NAME);
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
