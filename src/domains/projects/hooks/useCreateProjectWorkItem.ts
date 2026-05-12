"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createProjectWorkItem } from "@/domains/projects/api";
import type { CreateProjectWorkItemPayload, ProjectWorkItem } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type CreateProjectWorkItemVariables = {
  projectId: string;
  payload: CreateProjectWorkItemPayload;
};

export function useCreateProjectWorkItem() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItem, Error, CreateProjectWorkItemVariables>({
    mutationFn: async ({ projectId, payload }) => {
      const workItem = await createProjectWorkItem(projectId, payload);

      if (!workItem) {
        throw new Error("Failed to create work item.");
      }

      return workItem;
    },
    onSuccess: (workItem, { projectId, payload }) => {
      queryClient.setQueryData(QUERY_KEYS.project.workItemDetail(projectId, workItem.itemId), workItem);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });

      if (payload.parentId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.project.workItemChildren(projectId, payload.parentId),
        });
      }
    },
  });
}
