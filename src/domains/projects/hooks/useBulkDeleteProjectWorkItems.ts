"use client";

import { useQueryClient } from "@tanstack/react-query";

import { bulkDeleteProjectWorkItems } from "@/domains/projects/api";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import { removeProjectWorkItemFromCaches } from "@/domains/projects/utils/work-item-cache";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type BulkDeleteProjectWorkItemsVariables = {
  projectId: string;
  itemIds: string[];
};

export function useBulkDeleteProjectWorkItems(projectId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, BulkDeleteProjectWorkItemsVariables>({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.bulkDelete(projectId),
    mutationFn: async ({ projectId: variablesProjectId, itemIds }) => {
      await bulkDeleteProjectWorkItems(variablesProjectId, itemIds);
    },
    // Optimistically remove the selected items from the board so they disappear instantly.
    onMutate: async ({ projectId: variablesProjectId, itemIds }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.project.workItems(variablesProjectId) });
      itemIds.forEach(itemId => removeProjectWorkItemFromCaches(queryClient, variablesProjectId, itemId));
    },
    onSettled: (_data, _error, { projectId: variablesProjectId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.workItems(variablesProjectId),
      });
    },
  });
}
