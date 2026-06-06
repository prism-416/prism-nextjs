"use client";

import { useQueryClient } from "@tanstack/react-query";

import { bulkRestoreProjectWorkItems } from "@/domains/projects/api";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import type { TrashedProjectWorkItemSearchResult } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type BulkRestoreProjectWorkItemsVariables = {
  projectId: string;
  itemIds: string[];
};

type BulkRestoreContext = {
  previousTrash?: TrashedProjectWorkItemSearchResult;
};

export function useBulkRestoreProjectWorkItems(projectId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, BulkRestoreProjectWorkItemsVariables, BulkRestoreContext>({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.bulkRestore(projectId),
    mutationFn: async ({ projectId: variablesProjectId, itemIds }) => {
      await bulkRestoreProjectWorkItems(variablesProjectId, itemIds);
    },
    // Optimistically remove restored items from the trash list so the UI updates instantly.
    onMutate: async ({ projectId: variablesProjectId, itemIds }) => {
      const trashKey = QUERY_KEYS.project.workItemTrash(variablesProjectId);
      await queryClient.cancelQueries({ queryKey: trashKey });
      const previousTrash = queryClient.getQueryData<TrashedProjectWorkItemSearchResult>(trashKey);
      const idSet = new Set(itemIds);
      queryClient.setQueryData<TrashedProjectWorkItemSearchResult>(trashKey, previous =>
        previous ? { ...previous, items: previous.items.filter(item => !idSet.has(item.itemId)) } : previous,
      );
      return { previousTrash };
    },
    onError: (_error, { projectId: variablesProjectId }, context) => {
      if (context?.previousTrash) {
        queryClient.setQueryData(QUERY_KEYS.project.workItemTrash(variablesProjectId), context.previousTrash);
      }
    },
    onSettled: (_data, _error, { projectId: variablesProjectId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.workItems(variablesProjectId),
      });
    },
  });
}
