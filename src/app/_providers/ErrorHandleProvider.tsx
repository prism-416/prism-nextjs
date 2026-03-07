"use client";

import React from "react";
import type { ServerInitDataType } from "@/shared/utils/server-util";

interface Props {
  children: React.ReactNode;
  initData: ServerInitDataType;
}

export default function ErrorHandleProvider({ children }: Props) {
  return <>{children}</>;
}
