"use client";

import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

/**
 * Mirrors the document module's role enforcement:
 * - contribute (upload / download): owner, admin, member (everyone except viewer)
 * - manage (delete): owner or admin only
 */
export function useProjectDocumentPermissions(workspaceId?: string) {
  const { data: currentUser } = useCurrentUser();
  const { data: workspace } = useWorkspaceById(workspaceId ?? null);
  const { data: members } = useWorkspaceMembers(workspaceId ?? "");

  const currentMember = members?.find(member => member.userId === currentUser?.userId);
  const isOwner = Boolean(currentUser?.userId && workspace?.ownerId === currentUser.userId);
  const role = currentMember?.role;

  const canManage = isOwner || role === "admin";
  const canContribute = canManage || role === "member";

  return { canContribute, canManage, isOwner, role };
}
