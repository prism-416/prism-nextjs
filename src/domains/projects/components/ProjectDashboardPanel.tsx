"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, LayoutDashboard, Plus, RefreshCw } from "lucide-react";

import { UserAvatarStack } from "@/atomics/atoms/Avatar";
import { Button } from "@/atomics/atoms/Button";
import { resolveAssigneeAvatarUsers } from "@/domains/projects/utils/assignee-display";
import type { ProjectParticipant } from "@/domains/projects/types";
import { Typography } from "@/atomics/atoms/Typography";
import { ProjectDashboardPriorityMenu } from "@/domains/projects/components/ProjectDashboardPriorityMenu";
import { ProjectDashboardStatusMenu } from "@/domains/projects/components/ProjectDashboardStatusMenu";
import type {
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import {
  formatProjectScheduleSummary,
  getProjectWorkItemStatusLabel,
  PROJECT_WORK_ITEM_STATUSES,
} from "@/domains/projects/utils/work-item-display";
import {
  getProjectWorkItemsByStatus,
  getProjectWorkItemStatusDropId,
  getTopLevelProjectWorkItems,
  hasProjectWorkItemOrderChanged,
  reorderTopLevelProjectWorkItems,
  type ProjectWorkItemDropTarget,
} from "@/domains/projects/utils/work-item-order";
import { cn } from "@/shared/utils/cn";

type ProjectDashboardPanelProps = {
  projectSlug: string;
  workItems: ProjectWorkItemSearchResult;
  members?: ProjectParticipant[];
  isError: boolean;
  updateError: string | null;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
  onItemsReorder: (items: ProjectWorkItem[]) => void;
  onRetry: () => void;
  onCreateWorkItem: () => void;
};

const WORK_ITEM_STATUS_DOT_CLASS_NAMES: Partial<Record<ProjectWorkItemStatus, string>> = {
  todo: "bg-prism-muted",
  in_progress: "bg-prism-info",
  in_review: "bg-prism-review",
  done: "bg-prism-success",
};

type WorkItemCardContentProps = {
  item: ProjectWorkItem;
  members?: ProjectParticipant[];
  isDragOverlay?: boolean;
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
};

const WorkItemCardContent = memo(function WorkItemCardContent({
  item,
  members = [],
  isDragOverlay = false,
  onPriorityUpdate,
  onStatusUpdate,
}: WorkItemCardContentProps) {
  const visibleLabels = item.labelNames.slice(0, 3);
  const remainingLabelCount = Math.max(item.labelNames.length - visibleLabels.length, 0);
  const assigneeUsers = resolveAssigneeAvatarUsers(item.assigneeUsernames, members);

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Typography
          variant="bodySm"
          tone="primary"
          weight="semibold"
          className="min-w-0 flex-1 line-clamp-2 group-hover/card:text-prism-navy"
        >
          {item.title}
        </Typography>
      </div>

      <Typography
        variant="caption"
        tone="muted"
        className={cn("mt-1.5 line-clamp-3", !item.description && "italic opacity-70")}
      >
        {item.description || "No description."}
      </Typography>

      {(item.startDate || item.dueDate) && (
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

      {(item.assigneeUsernames.length > 0 || item.labelNames.length > 0) && (
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

const SortableWorkItemCard = memo(function SortableWorkItemCard({
  projectSlug,
  item,
  members,
  onPriorityUpdate,
  onStatusUpdate,
}: Omit<WorkItemCardContentProps, "isDragOverlay"> & { projectSlug: string }) {
  const router = useRouter();
  const didDragRef = useRef(false);
  const detailHref = `/projects/${encodeURIComponent(projectSlug)}/work-items/${encodeURIComponent(item.itemId)}`;
  const { attributes, listeners, setNodeRef, isDragging, isOver, transform, transition } = useSortable({
    id: item.itemId,
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
    [detailHref, router],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) {
        return;
      }

      event.preventDefault();
      router.push(detailHref);
    },
    [detailHref, router],
  );

  return (
    <article
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "group/card rounded-xl border border-border/80 bg-surface p-3",
        "shadow-[0_1px_0_rgba(255,255,255,0.65)_inset]",
        "cursor-pointer touch-none select-none active:cursor-grabbing",
        "transition-[opacity,border-color,box-shadow] duration-100",
        isOver && !isDragging && "border-prism-teal-500/40 shadow-[0_0_0_1px_rgba(19,177,165,0.18)]",
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
        onPriorityUpdate={onPriorityUpdate}
        onStatusUpdate={onStatusUpdate}
      />
    </article>
  );
});

const DroppableStatusColumn = memo(function DroppableStatusColumn({
  projectSlug,
  status,
  items,
  members,
  onPriorityUpdate,
  onStatusUpdate,
}: {
  projectSlug: string;
  status: ProjectWorkItemStatus;
  items: ProjectWorkItem[];
  members?: ProjectParticipant[];
  onPriorityUpdate: (item: ProjectWorkItem, priority: ProjectWorkItemPriority) => void;
  onStatusUpdate: (item: ProjectWorkItem, status: ProjectWorkItemStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: getProjectWorkItemStatusDropId(status),
    data: { status } satisfies ProjectWorkItemDropTarget,
  });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex min-h-72 min-w-[17rem] flex-col rounded-2xl border bg-surface-strong lg:min-w-0",
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
        <Typography
          variant="bodySm"
          tone="muted"
          className={cn(
            "flex-1 px-4 py-6 text-center italic transition-colors duration-200",
            isOver && "text-prism-teal-500/70",
          )}
        >
          {isOver ? "Drop here" : "No top-level work items."}
        </Typography>
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
                onPriorityUpdate={onPriorityUpdate}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </section>
  );
});

export const ProjectDashboardPanel = memo(function ProjectDashboardPanel({
  projectSlug,
  workItems,
  members,
  isError,
  updateError,
  onPriorityUpdate,
  onStatusUpdate,
  onItemsReorder,
  onRetry,
  onCreateWorkItem,
}: ProjectDashboardPanelProps) {
  const [activeItem, setActiveItem] = useState<ProjectWorkItem | null>(null);
  const [previewItems, setPreviewItems] = useState<ProjectWorkItem[] | null>(null);
  const previewItemsRef = useRef<ProjectWorkItem[] | null>(null);
  const lastDragOverTargetRef = useRef<string | null>(null);

  const topLevelItems = useMemo(() => getTopLevelProjectWorkItems(workItems.items), [workItems.items]);
  const displayItems = previewItems ?? topLevelItems;
  const itemsByStatus = useMemo(() => getProjectWorkItemsByStatus(displayItems), [displayItems]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const resetDragState = useCallback(() => {
    setActiveItem(null);
    setPreviewItems(null);
    previewItemsRef.current = null;
    lastDragOverTargetRef.current = null;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const item = event.active.data.current?.item as ProjectWorkItem | undefined;
    setActiveItem(item ?? null);
    previewItemsRef.current = null;
    lastDragOverTargetRef.current = null;
    setPreviewItems(null);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const activeItemId = String(event.active.id);
      const target = event.over?.data.current as ProjectWorkItemDropTarget | undefined;
      if (!target) {
        lastDragOverTargetRef.current = null;
        return;
      }
      if (target.itemId === activeItemId) {
        return;
      }

      const targetId = target.itemId ?? getProjectWorkItemStatusDropId(target.status);
      if (lastDragOverTargetRef.current === targetId) {
        return;
      }
      lastDragOverTargetRef.current = targetId;

      const baseItems = previewItemsRef.current ?? topLevelItems;
      const nextItems = reorderTopLevelProjectWorkItems(baseItems, activeItemId, target);
      if (!hasProjectWorkItemOrderChanged(baseItems, nextItems)) {
        return;
      }

      previewItemsRef.current = nextItems;
      setPreviewItems(nextItems);
    },
    [topLevelItems],
  );

  const handleDragEnd = useCallback(() => {
    const finalItems = previewItemsRef.current;
    resetDragState();

    if (finalItems && hasProjectWorkItemOrderChanged(topLevelItems, finalItems)) {
      onItemsReorder(finalItems);
    }
  }, [onItemsReorder, resetDragState, topLevelItems]);

  const handleDragCancel = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="size-5 text-prism-muted" />
            <Typography
              variant="h3"
              tone="primary"
              className="text-xl tracking-normal md:text-xl"
            >
              Dashboard
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
        <div className="flex flex-wrap items-center gap-2">
          {!isError && (
            <Button
              type="button"
              className="h-10 rounded-lg px-4"
              onClick={onCreateWorkItem}
            >
              <Plus className="size-4" />
              New work item
            </Button>
          )}
        </div>
      </div>

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
          <DndContext
            id={`project-dashboard-${projectSlug}-dnd`}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="grid min-w-[68rem] items-stretch gap-4 lg:min-w-0 lg:grid-cols-4">
              {PROJECT_WORK_ITEM_STATUSES.map(status => (
                <DroppableStatusColumn
                  key={status}
                  projectSlug={projectSlug}
                  status={status}
                  items={itemsByStatus[status]}
                  members={members}
                  onPriorityUpdate={onPriorityUpdate}
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </div>

            <DragOverlay
              dropAnimation={null}
              zIndex={40}
            >
              {activeItem && (
                <article className="cursor-grabbing rounded-xl border border-prism-teal-500/40 bg-surface p-3 shadow-[0_24px_56px_rgba(12,71,103,0.24)] ring-1 ring-prism-teal-500/30">
                  <WorkItemCardContent
                    item={activeItem}
                    members={members}
                    isDragOverlay
                    onPriorityUpdate={onPriorityUpdate}
                    onStatusUpdate={onStatusUpdate}
                  />
                </article>
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </section>
  );
});
