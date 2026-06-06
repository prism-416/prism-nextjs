"use client";

import { useQueryClient } from "@tanstack/react-query";

import { restoreProjectWorkItem } from "@/domains/projects/api";
import { PROJECT_MUTATION_KEYS } from "@/domains/projects/constants/mutations";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type RestoreProjectWorkItemVariables = {
  projectId: string;
  itemId: string;
};

export function useRestoreProjectWorkItem(projectId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectWorkItem | undefined, unknown, RestoreProjectWorkItemVariables>({
    mutationKey: PROJECT_MUTATION_KEYS.workItems.restore(projectId),
    mutationFn: ({ projectId: variablesProjectId, itemId }) => restoreProjectWorkItem(variablesProjectId, itemId),
    onSuccess: (_, { projectId: variablesProjectId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project.workItems(variablesProjectId),
      });
    },
  });
}
