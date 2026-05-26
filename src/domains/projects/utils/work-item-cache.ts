import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type {
  ProjectWorkItem,
  ProjectWorkItemSearchResult,
  ReorderProjectWorkItemsPayload,
} from "@/domains/projects/types";
import type { ProjectWorkItemDeletedPayload } from "@/domains/projects/types/realtime";
import { PROJECT_WORK_ITEM_STATUSES } from "@/domains/projects/utils/work-item-display";
import { QUERY_KEYS } from "@/shared/query/queryKeys";

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
    previous => replaceWorkItemInSearchResult(previous, workItem),
  );
  queryClient.setQueriesData<ProjectWorkItem[]>(
    {
      predicate: query => isProjectWorkItemChildrenQuery(query.queryKey, projectId),
    },
    previous => replaceWorkItemInChildren(previous, workItem),
  );
  invalidateProjectWorkItemCollections(queryClient, projectId, workItem.workspaceId);
}

export type ProjectWorkItemReorderSnapshot = {
  lists: Array<[QueryKey, ProjectWorkItemSearchResult | undefined]>;
  details: Array<[QueryKey, ProjectWorkItem | undefined]>;
};

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

export function snapshotProjectWorkItemReorderCaches(
  queryClient: QueryClient,
  projectId: string,
  itemIds: string[],
): ProjectWorkItemReorderSnapshot {
  const lists = queryClient.getQueriesData<ProjectWorkItemSearchResult>({
    predicate: query => isProjectWorkItemListQuery(query.queryKey, projectId),
  });

  const details: ProjectWorkItemReorderSnapshot["details"] = itemIds.map(itemId => {
    const key = QUERY_KEYS.project.workItemDetail(projectId, itemId);
    return [key, queryClient.getQueryData<ProjectWorkItem>(key)];
  });

  return { lists, details };
}

export function restoreProjectWorkItemReorderCaches(
  queryClient: QueryClient,
  snapshot: ProjectWorkItemReorderSnapshot,
) {
  snapshot.lists.forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
  });
  snapshot.details.forEach(([key, data]) => {
    queryClient.setQueryData(key, data);
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

export function syncProjectWorkItemsReordered(
  queryClient: QueryClient,
  workItems: ProjectWorkItem[],
  { invalidateCollections = true }: { invalidateCollections?: boolean } = {},
) {
  const firstWorkItem = workItems[0];
  if (!firstWorkItem) {
    return;
  }

  workItems.forEach(workItem => {
    queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(workItem.projectId, workItem.itemId), workItem);
  });

  if (invalidateCollections) {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(firstWorkItem.projectId) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(firstWorkItem.workspaceId) });
  }
}

export function syncProjectWorkItemDeleted(queryClient: QueryClient, payload: ProjectWorkItemDeletedPayload) {
  const { itemId, projectId } = payload;

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
  invalidateProjectWorkItemCollections(queryClient, projectId);
  queryClient.invalidateQueries({
    predicate: query =>
      query.queryKey[0] === "workspace" && query.queryKey[1] === "detail" && query.queryKey[3] === "sprints",
  });
}
