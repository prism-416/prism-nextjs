import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type {
  ProjectWorkItem,
  ProjectWorkItemSearchResult,
  ReorderProjectWorkItemsPayload,
} from "@/domains/projects/types";
import type { ProjectWorkItemDeletedPayload } from "@/domains/projects/types/realtime";
import { PROJECT_WORK_ITEM_STATUSES } from "@/domains/projects/utils/work-item-display";
import { QUERY_KEYS } from "@/shared/query/queryKeys";

/**
 * Insert a work item into a list so it stays ordered by `sortOrder` ascending,
 * matching the order the API returns (sort_order ASC).
 */
function insertWorkItemBySortOrder(items: ProjectWorkItem[], workItem: ProjectWorkItem) {
  const insertIndex = items.findIndex(item => item.sortOrder > workItem.sortOrder);
  return insertIndex === -1
    ? [...items, workItem]
    : [...items.slice(0, insertIndex), workItem, ...items.slice(insertIndex)];
}

/**
 * Optimistically merge a patch into a single board item in place. Used for field
 * edits that don't change ordering (title, description, priority, assignees…).
 */
export function patchProjectBoardWorkItem(
  queryClient: QueryClient,
  boardQueryKey: QueryKey,
  itemId: string,
  patch: Partial<ProjectWorkItem>,
) {
  queryClient.setQueryData<ProjectWorkItemSearchResult>(boardQueryKey, previous => {
    if (!previous) return previous;
    return {
      ...previous,
      items: previous.items.map(item => (item.itemId === itemId ? { ...item, ...patch } : item)),
    };
  });
}

/**
 * Optimistically apply a patch and re-position the item by its new `sortOrder`.
 * Used when status changes (the API reassigns sort_order within the new column).
 */
export function moveProjectBoardWorkItem(
  queryClient: QueryClient,
  boardQueryKey: QueryKey,
  itemId: string,
  patch: Partial<ProjectWorkItem>,
) {
  queryClient.setQueryData<ProjectWorkItemSearchResult>(boardQueryKey, previous => {
    if (!previous) return previous;
    const existing = previous.items.find(item => item.itemId === itemId);
    if (!existing) return previous;
    const updated = { ...existing, ...patch };
    const withoutItem = previous.items.filter(item => item.itemId !== itemId);
    return { ...previous, items: insertWorkItemBySortOrder(withoutItem, updated) };
  });
}

/**
 * Optimistically insert a freshly created work item at its sorted position.
 */
export function insertProjectBoardWorkItem(
  queryClient: QueryClient,
  boardQueryKey: QueryKey,
  workItem: ProjectWorkItem,
) {
  queryClient.setQueryData<ProjectWorkItemSearchResult>(boardQueryKey, previous => {
    if (!previous || previous.items.some(item => item.itemId === workItem.itemId)) {
      return previous;
    }
    return {
      ...previous,
      items: insertWorkItemBySortOrder(previous.items, workItem),
      total: previous.total + 1,
    };
  });
}

/**
 * Optimistically merge a patch into the cached work item detail, if present.
 */
export function patchProjectWorkItemDetail(
  queryClient: QueryClient,
  projectId: string,
  itemId: string,
  patch: Partial<ProjectWorkItem>,
) {
  queryClient.setQueryData<ProjectWorkItem>(QUERY_KEYS.project.workItemDetail(projectId, itemId), previous =>
    previous ? { ...previous, ...patch } : previous,
  );
}

function replaceWorkItemInSearchResult(previous: ProjectWorkItemSearchResult | undefined, workItem: ProjectWorkItem) {
  if (!previous) {
    return previous;
  }

  return {
    ...previous,
    items: previous.items.map(item => (item.itemId === workItem.itemId ? workItem : item)),
  };
}

function removeWorkItemFromSearchResult(previous: ProjectWorkItemSearchResult | undefined, itemId: string) {
  if (!previous) {
    return previous;
  }

  const nextItems = previous.items.filter(item => item.itemId !== itemId);

  return {
    ...previous,
    items: nextItems,
    total: nextItems.length === previous.items.length ? previous.total : Math.max(previous.total - 1, 0),
  };
}

function replaceWorkItemInChildren(previous: ProjectWorkItem[] | undefined, workItem: ProjectWorkItem) {
  if (!previous) {
    return previous;
  }

  return previous.map(item => (item.itemId === workItem.itemId ? workItem : item));
}

function removeWorkItemFromChildren(previous: ProjectWorkItem[] | undefined, itemId: string) {
  if (!previous) {
    return previous;
  }

  return previous.filter(item => item.itemId !== itemId);
}

function isProjectWorkItemListQuery(queryKey: QueryKey, projectId: string) {
  return (
    queryKey[0] === "project" &&
    queryKey[1] === "detail" &&
    queryKey[2] === projectId &&
    queryKey[3] === "work-items" &&
    (queryKey[4] === "list" || queryKey[4] === "my-tasks")
  );
}

function isProjectWorkItemChildrenQuery(queryKey: QueryKey, projectId: string) {
  return (
    queryKey[0] === "project" &&
    queryKey[1] === "detail" &&
    queryKey[2] === projectId &&
    queryKey[3] === "work-items" &&
    queryKey[4] === "detail" &&
    queryKey[6] === "children"
  );
}

function invalidateProjectWorkItemCollections(queryClient: QueryClient, projectId: string, workspaceId?: string) {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });

  if (workspaceId) {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(workspaceId) });
  }
}

