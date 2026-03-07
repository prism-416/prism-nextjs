import axios, { AxiosError } from "axios";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { AxiosRequestType } from "@/shared/types/api";
import { adapter } from "@/shared/http/adapter";
import { eventBus } from "@/shared/lib/eventBus";
import { removeAuthToken, setAuthToken } from "@/shared/utils/axios-util";
import { IS_SERVER } from "@/shared/constants/env";
import { AuthEventBus } from "@/shared/types/eventBus";
import { AuthSessionResponse } from "@/shared/types/auth";
import { getCookie } from "@/shared/utils/cookie";

let is401EventEmitted = false;
let is403EventEmitted = false;
let refreshPromise: Promise<string | null> | null = null;

const authClient = axios.create({
  adapter,
} as AxiosRequestType);

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    })
      .then(async response => {
        const payload = (await response.json().catch(() => null)) as AuthSessionResponse | null;

        if (!response.ok || !payload?.accessToken) {
          return null;
        }

        setAuthToken(payload.accessToken);
        return payload.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

authClient.interceptors.request.use(
  config => {
    if (!IS_SERVER && !config.headers.Authorization) {
      const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

authClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const is401 = error.response?.status === 401;
    const is403 = error.response?.status === 403;
    const originalRequest = error.config as (AxiosRequestType & { _retry?: boolean }) | undefined;

    if (
      is401 &&
      !IS_SERVER &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh"
    ) {
      originalRequest._retry = true;

      const nextAccessToken = await refreshAccessToken();

      if (nextAccessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return authClient.request(originalRequest);
      }
    }

    if (is401 && !is401EventEmitted && !IS_SERVER) {
      is401EventEmitted = true;
      removeAuthToken();
      eventBus.$emit<AuthEventBus>("errorApi", {
        status: 401,
        message: "UNAUTHORIZED ERROR",
        data: null,
      });
      setTimeout(() => {
        is401EventEmitted = false;
      }, 5000);
    } else if (is403 && !is403EventEmitted && !IS_SERVER) {
      is403EventEmitted = true;
      eventBus.$emit<AuthEventBus>("errorApi", {
        status: 403,
        message: "FORBIDDEN ERROR",
        data: null,
      });
      setTimeout(() => {
        is403EventEmitted = false;
      }, 5000);
    }

    return Promise.reject(error.response ?? error);
  },
);

export default authClient;
