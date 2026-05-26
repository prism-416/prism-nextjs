"use client";

import { useQueryClient } from "@tanstack/react-query";

import { deleteWorkspaceJob } from "@/domains/workspaces/api";
import type { WorkspaceJob } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type DeleteWorkspaceJobVariables = {
  workspaceId: string;
  jobId: string;
};

export function useDeleteWorkspaceJob() {
  const queryClient = useQueryClient();

  return useApiMutation<void, Error, DeleteWorkspaceJobVariables>({
    mutationFn: ({ workspaceId, jobId }) => deleteWorkspaceJob(workspaceId, jobId),
    onSuccess: (_, { workspaceId, jobId }) => {
      queryClient.setQueryData<WorkspaceJob[]>(QUERY_KEYS.workspace.jobs(workspaceId), previous =>
        previous?.filter(job => job.jobId !== jobId),
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
    },
  });
}
