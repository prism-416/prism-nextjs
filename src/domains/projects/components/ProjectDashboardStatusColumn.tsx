"use client";

import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { getProjectWorkItemStatusLabel } from "@/domains/projects/utils/work-item-display";
import {
  getProjectWorkItemStatusDropId,
  type ProjectWorkItemDropTarget,
} from "@/domains/projects/utils/work-item-order";
import { cn } from "@/shared/utils/cn";
import { SortableWorkItemCard } from "./ProjectDashboardWorkItemCard";

export const WORK_ITEM_STATUS_DOT_CLASS_NAMES: Partial<Record<ProjectWorkItemStatus, string>> = {
  todo: "bg-prism-muted",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
};

type AddWorkItemSlotProps = {
  status: ProjectWorkItemStatus;
  emptyLabel?: string;
  isPending?: boolean;
  onCreateWorkItem: (status: ProjectWorkItemStatus) => void;
};

export function AddWorkItemSlot({ status, emptyLabel, isPending = false, onCreateWorkItem }: AddWorkItemSlotProps) {
  const statusLabel = getProjectWorkItemStatusLabel(status);
  const label = isPending ? "Creating..." : "Add work item";

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "group/add relative h-[clamp(5.5rem,12vw,9rem)] w-full flex-col overflow-hidden rounded-xl border-dashed bg-transparent text-prism-muted",
        "opacity-0 transition-[opacity,border-color,background-color,color] duration-150",
        "hover:border-prism-teal-500/60 hover:bg-prism-teal-500/[0.04] hover:text-prism-navy",
        "focus-visible:opacity-100 group-hover/column:opacity-100",
        emptyLabel && "border-transparent opacity-100",
        !emptyLabel && "border-border/90",
      )}
      aria-label={isPending ? `Creating ${statusLabel} work item` : `Create ${statusLabel} work item`}
      disabled={isPending}
      onClick={() => onCreateWorkItem(status)}
    >
      {emptyLabel && (
        <span className="absolute inset-x-0 top-0 px-4 py-3 text-center text-sm font-medium italic text-prism-muted transition-opacity duration-150 group-hover/add:opacity-0 group-focus-visible/add:opacity-0">
          {emptyLabel}
        </span>
      )}
      <span
        className={cn(
          "flex items-center gap-2 transition-opacity duration-150",
          emptyLabel && "opacity-0 group-hover/add:opacity-100 group-focus-visible/add:opacity-100",
        )}
      >
        <Plus className="size-5" />
        <span className="text-sm font-semibold">{label}</span>
      </span>
    </Button>
  );
}

export const DroppableStatusColumn = memo(function DroppableStatusColumn({
  projectSlug,
  status,
  items,
  members,
  inlineEditingItemId,
  inlineCreatingStatus,
  onPriorityUpdate,
  onStatusUpdate,
  onInlineCreateWorkItem,
  onInlineTitleUpdate,
  onInlineDescriptionUpdate,
  onInlineScheduleUpdate,
  onInlineAssigneesUpdate,
  onInlineEditCancel,
  onEditWorkItem,
  onDeleteWorkItem,
}: {
  projectSlug: string;
  status: ProjectWorkItemStatus;
  items: ProjectWorkItem[];
  members?: ProjectParticipant[];
  inlineEditingItemId: string | null;
  inlineCreatingStatus: ProjectWorkItemStatus | null;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onInlineCreateWorkItem: (status: ProjectWorkItemStatus) => void;
  onInlineTitleUpdate: (
    item: ProjectWorkItem,
    title: string,
    options?: { keepEditing?: boolean },
  ) => void | Promise<void>;
  onInlineDescriptionUpdate: (
    item: ProjectWorkItem,
    description: string,
    options?: { keepEditing?: boolean },
  ) => void | Promise<void>;
  onInlineScheduleUpdate: (
    item: ProjectWorkItem,
    patch: { startDate?: string | null; dueDate?: string | null },
  ) => void | Promise<void>;
  onInlineAssigneesUpdate: (item: ProjectWorkItem, usernames: string[]) => void | Promise<void>;
  onInlineEditCancel: () => void;
  onEditWorkItem: (item: ProjectWorkItem) => void;
  onDeleteWorkItem: (item: ProjectWorkItem) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: getProjectWorkItemStatusDropId(status),
    data: { status } satisfies ProjectWorkItemDropTarget,
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "group/column flex min-h-72 min-w-[17rem] flex-col rounded-2xl border bg-surface-strong lg:min-w-0",
        "transition-colors duration-200",
        isOver ? "border-prism-teal-500/50 bg-prism-teal-500/[0.04]" : "border-border/80",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn("size-2 shrink-0 rounded-full", WORK_ITEM_STATUS_DOT_CLASS_NAMES[status])}
            aria-hidden="true"
          />
          <Typography
            variant="bodySm"
            tone="primary"
            weight="semibold"
          >
            {getProjectWorkItemStatusLabel(status)}
          </Typography>
        </div>
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-prism-navy/5 px-2 text-xs font-medium text-prism-muted">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-3">
          <AddWorkItemSlot
            status={status}
            isPending={inlineCreatingStatus === status}
            emptyLabel={isOver ? "Drop here" : "No top-level work items."}
            onCreateWorkItem={onInlineCreateWorkItem}
          />
        </div>
      ) : (
        <SortableContext
          id={getProjectWorkItemStatusDropId(status)}
          items={items.map(item => item.itemId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid gap-3 p-3">
            {items.map(item => (
              <SortableWorkItemCard
                key={item.itemId}
                projectSlug={projectSlug}
                item={item}
                members={members}
                isEditingTitle={inlineEditingItemId === item.itemId}
                onPriorityUpdate={onPriorityUpdate}
                onStatusUpdate={onStatusUpdate}
                onTitleUpdate={onInlineTitleUpdate}
                onDescriptionUpdate={onInlineDescriptionUpdate}
                onTitleEditCancel={onInlineEditCancel}
                onScheduleUpdate={onInlineScheduleUpdate}
                onAssigneesUpdate={onInlineAssigneesUpdate}
                onEditWorkItem={onEditWorkItem}
                onDeleteWorkItem={onDeleteWorkItem}
              />
            ))}
            <AddWorkItemSlot
              status={status}
              isPending={inlineCreatingStatus === status}
              onCreateWorkItem={onInlineCreateWorkItem}
            />
          </div>
        </SortableContext>
      )}
    </section>
  );
});
