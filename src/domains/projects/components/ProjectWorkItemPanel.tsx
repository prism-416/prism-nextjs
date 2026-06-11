import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { UserAvatarStack } from "@/atomics/atoms/Avatar";
import { resolveAssigneeAvatarUsers } from "@/domains/projects/utils/assignee-display";
import { ProjectWorkItemActionsMenu } from "@/domains/projects/components/ProjectWorkItemActionsMenu";
import { ProjectWorkItemAssigneeSelector } from "@/domains/projects/components/ProjectWorkItemAssigneeSelector";
import { ProjectWorkItemCode } from "@/domains/projects/components/ProjectWorkItemCode";
import { DatePicker } from "@/atomics/molecules/DatePicker";
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
  members: ProjectParticipant[];
  initialCurrentUser?: CurrentUser;
  isChildrenError: boolean;
  isCommentsError: boolean;
  updateError: string | null;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onAssigneesUpdate: (item: ProjectWorkItem, usernames: string[]) => void;
  onScheduleUpdate: (item: ProjectWorkItem, patch: { startDate?: string | null; dueDate?: string | null }) => void;
  onRetryChildren: () => void;
  onRetryComments: () => void;
  onCreateChildWorkItem: () => void;
  onEditWorkItem: () => void;
  onDeleteWorkItem: () => void;
};

function ChildWorkItemCard({
  projectSlug,
  item,
  members,
  onStatusUpdate,
  onPriorityUpdate,
}: {
  projectSlug: string;
  item: ProjectWorkItem;
  members: ProjectParticipant[];
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
}) {
  const router = useRouter();
  const assigneeUsers = resolveAssigneeAvatarUsers(item.assigneeUsernames, members);
  const scheduleSummary = formatScheduleRange(item.startDate, item.dueDate);
  const detailHref = `/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(item.itemId)}`;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button, a, select, input, textarea")) return;
    router.push(detailHref);
  };

  return (
    <article
      className="group/card cursor-pointer rounded-xl border border-border/80 bg-surface p-3 shadow-[0_1px_0_rgba(255,255,255,0.65)_inset] transition-[border-color,box-shadow] duration-100"
      onClick={handleClick}
    >
      <div className="min-w-0">
        <ProjectWorkItemCode code={item.code} />
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="mt-1.5 line-clamp-2 group-hover/card:text-prism-navy"
        >
          {item.title}
        </Typography>

        <Typography
          variant="caption"
          tone="muted"
          className={cn("mt-1.5 min-h-5 line-clamp-1", !item.description && "italic opacity-70")}
        >
          {item.description || "No description."}
        </Typography>

        <p
          aria-hidden={!scheduleSummary}
          className={cn(
            "mt-2 flex h-4 items-center gap-1.5 text-xs font-medium text-prism-muted",
            !scheduleSummary && "invisible",
          )}
        >
          <CalendarDays className="size-3.5 shrink-0" />
          <span>{scheduleSummary ?? "No date"}</span>
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <ProjectWorkItemInlineControls
          item={item}
          onStatusUpdate={onStatusUpdate}
          onPriorityUpdate={onPriorityUpdate}
        />
      </div>

      {assigneeUsers.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <UserAvatarStack
            users={assigneeUsers}
            avatarClassName="size-6 text-[10px]"
          />
        </div>
      )}
    </article>
  );
}

export function ProjectWorkItemPanel({
  projectId,
  projectSlug,
  workItem,
  childItems,
  comments,
  members,
  initialCurrentUser,
  isChildrenError,
  isCommentsError,
  updateError,
  onStatusUpdate,
  onPriorityUpdate,
  onAssigneesUpdate,
  onScheduleUpdate,
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
            <ProjectWorkItemCode code={workItem.code} />
            <Typography
              variant="h2"
              tone="primary"
              className="mt-2 text-2xl tracking-normal md:text-3xl"
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
            code={workItem.code}
            title={workItem.title}
            onEdit={onEditWorkItem}
            onDelete={onDeleteWorkItem}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-border/70 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <DatePicker
              variant="pill"
              label="Start"
              value={workItem.startDate ?? ""}
              onChange={value => onScheduleUpdate(workItem, { startDate: value || null })}
            />
            <DatePicker
              variant="pill"
              label="Due"
              value={workItem.dueDate ?? ""}
              min={workItem.startDate ?? undefined}
              onChange={value => onScheduleUpdate(workItem, { dueDate: value || null })}
            />
          </div>
          <ProjectWorkItemInlineControls
            item={workItem}
            onStatusUpdate={onStatusUpdate}
            onPriorityUpdate={onPriorityUpdate}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-prism-muted">Assignees</span>
            <div className="flex flex-wrap items-center gap-2">
              <ProjectWorkItemAssigneeSelector
                members={members}
                selectedUsernames={workItem.assigneeUsernames}
                onChange={usernames => onAssigneesUpdate(workItem, usernames)}
              />
            </div>
          </div>
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
            fontSize="lg"
            lineHeight="7"
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
          <div className="mt-4 text-sm text-prism-danger">
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
          <div className="mt-4 rounded-xl border border-dashed border-border bg-surface-strong px-4 py-6 text-center">
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {childItems.map(item => (
              <ChildWorkItemCard
                key={item.itemId}
                projectSlug={projectSlug}
                item={item}
                members={members}
                onStatusUpdate={onStatusUpdate}
                onPriorityUpdate={onPriorityUpdate}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectWorkItemCommentsPanel
        projectId={projectId}
        workspaceId={workItem.workspaceId}
        itemId={workItem.itemId}
        comments={comments}
        members={members}
        initialCurrentUser={initialCurrentUser}
        isError={isCommentsError}
        onRetry={onRetryComments}
      />
    </section>
  );
}
