import Link from "next/link";
import { ArrowLeft, CalendarRange, ListTodo, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectSprintStatusBadge } from "@/domains/projects/components/ProjectSprintStatusBadge";
import { ProjectWorkItemPriorityBadge } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type {
  ProjectSprint,
  ProjectWorkItem,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import {
  formatProjectRelativeDateTime,
  formatProjectSprintRange,
  getProjectSprintDurationText,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectSprintPanelProps = {
  projectSlug: string;
  sprint: ProjectSprint;
  workItems: ProjectWorkItemSearchResult;
  isWorkItemsError: boolean;
  onRetryWorkItems: () => void;
};

function SprintMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface-strong px-4 py-3">
      <Typography
        variant="caption"
        tone="muted"
      >
        {label}
      </Typography>
      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className="mt-1"
      >
        {value}
      </Typography>
    </div>
  );
}

function getWorkItemsByStatus(items: ProjectWorkItem[]) {
  return PROJECT_WORK_ITEM_STATUSES.reduce<Record<ProjectWorkItemStatus, ProjectWorkItem[]>>(
    (result, status) => ({
      ...result,
      [status]: items.filter(item => item.status === status),
    }),
    {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    },
  );
}

function WorkItemCard({ item }: { item: ProjectWorkItem }) {
  const visibleLabels = item.labelNames.slice(0, 3);
  const remainingLabelCount = Math.max(item.labelNames.length - visibleLabels.length, 0);

  return (
    <article className="rounded-xl border border-border/80 bg-surface p-3 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]">
      <Typography
        variant="bodySm"
        tone="primary"
        weight="semibold"
        className="line-clamp-2"
      >
        {item.title}
      </Typography>
      <Typography
        variant="caption"
        tone="muted"
        className={cn("mt-1 line-clamp-3", !item.description && "italic opacity-70")}
      >
        {item.description || "No description."}
      </Typography>

      <div className="mt-3">
        <ProjectWorkItemPriorityBadge priority={item.priority} />
      </div>

      {(item.assigneeUsernames.length > 0 || item.labelNames.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {item.assigneeUsernames.map(username => (
            <span
              key={username}
              className="inline-flex h-6 items-center rounded-full border border-border bg-surface-strong px-2 text-xs text-prism-muted"
            >
              @{username}
            </span>
          ))}
          {visibleLabels.map(label => (
            <span
              key={label}
              className="inline-flex h-6 items-center rounded-full border border-prism-teal-500/20 bg-prism-teal-500/10 px-2 text-xs text-prism-navy"
            >
              {label}
            </span>
          ))}
          {remainingLabelCount > 0 && (
            <span className="inline-flex h-6 items-center rounded-full border border-border bg-surface-strong px-2 text-xs text-prism-muted">
              +{remainingLabelCount}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

function WorkItemStatusColumn({ status, items }: { status: ProjectWorkItemStatus; items: ProjectWorkItem[] }) {
  return (
    <section className="flex min-h-72 min-w-[17rem] flex-col rounded-2xl border border-border/80 bg-surface-strong lg:min-w-0">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
        >
          {getProjectWorkItemStatusLabel(status)}
        </Typography>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-prism-navy/5 px-2 text-xs font-medium text-prism-muted">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <Typography
          variant="bodySm"
          tone="muted"
          className="px-4 py-6 text-center italic"
        >
          No work items.
        </Typography>
      ) : (
        <div className="grid gap-3 p-3">
          {items.map(item => (
            <WorkItemCard
              key={item.itemId}
              item={item}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProjectSprintPanel({
  projectSlug,
  sprint,
  workItems,
  isWorkItemsError,
  onRetryWorkItems,
}: ProjectSprintPanelProps) {
  const sprintsHref = `/projects/${encodeURIComponent(projectSlug)}/sprints`;
  const items = workItems.items;
  const workItemsByStatus = getWorkItemsByStatus(items);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
        <Button
          asChild
          variant="ghost"
          className="h-8 w-fit rounded-lg px-2 text-prism-muted hover:bg-prism-navy/5 hover:text-prism-body"
        >
          <Link href={sprintsHref}>
            <ArrowLeft className="size-4" />
            Back to sprints
          </Link>
        </Button>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CalendarRange className="size-5 text-prism-muted" />
              <ProjectSprintStatusBadge status={sprint.status} />
            </div>
            <Typography
              variant="h2"
              tone="primary"
              className="mt-3 text-2xl tracking-normal md:text-3xl"
            >
              {sprint.name}
            </Typography>
            <Typography
              variant="bodySm"
              tone="muted"
              className={cn("mt-2 max-w-3xl", !sprint.description && "italic opacity-70")}
            >
              {sprint.description || "No description."}
            </Typography>
          </div>

          <span className="inline-flex h-7 w-fit items-center rounded-full border border-border bg-surface-strong px-3 text-xs font-medium text-prism-muted">
            {items.length} of {workItems.total} work items
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <SprintMetric
            label="Range"
            value={formatProjectSprintRange(sprint)}
          />
          <SprintMetric
            label="Duration"
            value={getProjectSprintDurationText(sprint)}
          />
          <SprintMetric
            label="Created"
            value={formatProjectRelativeDateTime(sprint.createdAt)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
        <div className="flex flex-col gap-3 border-b border-border/70 bg-surface-strong px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="size-4 text-prism-muted" />
            <Typography
              variant="bodySm"
              tone="primary"
              weight="semibold"
            >
              Work items
            </Typography>
          </div>
          <span className="text-xs font-medium text-prism-muted">{workItems.total} total</span>
        </div>

        {isWorkItemsError && (
          <div className="px-5 py-4 text-sm text-prism-danger">
            <p>Sprint work items could not be loaded.</p>
            <Button
              className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
              onClick={onRetryWorkItems}
              variant="outline"
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        )}

        {!isWorkItemsError && (
          <div className="mt-4 overflow-x-auto pb-1">
            <div className="grid min-w-[72rem] gap-4 lg:min-w-0 lg:grid-cols-4">
              {PROJECT_WORK_ITEM_STATUSES.map(status => (
                <WorkItemStatusColumn
                  key={status}
                  status={status}
                  items={workItemsByStatus[status]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
