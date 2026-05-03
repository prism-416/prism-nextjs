"use client";

import { WorkspaceRow } from "@/domains/workspaces/components/list/WorkspaceRow";
import { useCanManageWorkspace } from "@/domains/workspaces/hooks/useCanManageWorkspace";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceRowWithPermissionProps = {
  workspace: Workspace;
  onOpenDetails: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void;
};

export function WorkspaceRowWithPermission({ workspace, onOpenDetails, onDelete }: WorkspaceRowWithPermissionProps) {
  const canManageWorkspace = useCanManageWorkspace(workspace);

  return (
    <WorkspaceRow
      workspace={workspace}
      canManageWorkspace={canManageWorkspace}
      onOpenDetails={onOpenDetails}
      onDelete={onDelete}
    />
  );
}
