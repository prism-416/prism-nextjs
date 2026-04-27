import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { API_HOST, JSON_CONTENT_TYPE } from "@/shared/constants/api";
import { applyAuthCookies, clearAuthCookies } from "@/shared/utils/auth-cookie";
import { normalizeAuthTokens } from "@/shared/utils/auth-session";
import type { AuthTokens } from "@/shared/types/auth";

/** Routes anyone can visit (authenticated or not). */
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/verify"];

/** Routes that authenticated users are bounced away from (back to "/"). */
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
    return false;
  }

  return payload.exp * 1000 <= Date.now() + 30 * 1000;
}

async function refreshAuthSession(refreshToken: string): Promise<AuthTokens | null> {
  const response = await fetch(`${API_HOST}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": JSON_CONTENT_TYPE,
      Cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`,
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  const tokens = normalizeAuthTokens((payload?.data as Record<string, unknown> | undefined) || payload || undefined);

  if (!response.ok || !tokens) {
    return null;
  }

  return tokens.refreshToken ? tokens : { ...tokens, refreshToken };
}

function getRedirectToSignInResponse(request: NextRequest) {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return clearAuthCookies(NextResponse.redirect(signInUrl));
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  const isGuestOnlyRoute = matchesRoute(pathname, GUEST_ONLY_ROUTES);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const accessTokenNeedsRefresh = shouldRefreshAccessToken(accessToken);
  let refreshedTokens: AuthTokens | null = null;
  let didRefreshFail = false;

  if (refreshToken && accessTokenNeedsRefresh) {
    refreshedTokens = await refreshAuthSession(refreshToken);
    didRefreshFail = !refreshedTokens;
  }

  const isAuthenticated = Boolean(refreshedTokens || (accessToken && !accessTokenNeedsRefresh));

  if (!isAuthenticated && !isPublicRoute) {
    return getRedirectToSignInResponse(request);
  }

  if (isAuthenticated && isGuestOnlyRoute) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return refreshedTokens ? applyAuthCookies(response, refreshedTokens) : response;
  }

  if (refreshedTokens) {
    return getNextResponseWithSession(request, refreshedTokens);
  }

  if (didRefreshFail) {
    return clearAuthCookies(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
