"use client";

import { useQueryClient } from "@tanstack/react-query";

import { permanentlyDeleteProjectWorkItem } from "@/domains/projects/api";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type PermanentlyDeleteProjectWorkItemVariables = {
  projectId: string;
  itemId: string;
};

export function usePermanentlyDeleteProjectWorkItem(projectId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, PermanentlyDeleteProjectWorkItemVariables>({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.permanentDelete(projectId),
    mutationFn: async ({ projectId: variablesProjectId, itemId }) => {
      await permanentlyDeleteProjectWorkItem(variablesProjectId, itemId);
    },
    onSuccess: (_, { projectId: variablesProjectId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.workItemTrash(variablesProjectId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.documents(variablesProjectId),
      });
    },
  });
}
