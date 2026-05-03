"use client";

import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { Workspace } from "@/domains/workspaces/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

export function useCanManageWorkspace(workspace: Workspace) {
  const { data: currentUser } = useCurrentUser();
  const { data: members } = useWorkspaceMembers(workspace.workspaceId);
  const currentMember = members?.find(member => member.userId === currentUser?.userId);

  return currentUser?.userId === workspace.ownerId || currentMember?.role === "admin";
}
