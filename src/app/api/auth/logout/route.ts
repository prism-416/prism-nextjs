import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { clearAuthCookies } from "@/shared/utils/auth-cookie";
import { getLogoutEndpoint } from "@/shared/utils/auth-token";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (refreshToken) {
    try {
      await fetch(getLogoutEndpoint(), {
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
    } catch {
      // Ignore backend logout failures and clear local cookies regardless.
    }
  }

  return clearAuthCookies(
    NextResponse.json({
      authenticated: false,
    }),
  );
}
