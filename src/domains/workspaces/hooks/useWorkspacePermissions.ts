"use client";

import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { Workspace } from "@/domains/workspaces/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

type UseWorkspacePermissionsOptions = {
  initialCanManage?: boolean;
};

export function useWorkspacePermissions(
  workspace: Pick<Workspace, "workspaceId" | "ownerId">,
  options: UseWorkspacePermissionsOptions = {},
) {
  const { data: currentUser } = useCurrentUser();
  const { data: liveWorkspace } = useWorkspaceById(workspace.workspaceId);
  const { data: members } = useWorkspaceMembers(workspace.workspaceId);
  const ownerId = liveWorkspace?.ownerId ?? workspace.ownerId;
  const currentMember = members?.find(member => member.userId === currentUser?.userId);
  const isOwner = currentUser?.userId === ownerId;
  const liveCanManage = isOwner || currentMember?.role === "admin";
  const canManage = members ? liveCanManage : (options.initialCanManage ?? liveCanManage);

  return { canManage, isOwner };
}
