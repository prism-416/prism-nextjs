import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  AgentRun,
  AgentRunSearchParams,
  AgentRunSearchResult,
  AgentRunStepsByRunId,
  AgentStep,
  CreateFeatureProvisioningRequestPayload,
  CreateProjectPayload,
  Project,
  ProjectParticipant,
  ProjectSummary,
  ProjectWorkItem,
  ProjectWorkItemSearchParams,
  ProjectWorkItemSearchResult,
  ReorderProjectWorkItemsPayload,
  CreateProjectWorkItemPayload,
  FeatureProvisioningRequest,
  TrashedProjectWorkItemSearchResult,
  UpdateProjectPayload,
  UpdateProjectWorkItemPayload,
} from "../types";
import { getDefinedProjectWorkItemSearchParams, getEmptyProjectWorkItemSearchResult } from "../utils/work-item";

export * from "./comments";
export * from "./documents";

const AGENT_RUN_HISTORY_LIMIT = 50;

function getEmptyAgentRunSearchResult(limit = AGENT_RUN_HISTORY_LIMIT): AgentRunSearchResult {
  return {
    items: [],
    total: 0,
    limit,
    offset: 0,
  };
}

function sortAgentRunsByRecency(a: AgentRun, b: AgentRun) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export async function getProjectsByWorkspaceId(workspaceId: string) {
  const response = await commonAxios<{ workspaceId: string }, ApiResponse<ProjectSummary[]>>({
    url: "/projects",
    method: "GET",
    data: { workspaceId },
    version: null,
  });

  return response?.data ?? [];
}

export async function getProjectsByWorkspaceSlug(workspaceSlug: string) {
  const response = await commonAxios<null, ApiResponse<ProjectSummary[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceSlug)}/projects`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export const getProjects = getProjectsByWorkspaceSlug;

export async function getProjectParticipants(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectParticipant[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function getProject(projectId: string) {
  const response = await commonAxios<null, ApiResponse<Project>>({
    url: `/projects/${encodeURIComponent(projectId)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}

export async function getProjectBySlug(projectSlug: string) {
  const response = await commonAxios<null, ApiResponse<Project>>({
    url: `/projects/slugs/${encodeURIComponent(projectSlug)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}

export async function createProject(body: CreateProjectPayload) {
  const response = await commonAxios<CreateProjectPayload, ApiResponse<Project>>({
    url: "/projects",
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function updateProject(projectId: string, body: UpdateProjectPayload) {
  const response = await commonAxios<UpdateProjectPayload, ApiResponse<Project>>({
    url: `/projects/${encodeURIComponent(projectId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function deleteProject(projectId: string) {
  await commonAxios<null, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function getProjectWorkItems(projectId: string, params?: ProjectWorkItemSearchParams) {
  const searchParams = getDefinedProjectWorkItemSearchParams(params);
  const response = await commonAxios<ProjectWorkItemSearchParams | null, ApiResponse<ProjectWorkItemSearchResult>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items`,
    method: "GET",
    data: searchParams ?? null,
    version: null,
  });

  return response?.data ?? getEmptyProjectWorkItemSearchResult(searchParams);
}

export async function createProjectWorkItem(projectId: string, body: CreateProjectWorkItemPayload) {
  const response = await commonAxios<CreateProjectWorkItemPayload, ApiResponse<ProjectWorkItem>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function getProjectWorkItem(projectId: string, itemId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectWorkItem>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}

export async function updateProjectWorkItem(projectId: string, itemId: string, body: UpdateProjectWorkItemPayload) {
  const response = await commonAxios<UpdateProjectWorkItemPayload, ApiResponse<ProjectWorkItem>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function reorderProjectWorkItems(projectId: string, body: ReorderProjectWorkItemsPayload) {
  const response = await commonAxios<ReorderProjectWorkItemsPayload, ApiResponse<ProjectWorkItem[]>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/reorder`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data ?? [];
}

export async function deleteProjectWorkItem(projectId: string, itemId: string) {
  await commonAxios<null, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function getProjectWorkItemChildren(projectId: string, itemId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectWorkItem[]>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/children`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function bulkDeleteProjectWorkItems(projectId: string, itemIds: string[]) {
  await commonAxios<{ itemIds: string[] }, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/bulk-delete`,
    method: "POST",
    data: { itemIds },
    version: null,
  });
}

export async function getTrashedProjectWorkItems(projectId: string) {
  const response = await commonAxios<null, ApiResponse<TrashedProjectWorkItemSearchResult>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/trash`,
    method: "GET",
    version: null,
  });

  return response?.data ?? { items: [] };
}

export async function restoreProjectWorkItem(projectId: string, itemId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectWorkItem>>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/trash/${encodeURIComponent(itemId)}/restore`,
    method: "POST",
    version: null,
  });

  return response?.data;
}

export async function permanentlyDeleteProjectWorkItem(projectId: string, itemId: string) {
  await commonAxios<null, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/trash/${encodeURIComponent(itemId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function bulkRestoreProjectWorkItems(projectId: string, itemIds: string[]) {
  await commonAxios<{ itemIds: string[] }, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/trash/bulk-restore`,
    method: "POST",
    data: { itemIds },
    version: null,
  });
}

export async function bulkPermanentlyDeleteProjectWorkItems(projectId: string, itemIds: string[]) {
  await commonAxios<{ itemIds: string[] }, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/work-items/trash/bulk-delete`,
    method: "POST",
    data: { itemIds },
    version: null,
  });
}

export async function getWorkspaceAgentRuns(workspaceId: string, params?: AgentRunSearchParams) {
  const response = await commonAxios<AgentRunSearchParams | null, ApiResponse<AgentRunSearchResult>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/agent-runs`,
    method: "GET",
    data: params ?? null,
    version: null,
  });

  return response?.data ?? getEmptyAgentRunSearchResult(params?.limit);
}

export async function getWorkspaceAgentRunHistory(workspaceId: string) {
  const result = await getWorkspaceAgentRuns(workspaceId, {
    limit: AGENT_RUN_HISTORY_LIMIT,
    offset: 0,
  });

  return {
    ...result,
    items: [...result.items].sort(sortAgentRunsByRecency),
  } satisfies AgentRunSearchResult;
}

export async function getAgentRunSteps(workspaceId: string, runId: string) {
  const response = await commonAxios<null, ApiResponse<AgentStep[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/agent-runs/${encodeURIComponent(runId)}/steps`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function cancelAgentRun(workspaceId: string, runId: string) {
  const response = await commonAxios<null, ApiResponse<AgentRun>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/agent-runs/${encodeURIComponent(runId)}/cancel`,
    method: "POST",
    version: null,
  });

  return response?.data;
}

export async function getAgentRunStepsByRunId(workspaceId: string, runs: AgentRun[]) {
  const entries = await Promise.all(
    runs.map(async run => {
      const steps = await getAgentRunSteps(workspaceId, run.runId).catch(() => []);
      return [run.runId, steps] as const;
    }),
  );

  return Object.fromEntries(entries) as AgentRunStepsByRunId;
}

export async function requestFeatureProvisioning(workspaceId: string, body: CreateFeatureProvisioningRequestPayload) {
  const response = await commonAxios<CreateFeatureProvisioningRequestPayload, ApiResponse<FeatureProvisioningRequest>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/provision`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}
