"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createProject } from "@/domains/projects/api";
import type { CreateProjectPayload, Project, ProjectSummary } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UseCreateProjectParams = {
  workspaceSlug: string;
};

export function useCreateProject({ workspaceSlug }: UseCreateProjectParams) {
  const queryClient = useQueryClient();

  return useApiMutation<Project, Error, CreateProjectPayload>({
    mutationFn: async payload => {
      const project = await createProject(payload);

      if (!project) {
        throw new Error("Failed to create project.");
      }

      return project;
    },
    onSuccess: project => {
      const queryKey = QUERY_KEYS.project.listByWorkspaceSlug(workspaceSlug);

      queryClient.setQueryData<ProjectSummary[]>(queryKey, previous => {
        if (!previous) return [project];

        return [project, ...previous.filter(item => item.projectId !== project.projectId)];
      });

      queryClient.invalidateQueries({ queryKey });
    },
  });
}
