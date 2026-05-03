"use client";

import { useQueryClient } from "@tanstack/react-query";

import { removeWorkspaceMember } from "@/domains/workspaces/api";
import type { Workspace, WorkspaceMember } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type RemoveWorkspaceMemberVariables = {
  workspaceId: string;
  userId: string;
  removeWorkspaceFromList?: boolean;
};

export function useRemoveWorkspaceMember() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, RemoveWorkspaceMemberVariables>({
    mutationFn: async ({ workspaceId, userId }) => {
      await removeWorkspaceMember(workspaceId, userId);
    },
    onSuccess: (_, { workspaceId, userId, removeWorkspaceFromList = false }) => {
      queryClient.setQueryData<WorkspaceMember[]>(QUERY_KEYS.workspace.members(workspaceId), previous => {
        if (!previous) {
          return [];
        }

        return previous.filter(member => member.userId !== userId);
      });

      if (removeWorkspaceFromList) {
        queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
          if (!previous) {
            return [];
          }

          return previous.filter(workspace => workspace.workspaceId !== workspaceId);
        });
      }
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
    },
  });
}
