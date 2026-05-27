"use client";

import { useQueryClient } from "@tanstack/react-query";

import { reorderProjectWorkItems } from "@/domains/projects/api";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import type { ProjectWorkItem, ReorderProjectWorkItemsPayload } from "@/domains/projects/types";
import { syncProjectWorkItemsReordered } from "@/domains/projects/utils/work-item-cache";
import { QUERY_KEYS } from "@/shared/query/queryKeys";
import { useApiMutation } from "@/shared/query";

type ReorderProjectWorkItemsVariables = {
  projectId: string;
  payload: ReorderProjectWorkItemsPayload;
};

export function useReorderProjectWorkItems(projectId: string) {
  const queryClient = useQueryClient();
  const mutationKey = PROJECT_MUTATION_KEYS.workItems.reorder(projectId);

  return useApiMutation<ProjectWorkItem[], Error, ReorderProjectWorkItemsVariables>({
    mutationKey,
    scope: { id: `project-work-item-reorder:${projectId}` },
    mutationFn: async ({ projectId: variablesProjectId, payload }) => {
      const workItems = await reorderProjectWorkItems(variablesProjectId, payload);

      if (workItems.length === 0) {
        throw new Error("Failed to reorder work items.");
      }

      return workItems;
    },
    onError: (_error, variables) => {
      const hasQueuedReorder = queryClient.isMutating({ mutationKey }) > 1;
      const hasPendingLocalUpdate =
        queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.update(variables.projectId) }) > 0;
      if (!hasQueuedReorder && !hasPendingLocalUpdate) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(variables.projectId) });
      }
    },
    onSuccess: workItems => {
      const hasQueuedReorder = queryClient.isMutating({ mutationKey }) > 1;
      const hasPendingLocalUpdate =
        queryClient.isMutating({ mutationKey: PROJECT_MUTATION_KEYS.workItems.update(projectId) }) > 0;
      if (!hasQueuedReorder && !hasPendingLocalUpdate) {
        syncProjectWorkItemsReordered(queryClient, workItems);
      }
    },
  });
}
