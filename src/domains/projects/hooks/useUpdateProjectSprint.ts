"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateProjectSprint } from "@/domains/projects/api";
import type { ProjectSprint, UpdateProjectSprintPayload } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateProjectSprintVariables = {
  projectId: string;
  sprintId: string;
  payload: UpdateProjectSprintPayload;
};

export function useUpdateProjectSprint() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectSprint, Error, UpdateProjectSprintVariables>({
    mutationFn: async ({ projectId, sprintId, payload }) => {
      const sprint = await updateProjectSprint(projectId, sprintId, payload);

      if (!sprint) {
        throw new Error("Failed to update sprint.");
      }

      return sprint;
    },
    onSuccess: (sprint, { projectId, sprintId }) => {
      queryClient.setQueryData(QUERY_KEYS.project.sprintDetail(projectId, sprintId), sprint);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.sprints(projectId) });
    },
  });
}
