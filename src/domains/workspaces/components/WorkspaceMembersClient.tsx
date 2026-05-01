"use client";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { WorkspaceMembersSkeleton } from "@/domains/workspaces/components/WorkspaceMembersSkeleton";
import { useWorkspaceMembers } from "@/domains/workspaces/hooks/useWorkspaceMembers";
import type { WorkspaceMember } from "@/domains/workspaces/types";
import { cn } from "@/shared/utils/cn";

type WorkspaceMembersClientProps = {
  workspaceId: string;
  initialData?: WorkspaceMember[];
};

export function WorkspaceMembersClient({ workspaceId, initialData }: WorkspaceMembersClientProps) {
  const { data, isPending, isError, refetch } = useWorkspaceMembers(workspaceId, initialData);
  const members = data ?? [];

  if (isPending && members.length === 0) {
    return <WorkspaceMembersSkeleton />;
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-prism-heading">Members</h1>
        <p className="mt-1 text-sm text-prism-muted">Review who has access to this workspace.</p>
      </div>

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
        </div>
      ) : null}

      {!isError && members.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.05)]">
          {members.map(member => (
            <div
              key={member.userId}
              className="flex items-center gap-3 border-b border-border/60 px-5 py-4 last:border-b-0"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-prism-navy text-sm font-semibold text-primary-foreground">
                {getMemberInitial(member)}
              </span>
              <div className="min-w-0 flex-1">
                <Typography
                  variant="title"
                  tone="primary"
                  className="truncate text-base"
                >
                  {member.fullName}
                </Typography>
                <Typography
                  variant="caption"
                  tone="muted"
                  className="mt-0.5 block truncate"
                >
                  @{member.username}
                </Typography>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
                  member.role === "admin"
                    ? "border-prism-teal-500/30 bg-prism-teal-500/10 text-prism-navy"
                    : "border-border bg-surface-strong text-prism-muted",
                )}
              >
                {member.role}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function getMemberInitial(member: WorkspaceMember) {
  const displayName = member.fullName || member.username;

  return displayName.trim().charAt(0).toUpperCase() || "U";
}
