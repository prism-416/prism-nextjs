import Link from "next/link";
import { FolderKanban, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { CreateProjectWorkItemForm } from "@/domains/projects/components/CreateProjectWorkItemForm";
import { ProjectWorkItemPriorityBadge } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import type {
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import {
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemsPanelProps = {
  projectId: string;
  projectSlug: string;
  workItems: ProjectWorkItemSearchResult;
  isError: boolean;
  updatingItemId: string | null;
  isUpdatingItem: boolean;
  updateError: string | null;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onRetry: () => void;
};

function getTopLevelWorkItems(items: ProjectWorkItem[]) {
  return items.filter(item => item.parentId === null);
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

function WorkItemCard({
  projectSlug,
  item,
  disabled,
  isUpdating,
  onStatusUpdate,
  onPriorityUpdate,
}: {
  projectSlug: string;
  item: ProjectWorkItem;
  disabled: boolean;
  isUpdating: boolean;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
}) {
  const detailHref = `/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(item.itemId)}`;
  const visibleLabels = item.labelNames.slice(0, 3);
  const remainingLabelCount = Math.max(item.labelNames.length - visibleLabels.length, 0);

  return (
    <article className="rounded-xl border border-border/80 bg-surface p-3 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]">
      <Link
        href={detailHref}
        className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="line-clamp-2 hover:text-prism-navy"
        >
          {item.title}
        </Typography>
      </Link>
      <Typography
        variant="caption"
        tone="muted"
        className={cn("mt-1 line-clamp-3", !item.description && "italic opacity-70")}
      >
        {item.description || "No description."}
      </Typography>

      <div className="mt-3 grid gap-2">
        <select
          value={item.status}
          onChange={event => onStatusUpdate(item, event.target.value as ProjectWorkItemStatus)}
          disabled={disabled}
          className={cn(
            "h-9 rounded-lg border border-border bg-surface-field px-2 text-xs font-medium text-prism-body",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
          )}
          aria-label={`Update ${item.title} status`}
        >
          {PROJECT_WORK_ITEM_STATUSES.map(status => (
            <option
              key={status}
              value={status}
            >
              {getProjectWorkItemStatusLabel(status)}
            </option>
          ))}
        </select>
        <select
          value={item.priority}
          onChange={event => onPriorityUpdate(item, event.target.value as ProjectWorkItemPriority)}
          disabled={disabled}
          className={cn(
            "h-9 rounded-lg border border-border bg-surface-field px-2 text-xs font-medium text-prism-body",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
          )}
          aria-label={`Update ${item.title} priority`}
        >
          {PROJECT_WORK_ITEM_PRIORITIES.map(priority => (
            <option
              key={priority}
              value={priority}
            >
              {getProjectWorkItemPriorityLabel(priority)}
            </option>
          ))}
        </select>
      </div>

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

      {isUpdating && <p className="mt-3 text-xs text-prism-muted">Updating...</p>}
    </article>
  );
}

function WorkItemStatusColumn({
  projectSlug,
  status,
  items,
  disabled,
  updatingItemId,
  onStatusUpdate,
  onPriorityUpdate,
}: {
  projectSlug: string;
  status: ProjectWorkItemStatus;
  items: ProjectWorkItem[];
  disabled: boolean;
  updatingItemId: string | null;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
}) {
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
          No top-level work items.
        </Typography>
      ) : (
        <div className="grid gap-3 p-3">
          {items.map(item => (
            <WorkItemCard
              key={item.itemId}
              projectSlug={projectSlug}
              item={item}
              disabled={disabled}
              isUpdating={updatingItemId === item.itemId}
              onStatusUpdate={onStatusUpdate}
              onPriorityUpdate={onPriorityUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProjectWorkItemsPanel({
  projectId,
  projectSlug,
  workItems,
  isError,
  updatingItemId,
  isUpdatingItem,
  updateError,
  onStatusUpdate,
  onPriorityUpdate,
  onRetry,
}: ProjectWorkItemsPanelProps) {
  const topLevelItems = getTopLevelWorkItems(workItems.items);
  const itemsByStatus = getWorkItemsByStatus(topLevelItems);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="size-5 text-prism-muted" />
            <Typography
              variant="h3"
              tone="primary"
              className="text-xl tracking-normal md:text-xl"
            >
              Work items
            </Typography>
          </div>
          <Typography
            variant="bodySm"
            tone="muted"
            className="mt-1"
          >
            Review top-level work items by status. Open an item to see its child work items.
          </Typography>
        </div>
        <span className="inline-flex h-7 w-fit items-center rounded-full border border-border bg-surface px-3 text-xs font-medium text-prism-muted">
          {topLevelItems.length} of {workItems.total}
        </span>
      </div>

      <CreateProjectWorkItemForm
        projectId={projectId}
        defaultType="epic"
      />

      {updateError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          {updateError}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          <p>Work items could not be loaded.</p>
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

      {!isError && (
        <div className="overflow-x-auto pb-1">
          <div className="grid min-w-[72rem] gap-4 lg:min-w-0 lg:grid-cols-4">
            {PROJECT_WORK_ITEM_STATUSES.map(status => (
              <WorkItemStatusColumn
                key={status}
                projectSlug={projectSlug}
                status={status}
                items={itemsByStatus[status]}
                disabled={isUpdatingItem}
                updatingItemId={updatingItemId}
                onStatusUpdate={onStatusUpdate}
                onPriorityUpdate={onPriorityUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
