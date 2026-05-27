import Link from "next/link";
import { ArrowLeft, GitBranch, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectWorkItemActionsMenu } from "@/domains/projects/components/ProjectWorkItemActionsMenu";
import { ProjectWorkItemCommentsPanel } from "@/domains/projects/components/ProjectWorkItemCommentsPanel";
import { ProjectWorkItemInlineControls } from "@/domains/projects/components/ProjectWorkItemInlineControls";
import { ProjectWorkItemPriorityBadge } from "@/domains/projects/components/ProjectWorkItemPriorityBadge";
import { ProjectWorkItemStatusBadge } from "@/domains/projects/components/ProjectWorkItemStatusBadge";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemCommentSearchResult,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import type { CurrentUser } from "@/shared/types/auth";
import {
  formatProjectScheduleDate,
  getProjectWorkItemPriorityLabel,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_PRIORITIES,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

type ProjectWorkItemPanelProps = {
  projectId: string;
  projectSlug: string;
  workItem: ProjectWorkItem;
  childItems: ProjectWorkItem[];
  comments: ProjectWorkItemCommentSearchResult;
  initialMembers?: ProjectParticipant[];
  initialCurrentUser?: CurrentUser;
  isChildrenError: boolean;
  isCommentsError: boolean;
  updatingItemId: string | null;
  isUpdatingItem: boolean;
  updateError: string | null;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onRetryChildren: () => void;
  onRetryComments: () => void;
  onCreateChildWorkItem: () => void;
  onEditWorkItem: () => void;
  onDeleteWorkItem: () => void;
};

function WorkItemControls({
  item,
  disabled,
  onStatusUpdate,
  onPriorityUpdate,
}: {
  item: ProjectWorkItem;
  disabled: boolean;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <select
        value={item.status}
        onChange={event => onStatusUpdate(item, event.target.value as ProjectWorkItemStatus)}
        disabled={disabled}
        className={cn(
          "h-10 rounded-lg border border-border bg-surface-field px-3 text-sm text-prism-body",
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
          "h-10 rounded-lg border border-border bg-surface-field px-3 text-sm text-prism-body",
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
  );
}

function ChildWorkItemCard({
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

      {item.dueDate && (
        <p className="mt-2 text-xs text-prism-muted">
          Due <span className="font-medium text-prism-body">{formatProjectScheduleDate(item.dueDate)}</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <ProjectWorkItemStatusBadge status={item.status} />
        <ProjectWorkItemPriorityBadge priority={item.priority} />
      </div>

      <div className="mt-3">
        <WorkItemControls
          item={item}
          disabled={disabled}
          onStatusUpdate={onStatusUpdate}
          onPriorityUpdate={onPriorityUpdate}
        />
      </div>

      {isUpdating && <p className="mt-3 text-xs text-prism-muted">Updating...</p>}
    </article>
  );
}

export function ProjectWorkItemPanel({
  projectId,
  projectSlug,
  workItem,
  childItems,
  comments,
  initialMembers,
  initialCurrentUser,
  isChildrenError,
  isCommentsError,
  updatingItemId,
  isUpdatingItem,
  updateError,
  onStatusUpdate,
  onPriorityUpdate,
  onRetryChildren,
  onRetryComments,
  onCreateChildWorkItem,
  onEditWorkItem,
  onDeleteWorkItem,
}: ProjectWorkItemPanelProps) {
  const dashboardHref = `/projects/${encodeURIComponent(projectSlug)}`;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
        <Button
          asChild
          variant="ghost"
          className="h-8 w-fit rounded-lg px-2 text-prism-muted hover:bg-prism-navy/5 hover:text-prism-body"
        >
          <Link href={dashboardHref}>
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
        </Button>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Typography
              variant="h2"
              tone="primary"
              className="text-2xl tracking-normal md:text-3xl"
            >
              {workItem.title}
            </Typography>
            <Typography
              variant="bodySm"
              tone="muted"
              className={cn("mt-2 max-w-3xl", !workItem.description && "italic opacity-70")}
            >
              {workItem.description || "No description."}
            </Typography>
          </div>

          <div className="flex shrink-0 items-center">
            <ProjectWorkItemActionsMenu
              title={workItem.title}
              onEdit={onEditWorkItem}
              onDelete={onDeleteWorkItem}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-4 text-sm text-prism-muted">
          <p>
            Start date{" "}
            <span className="ml-1 font-medium text-prism-body">{formatProjectScheduleDate(workItem.startDate)}</span>
          </p>
          <span
            className="hidden h-4 w-px bg-border sm:block"
            aria-hidden="true"
          />
          <p>
            Due date{" "}
            <span className="ml-1 font-medium text-prism-body">{formatProjectScheduleDate(workItem.dueDate)}</span>
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <GitBranch className="size-5 text-prism-muted" />
          <ProjectWorkItemInlineControls
            item={workItem}
            disabled={isUpdatingItem}
            isUpdating={updatingItemId === workItem.itemId}
            onStatusUpdate={onStatusUpdate}
            onPriorityUpdate={onPriorityUpdate}
          />
        </div>
      </div>

      {updateError && (
        <div className="rounded-xl border border-prism-danger-soft bg-surface px-5 py-4 text-sm text-prism-danger">
          {updateError}
        </div>
      )}

      <div className="rounded-2xl border border-border/80 bg-surface p-4 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
        <div className="flex flex-col gap-3 border-b border-border/70 bg-surface-strong px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
          >
            Child work items
          </Typography>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-prism-muted">{childItems.length} total</span>
            <Button
              type="button"
              className="h-9 rounded-lg px-3"
              onClick={onCreateChildWorkItem}
            >
              <Plus className="size-4" />
              New child item
            </Button>
          </div>
        </div>

        {isChildrenError && (
          <div className="px-5 py-4 text-sm text-prism-danger">
            <p>Child work items could not be loaded.</p>
            <Button
              className="mt-3 h-9 rounded-lg border-prism-danger-soft bg-surface px-4 text-prism-danger hover:bg-prism-danger-soft/40"
              onClick={onRetryChildren}
              variant="outline"
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        )}

        {!isChildrenError && childItems.length === 0 && (
          <div className="px-6 py-10 text-center">
            <Typography
              variant="title"
              tone="primary"
              className="text-base tracking-normal md:text-base"
            >
              No child work items
            </Typography>
            <Typography
              variant="bodySm"
              tone="muted"
              className="mx-auto mt-2 max-w-md"
            >
              Child items created under this work item will appear here.
            </Typography>
          </div>
        )}

        {!isChildrenError && childItems.length > 0 && (
          <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {childItems.map(item => (
              <ChildWorkItemCard
                key={item.itemId}
                projectSlug={projectSlug}
                item={item}
                disabled={isUpdatingItem}
                isUpdating={updatingItemId === item.itemId}
                onStatusUpdate={onStatusUpdate}
                onPriorityUpdate={onPriorityUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectWorkItemCommentsPanel
        projectId={projectId}
        itemId={workItem.itemId}
        comments={comments}
        initialMembers={initialMembers}
        initialCurrentUser={initialCurrentUser}
        isError={isCommentsError}
        onRetry={onRetryComments}
      />
    </section>
  );
}
