"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteProjectSprint } from "@/domains/projects/api";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteProjectSprintVariables = {
  projectId: string;
  sprintId: string;
};

export function useDeleteProjectSprint() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, DeleteProjectSprintVariables>({
    mutationFn: ({ projectId, sprintId }) => deleteProjectSprint(projectId, sprintId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.sprints(projectId) });
    },
  });
}
