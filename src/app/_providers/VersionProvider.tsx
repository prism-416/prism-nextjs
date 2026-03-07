"use client";

import React, { createContext, useContext } from "react";
import type { ServerInitDataType } from "@/shared/utils/server-util";

const VersionContext = createContext<string | null>(null);

export const VersionProvider: React.FC<{ initData: ServerInitDataType; children: React.ReactNode }> = ({
  initData: { version },
  children,
}) => {
  return <VersionContext.Provider value={version}>{children}</VersionContext.Provider>;
};

/**
 * @description 클라이언트에서 기기 정보를 가져오기 위한 훅
 */
export const useVersion = () => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error("useVersion must be used within a VersionProvider");
  }
  return context;
};
