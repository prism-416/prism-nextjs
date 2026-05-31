"use client";

import { useQueryClient } from "@tanstack/react-query";

import { addWorkspaceSprintWorkItems } from "@/domains/sprints/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type AddSprintWorkItemsVariables = {
  workspaceId: string;
  sprintId: string;
  itemIds: string[];
};

export function useAddSprintWorkItems() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, AddSprintWorkItemsVariables>({
    mutationFn: ({ workspaceId, sprintId, itemIds }) => addWorkspaceSprintWorkItems(workspaceId, sprintId, itemIds),
    onSuccess: (_, { workspaceId, sprintId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workspace.sprintDetail(workspaceId, sprintId),
      });
    },
  });
}
