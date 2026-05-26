import type { QueryClient, QueryKey } from "@tanstack/react-query";

import type { ProjectWorkItem, ProjectWorkItemSearchResult } from "@/domains/projects/types";
import type { ProjectWorkItemDeletedPayload } from "@/domains/projects/types/realtime";
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
