import { API_HOST } from "@/shared/constants/api";
import { SERVER_ENV } from "@/shared/constants/server-env";
import { normalizeAuthTokens } from "@/shared/utils/auth-session";

const DEFAULT_REFRESH_ENDPOINT = "/api/auth/refresh";
const DEFAULT_LOGOUT_ENDPOINT = "/api/auth/logout";

export function resolveBackendAuthUrl(path: string | undefined, fallbackPath: string) {
  if (!API_HOST) {
    throw new Error("NEXT_PUBLIC_API_HOST is required.");
  }

  const targetPath = path || fallbackPath;

  if (/^https?:\/\//.test(targetPath)) {
    return targetPath;
  }

  const base = API_HOST.endsWith("/") ? API_HOST : `${API_HOST}/`;
  const relative = targetPath.startsWith("/") ? targetPath.slice(1) : targetPath;

  return new URL(relative, base).toString();
}

export function getRefreshEndpoint() {
  return resolveBackendAuthUrl(SERVER_ENV.AUTH_REFRESH_PATH, DEFAULT_REFRESH_ENDPOINT);
}

export function getLogoutEndpoint() {
  return resolveBackendAuthUrl(SERVER_ENV.AUTH_LOGOUT_PATH, DEFAULT_LOGOUT_ENDPOINT);
}

export function getGoogleIdTokenSigninEndpoint() {
  if (!SERVER_ENV.AUTH_GOOGLE_SIGNIN_PATH) {
    throw new Error("AUTH_GOOGLE_SIGNIN_PATH is required.");
  }

  return resolveBackendAuthUrl(SERVER_ENV.AUTH_GOOGLE_SIGNIN_PATH, SERVER_ENV.AUTH_GOOGLE_SIGNIN_PATH);
}

export { normalizeAuthTokens };
