"use client";

import { useQueryClient } from "@tanstack/react-query";

import { updateWorkspaceMemberJobs } from "@/domains/workspaces/api";
import type { WorkspaceMember } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type UpdateWorkspaceMemberJobsVariables = {
  workspaceId: string;
  userId: string;
  jobIds: string[];
};

export function useUpdateWorkspaceMemberJobs() {
  const queryClient = useQueryClient();

  return useApiMutation<WorkspaceMember, Error, UpdateWorkspaceMemberJobsVariables>({
    mutationFn: async ({ workspaceId, userId, jobIds }) => {
      const member = await updateWorkspaceMemberJobs(workspaceId, userId, { jobIds });

      if (!member) {
        throw new Error("Failed to update member jobs.");
      }

      return member;
    },
    onSuccess: (member, { workspaceId }) => {
      queryClient.setQueryData<WorkspaceMember[]>(QUERY_KEYS.workspace.members(workspaceId), previous =>
        previous?.map(item => (item.userId === member.userId ? member : item)),
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
    },
  });
}
