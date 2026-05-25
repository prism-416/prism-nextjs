"use client";

import { getWorkspaceJobs } from "@/domains/workspaces/api";
import type { WorkspaceJob } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useWorkspaceJobs(workspaceId: string, initialData?: WorkspaceJob[]) {
  return useApiQuery<WorkspaceJob[]>({
    queryKey: QUERY_KEYS.workspace.jobs(workspaceId),
    queryFn: () => getWorkspaceJobs(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
