"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteProjectWorkItem } from "@/domains/projects/api";
import { syncProjectWorkItemDeleted } from "@/domains/projects/utils/work-item-cache";
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
    onSuccess: (_, { projectId, itemId }) => {
      syncProjectWorkItemDeleted(queryClient, { projectId, itemId });
      // `exact: true` so we only drop the detail query itself and leave the
      // children sub-query untouched — removing it would make the still-mounted
      // delete dialog refetch children for the now-deleted item (404).
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.project.workItemDetail(projectId, itemId),
        exact: true,
      });
    },
  });
}
