import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { applyAuthCookies, clearAuthCookies } from "@/shared/utils/auth-cookie";
import { refreshAuthSession } from "@/shared/utils/auth-refresh";
import type { AuthTokens } from "@/shared/types/auth";
import { AUTHENTICATED_ENTRY_PATH } from "@/shared/constants/site";

/** Routes anyone can visit (authenticated or not). */
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/verify", "/workspaces/invitations/accept"];

/** Routes that authenticated users are bounced away from. */
const GUEST_ONLY_ROUTES = ["/sign-in", "/sign-up"];

function matchesRoute(pathname: string, routes: readonly string[]) {
  return routes.some(route =>
    route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`),
  );
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
    return JSON.parse(atob(paddedPayload)) as { exp?: unknown };
  } catch {
    return null;
  }
}

function shouldRefreshAccessToken(accessToken: string | undefined) {
  if (!accessToken) {
    return true;
  }

  const payload = decodeJwtPayload(accessToken);

  if (typeof payload?.exp !== "number") {
    // A token we can't decode (or one without an expiry) can't be trusted as
    // valid — force a refresh attempt instead of authorizing on mere presence.
    return true;
  }

  return payload.exp * 1000 <= Date.now() + 30 * 1000;
}

function getRedirectToSignInResponse(request: NextRequest, shouldClearCookies = true) {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  const response = NextResponse.redirect(signInUrl);
  return shouldClearCookies ? clearAuthCookies(response) : response;
}

function getRequestCookieHeader(request: NextRequest, tokens: AuthTokens) {
  const cookies = request.cookies
    .getAll()
    .filter(cookie => cookie.name !== ACCESS_TOKEN_COOKIE_NAME && cookie.name !== REFRESH_TOKEN_COOKIE_NAME);
  const nextCookies = [
    ...cookies,
    { name: ACCESS_TOKEN_COOKIE_NAME, value: tokens.accessToken },
    ...(tokens.refreshToken ? [{ name: REFRESH_TOKEN_COOKIE_NAME, value: tokens.refreshToken }] : []),
  ];

  return nextCookies.map(cookie => `${cookie.name}=${encodeURIComponent(cookie.value)}`).join("; ");
}

function getNextResponseWithSession(request: NextRequest, tokens: AuthTokens) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("cookie", getRequestCookieHeader(request, tokens));

  return applyAuthCookies(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
    tokens,
  );
}

function getOptionsResponse(request: NextRequest) {
  const origin = request.headers.get("origin") ?? request.nextUrl.origin;
  const requestHeaders = request.headers.get("access-control-request-headers");

  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": requestHeaders ?? "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      Vary: "Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
    },
  });
}

export async function proxy(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return getOptionsResponse(request);
  }

  const { pathname } = request.nextUrl;

  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isGuestOnlyRoute = matchesRoute(pathname, GUEST_ONLY_ROUTES);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const accessTokenNeedsRefresh = shouldRefreshAccessToken(accessToken);
  let refreshedTokens: AuthTokens | null = null;
  let didRefreshFail = false;
  let isRefreshTokenInvalid = false;

  if (refreshToken && accessTokenNeedsRefresh) {
    const refreshResult = await refreshAuthSession(refreshToken);
    refreshedTokens = refreshResult.status === "success" ? refreshResult.tokens : null;
    didRefreshFail = refreshResult.status === "failed";
    isRefreshTokenInvalid = refreshResult.status === "invalid";
  }

  const isAuthenticated = Boolean(refreshedTokens || (accessToken && !accessTokenNeedsRefresh));

  // A transient upstream refresh failure (network error / 5xx) is not a logout:
  // the refresh token is most likely still valid, the auth backend just hiccuped.
  // Let the request through with the existing cookies and let the client retry
  // recover, instead of bouncing the user to sign-in on a momentary blip. A
  // genuinely invalid refresh token still falls through to the redirect below.
  if (!isAuthenticated && !isPublicRoute && !didRefreshFail) {
    return getRedirectToSignInResponse(request, isRefreshTokenInvalid || !refreshToken);
  }

  if (isAuthenticated && isGuestOnlyRoute) {
    const response = NextResponse.redirect(new URL(AUTHENTICATED_ENTRY_PATH, request.url));
    return refreshedTokens ? applyAuthCookies(response, refreshedTokens) : response;
  }

  if (refreshedTokens) {
    return getNextResponseWithSession(request, refreshedTokens);
  }

  if (isRefreshTokenInvalid) {
    return clearAuthCookies(NextResponse.next());
  }

  if (didRefreshFail) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
