"use client";

import { useMemo, useState } from "react";
import { CircleCheck, Loader2, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { ConfirmDialog } from "@/atomics/organisms/ConfirmDialog";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceInviteMembersDialog } from "@/domains/workspaces/components/WorkspaceInviteMembersDialog";
import { WorkspaceMembersSkeleton } from "@/domains/workspaces/components/WorkspaceMembersSkeleton";
import { useRemoveWorkspaceMember } from "@/domains/workspaces/hooks/useRemoveWorkspaceMember";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { Workspace, WorkspaceMember } from "@/domains/workspaces/types";
import {
  getWorkspaceMemberDisplayName,
  getWorkspaceMemberInitial,
  getWorkspaceMemberSortRank,
} from "@/domains/workspaces/utils/member";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { cn } from "@/shared/utils/cn";

type WorkspaceMembersClientProps = {
  workspace: Workspace;
  initialData?: WorkspaceMember[];
};

const EMPTY_MEMBERS: WorkspaceMember[] = [];

export function WorkspaceMembersClient({ workspace, initialData }: WorkspaceMembersClientProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [pendingRemoveMember, setPendingRemoveMember] = useState<WorkspaceMember | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const { data: currentUser } = useCurrentUser();
  const { data, isPending, isError, refetch } = useWorkspaceMembers(workspace.workspaceId, initialData);
  const removeMember = useRemoveWorkspaceMember();
  const members = data ?? EMPTY_MEMBERS;
  const currentMember = members.find(member => member.userId === currentUser?.userId);
  const canManageMembers = currentUser?.userId === workspace.ownerId || currentMember?.role === "admin";
  const sortedMembers = useMemo(
    () =>
      [...members].sort(
        (first, second) =>
          getWorkspaceMemberSortRank(first, workspace.ownerId) - getWorkspaceMemberSortRank(second, workspace.ownerId),
      ),
    [members, workspace.ownerId],
  );

  async function handleConfirmRemove() {
    if (!pendingRemoveMember) {
      return;
    }

    setActionMessage(null);

    try {
      await removeMember.mutateAsync({
        workspaceId: workspace.workspaceId,
        userId: pendingRemoveMember.userId,
      });
      setPendingRemoveMember(null);
    } catch {
      setActionMessage("Member could not be removed.");
      setPendingRemoveMember(null);
    }
  }

  if (isPending && members.length === 0) {
    return <WorkspaceMembersSkeleton />;
  }

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
            onClick={() => {
              void refetch();
            }}
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
            const isOwner = member.userId === workspace.ownerId;
            const isSelf = member.userId === currentUser?.userId;
            const canRemoveMember = canManageMembers && !isOwner && !isSelf;

            return (
              <div
                key={member.userId}
                className="flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0"
              >
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
                  <span className="hidden items-center gap-1 rounded-full border border-prism-glow-sky/35 bg-prism-glow-sky/10 px-2.5 py-1 text-xs font-medium text-prism-navy sm:inline-flex">
                    <CircleCheck className="size-3.5 text-prism-glow-sky" />
                    You
                  </span>
                ) : null}
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                    isOwner || member.role === "admin"
                      ? "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy"
                      : "border-border bg-surface-strong text-prism-muted",
                  )}
                >
                  {isOwner ? "owner" : member.role}
                </span>
                {canRemoveMember ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-9 shrink-0 text-prism-danger hover:bg-prism-danger-soft/30 hover:text-prism-danger"
                    aria-label={`Remove ${getWorkspaceMemberDisplayName(member)}`}
                    disabled={removeMember.isPending}
                    onClick={() => setPendingRemoveMember(member)}
                  >
                    {removeMember.isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
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
        open={pendingRemoveMember != null}
        title="Remove member"
        description={
          pendingRemoveMember
            ? `Remove ${getWorkspaceMemberDisplayName(pendingRemoveMember)} from this workspace?`
            : "Remove this member from this workspace?"
        }
        confirmLabel="Remove member"
        isPending={removeMember.isPending}
        tone="danger"
        onOpenChange={open => {
          if (!open) {
            setPendingRemoveMember(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmRemove();
        }}
      />
    </section>
  );
}
