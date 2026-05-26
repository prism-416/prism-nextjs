"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateProject } from "@/domains/projects/api";
import type { Project, UpdateProjectPayload } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateProjectVariables = {
  projectId: string;
  projectSlug: string;
  payload: UpdateProjectPayload;
};

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useApiMutation<Project, unknown, UpdateProjectVariables>({
    mutationFn: async ({ projectId, payload }) => {
      const project = await updateProject(projectId, payload);

      if (!project) {
        throw new Error("Failed to update project.");
      }

      return project;
    },
    onSuccess: (project, { projectSlug }) => {
      queryClient.setQueryData<Project>(QUERY_KEYS.project.detailBySlug(projectSlug), previous => ({
        ...previous,
        ...project,
      }));
      queryClient.setQueryData<Project>(QUERY_KEYS.project.detail(project.projectId), previous => ({
        ...previous,
        ...project,
      }));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.lists() });
    },
  });
}
