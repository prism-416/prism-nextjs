import Link from "next/link";
import { CalendarRange, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { CreateProjectSprintForm } from "@/domains/projects/components/CreateProjectSprintForm";
import { ProjectSprintStatusBadge } from "@/domains/projects/components/ProjectSprintStatusBadge";
import type { ProjectSprint, ProjectSprintStatus } from "@/domains/projects/types";
import {
  formatProjectRelativeDateTime,
  formatProjectSprintRange,
  getProjectSprintDurationText,
  getProjectSprintStatusLabel,
  PROJECT_SPRINT_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectSprintsPanelProps = {
  projectId: string;
  projectSlug: string;
  sprints: ProjectSprint[];
  isError: boolean;
  onRetry: () => void;
};

function getSprintsByStatus(sprints: ProjectSprint[]) {
  return PROJECT_SPRINT_STATUSES.reduce<Record<ProjectSprintStatus, ProjectSprint[]>>(
    (result, status) => ({
      ...result,
      [status]: sprints.filter(sprint => sprint.status === status),
    }),
    {
      backlog: [],
      in_progress: [],
      done: [],
    },
  );
}

function SprintSummaryCard({ status, count }: { status: ProjectSprintStatus; count: number }) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface px-4 py-3">
      <Typography
        variant="caption"
        tone="muted"
      >
        {getProjectSprintStatusLabel(status)}
      </Typography>
      <Typography
        variant="title"
        tone="primary"
        className="mt-1 text-lg tracking-normal md:text-lg"
      >
        {count}
      </Typography>
    </div>
  );
}

function SprintRow({ projectSlug, sprint }: { projectSlug: string; sprint: ProjectSprint }) {
  const sprintHref = `/projects/${encodeURIComponent(projectSlug)}/sprints/${encodeURIComponent(sprint.sprintId)}`;

  return (
    <Link
      href={sprintHref}
      className="block p-4 transition-colors hover:bg-prism-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
            className="truncate"
          >
            {sprint.name}
          </Typography>
          <Typography
            variant="caption"
            tone="muted"
            className={cn("mt-1 line-clamp-2", !sprint.description && "italic opacity-70")}
          >
            {sprint.description || "No description."}
          </Typography>
        </div>
        <ProjectSprintStatusBadge status={sprint.status} />
      </div>

      <dl className="mt-4 grid gap-2 text-xs text-prism-muted">
        <div className="flex items-center justify-between gap-3">
          <dt>Range</dt>
          <dd className="truncate text-right text-prism-body">{formatProjectSprintRange(sprint)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Duration</dt>
          <dd className="text-prism-body">{getProjectSprintDurationText(sprint)}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Created</dt>
          <dd className="text-prism-body">{formatProjectRelativeDateTime(sprint.createdAt)}</dd>
        </div>
      </dl>
    </Link>
  );
}

function SprintStatusColumn({
  projectSlug,
  status,
  sprints,
}: {
  projectSlug: string;
  status: ProjectSprintStatus;
  sprints: ProjectSprint[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-surface-strong px-4 py-3">
        <div className="min-w-0">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
            className="truncate"
          >
            {getProjectSprintStatusLabel(status)}
          </Typography>
        </div>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-prism-navy/5 px-2 text-xs font-medium text-prism-muted">
          {sprints.length}
        </span>
      </div>

      {sprints.length === 0 ? (
        <Typography
          variant="bodySm"
          tone="muted"
          className="px-4 py-6 text-center italic"
        >
          No sprints.
        </Typography>
      ) : (
        <div className="divide-y divide-border/70">
          {sprints.map(sprint => (
            <SprintRow
              key={sprint.sprintId}
              projectSlug={projectSlug}
              sprint={sprint}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProjectSprintsPanel({ projectId, projectSlug, sprints, isError, onRetry }: ProjectSprintsPanelProps) {
  const sprintsByStatus = getSprintsByStatus(sprints);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarRange className="size-5 text-prism-muted" />
            <Typography
              variant="h3"
              tone="primary"
              className="text-xl tracking-normal md:text-xl"
            >
              Sprints
            </Typography>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Track planned project iterations and their current state.
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-fit items-center rounded-full border border-border bg-surface px-3 text-xs font-medium text-prism-muted">
            {sprints.length} total
          </span>
        </div>
      </div>

      {!isError && <CreateProjectSprintForm projectId={projectId} />}

      {isError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Sprints could not be loaded.</p>
          <Button
            className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
            onClick={onRetry}
            variant="outline"
          >
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </div>
      )}

      {!isError && sprints.length === 0 && (
        <div className="rounded-xl border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
          <Typography
            variant="title"
            tone="primary"
            className="text-base tracking-normal md:text-base"
          >
            No sprints yet
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mx-auto mt-2 max-w-md"
          >
            Sprints created for this project will appear here.
          </Typography>
        </div>
      )}

      {!isError && sprints.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            {PROJECT_SPRINT_STATUSES.map(status => (
              <SprintSummaryCard
                key={status}
                status={status}
                count={sprintsByStatus[status].length}
              />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {PROJECT_SPRINT_STATUSES.map(status => (
              <SprintStatusColumn
                key={status}
                projectSlug={projectSlug}
                status={status}
                sprints={sprintsByStatus[status]}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
