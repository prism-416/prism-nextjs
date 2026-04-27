// --- Workspace domain types (Prizmatic API shapes) ---

/** `GET /workspaces/{workspaceId}` response `data` */
export interface Workspace {
  workspaceId: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  memberCount?: number;
  projectCount?: number;
}

/** `GET /workspaces/{workspaceId}/members` response item */
export interface WorkspaceMember {
  userId: string;
  fullName: string;
  username: string;
  role: InvitationRole;
  joinedAt: string | null;
  invitedAt: string | null;
}

export type InvitationRole = "admin" | "member" | "viewer";

export type WorkspaceMemberCandidateKind = "existing" | "external";

export type WorkspaceMemberCandidateSearchReason = "success" | "self" | "already_member" | "no_results";

export interface WorkspaceInvitationRoleOption {
  value: InvitationRole;
  label: string;
  description: string;
}

/** `GET /workspaces/members/search` response item */
export interface WorkspaceMemberCandidate {
  kind: WorkspaceMemberCandidateKind;
  userId: string | null;
  email: string;
  fullName: string | null;
  username: string | null;
}

export type InviteMember = WorkspaceMemberCandidate & {
  role: InvitationRole;
};

/** `GET /workspaces/members/search` response `data` */
export interface WorkspaceMemberCandidateSearchResult {
  reason: WorkspaceMemberCandidateSearchReason;
  items: WorkspaceMemberCandidate[];
}

/** `GET /workspaces/members/search` query */
export interface SearchWorkspaceMemberCandidatesPayload {
  keyword: string;
  workspaceId?: string;
}

/** `POST /workspaces` body */
export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}

/** `PATCH /workspaces/{workspaceId}` body */
export interface UpdateWorkspacePayload {
  name?: string;
  description?: string | null;
}

/** `POST /workspaces/{workspaceId}/invitations` body */
export interface CreateInvitationPayload {
  receiverId: string;
  role: InvitationRole;
}

/** `POST /workspaces/invitations/accept` body */
export interface AcceptInvitationPayload {
  token: string;
}
