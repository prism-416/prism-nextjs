import { API_HOST } from "@/shared/constants/api";
import { SERVER_ENV } from "@/shared/constants/server-env";
import { AuthSessionPayload, AuthTokens } from "@/shared/types/auth";

const DEFAULT_REFRESH_ENDPOINT = "/api/auth/refresh";
const DEFAULT_LOGOUT_ENDPOINT = "/api/auth/logout";

function getTokenString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function getNumberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizeAuthTokens(payload: AuthSessionPayload | null | undefined): AuthTokens | null {
  if (!payload) return null;

  const accessToken = getTokenString(payload.accessToken) || getTokenString(payload.access_token);
  const refreshToken = getTokenString(payload.refreshToken) || getTokenString(payload.refresh_token);
  const accessTokenExpiresIn =
    getNumberValue(payload.accessTokenExpiresIn) ||
    getNumberValue(payload.expiresIn) ||
    getNumberValue(payload.expires_in);
  const refreshTokenExpiresIn = getNumberValue(payload.refreshTokenExpiresIn);

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

export function resolveBackendAuthUrl(path: string | undefined, fallbackPath: string) {
  if (!API_HOST) {
    throw new Error("NEXT_PUBLIC_API_HOST is required.");
  }

  const targetPath = path || fallbackPath;

  if (/^https?:\/\//.test(targetPath)) {
    return targetPath;
  }

  return new URL(targetPath, API_HOST).toString();
}

export function getRefreshEndpoint() {
  return resolveBackendAuthUrl(SERVER_ENV.AUTH_REFRESH_PATH, DEFAULT_REFRESH_ENDPOINT);
}

export function getLogoutEndpoint() {
  return resolveBackendAuthUrl(SERVER_ENV.AUTH_LOGOUT_PATH, DEFAULT_LOGOUT_ENDPOINT);
}
