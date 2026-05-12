"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateProjectWorkItem } from "@/domains/projects/api";
import type {
  ProjectWorkItem,
  ProjectWorkItemSearchResult,
  UpdateProjectWorkItemPayload,
} from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateProjectWorkItemVariables = {
  projectId: string;
  itemId: string;
  payload: UpdateProjectWorkItemPayload;
};

function replaceWorkItemInSearchResult(previous: ProjectWorkItemSearchResult | undefined, workItem: ProjectWorkItem) {
  if (!previous) {
    return previous;
  }

  return {
    ...previous,
    items: previous.items.map(item => (item.itemId === workItem.itemId ? workItem : item)),
  };
}

function replaceWorkItemInChildren(previous: ProjectWorkItem[] | undefined, workItem: ProjectWorkItem) {
  if (!previous) {
    return previous;
  }

  return previous.map(item => (item.itemId === workItem.itemId ? workItem : item));
}

function isProjectWorkItemListQuery(queryKey: readonly unknown[], projectId: string) {
  return (
    queryKey[0] === "project" &&
    queryKey[1] === "detail" &&
    queryKey[2] === projectId &&
    queryKey[3] === "work-items" &&
    (queryKey[4] === "list" || queryKey[4] === "my-tasks")
  );
}

function isProjectWorkItemChildrenQuery(queryKey: readonly unknown[], projectId: string) {
  return (
    queryKey[0] === "project" &&
    queryKey[1] === "detail" &&
    queryKey[2] === projectId &&
    queryKey[3] === "work-items" &&
    queryKey[4] === "detail" &&
    queryKey[6] === "children"
  );
}

function isProjectSprintWorkItemsQuery(queryKey: readonly unknown[], projectId: string) {
  return (
    queryKey[0] === "project" &&
    queryKey[1] === "detail" &&
    queryKey[2] === projectId &&
    queryKey[3] === "sprints" &&
    queryKey[6] === "work-items"
  );
}

export function useUpdateProjectWorkItem() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItem, Error, UpdateProjectWorkItemVariables>({
    mutationFn: async ({ projectId, itemId, payload }) => {
      const workItem = await updateProjectWorkItem(projectId, itemId, payload);

      if (!workItem) {
        throw new Error("Failed to update work item.");
      }

      return workItem;
    },
    onSuccess: (workItem, { projectId, itemId }) => {
      queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(projectId, itemId), workItem);
      queryClient.setQueriesData<ProjectWorkItemSearchResult>(
        {
          predicate: query => isProjectWorkItemListQuery(query.queryKey, projectId),
        },
        previous => replaceWorkItemInSearchResult(previous, workItem),
      );
      queryClient.setQueriesData<ProjectWorkItemSearchResult>(
        {
          predicate: query => isProjectSprintWorkItemsQuery(query.queryKey, projectId),
        },
        previous => replaceWorkItemInSearchResult(previous, workItem),
      );
      queryClient.setQueriesData<ProjectWorkItem[]>(
        {
          predicate: query => isProjectWorkItemChildrenQuery(query.queryKey, projectId),
        },
        previous => replaceWorkItemInChildren(previous, workItem),
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.sprints(projectId) });
    },
  });
}
