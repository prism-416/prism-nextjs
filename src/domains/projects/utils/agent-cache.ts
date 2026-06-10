import type { QueryClient } from "@tanstack/react-query";

import type { AgentRun, AgentRunSearchResult, AgentStep } from "@/domains/projects/types";
import type { AgentStepRealtimePayload } from "@/domains/projects/types/agent-realtime";
import { QUERY_KEYS } from "@/shared/query";

const AGENT_RUN_HISTORY_LIMIT = 50;

function sortAgentRunsByRecency(a: AgentRun, b: AgentRun) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function sortAgentStepsByOrder(a: AgentStep, b: AgentStep) {
  if (a.stepOrder !== b.stepOrder) {
    return a.stepOrder - b.stepOrder;
  }

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

function getEmptyAgentRunSearchResult(limit = AGENT_RUN_HISTORY_LIMIT): AgentRunSearchResult {
  return {
    items: [],
    total: 0,
    limit,
    offset: 0,
  };
}

function upsertAgentRunHistory(previous: AgentRunSearchResult | undefined, run: AgentRun) {
  const base = previous ?? getEmptyAgentRunSearchResult();
  const runsById = new Map(base.items.map(item => [item.runId, item]));

  runsById.set(run.runId, run);

  const items = Array.from(runsById.values()).sort(sortAgentRunsByRecency).slice(0, base.limit);

  return {
    ...base,
    items,
    total: items.length,
  } satisfies AgentRunSearchResult;
}

function toAgentStep(payload: AgentStepRealtimePayload): AgentStep {
  return {
    stepId: payload.stepId,
    runId: payload.runId,
    stepOrder: payload.stepOrder,
    stepType: payload.stepType,
    status: payload.status,
    title: payload.title,
    inputObjectName: payload.inputObjectName,
    outputObjectName: payload.outputObjectName,
    inputSummary: payload.inputSummary,
    outputSummary: payload.outputSummary,
    errorMessage: payload.errorMessage,
    startedAt: payload.startedAt,
    completedAt: payload.completedAt,
    createdAt: payload.createdAt,
  };
}

export function syncAgentRunCreated(queryClient: QueryClient, run: AgentRun) {
  queryClient.setQueryData<AgentRunSearchResult>(QUERY_KEYS.project.agentRunHistory(run.workspaceId), previous =>
    upsertAgentRunHistory(previous, run),
  );
}

export function syncAgentRunUpdated(queryClient: QueryClient, run: AgentRun) {
  queryClient.setQueryData<AgentRunSearchResult>(QUERY_KEYS.project.agentRunHistory(run.workspaceId), previous =>
    upsertAgentRunHistory(previous, run),
  );
}

export function syncAgentStepUpserted(
  queryClient: QueryClient,
  workspaceId: string,
  payload: AgentStepRealtimePayload,
) {
  const step = toAgentStep(payload);

  queryClient.setQueryData<AgentStep[]>(QUERY_KEYS.project.agentRunSteps(workspaceId, step.runId), previous => {
    const stepsById = new Map((previous ?? []).map(item => [item.stepId, item]));

    stepsById.set(step.stepId, step);

    return Array.from(stepsById.values()).sort(sortAgentStepsByOrder);
  });
}
