"use client";

import { getWorkspaceProjectJobs } from "@/domains/workspaces/api";
import type { WorkspaceProjectJob } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useWorkspaceProjectJobs(workspaceId: string, initialData?: WorkspaceProjectJob[]) {
  return useApiQuery<WorkspaceProjectJob[]>({
    queryKey: QUERY_KEYS.workspace.projectJobs(workspaceId),
    queryFn: () => getWorkspaceProjectJobs(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
