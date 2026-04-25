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
  return commonAxios<null, ApiResponse<Workspace[]>>({
    url: "/workspaces",
    method: "GET",
    version: null,
  });
}

export async function getWorkspaceById(workspaceId: string) {
  return commonAxios<null, ApiResponse<Workspace>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}`,
    method: "GET",
    version: null,
  });
}

export async function createWorkspace(body: CreateWorkspacePayload) {
  return commonAxios<CreateWorkspacePayload, ApiResponse<Workspace>>({
    url: "/workspaces",
    method: "POST",
    data: body,
    version: null,
  });
}

export async function updateWorkspace(workspaceId: string, body: UpdateWorkspacePayload) {
  return commonAxios<UpdateWorkspacePayload, ApiResponse<Workspace>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}`,
    method: "PATCH",
    data: body,
    version: null,
  });
}

export async function getWorkspaceMembers(workspaceId: string) {
  return commonAxios<null, ApiResponse<WorkspaceMember[]>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/members`,
    method: "GET",
    version: null,
  });
}

export async function searchWorkspaceMemberCandidates(query: SearchWorkspaceMemberCandidatesPayload) {
  return commonAxios<SearchWorkspaceMemberCandidatesPayload, ApiResponse<WorkspaceMemberCandidateSearchResult>>({
    url: "/workspaces/member-candidates",
    method: "GET",
    data: query,
    version: null,
  });
}

export async function createInvitation(workspaceId: string, body: CreateInvitationPayload) {
  return commonAxios<CreateInvitationPayload, ApiResponse<unknown>>({
    url: `/workspaces/${encodeURIComponent(workspaceId)}/invitations`,
    method: "POST",
    data: body,
    version: null,
  });
}

export async function acceptInvitation(body: AcceptInvitationPayload) {
  return commonAxios<AcceptInvitationPayload, ApiResponse<unknown>>({
    url: "/workspaces/invitations/accept",
    method: "POST",
    data: body,
    version: null,
  });
}
