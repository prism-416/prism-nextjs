import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { API_HOST, TOKEN_TYPE_BEARER } from "@/shared/constants/api";
import { clearAuthCookies } from "@/shared/utils/auth-cookie";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

  if (API_HOST) {
    try {
      await fetch(`${API_HOST}/auth/logout`, {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `${TOKEN_TYPE_BEARER} ${accessToken}` } : {}),
          ...(refreshToken ? { Cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}` } : {}),
        },
        cache: "no-store",
      });
    } catch {
      // Local session cleanup should still happen if the API logout cannot complete.
    }
  }

  return clearAuthCookies(
    NextResponse.json({
      authenticated: false,
      accessToken: undefined,
    }),
  );
}
