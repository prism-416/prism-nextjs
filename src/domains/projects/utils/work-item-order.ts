import type { ProjectWorkItem, ProjectWorkItemStatus } from "@/domains/projects/types";
import { PROJECT_WORK_ITEM_STATUSES } from "@/domains/projects/utils/work-item-display";

export type ProjectWorkItemDropTarget = {
  status: ProjectWorkItemStatus;
  itemId?: string;
};

export function getProjectWorkItemStatusDropId(status: ProjectWorkItemStatus) {
  return `status:${status}`;
}

export function getTopLevelProjectWorkItems(items: ProjectWorkItem[]) {
  return items.filter(item => item.parentId === null);
}

export function getProjectWorkItemsByStatus(items: ProjectWorkItem[]) {
  const result: Record<ProjectWorkItemStatus, ProjectWorkItem[]> = {
    todo: [],
    in_progress: [],
    in_review: [],
    done: [],
    archived: [],
  };

  for (const item of items) {
    result[item.status].push(item);
  }

  // Sort within each column to match DB order (sort_order ASC, created_at DESC),
  // so the display is stable regardless of the global cache array order.
  for (const status of PROJECT_WORK_ITEM_STATUSES) {
    result[status].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  return result;
}

export function reorderTopLevelProjectWorkItems(
  items: ProjectWorkItem[],
  activeItemId: string,
  target: ProjectWorkItemDropTarget,
) {
  const activeItem = items.find(item => item.itemId === activeItemId);
  if (!activeItem || target.itemId === activeItemId) {
    return items;
  }

  const itemsByStatus = getProjectWorkItemsByStatus(items);
  const sourceItems = itemsByStatus[activeItem.status];
  const activeIndex = sourceItems.findIndex(item => item.itemId === activeItemId);
  if (activeIndex < 0) {
    return items;
  }

  const targetItems = itemsByStatus[target.status];
  const originalTargetIndex = target.itemId
    ? targetItems.findIndex(item => item.itemId === target.itemId)
    : targetItems.length;
  if (target.itemId && originalTargetIndex < 0) {
    return items;
  }

  const movesDownInSameStatus =
    activeItem.status === target.status && target.itemId !== undefined && activeIndex < originalTargetIndex;
  sourceItems.splice(activeIndex, 1);
  const targetIndex = target.itemId ? targetItems.findIndex(item => item.itemId === target.itemId) : targetItems.length;

  targetItems.splice(movesDownInSameStatus ? targetIndex + 1 : targetIndex, 0, {
    ...activeItem,
    status: target.status,
  });

  const visibleItems = PROJECT_WORK_ITEM_STATUSES.flatMap(status =>
    itemsByStatus[status].map((item, sortOrder) => ({ ...item, sortOrder })),
  );
  const hiddenItems = items.filter(item => !PROJECT_WORK_ITEM_STATUSES.includes(item.status));

  return [...visibleItems, ...hiddenItems];
}

export function hasProjectWorkItemOrderChanged(previous: ProjectWorkItem[], next: ProjectWorkItem[]) {
  return (
    previous.length !== next.length ||
    previous.some((item, index) => {
      const nextItem = next[index];
      return (
        !nextItem ||
        item.itemId !== nextItem.itemId ||
        item.status !== nextItem.status ||
        item.sortOrder !== nextItem.sortOrder
      );
    })
  );
}
