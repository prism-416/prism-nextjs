"use client";

import { createContext, useContext, useMemo } from "react";
import type { ServerInitDataType } from "@/shared/utils/server-util";

type OAuthContextValue = {
  googleClientId?: string;
};

const OAuthContext = createContext<OAuthContextValue | undefined>(undefined);

type OAuthProviderProps = {
  children: React.ReactNode;
  initData: ServerInitDataType;
};

export function OAuthProvider({ children, initData }: OAuthProviderProps) {
  const value = useMemo(
    () => ({
      googleClientId: initData.googleClientId,
    }),
    [initData.googleClientId],
  );

  return <OAuthContext.Provider value={value}>{children}</OAuthContext.Provider>;
}

export function useOAuth() {
  const context = useContext(OAuthContext);

  if (context === undefined) {
    throw new Error("useOAuth must be used within OAuthProvider");
  }

  return context;
}
