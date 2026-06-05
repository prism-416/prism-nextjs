import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import type { AuthTokens } from "@/shared/types/auth";
import { normalizeAuthTokens } from "@/shared/utils/auth-session";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getResponseDataPayload(payload: Record<string, unknown> | null | undefined) {
  const data = payload?.data;

  return data && typeof data === "object" ? (data as Record<string, unknown>) : payload;
}

export function getCookieValueFromSetCookieHeader(setCookieHeader: string | null | undefined, cookieName: string) {
  if (!setCookieHeader) {
    return undefined;
  }

  const cookiePattern = new RegExp(`(?:^|,\\s*)${escapeRegExp(cookieName)}=`);
  const match = cookiePattern.exec(setCookieHeader);

  if (!match) {
    return undefined;
  }

  const cookiePrefixIndex = match[0].lastIndexOf(`${cookieName}=`);
  const valueStartIndex = match.index + cookiePrefixIndex + cookieName.length + 1;
  const valueEndIndex = setCookieHeader.indexOf(";", valueStartIndex);
  const rawValue = setCookieHeader.slice(valueStartIndex, valueEndIndex === -1 ? undefined : valueEndIndex).trim();
  const normalizedValue = rawValue.replace(/^"|"$/g, "");

  if (!normalizedValue) {
    return undefined;
  }

  try {
    return decodeURIComponent(normalizedValue);
  } catch {
    return normalizedValue;
  }
}

export function getAuthTokensFromResponse(
  payload: Record<string, unknown> | null | undefined,
  headers: Headers,
  fallbackRefreshToken?: string,
): AuthTokens | null {
  const tokens = normalizeAuthTokens(getResponseDataPayload(payload));

  if (!tokens) {
    return null;
  }

  const refreshTokenFromCookie = getCookieValueFromSetCookieHeader(
    headers.get("set-cookie"),
    REFRESH_TOKEN_COOKIE_NAME,
  );

  return {
    ...tokens,
    refreshToken: tokens.refreshToken ?? refreshTokenFromCookie ?? fallbackRefreshToken,
  };
}
