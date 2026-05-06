"use client";

import { useQueryClient } from "@tanstack/react-query";

import { removeProjectMember } from "@/domains/projects/api";
import type { ProjectMemberListItem } from "@/domains/projects/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type RemoveProjectMemberAssignmentVariables = {
  projectId: string;
  memberId: string;
};

export function useRemoveProjectMemberAssignment() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, RemoveProjectMemberAssignmentVariables>({
    mutationFn: ({ projectId, memberId }) => removeProjectMember(projectId, memberId),
    onSuccess: (_, { projectId, memberId }) => {
      queryClient.setQueryData<ProjectMemberListItem[]>(QUERY_KEYS.project.members(projectId), previous => {
        if (!previous) {
          return [];
        }

        return previous.filter(member => member.memberId !== memberId);
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.members(projectId) });
    },
  });
}
