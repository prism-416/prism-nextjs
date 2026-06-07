"use client";

import { getWorkspaceRepositories } from "@/domains/workspaces/api";
import type { WorkspaceRepositoryLink } from "@/domains/workspaces/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useWorkspaceRepositories(workspaceId: string) {
  return useApiQuery<WorkspaceRepositoryLink[]>({
    queryKey: QUERY_KEYS.workspace.repositories(workspaceId),
    queryFn: () => getWorkspaceRepositories(workspaceId),
    staleTime: 60 * 1000,
  });
}
