"use client";

import { useQueryClient } from "@tanstack/react-query";

import { reorderProjectWorkItems } from "@/domains/projects/api";
import type { ProjectWorkItem, ReorderProjectWorkItemsPayload } from "@/domains/projects/types";
import { syncProjectWorkItemsReordered } from "@/domains/projects/utils/work-item-cache";
import { useApiMutation } from "@/shared/query";

type ReorderProjectWorkItemsVariables = {
  projectId: string;
  payload: ReorderProjectWorkItemsPayload;
};

export function useReorderProjectWorkItems() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItem[], Error, ReorderProjectWorkItemsVariables>({
    mutationFn: async ({ projectId, payload }) => {
      const workItems = await reorderProjectWorkItems(projectId, payload);

      if (workItems.length === 0) {
        throw new Error("Failed to reorder work items.");
      }

      return workItems;
    },
    onSuccess: workItems => {
      syncProjectWorkItemsReordered(queryClient, workItems);
    },
  });
}
