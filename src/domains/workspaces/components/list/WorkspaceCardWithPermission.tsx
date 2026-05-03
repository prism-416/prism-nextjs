"use client";

import { WorkspaceCard } from "@/domains/workspaces/components/list/WorkspaceCard";
import { useCanManageWorkspace } from "@/domains/workspaces/hooks/useCanManageWorkspace";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceCardWithPermissionProps = {
  workspace: Workspace;
  onOpenDetails: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
};

export function WorkspaceCardWithPermission({ workspace, onOpenDetails, onDelete }: WorkspaceCardWithPermissionProps) {
  const canManageWorkspace = useCanManageWorkspace(workspace);

  return (
    <WorkspaceCard
      workspace={workspace}
      canManageWorkspace={canManageWorkspace}
      onOpenDetails={onOpenDetails}
      onDelete={onDelete}
    />
  );
}
