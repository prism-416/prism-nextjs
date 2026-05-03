"use client";

import { useQueryClient } from "@tanstack/react-query";

import { transferWorkspaceOwner } from "@/domains/workspaces/api";
import type { Workspace } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type TransferWorkspaceOwnerVariables = {
  workspaceId: string;
  ownerId: string;
};

export function useTransferWorkspaceOwner() {
  const queryClient = useQueryClient();

  return useApiMutation<Workspace, Error, TransferWorkspaceOwnerVariables>({
    mutationFn: async ({ workspaceId, ownerId }) => {
      const workspace = await transferWorkspaceOwner(workspaceId, { ownerId });

      if (!workspace) {
        throw new Error("Failed to transfer workspace owner.");
      }

      return workspace;
    },
    onSuccess: workspace => {
      queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
        if (!previous) {
          return [workspace];
        }

        return previous.map(item => (item.workspaceId === workspace.workspaceId ? { ...item, ...workspace } : item));
      });

      queryClient.setQueryData<Workspace>(QUERY_KEYS.workspace.detail(workspace.workspaceId), previous => {
        if (!previous) {
          return workspace;
        }

        return { ...previous, ...workspace };
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.detail(workspace.workspaceId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspace.workspaceId) });
    },
  });
}
