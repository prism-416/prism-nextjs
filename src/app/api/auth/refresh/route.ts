import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { API_HOST } from "@/shared/constants/api";
import { clearAuthCookies, applyAuthCookies } from "@/shared/utils/auth-cookie";
import { getAuthTokensFromResponse } from "@/shared/utils/auth-response";

async function readRefreshTokenFromBody(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const token = payload?.refreshToken ?? payload?.refresh_token;

  return typeof token === "string" && token.trim().length > 0 ? token : undefined;
}

export async function POST(request: NextRequest) {
  const bodyRefreshToken = await readRefreshTokenFromBody(request);
  const cookieStore = await cookies();
  const cookieRefreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = bodyRefreshToken || cookieRefreshToken;

  if (!refreshToken) {
    return clearAuthCookies(NextResponse.json({ message: "Refresh token is missing." }, { status: 401 }));
  }

  try {
    const response = await fetch(`${API_HOST}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`,
      },
      body: JSON.stringify({
        refreshToken,
      }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const tokens = getAuthTokensFromResponse(payload, response.headers, refreshToken);

    if (response.status === 401 || response.status === 403) {
      return clearAuthCookies(
        NextResponse.json(
          {
            message: "Failed to refresh access token.",
          },
          { status: 401 },
        ),
      );
    }

    if (!response.ok || !tokens) {
      return NextResponse.json(
        {
          message: "Failed to refresh access token.",
        },
        { status: 502 },
      );
    }

    const refreshResponse = NextResponse.json({
      authenticated: true,
      accessToken: tokens.accessToken,
    });

    return applyAuthCookies(refreshResponse, tokens);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to refresh access token.",
      },
      { status: 500 },
    );
  }
}
