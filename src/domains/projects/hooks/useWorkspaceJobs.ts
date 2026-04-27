"use client";

import { getWorkspaceJobs } from "@/domains/projects/api";
import type { ProjectJob } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_WORKSPACE_ID = "__missing_workspace__";

export function useWorkspaceJobs(workspaceId?: string) {
  return useApiQuery<ProjectJob[]>({
    queryKey: QUERY_KEYS.project.workspaceJobs(workspaceId ?? MISSING_WORKSPACE_ID),
    queryFn: () => (workspaceId ? getWorkspaceJobs(workspaceId) : Promise.resolve([])),
    enabled: Boolean(workspaceId),
    staleTime: 5 * 60 * 1000,
  });
}
