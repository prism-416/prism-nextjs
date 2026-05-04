"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createWorkspaceProjectJobs, updateWorkspaceProjectJobs } from "@/domains/workspaces/api";
import type {
  CreateWorkspaceProjectJobPayload,
  UpdateWorkspaceProjectJobPayload,
  WorkspaceProjectJob,
} from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type SaveWorkspaceProjectJobsVariables = {
  workspaceId: string;
  createJobs: CreateWorkspaceProjectJobPayload[];
  updateJobs: UpdateWorkspaceProjectJobPayload[];
};

type SaveWorkspaceProjectJobsResult = {
  createdJobs: WorkspaceProjectJob[];
  updatedJobs: WorkspaceProjectJob[];
};

function mergeWorkspaceProjectJobs(
  previous: WorkspaceProjectJob[] | undefined,
  result: SaveWorkspaceProjectJobsResult,
) {
  const jobsById = new Map((previous ?? []).map(job => [job.jobId, job]));

  for (const job of result.updatedJobs) {
    jobsById.set(job.jobId, job);
  }

  for (const job of result.createdJobs) {
    jobsById.set(job.jobId, job);
  }

  return Array.from(jobsById.values());
}

export function useSaveWorkspaceProjectJobs() {
  const queryClient = useQueryClient();

  return useApiMutation<SaveWorkspaceProjectJobsResult, Error, SaveWorkspaceProjectJobsVariables>({
    mutationFn: async ({ workspaceId, createJobs, updateJobs }) => {
      const [createdJobs, updatedJobs] = await Promise.all([
        createJobs.length > 0
          ? createWorkspaceProjectJobs(workspaceId, { jobs: createJobs })
          : Promise.resolve<WorkspaceProjectJob[]>([]),
        updateJobs.length > 0
          ? updateWorkspaceProjectJobs(workspaceId, { jobs: updateJobs })
          : Promise.resolve<WorkspaceProjectJob[]>([]),
      ]);

      return {
        createdJobs,
        updatedJobs,
      };
    },
    onSuccess: (result, { workspaceId }) => {
      queryClient.setQueryData<WorkspaceProjectJob[]>(QUERY_KEYS.workspace.projectJobs(workspaceId), previous =>
        mergeWorkspaceProjectJobs(previous, result),
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.projectJobs(workspaceId) });
    },
  });
}
