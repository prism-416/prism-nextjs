"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateWorkspace } from "@/domains/workspaces/api";
import type { UpdateWorkspacePayload, Workspace } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateWorkspaceVariables = {
  workspaceId: string;
  payload: UpdateWorkspacePayload;
};

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useApiMutation<Workspace, unknown, UpdateWorkspaceVariables>({
    mutationFn: async ({ workspaceId, payload }) => {
      const workspace = await updateWorkspace(workspaceId, payload);

      if (!workspace) {
        throw new Error("Failed to update workspace.");
      }

      return workspace;
    },
    onSuccess: workspace => {
      queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
        if (!previous) {
          return [workspace];
        }

        return previous.map(item => {
          if (item.workspaceId !== workspace.workspaceId) {
            return item;
          }

          return {
            ...item,
            ...workspace,
          };
        });
      });

      queryClient.setQueryData<Workspace>(QUERY_KEYS.workspace.detail(workspace.workspaceId), previous => ({
        ...previous,
        ...workspace,
      }));

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
    },
  });
}
