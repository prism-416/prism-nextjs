"use client";

import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { Workspace } from "@/domains/workspaces/types";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

export function useWorkspacePermissions(workspace: Pick<Workspace, "workspaceId" | "ownerId">) {
  const { data: currentUser } = useCurrentUser();
  const { data: members } = useWorkspaceMembers(workspace.workspaceId);
  const currentMember = members?.find(member => member.userId === currentUser?.userId);
  const isOwner = currentUser?.userId === workspace.ownerId;
  const canManage = isOwner || currentMember?.role === "admin";

  return { canManage, isOwner };
}
