import { AuthSessionPayload, AuthTokens } from "@/shared/types/auth";

function getTokenString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function getNumberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizeAuthTokens(
  payload: AuthSessionPayload | Record<string, unknown> | null | undefined,
): AuthTokens | null {
  if (!payload) return null;

  const accessToken = getTokenString(payload.accessToken) || getTokenString(payload.access_token);
  const refreshToken = getTokenString(payload.refreshToken) || getTokenString(payload.refresh_token);
  const accessTokenExpiresIn =
    getNumberValue(payload.accessTokenExpiresIn) ||
    getNumberValue(payload.expiresIn) ||
    getNumberValue(payload.expires_in) ||
    getNumberValue(payload.access_token_expires_in);
  const refreshTokenExpiresIn =
    getNumberValue(payload.refreshTokenExpiresIn) ||
    getNumberValue(payload.refreshExpiresIn) ||
    getNumberValue(payload.refresh_token_expires_in);

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    accessTokenExpiresIn,
    refreshTokenExpiresIn,
  };
}
