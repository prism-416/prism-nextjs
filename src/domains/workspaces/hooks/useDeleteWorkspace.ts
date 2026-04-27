"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteWorkspace } from "@/domains/workspaces/api";
import type { Workspace } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, string>({
    mutationFn: async workspaceId => {
      await deleteWorkspace(workspaceId);
    },
    onSuccess: (_, workspaceId) => {
      queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
        if (!previous) {
          return [];
        }

        return previous.filter(item => item.workspaceId !== workspaceId);
      });

      queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.detail(workspaceId) });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
    },
  });
}
