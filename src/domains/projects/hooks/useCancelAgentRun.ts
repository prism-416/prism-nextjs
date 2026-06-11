"use client";

import { useQueryClient } from "@tanstack/react-query";

import { cancelAgentRun } from "@/domains/projects/api";
import type { AgentRun } from "@/domains/projects/types";
import { syncAgentRunUpdated } from "@/domains/projects/utils/agent-cache";
import { QUERY_KEYS, useApiMutation } from "@/shared/query";

type CancelAgentRunVariables = {
  workspaceId: string;
  runId: string;
};

export function useCancelAgentRun() {
  const queryClient = useQueryClient();

  return useApiMutation<AgentRun, Error, CancelAgentRunVariables>({
    mutationFn: async ({ workspaceId, runId }) => {
      const run = await cancelAgentRun(workspaceId, runId);

      if (!run) {
        throw new Error("Agent run could not be cancelled.");
      }

      return run;
    },
    onSuccess: (run, { workspaceId, runId }) => {
      syncAgentRunUpdated(queryClient, run);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.agentRunSteps(workspaceId, runId) });
    },
    onSettled: (_run, _error, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project.agentRunHistory(workspaceId) });
    },
  });
}
