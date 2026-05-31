import Link from "next/link";
import { CalendarRange, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { SprintStatusBadge } from "@/domains/sprints/components/SprintStatusBadge";
import type { Sprint, SprintStatus } from "@/domains/sprints/types";
import { formatSprintRange, getSprintStatusLabel, SPRINT_STATUSES } from "@/domains/sprints/utils/sprint";
import { cn } from "@/shared/utils/cn";

type WorkspaceSprintsPanelProps = {
  workspaceSlug: string;
  sprints: Sprint[];
  isError: boolean;
  canManage: boolean;
  onRetry: () => void;
  onCreateSprint: () => void;
};

const STATUS_DOT_CLASS_NAMES: Record<SprintStatus, string> = {
  planned: "bg-prism-muted",
  active: "bg-prism-success",
  closed: "bg-prism-info",
};

function SprintCard({ workspaceSlug, sprint }: { workspaceSlug: string; sprint: Sprint }) {
  const href = `/workspaces/${encodeURIComponent(workspaceSlug)}/sprints/${encodeURIComponent(sprint.sprintId)}`;

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl border border-border/80 bg-surface p-4",
        "shadow-[0_2px_8px_rgba(3,23,34,0.06)] transition-all",
        "hover:border-border-strong/60 hover:shadow-[0_4px_16px_rgba(3,23,34,0.10)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="truncate"
        >
          {sprint.name}
        </Typography>
        <SprintStatusBadge status={sprint.status} />
      </div>
      <Typography
        variant="caption"
        tone="muted"
        className={cn("mt-1.5 line-clamp-2", !sprint.goal && "italic opacity-60")}
      >
        {sprint.goal || "No goal."}
      </Typography>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-prism-muted">
        <CalendarRange className="size-3 shrink-0" />
        <span className="truncate">{formatSprintRange(sprint)}</span>
      </div>
    </Link>
  );
}

export function WorkspaceSprintsPanel({
  workspaceSlug,
  sprints,
  isError,
  canManage,
  onRetry,
  onCreateSprint,
}: WorkspaceSprintsPanelProps) {
  const sprintsByStatus = SPRINT_STATUSES.reduce<Record<SprintStatus, Sprint[]>>(
    (result, status) => ({ ...result, [status]: sprints.filter(sprint => sprint.status === status) }),
    { planned: [], active: [], closed: [] },
  );

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="size-5 text-prism-muted" />
            <h1 className="text-xl font-semibold text-prism-heading">Sprints</h1>
          </div>
          <p className="mt-1 text-sm text-prism-muted">Plan iterations across projects in this workspace.</p>
        </div>
        {!isError && canManage && (
          <Button
            type="button"
            className="h-10 rounded-lg px-4"
            onClick={onCreateSprint}
          >
            <Plus className="size-4" />
            New sprint
          </Button>
        )}
      </div>
      {isError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Sprints could not be loaded.</p>
          <Button
            className="mt-3 h-9 rounded-lg"
            onClick={onRetry}
            variant="outline"
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      )}
      {!isError && (
        <div className="grid gap-4 lg:grid-cols-3">
          {SPRINT_STATUSES.map(status => (
            <section
              key={status}
              className="rounded-2xl border border-border/80 bg-surface-strong"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-prism-heading">
                  <span className={cn("size-2 rounded-full", STATUS_DOT_CLASS_NAMES[status])} />
                  {getSprintStatusLabel(status)}
                </span>
                <span className="text-xs text-prism-muted">{sprintsByStatus[status].length}</span>
              </div>
              <div className="flex flex-col gap-3 p-3">
                {sprintsByStatus[status].length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-xs text-prism-muted/70">
                    No sprints
                  </p>
                ) : (
                  sprintsByStatus[status].map(sprint => (
                    <SprintCard
                      key={sprint.sprintId}
                      workspaceSlug={workspaceSlug}
                      sprint={sprint}
                    />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
