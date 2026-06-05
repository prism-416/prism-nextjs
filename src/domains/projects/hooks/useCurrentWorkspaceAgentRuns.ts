"use client";

import { getCurrentWorkspaceAgentRuns } from "@/domains/projects/api";
import type { AgentRunSearchResult } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useCurrentWorkspaceAgentRuns(workspaceId: string, initialData?: AgentRunSearchResult) {
  return useApiQuery<AgentRunSearchResult>({
    queryKey: QUERY_KEYS.project.currentAgentRuns(workspaceId),
    queryFn: () => getCurrentWorkspaceAgentRuns(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
}
