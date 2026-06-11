"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { normalizeAuthTokens } from "@/shared/utils/auth-session";
import { getCookie } from "@/shared/utils/cookie";
import { removeAuthToken, setAuthToken } from "@/shared/utils/axios-util";
import { eventBus } from "@/shared/lib/eventBus";
import type { ServerInitDataType } from "@/shared/utils/server-util";
import { AuthSessionPayload } from "@/shared/types/auth";
import type { AuthEventBus } from "@/shared/types/eventBus";

interface AuthContextType {
  isAuthenticated: boolean;
  hydrateSession: (payload: AuthSessionPayload) => boolean;
  setSession: (payload: AuthSessionPayload) => Promise<boolean>;
  refreshSession: (refreshToken?: string) => Promise<boolean>;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  initData: ServerInitDataType;
}

async function parseAuthResponse(response: Response) {
  const payload = (await response.json().catch(() => null)) as { authenticated?: boolean; accessToken?: string } | null;
  return payload;
}

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof document === "undefined") {
      return false;
    }

    return Boolean(getCookie(ACCESS_TOKEN_COOKIE_NAME));
  });

  useEffect(() => {
    const accessToken = getCookie(ACCESS_TOKEN_COOKIE_NAME);

    if (accessToken) {
      setAuthToken(accessToken);
      return;
    }

    removeAuthToken();
  }, []);

  // When an access token can no longer be refreshed, the auth client emits a
  // session 401 on the event bus. Without a listener the user is left on a dead
  // authenticated page with failing requests, so tear the session down here.
  useEffect(() => {
    function handleSessionExpired(payload: AuthEventBus) {
      if (payload.status !== 401) {
        return;
      }

      removeAuthToken();
      setIsAuthenticated(false);
      void fetch("/api/auth/logout", { method: "POST", credentials: "include", cache: "no-store" }).catch(() => {
        // Cookies are still cleared by the redirect's middleware pass.
      });

      const { pathname, search } = window.location;

      if (pathname.startsWith("/sign-in")) {
        return;
      }

      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(`${pathname}${search}`)}`);
    }

    eventBus.$on<AuthEventBus>("errorApi", handleSessionExpired);

    return () => {
      eventBus.$remove<AuthEventBus>("errorApi", handleSessionExpired);
    };
  }, [router]);

  function hydrateSession(payload: AuthSessionPayload) {
    const tokens = normalizeAuthTokens(payload);

    if (!tokens?.accessToken) {
      removeAuthToken();
      setIsAuthenticated(false);
      return false;
    }

    setAuthToken(tokens.accessToken);
    setIsAuthenticated(true);
    return true;
  }

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
      hydrateSession,
      async setSession(payload) {
        const response = await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const result = await parseAuthResponse(response);

        if (!response.ok || !result?.accessToken) {
          setIsAuthenticated(false);
          return false;
        }

        return hydrateSession(result);
      },
      async refreshSession(refreshToken) {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          ...(refreshToken
            ? {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
              }
            : {}),
        });
        const result = await parseAuthResponse(response);

        if (!response.ok || !result?.accessToken) {
          removeAuthToken();
          setIsAuthenticated(false);
          return false;
        }

        return hydrateSession(result);
      },
      async clearSession() {
        let shouldFallbackToSessionDelete = false;

        try {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            cache: "no-store",
          });

          shouldFallbackToSessionDelete = !response.ok;
        } catch {
          shouldFallbackToSessionDelete = true;
        }

        if (shouldFallbackToSessionDelete) {
          try {
            await fetch("/api/auth/session", { method: "DELETE", credentials: "include" });
          } catch {
            // Client auth state is still cleared below.
          }
        }

        removeAuthToken();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
