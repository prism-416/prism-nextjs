import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  AcceptInvitationPayload,
  CreateInvitationPayload,
  CreateWorkspaceJobsPayload,
  CreateWorkspacePayload,
  DeclineInvitationPayload,
  GetWorkspaceInvitationPayload,
  SearchWorkspaceMemberCandidatesPayload,
  TransferWorkspaceOwnerPayload,
  UpdateWorkspaceJobsPayload,
  UpdateWorkspaceMemberRolePayload,
  UpdateWorkspaceMemberJobsPayload,
  UpdateWorkspacePayload,
  Workspace,
  WorkspaceInvitation,
  WorkspaceInvitationPreview,
  WorkspaceJob,
  WorkspaceMemberCandidateSearchResult,
  WorkspaceMember,
} from "../types";

export async function getWorkspaces() {
  const response = await commonAxios<null, ApiResponse<Workspace[]>>({
    url: "/workspaces",
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function getWorkspaceById(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<Workspace>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}`,
    method: "GET",
    version: null,
  });

  return response?.data;
}

export async function getWorkspaceBySlug(workspaceSlug: string) {
  const workspaces = await getWorkspaces();

  return workspaces.find(workspace => workspace.slug === workspaceSlug);
}

export async function createWorkspace(body: CreateWorkspacePayload) {
  const response = await commonAxios<CreateWorkspacePayload, ApiResponse<Workspace>>({
    url: "/workspaces",
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function updateWorkspace(workspaceId: string, body: UpdateWorkspacePayload) {
  const response = await commonAxios<UpdateWorkspacePayload, ApiResponse<Workspace>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function deleteWorkspace(workspaceId: string) {
  await commonAxios<null, ApiResponse<null>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function getWorkspaceMembers(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<WorkspaceMember[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function getWorkspaceJobs(workspaceId: string) {
  const response = await commonAxios<null, ApiResponse<WorkspaceJob[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/jobs`,
    method: "GET",
    version: null,
  });

  return response?.data ?? [];
}

export async function createWorkspaceJobs(workspaceId: string, body: CreateWorkspaceJobsPayload) {
  const response = await commonAxios<CreateWorkspaceJobsPayload, ApiResponse<WorkspaceJob[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/jobs`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data ?? [];
}

export async function updateWorkspaceJobs(workspaceId: string, body: UpdateWorkspaceJobsPayload) {
  const response = await commonAxios<UpdateWorkspaceJobsPayload, ApiResponse<WorkspaceJob[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/jobs`,
    method: "PATCH",
    data: body,
    version: null,
  });

  return response?.data ?? [];
}

export async function deleteWorkspaceJob(workspaceId: string, jobId: string) {
  await commonAxios<null, ApiResponse<null>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/jobs/${encodeURIComponent(jobId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function removeWorkspaceMember(workspaceId: string, userId: string) {
  await commonAxios<null, ApiResponse<null>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
    method: "DELETE",
    version: null,
  });
}

export async function updateWorkspaceMemberRole(
  workspaceId: string,
  userId: string,
  body: UpdateWorkspaceMemberRolePayload,
) {
  const response = await commonAxios<UpdateWorkspaceMemberRolePayload, ApiResponse<WorkspaceMember>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}/role`,
    method: "PUT",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function updateWorkspaceMemberJobs(
  workspaceId: string,
  userId: string,
  body: UpdateWorkspaceMemberJobsPayload,
) {
  const response = await commonAxios<UpdateWorkspaceMemberJobsPayload, ApiResponse<WorkspaceMember>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}/jobs`,
    method: "PUT",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function transferWorkspaceOwner(workspaceId: string, body: TransferWorkspaceOwnerPayload) {
  const response = await commonAxios<TransferWorkspaceOwnerPayload, ApiResponse<Workspace>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/owner`,
    method: "PUT",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function searchWorkspaceMemberCandidates(query: SearchWorkspaceMemberCandidatesPayload) {
  const response = await commonAxios<
    SearchWorkspaceMemberCandidatesPayload,
    ApiResponse<WorkspaceMemberCandidateSearchResult>
  >({
    url: "/workspaces/members/search",
    method: "GET",
    data: query,
    version: null,
  });

  return response?.data;
}

export async function createInvitation(workspaceId: string, body: CreateInvitationPayload) {
  const response = await commonAxios<CreateInvitationPayload, ApiResponse<WorkspaceInvitation>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/invitations`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function getWorkspaceInvitation(query: GetWorkspaceInvitationPayload) {
  const response = await commonAxios<GetWorkspaceInvitationPayload, ApiResponse<WorkspaceInvitationPreview>>({
    url: "/workspaces/invitations",
    method: "GET",
    data: query,
    version: null,
  });

  return response?.data;
}

export async function acceptInvitation(body: AcceptInvitationPayload) {
  const response = await commonAxios<AcceptInvitationPayload, ApiResponse<Workspace>>({
    url: "/workspaces/invitations/accept",
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function declineInvitation(body: DeclineInvitationPayload) {
  await commonAxios<DeclineInvitationPayload, ApiResponse<null>>({
    url: "/workspaces/invitations/decline",
    method: "POST",
    data: body,
    version: null,
  });
}
