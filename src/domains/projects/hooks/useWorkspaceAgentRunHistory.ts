"use client";

import { getWorkspaceAgentRunHistory } from "@/domains/projects/api";
import type { AgentRunSearchResult } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const ACTIVE_RUN_STATUSES = new Set(["queued", "running", "waiting"]);
const ACTIVE_RUN_POLL_INTERVAL_MS = 5_000;

export function useWorkspaceAgentRunHistory(workspaceId: string, initialData?: AgentRunSearchResult) {
  return useApiQuery<AgentRunSearchResult>({
    queryKey: QUERY_KEYS.project.agentRunHistory(workspaceId),
    queryFn: () => getWorkspaceAgentRunHistory(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 1000,
    // Realtime updates drive the UI, but a missed websocket event must not
    // leave a finished run looking active forever: poll while anything runs.
    refetchInterval: query => {
      const items = query.state.data?.items ?? [];
      return items.some(run => ACTIVE_RUN_STATUSES.has(run.status)) ? ACTIVE_RUN_POLL_INTERVAL_MS : false;
    },
  });
}
