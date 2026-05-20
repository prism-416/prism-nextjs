"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Crown, UserPlus } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Button } from "@/atomics/atoms/Button";
import { ConfirmDialog } from "@/atomics/organisms/ConfirmDialog";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInviteMembersDialog } from "@/domains/workspaces/components/WorkspaceInviteMembersDialog";
import { WorkspaceMemberActionsMenu } from "@/domains/workspaces/components/WorkspaceMemberActionsMenu";
import { useRemoveWorkspaceMember } from "@/domains/workspaces/hooks/useRemoveWorkspaceMember";
import { useTransferWorkspaceOwner } from "@/domains/workspaces/hooks/useTransferWorkspaceOwner";
import { useUpdateWorkspaceMemberRole } from "@/domains/workspaces/hooks/useUpdateWorkspaceMemberRole";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { InvitationRole, Workspace, WorkspaceMember } from "@/domains/workspaces/types";
import {
  getWorkspaceMemberDisplayName,
  getWorkspaceMemberInitial,
  getWorkspaceMemberRoleBadgeClassName,
  getWorkspaceMemberSortRank,
} from "@/domains/workspaces/utils/member";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { cn } from "@/shared/utils/cn";

type WorkspaceMembersEditorProps = {
  workspace: Workspace;
  onWorkspaceLeft?: () => void;
};

type PendingMemberAction = {
  type: "remove" | "transfer-owner";
  member: WorkspaceMember;
};

const EMPTY_MEMBERS: WorkspaceMember[] = [];

