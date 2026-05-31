"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteWorkspaceSprint } from "@/domains/sprints/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteWorkspaceSprintVariables = {
  workspaceId: string;
  sprintId: string;
};

export function useDeleteWorkspaceSprint() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, DeleteWorkspaceSprintVariables>({
    mutationFn: ({ workspaceId, sprintId }) => deleteWorkspaceSprint(workspaceId, sprintId),
    onSuccess: (_, { workspaceId, sprintId }) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.sprintDetail(workspaceId, sprintId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(workspaceId) });
    },
  });
}
