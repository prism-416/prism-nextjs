"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateWorkspaceSprint } from "@/domains/sprints/api";
import type { Sprint, UpdateSprintPayload } from "@/domains/sprints/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateWorkspaceSprintVariables = {
  workspaceId: string;
  sprintId: string;
  payload: UpdateSprintPayload;
};

export function useUpdateWorkspaceSprint() {
  const queryClient = useQueryClient();

  return useApiMutation<Sprint, Error, UpdateWorkspaceSprintVariables>({
    mutationFn: async ({ workspaceId, sprintId, payload }) => {
      const sprint = await updateWorkspaceSprint(workspaceId, sprintId, payload);

      if (!sprint) {
        throw new Error("Failed to update sprint.");
      }

      return sprint;
    },
    onSuccess: (_, { workspaceId, sprintId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprintDetail(workspaceId, sprintId) });
    },
  });
}
