"use client";

import { getAgentRunSteps } from "@/domains/projects/api";
import type { AgentStep } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const LIVE_STEPS_POLL_INTERVAL_MS = 5_000;

export function useAgentRunSteps(
  workspaceId: string,
  runId: string,
  initialData?: AgentStep[],
  options?: { isLive?: boolean },
) {
  return useApiQuery<AgentStep[]>({
    queryKey: QUERY_KEYS.project.agentRunSteps(workspaceId, runId),
    queryFn: () => getAgentRunSteps(workspaceId, runId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 1000,
    refetchInterval: options?.isLive ? LIVE_STEPS_POLL_INTERVAL_MS : false,
  });
}
