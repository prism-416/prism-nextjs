import { NextRequest, NextResponse } from "next/server";

import { API_HOST, JSON_CONTENT_TYPE } from "@/shared/constants/api";
import { applyAuthCookies, clearAuthCookies } from "@/shared/utils/auth-cookie";
import { getAuthTokensFromResponse } from "@/shared/utils/auth-response";

const GITHUB_OAUTH_TRANSACTION_COOKIE_NAME = "githubAppOauthTransaction";

async function readJsonRequestBody(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  return payload;
}

function getUpstreamErrorResponse(payload: Record<string, unknown> | null, status: number) {
  return NextResponse.json(payload ?? { message: "Authentication request failed." }, { status });
}

function clearGithubOAuthTransactionCookie(response: NextResponse) {
  response.cookies.set(GITHUB_OAUTH_TRANSACTION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

function maybeClearGithubOAuthTransactionCookie(response: NextResponse, upstreamPath: string) {
  if (upstreamPath === "/auth/oauth/github") {
    return clearGithubOAuthTransactionCookie(response);
  }

  return response;
}

export async function proxyAuthPost(request: NextRequest, upstreamPath: string) {
  const body = await readJsonRequestBody(request);
  const cookieHeader = request.headers.get("cookie");
  const shouldForwardCookieHeader = upstreamPath === "/auth/oauth/github";

  if (!body) {
    return NextResponse.json({ message: "Invalid authentication payload." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_HOST}${upstreamPath}`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_CONTENT_TYPE,
        ...(shouldForwardCookieHeader && cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const tokens = getAuthTokensFromResponse(payload, response.headers);

    if (response.status === 401 || response.status === 403) {
      return maybeClearGithubOAuthTransactionCookie(
        clearAuthCookies(getUpstreamErrorResponse(payload, response.status)),
        upstreamPath,
      );
    }

    if (!response.ok || !tokens) {
      return maybeClearGithubOAuthTransactionCookie(
        getUpstreamErrorResponse(payload, response.ok ? 502 : response.status),
        upstreamPath,
      );
    }

    return maybeClearGithubOAuthTransactionCookie(
      applyAuthCookies(NextResponse.json(payload, { status: response.status }), tokens),
      upstreamPath,
    );
  } catch {
    return maybeClearGithubOAuthTransactionCookie(
      NextResponse.json({ message: "Authentication request failed." }, { status: 502 }),
      upstreamPath,
    );
  }
}
