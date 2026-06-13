"use client";

import { useWorkspaceRoute } from "@/domains/workspaces/components/WorkspaceRouteShell";
import { WorkspaceSettingsClient } from "@/domains/workspaces/components/WorkspaceSettingsClient";

export function WorkspaceSettingsRoute() {
  const { workspace } = useWorkspaceRoute();

  return <WorkspaceSettingsClient workspace={workspace} />;
}
