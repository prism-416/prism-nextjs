import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { API_HOST, JSON_CONTENT_TYPE } from "@/shared/constants/api";
import { applyAuthCookies, clearAuthCookies } from "@/shared/utils/auth-cookie";
import { getAuthTokensFromResponse } from "@/shared/utils/auth-response";
import type { AuthTokens } from "@/shared/types/auth";
import { AUTHENTICATED_ENTRY_PATH } from "@/shared/constants/site";

/** Routes anyone can visit (authenticated or not). */
const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/verify", "/workspaces/invitations/accept"];

/** Routes that authenticated users are bounced away from. */
const GUEST_ONLY_ROUTES = ["/sign-in", "/sign-up"];

type RefreshSessionResult =
  | {
      status: "success";
      tokens: AuthTokens;
    }
  | {
      status: "invalid";
    }
  | {
      status: "failed";
    };

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

async function refreshAuthSession(refreshToken: string): Promise<RefreshSessionResult> {
  try {
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
    const tokens = getAuthTokensFromResponse(payload, response.headers, refreshToken);

    if (response.status === 401 || response.status === 403) {
      return { status: "invalid" };
    }

    if (!response.ok || !tokens) {
      return { status: "failed" };
    }

    return {
      status: "success",
      tokens,
    };
  } catch {
    return { status: "failed" };
  }
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

export async function proxy(request: NextRequest) {
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

  if (!isAuthenticated && !isPublicRoute) {
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
