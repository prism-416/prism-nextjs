"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteProject } from "@/domains/projects/api";
import type { ProjectSummary } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteProjectVariables = {
  projectId: string;
  workspaceId: string;
};

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useApiMutation<void, unknown, DeleteProjectVariables>({
    mutationFn: async ({ projectId }) => {
      await deleteProject(projectId);
    },
    onSuccess: (_, { projectId, workspaceId }) => {
      queryClient.setQueryData<ProjectSummary[]>(QUERY_KEYS.project.list(workspaceId), previous => {
        if (!previous) return [];
        return previous.filter(item => item.projectId !== projectId);
      });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.project.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.lists() });
    },
  });
}
