"use client";

import { useQueryClient } from "@tanstack/react-query";

import { connectWorkspaceRepository } from "@/domains/workspaces/api";
import type { CreateWorkspaceRepositoryLinkPayload, WorkspaceRepositoryLink } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type ConnectWorkspaceRepositoryVariables = {
  workspaceId: string;
  payload: CreateWorkspaceRepositoryLinkPayload;
};

export function useConnectWorkspaceRepository() {
  const queryClient = useQueryClient();

  return useApiMutation<WorkspaceRepositoryLink, unknown, ConnectWorkspaceRepositoryVariables>({
    mutationFn: async ({ workspaceId, payload }) => {
      const link = await connectWorkspaceRepository(workspaceId, payload);

      if (!link) {
        throw new Error("Failed to connect GitHub repository.");
      }

      return link;
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.repositories(workspaceId) });
    },
  });
}
