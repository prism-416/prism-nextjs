"use client";

import { useMemo, useState } from "react";

import { useRemoveWorkspaceMember } from "@/domains/workspaces/hooks/useRemoveWorkspaceMember";
import { useTransferWorkspaceOwner } from "@/domains/workspaces/hooks/useTransferWorkspaceOwner";
import { useUpdateWorkspaceMemberRole } from "@/domains/workspaces/hooks/useUpdateWorkspaceMemberRole";
import { useWorkspaceById } from "@/domains/workspaces/hooks/useWorkspaceById";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { InvitationRole, Workspace, WorkspaceMember } from "@/domains/workspaces/types";
import { getWorkspaceMemberDisplayName, getWorkspaceMemberSortRank } from "@/domains/workspaces/utils/member";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";

export type PendingMemberAction = {
  type: "remove" | "transfer-owner";
  member: WorkspaceMember;
};

type UseWorkspaceMemberManagementOptions = {
  initialData?: WorkspaceMember[];
  onLeave?: () => void;
  onSelfRoleChanged?: () => void;
};

const EMPTY_MEMBERS: WorkspaceMember[] = [];

export function useWorkspaceMemberManagement(workspace: Workspace, options: UseWorkspaceMemberManagementOptions = {}) {
  const { initialData, onLeave, onSelfRoleChanged } = options;

  const [optimisticOwnerId, setOptimisticOwnerId] = useState<string | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingMemberAction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: liveWorkspace } = useWorkspaceById(workspace.workspaceId, workspace);
  const { data, isPending, isError, refetch } = useWorkspaceMembers(workspace.workspaceId, initialData);
  const removeMember = useRemoveWorkspaceMember();
  const updateRole = useUpdateWorkspaceMemberRole();
  const transferOwner = useTransferWorkspaceOwner();

  const members = data ?? EMPTY_MEMBERS;
  const ownerId = optimisticOwnerId ?? liveWorkspace?.ownerId ?? workspace.ownerId;
  const currentMember = members.find(member => member.userId === currentUser?.userId);
  const isWorkspaceOwner = currentUser?.userId === ownerId;
  const canManageMembers = isWorkspaceOwner || currentMember?.role === "admin";
  const isMutating = removeMember.isPending || updateRole.isPending || transferOwner.isPending;
  const sortedMembers = useMemo(
    () =>
      [...members].sort(
        (first, second) => getWorkspaceMemberSortRank(first, ownerId) - getWorkspaceMemberSortRank(second, ownerId),
      ),
    [members, ownerId],
  );

  async function handleRoleChange(member: WorkspaceMember, role: InvitationRole) {
    setActionMessage(null);
    const isSelf = member.userId === currentUser?.userId;

    try {
      await updateRole.mutateAsync({ workspaceId: workspace.workspaceId, userId: member.userId, role });
      if (isSelf) {
        onSelfRoleChanged?.();
      }
    } catch {
      setActionMessage("Member role could not be updated.");
    }
  }

  async function handleRemove(member: WorkspaceMember) {
    const isSelf = member.userId === currentUser?.userId;

    setActionMessage(null);

    try {
      await removeMember.mutateAsync({
        workspaceId: workspace.workspaceId,
        userId: member.userId,
        removeWorkspaceFromList: isSelf,
      });
      if (isSelf) {
        onLeave?.();
      }
    } catch {
      setActionMessage(isSelf ? "Workspace could not be left." : "Member could not be removed.");
    }
  }

  async function handleTransferOwner(member: WorkspaceMember) {
    setActionMessage(null);
    const nextOwnerId = member.userId;
    setOptimisticOwnerId(nextOwnerId);

    try {
      await transferOwner.mutateAsync({
        workspaceId: workspace.workspaceId,
        ownerId: nextOwnerId,
      });
      setOptimisticOwnerId(null);
      void refetch();
    } catch {
      setOptimisticOwnerId(null);
      setActionMessage("Workspace owner could not be transferred.");
    }
  }

  async function handleConfirmPendingAction() {
    if (!pendingAction) return;

    if (pendingAction.type === "transfer-owner") {
      await handleTransferOwner(pendingAction.member);
    } else {
      await handleRemove(pendingAction.member);
    }

    setPendingAction(null);
  }

  function getPendingActionCopy() {
    if (!pendingAction) {
      return {
        title: "Confirm action",
        description: "Confirm this workspace member action.",
        confirmLabel: "Confirm",
        tone: "default" as const,
      };
    }

    const displayName = getWorkspaceMemberDisplayName(pendingAction.member);

    if (pendingAction.type === "transfer-owner") {
      return {
        title: "Transfer ownership",
        description: `Transfer workspace ownership to ${displayName}?`,
        confirmLabel: "Transfer owner",
        tone: "default" as const,
      };
    }

    return {
      title: "Remove member",
      description: `Remove ${displayName} from this workspace?`,
      confirmLabel: "Remove member",
      tone: "danger" as const,
    };
  }

  return {
    currentUser,
    currentMember,
    members,
    sortedMembers,
    ownerId,
    isWorkspaceOwner,
    canManageMembers,
    isMutating,
    isPending,
    isError,
    refetch,
    actionMessage,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isLeaveOpen,
    setIsLeaveOpen,
    pendingAction,
    setPendingAction,
    handleRoleChange,
    handleRemove,
    handleConfirmPendingAction,
    getPendingActionCopy,
    removeMember,
  };
}
