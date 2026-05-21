"use client";

import { UserPlus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { ConfirmDialog } from "@/atomics/organisms/ConfirmDialog";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInviteMembersDialog } from "@/domains/workspaces/components/WorkspaceInviteMembersDialog";
import { WorkspaceLeaveDialog } from "@/domains/workspaces/components/WorkspaceLeaveDialog";
import { WorkspaceMemberActionsMenu } from "@/domains/workspaces/components/WorkspaceMemberActionsMenu";
import { WorkspaceMemberRow } from "@/domains/workspaces/components/WorkspaceMemberRow";
import { useWorkspaceMemberManagement } from "@/domains/workspaces/hooks/useWorkspaceMemberManagement";
import type { Workspace } from "@/domains/workspaces/types";

type WorkspaceMembersEditorProps = {
  workspace: Workspace;
  onWorkspaceLeft?: () => void;
  onSelfRoleChanged?: () => void;
};

export function WorkspaceMembersEditor({ workspace, onWorkspaceLeft, onSelfRoleChanged }: WorkspaceMembersEditorProps) {
  const {
    currentUser,
    currentMember,
    sortedMembers,
    members,
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
  } = useWorkspaceMemberManagement(workspace, {
    onLeave: onWorkspaceLeft,
    onSelfRoleChanged,
  });

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
            className="h-8 rounded-lg bg-prism-navy px-2.5 text-xs text-white hover:bg-prism-navy/90"
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
            onClick={() => void refetch()}
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
              <WorkspaceMemberRow
                key={member.userId}
                member={member}
                ownerId={ownerId}
                currentUserId={currentUser?.userId}
              >
                {canShowActions ? (
                  <WorkspaceMemberActionsMenu
                    member={member}
                    disabled={isMutating}
                    onRoleChange={role => void handleRoleChange(member, role)}
                    onRemove={() => {
                      if (isSelf) {
                        setIsLeaveOpen(true);
                      } else {
                        setPendingAction({ type: "remove", member });
                      }
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
              </WorkspaceMemberRow>
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
          if (!open) setPendingAction(null);
        }}
        onConfirm={() => void handleConfirmPendingAction()}
      />

      <WorkspaceLeaveDialog
        workspaceName={workspace.name}
        isOwner={isWorkspaceOwner}
        open={isLeaveOpen}
        isPending={removeMember.isPending}
        onOpenChange={setIsLeaveOpen}
        onConfirm={() => {
          if (currentMember) void handleRemove(currentMember);
        }}
      />
    </section>
  );
}
