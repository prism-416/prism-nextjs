import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  DEFAULT_ACCESS_TOKEN_MAX_AGE,
  DEFAULT_REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE_NAME,
} from "@/shared/constants/auth";
import { AuthTokens } from "@/shared/types/auth";

const isProduction = process.env.NODE_ENV === "production";

export function applyAuthCookies(response: NextResponse, tokens: AuthTokens) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
    httpOnly: false,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: tokens.accessTokenExpiresIn || DEFAULT_ACCESS_TOKEN_MAX_AGE,
  });

  if (tokens.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      path: "/",
      maxAge: tokens.refreshTokenExpiresIn || DEFAULT_REFRESH_TOKEN_MAX_AGE,
    });
  }

  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, "", {
    httpOnly: false,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
  });

  return response;
}
