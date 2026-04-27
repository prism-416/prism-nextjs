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
  UpdateProjectPayload,
  UpsertProjectMembersPayload,
} from "../types";

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
    url: `/projects/workspaces/${encodeURIComponent(workspaceSlug)}`,
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

export async function getProjectByWorkspaceSlug(workspaceSlug: string, projectSlug: string) {
  const response = await commonAxios<null, ApiResponse<Project>>({
    url: `/projects/workspaces/${encodeURIComponent(workspaceSlug)}/${encodeURIComponent(projectSlug)}`,
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
