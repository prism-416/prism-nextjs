import { REFRESH_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { API_HOST, JSON_CONTENT_TYPE } from "@/shared/constants/api";
import { getAuthTokensFromResponse } from "@/shared/utils/auth-response";
import type { AuthTokens } from "@/shared/types/auth";

export type RefreshSessionResult =
  | {
      status: "success";
      tokens: AuthTokens;
    }
  | {
      status: "invalid";
    }
  | {
      status: "failed";
    };

/**
 * Exchanges a refresh token for a fresh access token via the upstream API. The
 * refresh token is not rotated, so the same token can be presented repeatedly and
 * concurrent calls never conflict. Shared by the middleware and the refresh route.
 */
export async function refreshAuthSession(refreshToken: string): Promise<RefreshSessionResult> {
  try {
    const response = await fetch(`${API_HOST}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": JSON_CONTENT_TYPE,
        Cookie: `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;
    const tokens = getAuthTokensFromResponse(payload, response.headers, refreshToken);

    if (response.status === 401 || response.status === 403) {
      return { status: "invalid" };
    }

    if (!response.ok || !tokens) {
      return { status: "failed" };
    }

    return {
      status: "success",
      tokens,
    };
  } catch {
    return { status: "failed" };
  }
}
