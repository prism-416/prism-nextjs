import { Users } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import type { ProjectMemberListItem } from "@/domains/projects/types";

type ProjectMembersPanelProps = {
  members: ProjectMemberListItem[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
};

export function ProjectMembersPanel({ members, isPending, isError, onRetry }: ProjectMembersPanelProps) {
  return (
    <aside className="rounded-2xl border border-border/80 bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-prism-muted" />
          <Typography
            variant="title"
            tone="primary"
          >
            Members
          </Typography>
        </div>
        <Typography
          variant="caption"
          tone="muted"
        >
          {members.length} total
        </Typography>
      </div>

      {isError ? (
        <div className="mt-5 rounded-xl border border-prism-danger-soft bg-surface px-4 py-3 text-sm text-prism-danger">
          <p>Members could not be loaded.</p>
          <Button
            className="mt-3 h-8 rounded-lg border-prism-danger-soft bg-surface px-3 text-prism-danger hover:bg-prism-danger-soft/40"
            onClick={onRetry}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : null}

      {!isError && isPending ? (
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-5"
        >
          Loading members...
        </Typography>
      ) : null}

      {!isError && !isPending && members.length === 0 ? (
        <Typography
          variant="bodySm"
          tone="muted"
          className="mt-5 italic"
        >
          No members assigned yet.
        </Typography>
      ) : null}

      {!isError && members.length > 0 ? (
        <div className="mt-5 space-y-3">
          {members.slice(0, 6).map(member => (
            <div
              key={member.memberId}
              className="rounded-xl border border-border/70 bg-surface-strong px-3 py-2"
            >
              <Typography
                variant="bodySm"
                tone="primary"
                weight="semibold"
                className="truncate"
              >
                {member.fullName}
              </Typography>
              <Typography
                variant="caption"
                tone="muted"
                className="truncate text-xs"
              >
                @{member.username}
                {member.jobNames.length > 0 ? ` - ${member.jobNames.join(", ")}` : ""}
              </Typography>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
