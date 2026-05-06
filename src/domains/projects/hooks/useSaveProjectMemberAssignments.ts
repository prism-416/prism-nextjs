"use client";

import { useQueryClient } from "@tanstack/react-query";

import { upsertProjectMembers } from "@/domains/projects/api";
import type { ProjectMember } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type SaveProjectMemberAssignmentsVariables = {
  projectId: string;
  userId: string;
  jobIds: string[];
};

export function useSaveProjectMemberAssignments() {
  const queryClient = useQueryClient();

  return useApiMutation<ProjectMember[], Error, SaveProjectMemberAssignmentsVariables>({
    mutationFn: ({ projectId, userId, jobIds }) =>
      upsertProjectMembers(projectId, {
        members: [{ userId, jobIds }],
      }),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.members(projectId) });
    },
  });
}
