"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createProjectSprint } from "@/domains/projects/api";
import type { CreateProjectSprintPayload, ProjectSprint } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type CreateProjectSprintVariables = {
  projectId: string;
  payload: CreateProjectSprintPayload;
};

export function useCreateProjectSprint() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectSprint, Error, CreateProjectSprintVariables>({
    mutationFn: async ({ projectId, payload }) => {
      const sprint = await createProjectSprint(projectId, payload);

      if (!sprint) {
        throw new Error("Failed to create sprint.");
      }

      return sprint;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.sprints(projectId) });
    },
  });
}