export function WorkspaceMembersEditor({ workspace, onWorkspaceLeft }: WorkspaceMembersEditorProps) {
  const [ownerId, setOwnerId] = useState(workspace.ownerId);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingMemberAction | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const { data, isPending, isError, refetch } = useWorkspaceMembers(workspace.workspaceId);
  const removeMember = useRemoveWorkspaceMember();
  const updateRole = useUpdateWorkspaceMemberRole();
  const transferOwner = useTransferWorkspaceOwner();
  const members = data ?? EMPTY_MEMBERS;
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

    try {
      await updateRole.mutateAsync({ workspaceId: workspace.workspaceId, userId: member.userId, role });
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
        onWorkspaceLeft?.();
      }
    } catch {
      setActionMessage(isSelf ? "Workspace could not be left." : "Member could not be removed.");
    }
  }

  async function handleTransferOwner(member: WorkspaceMember) {
    setActionMessage(null);
    const previousOwnerId = ownerId;
    const nextOwnerId = member.userId;
    setOwnerId(nextOwnerId);

    try {
      const updatedWorkspace = await transferOwner.mutateAsync({
        workspaceId: workspace.workspaceId,
        ownerId: nextOwnerId,
      });
      setOwnerId(updatedWorkspace.ownerId || nextOwnerId);
      void refetch();
    } catch {
      setOwnerId(previousOwnerId);
      setActionMessage("Workspace owner could not be transferred.");
    }
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
    const isSelf = pendingAction.member.userId === currentUser?.userId;

    if (pendingAction.type === "transfer-owner") {
      return {
        title: "Transfer ownership",
        description: `Transfer workspace ownership to ${displayName}?`,
        confirmLabel: "Transfer owner",
        tone: "default" as const,
      };
    }

    return {
      title: isSelf ? "Leave workspace" : "Remove member",
      description: isSelf ? `Leave ${workspace.name}?` : `Remove ${displayName} from this workspace?`,
      confirmLabel: isSelf ? "Leave workspace" : "Remove member",
      tone: "danger" as const,
    };
  }

  async function handleConfirmPendingAction() {
    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "transfer-owner") {
      await handleTransferOwner(pendingAction.member);
    } else {
      await handleRemove(pendingAction.member);
    }

    setPendingAction(null);
  }

  const pendingActionCopy = getPendingActionCopy();

  return (
    <section className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Typography
            variant="bodySm"
            tone="default"
            weight="medium"
          >
            Members
          </Typography>
          <Typography
            variant="caption"
            tone="muted"
            className="mt-0.5 block"
          >
            Manage who can access this workspace.
          </Typography>
        </div>
        {canManageMembers ? (
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-lg border-prism-teal-500/25 bg-prism-teal-500/5 px-2.5 text-xs text-prism-navy hover:border-prism-teal-500/35 hover:bg-prism-teal-500/[0.07] hover:text-prism-navy"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <UserPlus className="size-3.5" />
            Add member
          </Button>
        ) : null}
      </div>

      {actionMessage ? (
        <p
          role="alert"
          className="rounded-lg border border-prism-danger-soft bg-prism-danger-soft/20 px-3 py-2 text-sm text-prism-danger"
        >
          {actionMessage}
        </p>
      ) : null}

      {isError ? (
        <div className="rounded-lg border border-prism-danger-soft bg-surface px-3 py-3 text-sm text-prism-danger">
          <p>Members could not be loaded.</p>
          <Button
            type="button"
            variant="outline"
            className="mt-2 h-8 rounded-lg px-3"
            onClick={() => {
              void refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {isPending && members.length === 0 ? (
        <div className="rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm text-prism-muted">
          Loading members...
        </div>
      ) : null}

      {!isError && !isPending && members.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong/60 bg-surface px-3 py-3 text-sm text-prism-muted">
          No members yet.
        </div>
      ) : null}

      {!isError && sortedMembers.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-border/70 bg-surface">
          {sortedMembers.map(member => {
            const isOwner = member.userId === ownerId;
            const isSelf = member.userId === currentUser?.userId;
            const canShowActions = !isOwner && (canManageMembers || isSelf);

            return (
              <div
                key={member.userId}
                className="flex items-center gap-2 border-b border-border/60 px-2.5 py-2 last:border-b-0"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-prism-navy text-[11px] font-semibold text-primary-foreground">
                  {getWorkspaceMemberInitial(member)}
                </span>
                <div className="min-w-0 flex-1">
                  <Typography
                    variant="bodySm"
                    tone="primary"
                    fontSize="base"
                    weight="medium"
                    className="truncate"
                  >
                    {getWorkspaceMemberDisplayName(member)}
                  </Typography>
                  <Typography
                    variant="caption"
                    tone="muted"
                    fontSize="xs"
                    lineHeight="none"
                    className="mt-0.5 block truncate"
                  >
                    @{member.username}
                  </Typography>
                </div>
                {isSelf ? (
                  <Badge
                    icon={CircleCheck}
                    size="sm"
                  >
                    You
                  </Badge>
                ) : null}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-medium capitalize leading-none",
                    getWorkspaceMemberRoleBadgeClassName(member, ownerId),
                  )}
                >
                  {isOwner ? <Crown className="size-3" /> : null}
                  {isOwner ? "owner" : member.role}
                </span>
                {canShowActions ? (
                  <WorkspaceMemberActionsMenu
                    member={member}
                    disabled={isMutating}
                    onRoleChange={role => {
                      void handleRoleChange(member, role);
                    }}
                    onRemove={() => {
                      setPendingAction({ type: "remove", member });
                    }}
                    onTransferOwner={() => {
                      if (isWorkspaceOwner) {
                        setPendingAction({ type: "transfer-owner", member });
                      }
                    }}
                    canTransferOwner={isWorkspaceOwner}
                    isSelf={isSelf}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      <WorkspaceInviteMembersDialog
        workspaceId={workspace.workspaceId}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />

      <ConfirmDialog
        open={pendingAction != null}
        title={pendingActionCopy.title}
        description={pendingActionCopy.description}
        confirmLabel={pendingActionCopy.confirmLabel}
        isPending={isMutating}
        tone={pendingActionCopy.tone}
        onOpenChange={open => {
          if (!open) {
            setPendingAction(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmPendingAction();
        }}
      />
    </section>
  );
}
