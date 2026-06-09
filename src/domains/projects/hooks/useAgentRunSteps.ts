"use client";

import { getAgentRunSteps } from "@/domains/projects/api";
import type { AgentStep } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

export function useAgentRunSteps(workspaceId: string, runId: string, initialData?: AgentStep[]) {
  return useApiQuery<AgentStep[]>({
    queryKey: QUERY_KEYS.project.agentRunSteps(workspaceId, runId),
    queryFn: () => getAgentRunSteps(workspaceId, runId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 1000,
  });
}
