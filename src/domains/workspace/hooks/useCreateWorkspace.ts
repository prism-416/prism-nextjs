"use client";

import { useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS, useApiMutation } from "@/shared/query";

import { createWorkspace } from "@/domains/workspace/api";
import type { CreateWorkspacePayload, Workspace } from "@/domains/workspace/types";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useApiMutation<Workspace, Error, CreateWorkspacePayload>({
    mutationFn: async payload => {
      const workspace = await createWorkspace(payload);

      if (!workspace) {
        throw new Error("Failed to create workspace.");
      }

      return workspace;
    },
    onSuccess: workspace => {
      queryClient.setQueryData<Workspace[]>(QUERY_KEYS.workspace.list(), previous => {
        if (!previous) return [workspace];
        return [workspace, ...previous];
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.list() });
    },
  });
}
