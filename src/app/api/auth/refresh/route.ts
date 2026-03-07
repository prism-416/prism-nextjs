import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { clearAuthCookies, applyAuthCookies } from "@/shared/utils/auth-cookie";
import { getRefreshEndpoint, normalizeAuthTokens } from "@/shared/utils/auth-token";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return clearAuthCookies(NextResponse.json({ message: "Refresh token is missing." }, { status: 401 }));
  }

  try {
    const response = await fetch(getRefreshEndpoint(), {
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
    const tokens = normalizeAuthTokens((payload?.data as Record<string, unknown> | undefined) || payload || undefined);

    if (!response.ok || !tokens) {
      return clearAuthCookies(
        NextResponse.json(
          {
            message: "Failed to refresh access token.",
          },
          { status: 401 },
        ),
      );
    }

    const refreshResponse = NextResponse.json({
      authenticated: true,
      accessToken: tokens.accessToken,
    });

    return applyAuthCookies(refreshResponse, tokens);
  } catch {
    return clearAuthCookies(
      NextResponse.json(
        {
          message: "Failed to refresh access token.",
        },
        { status: 500 },
      ),
    );
  }
}
