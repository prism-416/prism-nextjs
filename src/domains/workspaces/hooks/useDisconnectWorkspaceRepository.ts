"use client";

import { useQueryClient } from "@tanstack/react-query";

import { disconnectWorkspaceRepository } from "@/domains/workspaces/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DisconnectWorkspaceRepositoryVariables = {
  workspaceId: string;
  linkId: string;
};

export function useDisconnectWorkspaceRepository() {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, DisconnectWorkspaceRepositoryVariables>({
    mutationFn: ({ workspaceId, linkId }) => disconnectWorkspaceRepository(workspaceId, linkId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.repositories(workspaceId) });
    },
  });
}
