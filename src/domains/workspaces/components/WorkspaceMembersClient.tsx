"use client";

import { useRouter } from "next/navigation";
import { CircleCheck, Crown, UserPlus } from "lucide-react";

import { Badge } from "@/atomics/atoms/Badge";
import { Button } from "@/atomics/atoms/Button";
import { ConfirmDialog } from "@/atomics/organisms/ConfirmDialog";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInviteMembersDialog } from "@/domains/workspaces/components/WorkspaceInviteMembersDialog";
import { WorkspaceLeaveDialog } from "@/domains/workspaces/components/WorkspaceLeaveDialog";
import { WorkspaceMemberActionsMenu } from "@/domains/workspaces/components/WorkspaceMemberActionsMenu";
import { WorkspaceMemberJobsEditor } from "@/domains/workspaces/components/WorkspaceMemberJobsEditor";
import { WorkspaceMembersSkeleton } from "@/domains/workspaces/components/WorkspaceMembersSkeleton";
import { useWorkspaceMemberManagement } from "@/domains/workspaces/hooks/useWorkspaceMemberManagement";
import { useWorkspaceJobs } from "@/domains/workspaces/hooks/useWorkspaceJobs";
import type { Workspace, WorkspaceJob, WorkspaceMember } from "@/domains/workspaces/types";
import {
  getWorkspaceMemberInitial,
  getWorkspaceMemberDisplayName,
  getWorkspaceMemberRoleBadgeClassName,
} from "@/domains/workspaces/utils/member";
import { cn } from "@/shared/utils/cn";

type WorkspaceMembersClientProps = {
  workspace: Workspace;
  initialData?: WorkspaceMember[];
  initialJobs?: WorkspaceJob[];
};

export function WorkspaceMembersClient({ workspace, initialData, initialJobs }: WorkspaceMembersClientProps) {
  const router = useRouter();
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
    initialData,
    onLeave: () => router.push("/workspaces"),
  });
  const { data: jobs = [] } = useWorkspaceJobs(workspace.workspaceId, initialJobs);

  if (isPending && members.length === 0) {
    return <WorkspaceMembersSkeleton />;
  }

  const pendingActionCopy = getPendingActionCopy();

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-prism-heading">Members</h1>
          <p className="mt-1 text-sm text-prism-muted">Review who has access to this workspace.</p>
        </div>
        {canManageMembers ? (
          <Button
            type="button"
            className="h-10 gap-1.5 rounded-lg px-4"
            onClick={() => setIsInviteDialogOpen(true)}
          >
            <UserPlus className="size-4" />
            Add member
          </Button>
        ) : null}
      </div>

      {actionMessage ? (
        <p
          role="alert"
          className="rounded-xl border border-prism-danger-soft bg-prism-danger-soft/20 px-4 py-3 text-sm text-prism-danger"
        >
          {actionMessage}
        </p>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Members could not be loaded.</p>
          <Button
            className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
            onClick={() => void refetch()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : null}

      {!isError && members.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
          <h2 className="text-base font-semibold text-prism-heading">No members yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-prism-muted">
            Invited teammates will appear here after they join this workspace.
          </p>
          {canManageMembers ? (
            <Button
              type="button"
              className="mt-5 h-10 gap-1.5 rounded-lg px-5"
              onClick={() => setIsInviteDialogOpen(true)}
            >
              <UserPlus className="size-4" />
              Add member
            </Button>
          ) : null}
        </div>
      ) : null}

      {!isError && members.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
          {sortedMembers.map(member => {
            const isOwner = member.userId === ownerId;
            const isSelf = member.userId === currentUser?.userId;
            const canShowActions = !isOwner && (canManageMembers || isSelf);

            return (
              <div
                key={member.userId}
                className="border-b border-border/60 px-5 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-prism-navy text-sm font-semibold text-primary-foreground">
                    {getWorkspaceMemberInitial(member)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Typography
                      variant="title"
                      tone="primary"
                      className="truncate text-base"
                    >
                      {getWorkspaceMemberDisplayName(member)}
                    </Typography>
                    <Typography
                      variant="caption"
                      tone="muted"
                      className="mt-0.5 block truncate"
                    >
                      @{member.username}
                    </Typography>
                  </div>
                  {isSelf ? (
                    <Badge
                      icon={CircleCheck}
                      className="hidden sm:inline-flex"
                    >
                      You
                    </Badge>
                  ) : null}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                      getWorkspaceMemberRoleBadgeClassName(member, ownerId),
                    )}
                  >
                    {isOwner ? <Crown className="size-3.5" /> : null}
                    {isOwner ? "owner" : member.role}
                  </span>
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
                </div>
                <WorkspaceMemberJobsEditor
                  key={`${member.userId}:${member.jobIds.join(",")}`}
                  workspace={workspace}
                  member={member}
                  jobs={jobs}
                  canManage={canManageMembers}
                />
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
