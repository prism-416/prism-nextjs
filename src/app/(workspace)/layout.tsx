"use client";

import type { ReactNode } from "react";

import { WorkspaceAccessGate } from "@/domains/workspace/components/WorkspaceAccessGate";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <WorkspaceAccessGate>{children}</WorkspaceAccessGate>;
}
