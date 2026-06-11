"use client";

import { memo, useCallback, useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, Check, MoreVertical, Pencil, Trash2 } from "lucide-react";

import { UserAvatarStack } from "@/atomics/atoms/Avatar";
import { Button } from "@/atomics/atoms/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atomics/molecules/DropdownMenu";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectDashboardPriorityMenu } from "@/domains/projects/components/ProjectDashboardPriorityMenu";
import { ProjectDashboardStatusMenu } from "@/domains/projects/components/ProjectDashboardStatusMenu";
import { ProjectWorkItemAssigneeSelector } from "@/domains/projects/components/ProjectWorkItemAssigneeSelector";
import { ProjectWorkItemTitleLine } from "@/domains/projects/components/ProjectWorkItemCode";
import { resolveAssigneeAvatarUsers } from "@/domains/projects/utils/assignee-display";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { formatProjectScheduleSummary, formatProjectWorkItemLabel } from "@/domains/projects/utils/work-item-display";
import type { ProjectWorkItemDropTarget } from "@/domains/projects/utils/work-item-order";
import { cn } from "@/shared/utils/cn";
import { InlineWorkItemEditor } from "./ProjectDashboardInlineEditor";

type DashboardWorkItemActionsMenuProps = {
  item: ProjectWorkItem;
  onEditWorkItem: (item: ProjectWorkItem) => void;
  onDeleteWorkItem: (item: ProjectWorkItem) => void;
};

export function DashboardWorkItemActionsMenu({
  item,
  onEditWorkItem,
  onDeleteWorkItem,
}: DashboardWorkItemActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-1.5 h-7 w-7 shrink-0 rounded-md text-prism-muted hover:bg-prism-navy/5 hover:text-prism-body"
          aria-label={`${formatProjectWorkItemLabel(item)} options`}
          onClick={event => event.stopPropagation()}
          onPointerDown={event => event.stopPropagation()}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={event => event.stopPropagation()}
        onPointerDown={event => event.stopPropagation()}
      >
        <DropdownMenuItem
          className="gap-2.5 whitespace-nowrap"
          onSelect={() => onEditWorkItem(item)}
        >
          <Pencil className="size-4 text-prism-muted" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5 whitespace-nowrap text-prism-danger data-[highlighted]:bg-prism-danger-soft/25 data-[highlighted]:text-prism-danger"
          onSelect={() => onDeleteWorkItem(item)}
        >
          <Trash2 className="size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type WorkItemCardContentProps = {
  item: ProjectWorkItem;
  members?: ProjectParticipant[];
  isDragOverlay?: boolean;
  isEditingTitle?: boolean;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onTitleUpdate?: (item: ProjectWorkItem, title: string, options?: { keepEditing?: boolean }) => void | Promise<void>;
  onDescriptionUpdate?: (
    item: ProjectWorkItem,
    description: string,
    options?: { keepEditing?: boolean },
  ) => void | Promise<void>;
  onTitleEditCancel?: () => void;
  onScheduleUpdate?: (
    item: ProjectWorkItem,
    patch: { startDate?: string | null; dueDate?: string | null },
  ) => void | Promise<void>;
  onAssigneesUpdate?: (item: ProjectWorkItem, usernames: string[]) => void | Promise<void>;
  onEditWorkItem?: (item: ProjectWorkItem) => void;
  onDeleteWorkItem?: (item: ProjectWorkItem) => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelected?: (itemId: string) => void;
};

