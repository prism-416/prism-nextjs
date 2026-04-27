import { commonAxios } from "@/shared/http/common-axios";
import type { ApiResponse } from "@/shared/types/api";

import type {
  AcceptInvitationPayload,
  CreateInvitationPayload,
  CreateWorkspacePayload,
  SearchWorkspaceMemberCandidatesPayload,
  UpdateWorkspacePayload,
  Workspace,
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
  const response = await commonAxios<CreateInvitationPayload, ApiResponse<unknown>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/invitations`,
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}

export async function acceptInvitation(body: AcceptInvitationPayload) {
  const response = await commonAxios<AcceptInvitationPayload, ApiResponse<unknown>>({
    url: "/workspaces/invitations/accept",
    method: "POST",
    data: body,
    version: null,
  });

  return response?.data;
}