export function syncProjectWorkItemCreated(queryClient: QueryClient, workItem: ProjectWorkItem) {
  queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(workItem.projectId, workItem.itemId), workItem);
  invalidateProjectWorkItemCollections(queryClient, workItem.projectId, workItem.workspaceId);
}

export function syncProjectWorkItemUpdated(queryClient: QueryClient, workItem: ProjectWorkItem) {
  const { itemId, projectId } = workItem;

  queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(projectId, itemId), workItem);
  queryClient.setQueriesData<ProjectWorkItemSearchResult>(
    {
      predicate: query => isProjectWorkItemListQuery(query.queryKey, projectId),
    },
    previous => {
      if (!previous) return previous;
      const existing = previous.items.find(i => i.itemId === itemId);
      if (!existing) return replaceWorkItemInSearchResult(previous, workItem);

      // When sortOrder changes (e.g. after a status change that reassigns sort_order),
      // move the item to its new sorted position so the display is stable before the
      // next refetch arrives.
      if (existing.sortOrder !== workItem.sortOrder) {
        const withoutItem = previous.items.filter(i => i.itemId !== itemId);
        return { ...previous, items: insertWorkItemBySortOrder(withoutItem, workItem) };
      }

      return replaceWorkItemInSearchResult(previous, workItem);
    },
  );
  queryClient.setQueriesData<ProjectWorkItem[]>(
    {
      predicate: query => isProjectWorkItemChildrenQuery(query.queryKey, projectId),
    },
    previous => replaceWorkItemInChildren(previous, workItem),
  );
  invalidateProjectWorkItemCollections(queryClient, projectId, workItem.workspaceId);
}

function sortTopLevelProjectWorkItemsForDisplay(items: ProjectWorkItem[]) {
  return [...items].sort((a, b) => {
    const aStatusIndex = PROJECT_WORK_ITEM_STATUSES.indexOf(a.status);
    const bStatusIndex = PROJECT_WORK_ITEM_STATUSES.indexOf(b.status);
    if (aStatusIndex !== bStatusIndex) {
      return aStatusIndex - bStatusIndex;
    }
    return a.sortOrder - b.sortOrder;
  });
}

export function applyOptimisticProjectWorkItemReorder(
  queryClient: QueryClient,
  projectId: string,
  payload: ReorderProjectWorkItemsPayload,
) {
  const updates = new Map(payload.items.map(({ itemId, status, sortOrder }) => [itemId, { status, sortOrder }]));

  queryClient.setQueriesData<ProjectWorkItemSearchResult>(
    {
      predicate: query => isProjectWorkItemListQuery(query.queryKey, projectId),
    },
    previous => {
      if (!previous) {
        return previous;
      }

      const updatedItems = previous.items.map(item => {
        const update = updates.get(item.itemId);
        return update ? { ...item, ...update } : item;
      });

      const topLevel = updatedItems.filter(item => item.parentId === null);
      const children = updatedItems.filter(item => item.parentId !== null);

      return { ...previous, items: [...sortTopLevelProjectWorkItemsForDisplay(topLevel), ...children] };
    },
  );

  payload.items.forEach(({ itemId, status, sortOrder }) => {
    queryClient.setQueryData<ProjectWorkItem>(QUERY_KEYS.project.workItemDetail(projectId, itemId), previous =>
      previous ? { ...previous, status, sortOrder } : previous,
    );
  });
}

export function syncProjectWorkItemsReordered(queryClient: QueryClient, workItems: ProjectWorkItem[]) {
  const firstWorkItem = workItems[0];
  if (!firstWorkItem) {
    return;
  }

  workItems.forEach(workItem => {
    queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(workItem.projectId, workItem.itemId), workItem);
  });

  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(firstWorkItem.projectId) });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(firstWorkItem.workspaceId) });
}

/**
 * Remove a work item from the cached lists/children/detail without triggering any
 * refetch. Used for optimistic deletes (apply instantly, reconcile later).
 */
export function removeProjectWorkItemFromCaches(queryClient: QueryClient, projectId: string, itemId: string) {
  queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(projectId, itemId), undefined);
  queryClient.setQueriesData<ProjectWorkItemSearchResult>(
    {
      predicate: query => isProjectWorkItemListQuery(query.queryKey, projectId),
    },
    previous => removeWorkItemFromSearchResult(previous, itemId),
  );
  queryClient.setQueriesData<ProjectWorkItem[]>(
    {
      predicate: query => isProjectWorkItemChildrenQuery(query.queryKey, projectId),
    },
    previous => removeWorkItemFromChildren(previous, itemId),
  );
}

export function syncProjectWorkItemDeleted(queryClient: QueryClient, payload: ProjectWorkItemDeletedPayload) {
  const { itemId, projectId } = payload;

  removeProjectWorkItemFromCaches(queryClient, projectId, itemId);
  // Invalidate the work item collections (and other items' subtrees) but NOT the
  // deleted item's own detail/children subtree — it no longer exists on the
  // server, so refetching it would 404 (the delete dialog may still be observing
  // its children to show the child count).
  queryClient.invalidateQueries({
    predicate: query => {
      const key = query.queryKey;
      const underWorkItems =
        key[0] === "project" && key[1] === "detail" && key[2] === projectId && key[3] === "work-items";
      if (!underWorkItems) {
        return false;
      }
      const isDeletedItemSubtree = key[4] === "detail" && key[5] === itemId;
      return !isDeletedItemSubtree;
    },
  });
  queryClient.invalidateQueries({
    predicate: query =>
      query.queryKey[0] === "workspace" && query.queryKey[1] === "detail" && query.queryKey[3] === "sprints",
  });
}
