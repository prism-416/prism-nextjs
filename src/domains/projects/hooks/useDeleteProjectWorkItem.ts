"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteProjectWorkItem } from "@/domains/projects/api";
import { removeProjectWorkItemFromCaches, syncProjectWorkItemDeleted } from "@/domains/projects/utils/work-item-cache";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteProjectWorkItemVariables = {
  projectId: string;
  itemId: string;
};

export function useDeleteProjectWorkItem() {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, DeleteProjectWorkItemVariables>({
    mutationFn: async ({ projectId, itemId }) => {
      await deleteProjectWorkItem(projectId, itemId);
    },
    // Optimistically remove from the board/lists so the card disappears instantly.
    onMutate: async ({ projectId, itemId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
      removeProjectWorkItemFromCaches(queryClient, projectId, itemId);
    },
    onError: (_error, { projectId }) => {
      // Restore the optimistically removed item if the delete failed.
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.workItems(projectId) });
    },
    onSuccess: (_, { projectId, itemId }) => {
      // Reconcile with the server (idempotent removal + targeted invalidation).
      syncProjectWorkItemDeleted(queryClient, { projectId, itemId });
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.project.workItemDetail(projectId, itemId),
        exact: true,
      });
    },
  });
}
