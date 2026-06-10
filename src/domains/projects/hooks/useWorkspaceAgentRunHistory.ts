"use client";

import { getWorkspaceAgentRunHistory } from "@/domains/projects/api";
import type { AgentRunSearchResult } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useWorkspaceAgentRunHistory(workspaceId: string, initialData?: AgentRunSearchResult) {
  return useApiQuery<AgentRunSearchResult>({
    queryKey: QUERY_KEYS.project.agentRunHistory(workspaceId),
    queryFn: () => getWorkspaceAgentRunHistory(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 1000,
  });
}
