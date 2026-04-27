"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateWorkspace } from "@/domains/workspace/api";
import type { UpdateWorkspacePayload, Workspace } from "@/domains/workspace/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateWorkspaceVariables = {
  workspaceId: string;
  payload: UpdateWorkspacePayload;
};

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useApiMutation<Workspace, Error, UpdateWorkspaceVariables>({
    mutationFn: async ({ workspaceId, payload }) => {
      const workspace = await updateWorkspace(workspaceId, payload);

      if (!workspace) {
        throw new Error("Failed to update workspace.");
      }

      return workspace;
    },
    onSuccess: workspace => {
      queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
        if (!previous) return [workspace];
        return previous.map(item => (item.workspaceId === workspace.workspaceId ? { ...item, ...workspace } : item));
      });

      queryClient.setQueryData(QUERY_KEYS.workspace.detail(workspace.workspaceId), workspace);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.detail(workspace.workspaceId) });
    },
  });
}
