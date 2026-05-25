"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createWorkspaceSprint } from "@/domains/sprints/api";
import type { CreateSprintPayload, Sprint } from "@/domains/sprints/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type CreateWorkspaceSprintVariables = {
  workspaceId: string;
  payload: CreateSprintPayload;
};

export function useCreateWorkspaceSprint() {
  const queryClient = useQueryClient();

  return useApiMutation<Sprint, Error, CreateWorkspaceSprintVariables>({
    mutationFn: async ({ workspaceId, payload }) => {
      const sprint = await createWorkspaceSprint(workspaceId, payload);

      if (!sprint) {
        throw new Error("Failed to create sprint.");
      }

      return sprint;
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.sprints(workspaceId) });
    },
  });
}
