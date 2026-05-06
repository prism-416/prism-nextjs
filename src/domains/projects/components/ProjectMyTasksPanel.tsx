import { ListTodo, LoaderCircle, RefreshCw, RotateCcw, Search } from "lucide-react";
import type * as React from "react";

import { Button } from "@/atomics/atoms/Button";
import { Input } from "@/atomics/atoms/Input";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectWorkItemPriorityBadge } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type { ProjectWorkItem, ProjectWorkItemPriority, ProjectWorkItemStatus } from "@/domains/projects/types";
import {
  formatProjectRelativeDateTime,
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

export type ProjectMyTasksStatusFilter = ProjectWorkItemStatus | "all";

export type ProjectMyTasksPriorityFilter = ProjectWorkItemPriority | "all";

type ProjectMyTasksPanelProps = {
  tasks: ProjectWorkItem[];
  total: number;
  assigneeUsername?: string;
  query: string;
  status: ProjectMyTasksStatusFilter;
  priority: ProjectMyTasksPriorityFilter;
  isError: boolean;
  isUpdatingStatus: boolean;
  updatingTaskId: string | null;
  statusUpdateError: string | null;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ProjectMyTasksStatusFilter) => void;
  onPriorityChange: (value: ProjectMyTasksPriorityFilter) => void;
  onStatusUpdate: (task: ProjectWorkItem, value: ProjectWorkItemStatus) => void;
  onResetFilters: () => void;
  onRetry: () => void;
};

const STATUS_FILTERS: ProjectMyTasksStatusFilter[] = ["all", ...PROJECT_WORK_ITEM_STATUSES];
const PRIORITY_FILTERS: ProjectMyTasksPriorityFilter[] = ["all", ...PROJECT_WORK_ITEM_PRIORITIES];

function getStatusFilterLabel(status: ProjectMyTasksStatusFilter) {
  return status === "all" ? "All statuses" : getProjectWorkItemStatusLabel(status);
}

