"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { LayoutDashboard, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/atomics/atoms/Button";
import { Typography } from "@/atomics/atoms/Typography";
import { DroppableStatusColumn } from "@/domains/projects/components/ProjectDashboardStatusColumn";
import { WorkItemCardContent } from "@/domains/projects/components/ProjectDashboardWorkItemCard";
import type {
  ProjectParticipant,
  ProjectWorkItem,
  ProjectWorkItemPriority,
  ProjectWorkItemSearchResult,
  ProjectWorkItemStatus,
} from "@/domains/projects/types";
import { PROJECT_WORK_ITEM_STATUSES } from "@/domains/projects/utils/work-item-display";
import {
  getProjectWorkItemsByStatus,
  getProjectWorkItemStatusDropId,
  getTopLevelProjectWorkItems,
  hasProjectWorkItemOrderChanged,
  reorderTopLevelProjectWorkItems,
  type ProjectWorkItemDropTarget,
} from "@/domains/projects/utils/work-item-order";

type ProjectDashboardPanelProps = {
  projectSlug: string;
  workItems: ProjectWorkItemSearchResult;
  members?: ProjectParticipant[];
  isError: boolean;
  updateError: string | null;
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
  onItemsReorder: (items: ProjectWorkItem[]) => void;
  onRetry: () => void;
  onCreateWorkItem: (status?: ProjectWorkItemStatus) => void;
};

export const ProjectDashboardPanel = memo(function ProjectDashboardPanel({
  projectSlug,
  workItems,
  members,
  isError,
  updateError,
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
              onClick={() => onCreateWorkItem()}
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
            <div className="grid items-stretch gap-4 lg:grid-cols-4">
              {PROJECT_WORK_ITEM_STATUSES.map(status => (
                <DroppableStatusColumn
                  key={status}
                  projectSlug={projectSlug}
                  status={status}
                  items={itemsByStatus[status]}
                  members={members}
                  inlineEditingItemId={inlineEditingItemId}
                  inlineCreatingStatus={inlineCreatingStatus}
                  onPriorityUpdate={onPriorityUpdate}
                  onStatusUpdate={onStatusUpdate}
                  onInlineCreateWorkItem={onInlineCreateWorkItem}
                  onInlineTitleUpdate={onInlineTitleUpdate}
                  onInlineDescriptionUpdate={onInlineDescriptionUpdate}
                  onInlineScheduleUpdate={onInlineScheduleUpdate}
                  onInlineAssigneesUpdate={onInlineAssigneesUpdate}
                  onInlineEditCancel={onInlineEditCancel}
                  onEditWorkItem={onEditWorkItem}
                  onDeleteWorkItem={onDeleteWorkItem}
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
