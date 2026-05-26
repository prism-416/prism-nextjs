"use client";

import { useQueryClient } from "@tanstack/react-query";

import { createWorkspaceJobs, updateWorkspaceJobs } from "@/domains/workspaces/api";
import type { CreateWorkspaceJobPayload, UpdateWorkspaceJobPayload, WorkspaceJob } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type SaveWorkspaceJobsVariables = {
  workspaceId: string;
  createJobs: CreateWorkspaceJobPayload[];
  updateJobs: UpdateWorkspaceJobPayload[];
};

type SaveWorkspaceJobsResult = {
  createdJobs: WorkspaceJob[];
  updatedJobs: WorkspaceJob[];
};

function mergeWorkspaceJobs(previous: WorkspaceJob[] | undefined, result: SaveWorkspaceJobsResult) {
  const jobsById = new Map((previous ?? []).map(job => [job.jobId, job]));

  for (const job of result.updatedJobs) {
    jobsById.set(job.jobId, job);
  }

  for (const job of result.createdJobs) {
    jobsById.set(job.jobId, job);
  }

  return Array.from(jobsById.values());
}

export function useSaveWorkspaceJobs() {
  const queryClient = useQueryClient();

  return useApiMutation<SaveWorkspaceJobsResult, Error, SaveWorkspaceJobsVariables>({
    mutationFn: async ({ workspaceId, createJobs, updateJobs }) => {
      const [createdJobs, updatedJobs] = await Promise.all([
        createJobs.length > 0
          ? createWorkspaceJobs(workspaceId, { jobs: createJobs })
          : Promise.resolve<WorkspaceJob[]>([]),
        updateJobs.length > 0
          ? updateWorkspaceJobs(workspaceId, { jobs: updateJobs })
          : Promise.resolve<WorkspaceJob[]>([]),
      ]);

      return {
        createdJobs,
        updatedJobs,
      };
    },
    onSuccess: (result, { workspaceId }) => {
      queryClient.setQueryData<WorkspaceJob[]>(QUERY_KEYS.workspace.jobs(workspaceId), previous =>
        mergeWorkspaceJobs(previous, result),
      );

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.workspace.members(workspaceId) });
    },
  });
}
