"use client";

import { useQueryClient } from "@tanstack/react-query";

import { reorderProjectWorkItems } from "@/domains/projects/api";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import type { ProjectWorkItem, ReorderProjectWorkItemsPayload } from "@/domains/projects/types";
import {
  applyOptimisticProjectWorkItemReorder,
  restoreProjectWorkItemReorderCaches,
  snapshotProjectWorkItemReorderCaches,
  syncProjectWorkItemsReordered,
  type ProjectWorkItemReorderSnapshot,
} from "@/domains/projects/utils/work-item-cache";
import { QUERY_KEYS } from "@/shared/query/queryKeys";
import { useApiMutation } from "@/shared/query";

type ReorderProjectWorkItemsVariables = {
  projectId: string;
  payload: ReorderProjectWorkItemsPayload;
};

type ReorderProjectWorkItemsContext = {
  snapshot: ProjectWorkItemReorderSnapshot;
};

export function useReorderProjectWorkItems(projectId: string) {
  const queryClient = useQueryClient();
  const mutationKey = PROJECT_MUTATION_KEYS.workItems.reorder(projectId);

  return useApiMutation<ProjectWorkItem[], Error, ReorderProjectWorkItemsVariables, ReorderProjectWorkItemsContext>({
    mutationKey,
    scope: { id: `project-work-item-reorder:${projectId}` },
    mutationFn: async ({ projectId: variablesProjectId, payload }) => {
      const workItems = await reorderProjectWorkItems(variablesProjectId, payload);

      if (workItems.length === 0) {
        throw new Error("Failed to reorder work items.");
      }

      return workItems;
    },
    onMutate: async ({ projectId: variablesProjectId, payload }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.project.workItems(variablesProjectId) });

      const snapshot = snapshotProjectWorkItemReorderCaches(
        queryClient,
        variablesProjectId,
        payload.items.map(item => item.itemId),
      );
      applyOptimisticProjectWorkItemReorder(queryClient, variablesProjectId, payload);

      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      if (context?.snapshot) {
        restoreProjectWorkItemReorderCaches(queryClient, context.snapshot);
      }
    },
    onSuccess: workItems => {
      const hasQueuedReorder = queryClient.isMutating({ mutationKey }) > 1;
      syncProjectWorkItemsReordered(queryClient, workItems, { invalidateCollections: !hasQueuedReorder });
    },
  });
}
