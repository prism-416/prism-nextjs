import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectWorkItemActionsMenu } from "@/domains/projects/components/ProjectWorkItemActionsMenu";
import { ProjectWorkItemCommentsPanel } from "@/domains/projects/components/ProjectWorkItemCommentsPanel";
import { ProjectWorkItemInlineControls } from "@/domains/projects/components/ProjectWorkItemInlineControls";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemCommentSearchResult,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import type { CurrentUser } from "@/shared/types/auth";
import { formatProjectDate } from "@/domains/projects/utils/work-item-display";
import { cn } from "@/shared/utils/cn";

function formatScheduleRange(startDate: string | null, dueDate: string | null) {
  if (startDate && dueDate) {
    return `${formatProjectDate(startDate)} ~ ${formatProjectDate(dueDate)}`;
  }
  if (startDate) {
    return `Starts ${formatProjectDate(startDate)}`;
  }
  if (dueDate) {
    return `Due ${formatProjectDate(dueDate)}`;
  }
  return null;
}

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
  updateError: string | null;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onRetryChildren: () => void;
  onRetryComments: () => void;
  onCreateChildWorkItem: () => void;
  onEditWorkItem: () => void;
  onDeleteWorkItem: () => void;
};

function ChildWorkItemCard({
  projectSlug,
  item,
  onStatusUpdate,
  onPriorityUpdate,
}: {
  projectSlug: string;
  item: ProjectWorkItem;
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

      <p
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-prism-muted"
        aria-hidden={!formatScheduleRange(item.startDate, item.dueDate) || undefined}
      >
        <CalendarDays
          className={cn("size-3.5 shrink-0", !formatScheduleRange(item.startDate, item.dueDate) && "invisible")}
        />
        <span className="text-prism-body">{formatScheduleRange(item.startDate, item.dueDate) ?? " "}</span>
      </p>

      <div className="mt-3">
        <ProjectWorkItemInlineControls
          item={item}
          onStatusUpdate={onStatusUpdate}
          onPriorityUpdate={onPriorityUpdate}
        />
      </div>
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
  updateError,
  onStatusUpdate,
  onPriorityUpdate,
  onRetryChildren,
  onRetryComments,
  onCreateChildWorkItem,
  onEditWorkItem,
  onDeleteWorkItem,
}: ProjectWorkItemPanelProps) {
  const backHref = workItem.parentId
    ? `/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(workItem.parentId)}`
    : `/projects/${encodeURIComponent(projectSlug)}`;
  const backLabel = workItem.parentId ? "Back to parent" : "Back to dashboard";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
        <Button
          asChild
          variant="ghost"
          className="h-8 w-fit rounded-lg px-2 text-prism-muted hover:bg-prism-navy/5 hover:text-prism-body"
        >
          <Link href={backHref}>
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        </Button>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
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

          <ProjectWorkItemActionsMenu
            title={workItem.title}
            onEdit={onEditWorkItem}
            onDelete={onDeleteWorkItem}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-4">
          {formatScheduleRange(workItem.startDate, workItem.dueDate) && (
            <p className="flex items-center gap-1.5 text-xs font-medium text-prism-muted">
              <CalendarDays className="size-3.5 shrink-0" />
              <span className="text-prism-body">{formatScheduleRange(workItem.startDate, workItem.dueDate)}</span>
            </p>
          )}
          <ProjectWorkItemInlineControls
            item={workItem}
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

      <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_8px_24px_rgba(12,71,103,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
            className="text-base"
          >
            Child work items ({childItems.length})
          </Typography>
          <Button
            type="button"
            className="h-9 rounded-lg px-3"
            onClick={onCreateChildWorkItem}
          >
            <Plus className="size-4" />
            New child item
          </Button>
        </div>

        {isChildrenError && (
          <div className="mt-5 text-sm text-prism-danger">
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
          <div className="mt-5 rounded-xl border border-dashed border-border bg-surface-strong px-4 py-6 text-center">
            <Typography
              variant="bodySm"
              tone="primary"
              weight="semibold"
            >
              No child work items
            </Typography>
            <Typography
              variant="caption"
              tone="muted"
              className="mt-1"
            >
              Child items created under this work item will appear here.
            </Typography>
          </div>
        )}

        {!isChildrenError && childItems.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {childItems.map(item => (
              <ChildWorkItemCard
                key={item.itemId}
                projectSlug={projectSlug}
                item={item}
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
