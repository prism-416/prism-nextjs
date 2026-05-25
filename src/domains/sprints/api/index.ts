import type {
  CreateSprintPayload,
  Sprint,
  SprintWorkItemSearchParams,
  SprintWorkItemSearchResult,
  UpdateSprintPayload,
} from "@/domains/sprints/types";
import {
  getDefinedSprintWorkItemSearchParams,
  getEmptySprintWorkItemSearchResult,
} from "@/domains/sprints/utils/sprint";
import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

export async function getWorkspaceSprints(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<Sprint[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/sprints`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function createWorkspaceSprint(workspaceId: string, body: CreateSprintPayload) {
  const response = await commonAxios<CreateSprintPayload, ApiResponse<Sprint>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/sprints`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function getWorkspaceSprint(workspaceId: string, sprintId: string) {
  const response = await commonAxios<null, ApiResponse<Sprint>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/sprints/${encodeURIComponent(sprintId)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}

export async function updateWorkspaceSprint(workspaceId: string, sprintId: string, body: UpdateSprintPayload) {
  const response = await commonAxios<UpdateSprintPayload, ApiResponse<Sprint>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/sprints/${encodeURIComponent(sprintId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function deleteWorkspaceSprint(workspaceId: string, sprintId: string) {
  await commonAxios<null, unknown>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/sprints/${encodeURIComponent(sprintId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function getWorkspaceSprintWorkItems(
  workspaceId: string,
  sprintId: string,
  params?: SprintWorkItemSearchParams,
) {
  const searchParams = getDefinedSprintWorkItemSearchParams(params);
  const response = await commonAxios<SprintWorkItemSearchParams | null, ApiResponse<SprintWorkItemSearchResult>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/sprints/${encodeURIComponent(sprintId)}/work-items`,
    method: "GET",
    data: searchParams ?? null,
    version: null,
  });

  return response?.data ?? getEmptySprintWorkItemSearchResult(searchParams);
}