export const WorkItemCardContent = memo(function WorkItemCardContent({
  item,
  members = [],
  isDragOverlay = false,
  isEditingTitle = false,
  onPriorityUpdate,
  onStatusUpdate,
  onTitleUpdate,
  onDescriptionUpdate,
  onTitleEditCancel,
  onScheduleUpdate,
  onAssigneesUpdate,
  onEditWorkItem,
  onDeleteWorkItem,
  selectionMode = false,
  isSelected = false,
  onToggleSelected,
}: WorkItemCardContentProps) {
  const visibleLabels = item.labelNames.slice(0, 3);
  const remainingLabelCount = Math.max(item.labelNames.length - visibleLabels.length, 0);
  const assigneeUsers = resolveAssigneeAvatarUsers(item.assigneeUsernames, members);

  return (
    <>
      <div className="flex items-center">
        {selectionMode && !isDragOverlay && !isEditingTitle && onToggleSelected && (
          <button
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-label={
              isSelected ? `Deselect ${formatProjectWorkItemLabel(item)}` : `Select ${formatProjectWorkItemLabel(item)}`
            }
            className={cn(
              "mr-2 grid size-5 shrink-0 place-items-center rounded-md border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected
                ? "border-prism-teal-500 bg-prism-teal-500 text-white"
                : "border-border bg-surface-strong text-transparent hover:border-border-strong",
            )}
            onPointerDown={event => event.stopPropagation()}
            onClick={event => {
              event.stopPropagation();
              onToggleSelected(item.itemId);
            }}
          >
            <Check className="size-3.5" />
          </button>
        )}
        {isEditingTitle &&
        onTitleUpdate &&
        onDescriptionUpdate &&
        onTitleEditCancel &&
        onScheduleUpdate &&
        onAssigneesUpdate ? (
          <InlineWorkItemEditor
            item={item}
            onTitleUpdate={onTitleUpdate}
            onDescriptionUpdate={onDescriptionUpdate}
            onScheduleUpdate={onScheduleUpdate}
            onEditCancel={onTitleEditCancel}
          />
        ) : (
          <ProjectWorkItemTitleLine
            code={item.code}
            title={item.title}
            titleClassName="line-clamp-2 group-hover/card:text-prism-navy"
          />
        )}
        {!isDragOverlay && !isEditingTitle && onEditWorkItem && onDeleteWorkItem && (
          <DashboardWorkItemActionsMenu
            item={item}
            onEditWorkItem={onEditWorkItem}
            onDeleteWorkItem={onDeleteWorkItem}
          />
        )}
      </div>

      {!isEditingTitle && (
        <Typography
          variant="caption"
          tone="muted"
          className={cn("mt-1.5 line-clamp-3", !item.description && "italic opacity-70")}
        >
          {item.description || "No description."}
        </Typography>
      )}

      {!isEditingTitle && (item.startDate || item.dueDate) && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-prism-muted">
          <CalendarDays className="size-3.5 shrink-0" />
          <span>{formatProjectScheduleSummary(item.startDate, item.dueDate)}</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ProjectDashboardStatusMenu
          item={item}
          disabled={isDragOverlay}
          onStatusUpdate={onStatusUpdate}
        />
        <ProjectDashboardPriorityMenu
          item={item}
          disabled={isDragOverlay}
          onPriorityUpdate={onPriorityUpdate}
        />
      </div>

      {isEditingTitle && onAssigneesUpdate && (
        <div
          className="mt-3 flex items-center gap-2"
          onPointerDown={event => event.stopPropagation()}
        >
          <ProjectWorkItemAssigneeSelector
            members={members}
            selectedUsernames={item.assigneeUsernames}
            maxVisible={3}
            onChange={usernames => void onAssigneesUpdate(item, usernames)}
          />
        </div>
      )}

      {!isEditingTitle && (item.assigneeUsernames.length > 0 || item.labelNames.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {/* stop propagation so dnd-kit doesn't capture pointer and eat the tooltip */}
          <span onPointerDown={e => e.stopPropagation()}>
            <UserAvatarStack
              users={assigneeUsers}
              avatarClassName="size-6 text-[10px]"
            />
          </span>
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
    </>
  );
});

export const SortableWorkItemCard = memo(function SortableWorkItemCard({
  projectSlug,
  item,
  members,
  isEditingTitle,
  onPriorityUpdate,
  onStatusUpdate,
  onTitleUpdate,
  onDescriptionUpdate,
  onTitleEditCancel,
  onScheduleUpdate,
  onAssigneesUpdate,
  onEditWorkItem,
  onDeleteWorkItem,
  selectionMode = false,
  isSelected = false,
  onToggleSelected,
}: Omit<WorkItemCardContentProps, "isDragOverlay"> & {
  projectSlug: string;
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelected?: (itemId: string) => void;
}) {
  const router = useRouter();
  const didDragRef = useRef(false);
  const detailHref = `/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(item.itemId)}`;
  const { attributes, listeners, setNodeRef, isDragging, isOver, transform, transition } = useSortable({
    id: item.itemId,
    disabled: isEditingTitle || selectionMode,
    data: { item, itemId: item.itemId, status: item.status } satisfies ProjectWorkItemDropTarget & {
      item: ProjectWorkItem;
    },
  });

  useEffect(() => {
    if (isDragging) {
      didDragRef.current = true;
    }
  }, [isDragging]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isEditingTitle) {
        event.preventDefault();
        return;
      }

      if (selectionMode) {
        event.preventDefault();
        onToggleSelected?.(item.itemId);
        return;
      }

      if (didDragRef.current) {
        event.preventDefault();
        didDragRef.current = false;
        return;
      }

      if ((event.target as HTMLElement).closest("select, button, input, textarea, a")) {
        return;
      }

      router.push(detailHref);
    },
    [detailHref, isEditingTitle, item.itemId, onToggleSelected, router, selectionMode],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (isEditingTitle) {
        return;
      }

      if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) {
        return;
      }

      event.preventDefault();
      if (selectionMode) {
        onToggleSelected?.(item.itemId);
        return;
      }
      router.push(detailHref);
    },
    [detailHref, isEditingTitle, item.itemId, onToggleSelected, router, selectionMode],
  );

  return (
    <article
      ref={setNodeRef}
      data-dashboard-work-item-card={item.itemId}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group/card rounded-xl border border-border/80 bg-surface p-3",
        "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]",
        isEditingTitle || selectionMode
          ? "cursor-pointer touch-auto"
          : "cursor-pointer touch-none select-none active:cursor-grabbing",
        isEditingTitle && "cursor-default",
        "transition-[opacity,border-color,box-shadow] duration-100",
        isOver && !isDragging && "border-prism-teal-500/40 shadow-[0_0_0_1px_rgba(19,177,165,0.18)]",
        isSelected && "border-prism-teal-500/60 shadow-[0_0_0_1px_rgba(19,177,165,0.3)]",
        isDragging ? "opacity-35" : "opacity-100",
      )}
      {...attributes}
      {...listeners}
      onPointerDownCapture={() => {
        didDragRef.current = false;
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <WorkItemCardContent
        item={item}
        members={members}
        isEditingTitle={isEditingTitle}
        onPriorityUpdate={onPriorityUpdate}
        onStatusUpdate={onStatusUpdate}
        onTitleUpdate={onTitleUpdate}
        onDescriptionUpdate={onDescriptionUpdate}
        onTitleEditCancel={onTitleEditCancel}
        onScheduleUpdate={onScheduleUpdate}
        onAssigneesUpdate={onAssigneesUpdate}
        onEditWorkItem={onEditWorkItem}
        onDeleteWorkItem={onDeleteWorkItem}
        selectionMode={selectionMode}
        isSelected={isSelected}
        onToggleSelected={onToggleSelected}
      />
    </article>
  );
});
