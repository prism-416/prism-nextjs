"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/shared/constants/auth";
import { getCookie } from "@/shared/utils/cookie";
import { removeAuthToken, setAuthToken } from "@/shared/utils/axios-util";
import type { ServerInitDataType } from "@/shared/utils/server-util";
import { AuthSessionPayload } from "@/shared/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  setSession: (payload: AuthSessionPayload) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
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

  const value = useMemo<AuthContextType>(
    () => ({
      isAuthenticated,
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

        setAuthToken(result.accessToken);
        setIsAuthenticated(true);
        return true;
      },
      async refreshSession() {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });
        const result = await parseAuthResponse(response);

        if (!response.ok || !result?.accessToken) {
          removeAuthToken();
          setIsAuthenticated(false);
          return false;
        }

        setAuthToken(result.accessToken);
        setIsAuthenticated(true);
        return true;
      },
      async clearSession() {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
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
