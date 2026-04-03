"use client";

import TanStackQueryProvider from "./TanStackQueryProvider";
import type { ServerInitDataType } from "@/shared/utils/server-util";
import RenderProvider from "./RenderProvider";
import ErrorHandleProvider from "./ErrorHandleProvider";
import { DeviceInfoProvider } from "./DeviceInfoProvider";
import AuthProvider from "./AuthProvider";
import { OAuthProvider } from "./OAuthProvider";
import { VersionProvider } from "./VersionProvider";

interface Props {
  children: React.ReactNode;
  initData: ServerInitDataType;
}

export default function Provider({ children, initData }: Props) {
  return (
    <OAuthProvider initData={initData}>
      <AuthProvider initData={initData}>
        <DeviceInfoProvider initData={initData}>
          <TanStackQueryProvider>
            <RenderProvider initData={initData}>
              <ErrorHandleProvider initData={initData}>
                <VersionProvider initData={initData}>{children}</VersionProvider>
              </ErrorHandleProvider>
            </RenderProvider>
          </TanStackQueryProvider>
        </DeviceInfoProvider>
      </AuthProvider>
    </OAuthProvider>
  );
}
