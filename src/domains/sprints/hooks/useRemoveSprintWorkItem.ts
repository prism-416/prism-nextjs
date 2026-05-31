"use client";

import { useQueryClient } from "@tanstack/react-query";

import { removeWorkspaceSprintWorkItem } from "@/domains/sprints/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type RemoveSprintWorkItemVariables = {
  workspaceId: string;
  sprintId: string;
  itemId: string;
};

export function useRemoveSprintWorkItem() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, RemoveSprintWorkItemVariables>({
    mutationFn: ({ workspaceId, sprintId, itemId }) => removeWorkspaceSprintWorkItem(workspaceId, sprintId, itemId),
    onSuccess: (_, { workspaceId, sprintId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workspace.sprintDetail(workspaceId, sprintId),
      });
    },
  });
}
