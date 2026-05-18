import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  CreateProjectPayload,
  ProjectAssignableMember,
  ProjectJob,
  Project,
  ProjectMember,
  ProjectMemberListItem,
  ProjectSummary,
  ProjectSprint,
  ProjectWorkItem,
  ProjectWorkItemSearchParams,
  ProjectWorkItemSearchResult,
  CreateProjectSprintPayload,
  CreateProjectWorkItemPayload,
  UpdateProjectPayload,
  UpdateProjectSprintPayload,
  UpdateProjectWorkItemPayload,
  UpsertProjectMembersPayload,
} from "../types";
import { getDefinedProjectWorkItemSearchParams, getEmptyProjectWorkItemSearchResult } from "../utils/work-item";

export * from "./comments";

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

export async function getProjectAssignableMembers(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectAssignableMember[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function getWorkspaceJobs(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectJob[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/jobs`,
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

export async function getProjectMembers(projectId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectMemberListItem[]>>({
    url: `/projects/${encodeURIComponent(projectId)}/members`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function upsertProjectMembers(projectId: string, body: UpsertProjectMembersPayload) {
  const response = await commonAxios<UpsertProjectMembersPayload, ApiResponse<ProjectMember[]>>({
    url: `/projects/${encodeURIComponent(projectId)}/members`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data ?? [];
}

export async function removeProjectMember(projectId: string, memberId: string) {
  await commonAxios<null, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/members/${encodeURIComponent(memberId)}`,
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

export async function getProjectSprints(projectId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectSprint[]>>({
    url: `/projects/${encodeURIComponent(projectId)}/sprints`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function createProjectSprint(projectId: string, body: CreateProjectSprintPayload) {
  const response = await commonAxios<CreateProjectSprintPayload, ApiResponse<ProjectSprint>>({
    url: `/projects/${encodeURIComponent(projectId)}/sprints`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function getProjectSprint(projectId: string, sprintId: string) {
  const response = await commonAxios<null, ApiResponse<ProjectSprint>>({
    url: `/projects/${encodeURIComponent(projectId)}/sprints/${encodeURIComponent(sprintId)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}

export async function updateProjectSprint(projectId: string, sprintId: string, body: UpdateProjectSprintPayload) {
  const response = await commonAxios<UpdateProjectSprintPayload, ApiResponse<ProjectSprint>>({
    url: `/projects/${encodeURIComponent(projectId)}/sprints/${encodeURIComponent(sprintId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function deleteProjectSprint(projectId: string, sprintId: string) {
  await commonAxios<null, unknown>({
    url: `/projects/${encodeURIComponent(projectId)}/sprints/${encodeURIComponent(sprintId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function getProjectSprintWorkItems(
  projectId: string,
  sprintId: string,
  params?: ProjectWorkItemSearchParams,
) {
  const searchParams = getDefinedProjectWorkItemSearchParams(params);
  const response = await commonAxios<ProjectWorkItemSearchParams | null, ApiResponse<ProjectWorkItemSearchResult>>({
    url: `/projects/${encodeURIComponent(projectId)}/sprints/${encodeURIComponent(sprintId)}/work-items`,
    method: "GET",
    data: searchParams ?? null,
    version: null,
  });

  return response?.data ?? getEmptyProjectWorkItemSearchResult(searchParams);
}
