"use client";

import type { ReactNode } from "react";

import { useWorkspaceAccess } from "@/domains/workspace/hooks/useWorkspaceAccess";
import { WorkspaceLoadingState } from "@/domains/workspace/components/WorkspaceLoadingState";

type WorkspaceAccessGateProps = {
  children: ReactNode;
};

export function WorkspaceAccessGate({ children }: WorkspaceAccessGateProps) {
  const { isCheckingAccess, hasAccess } = useWorkspaceAccess();

  if (isCheckingAccess) {
    return <WorkspaceLoadingState />;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
