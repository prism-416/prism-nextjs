import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { clearAuthCookies, applyAuthCookies } from "@/shared/utils/auth-cookie";
import { refreshAuthSession } from "@/shared/utils/auth-refresh";

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

  const result = await refreshAuthSession(refreshToken);

  if (result.status === "invalid") {
    return clearAuthCookies(
      NextResponse.json(
        {
          message: "Failed to refresh access token.",
        },
        { status: 401 },
      ),
    );
  }

  if (result.status === "failed") {
    return NextResponse.json(
      {
        message: "Failed to refresh access token.",
      },
      { status: 502 },
    );
  }

  const refreshResponse = NextResponse.json({
    authenticated: true,
    accessToken: result.tokens.accessToken,
  });

  return applyAuthCookies(refreshResponse, result.tokens);
}