function getPriorityFilterLabel(priority: ProjectMyTasksPriorityFilter) {
  return priority === "all" ? "All priorities" : getProjectWorkItemPriorityLabel(priority);
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "h-8 rounded-md px-2.5 text-xs text-prism-muted hover:bg-prism-navy/5 hover:text-prism-body",
        active && "bg-prism-navy/5 text-prism-body",
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

type TaskRowProps = {
  task: ProjectWorkItem;
  isUpdating: boolean;
  isStatusUpdateDisabled: boolean;
  onStatusUpdate: (task: ProjectWorkItem, value: ProjectWorkItemStatus) => void;
};

function TaskRow({ task, isUpdating, isStatusUpdateDisabled, onStatusUpdate }: TaskRowProps) {
  const visibleLabels = task.labelNames.slice(0, 3);
  const remainingLabelCount = Math.max(task.labelNames.length - visibleLabels.length, 0);

  return (
    <article className="grid gap-3 border-b border-border/70 px-4 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_8rem_8rem_8rem] md:items-center md:gap-4">
      <div className="min-w-0">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="truncate"
        >
          {task.title}
        </Typography>
        <Typography
          variant="caption"
          tone="muted"
          className={cn("mt-1 line-clamp-2", !task.description && "italic opacity-70")}
        >
          {task.description || "No description."}
        </Typography>

        {(task.assigneeUsernames.length > 0 || task.labelNames.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {task.assigneeUsernames.map(username => (
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
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-prism-muted md:hidden">Status</span>
        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={event => {
              onStatusUpdate(task, event.target.value as ProjectWorkItemStatus);
            }}
            className={cn(
              "h-9 w-full rounded-lg border border-border bg-surface-field px-2 text-xs font-medium text-prism-body",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
            )}
            aria-label={`Update ${task.title} status`}
            disabled={isStatusUpdateDisabled}
          >
            {PROJECT_WORK_ITEM_STATUSES.map(item => (
              <option
                key={item}
                value={item}
              >
                {getProjectWorkItemStatusLabel(item)}
              </option>
            ))}
          </select>
          {isUpdating && <LoaderCircle className="size-4 shrink-0 animate-spin text-prism-muted" />}
        </div>
      </div>
      <div>
        <span className="mb-1 block text-xs font-medium text-prism-muted md:hidden">Priority</span>
        <ProjectWorkItemPriorityBadge priority={task.priority} />
      </div>
      <div className="text-sm text-prism-muted">
        <span className="mb-1 block text-xs font-medium md:hidden">Created</span>
        {formatProjectRelativeDateTime(task.createdAt)}
      </div>
    </article>
  );
}

export function ProjectMyTasksPanel({
  tasks,
  total,
  assigneeUsername,
  query,
  status,
  priority,
  isError,
  isUpdatingStatus,
  updatingTaskId,
  statusUpdateError,
  onQueryChange,
  onStatusChange,
  onPriorityChange,
  onStatusUpdate,
  onResetFilters,
  onRetry,
}: ProjectMyTasksPanelProps) {
  const hasFilters = Boolean(query.trim()) || status !== "all" || priority !== "all";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="size-5 text-prism-muted" />
            <Typography
              variant="h3"
              tone="primary"
              className="text-xl tracking-normal md:text-xl"
            >
              My tasks
            </Typography>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Review task work items assigned to your project account.
          </Typography>
        </div>
        <span className="inline-flex h-7 w-fit items-center rounded-full border border-border bg-surface px-3 text-xs font-medium text-prism-muted">
          {tasks.length} of {total}
        </span>
      </div>

      {!assigneeUsername && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          Current user could not be loaded.
        </div>
      )}

      {statusUpdateError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          {statusUpdateError}
        </div>
      )}

      {assigneeUsername && (
        <div className="rounded-xl border border-border/80 bg-surface p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-prism-muted" />
            <Input
              value={query}
              onChange={event => {
                onQueryChange(event.target.value);
              }}
              placeholder="Search tasks"
              className="h-10 rounded-lg border-border bg-prism-surface-field pl-9 text-sm focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="mt-3 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface-strong p-1">
              {STATUS_FILTERS.map(item => (
                <FilterButton
                  key={item}
                  active={status === item}
                  onClick={() => {
                    onStatusChange(item);
                  }}
                >
                  {getStatusFilterLabel(item)}
                </FilterButton>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface-strong p-1">
                {PRIORITY_FILTERS.map(item => (
                  <FilterButton
                    key={item}
                    active={priority === item}
                    onClick={() => {
                      onPriorityChange(item);
                    }}
                  >
                    {getPriorityFilterLabel(item)}
                  </FilterButton>
                ))}
              </div>

              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-lg border-border bg-surface px-3 text-prism-body"
                  onClick={onResetFilters}
                >
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Tasks could not be loaded.</p>
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

      {!isError && assigneeUsername && tasks.length === 0 && (
        <div className="rounded-xl border border-dashed border-border-strong/60 bg-surface px-6 py-10 text-center">
          <Typography
            variant="title"
            tone="primary"
            className="text-base tracking-normal md:text-base"
          >
            {hasFilters ? "No matching tasks" : "No tasks assigned"}
          </Typography>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mx-auto mt-2 max-w-md"
          >
            {hasFilters
              ? "Try adjusting the filters to broaden the task list."
              : `Tasks assigned to @${assigneeUsername} will appear here.`}
          </Typography>
        </div>
      )}

      {!isError && tasks.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
          <div className="hidden h-9 grid-cols-[minmax(0,1fr)_8rem_8rem_8rem] items-center gap-4 border-b border-border/70 bg-surface-strong px-4 text-xs font-medium uppercase text-prism-muted md:grid">
            <span>Task</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Created</span>
          </div>
          {tasks.map(task => (
            <TaskRow
              key={task.itemId}
              task={task}
              isUpdating={updatingTaskId === task.itemId}
              isStatusUpdateDisabled={isUpdatingStatus}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
