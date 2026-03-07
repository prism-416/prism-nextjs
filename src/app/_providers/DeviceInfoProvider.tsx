"use client";

import React, { createContext, useContext } from "react";
import type { ServerDeviceInfoType, ServerInitDataType } from "@/shared/utils/server-util";

const DeviceInfoContext = createContext<ServerDeviceInfoType | null>(null);

export const DeviceInfoProvider: React.FC<{ initData: ServerInitDataType; children: React.ReactNode }> = ({
  initData: { deviceInfo },
  children,
}) => {
  return <DeviceInfoContext.Provider value={deviceInfo}>{children}</DeviceInfoContext.Provider>;
};

/**
 * @description 클라이언트에서 기기 정보를 가져오기 위한 훅
 */
export const useClientDeviceInfo = () => {
  const context = useContext(DeviceInfoContext);
  if (!context) {
    throw new Error("useDeviceInfo must be used within a DeviceInfoProvider");
  }
  return context;
};
