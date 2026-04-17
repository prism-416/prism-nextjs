"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { normalizeAuthTokens } from "@/shared/utils/auth-session";
import { getCookie } from "@/shared/utils/cookie";
import { removeAuthToken, setAuthToken } from "@/shared/utils/axios-util";
import { logout } from "@/domains/auth/api";
import type { ServerInitDataType } from "@/shared/utils/server-util";
import { AuthSessionPayload } from "@/shared/types/auth";

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
        try {
          await logout();
        } catch {
          // Backend logout is best-effort
        }
        await fetch("/api/auth/session", { method: "DELETE", credentials: "include" });
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
