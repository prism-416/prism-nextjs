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
}

export type InvitationRole = "admin" | "member" | "viewer";

export type WorkspaceMemberCandidateKind = "existing" | "external";

export type WorkspaceMemberCandidateSearchReason = "success" | "self" | "already_member" | "no_results";
export type WorkspaceInvitationStatus = "pending" | "accepted" | "declined" | "expired";

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

/** `GET /workspaces/invitations` query */
export interface GetWorkspaceInvitationPayload {
  token: string;
}

/** `POST /workspaces/{workspaceId}/invitations` response `data` */
export interface WorkspaceInvitation {
  invitationId: string;
  workspaceId: string;
  senderId: string;
  receiverId: string;
  role: InvitationRole;
  expiresAt: string;
  token: string;
  invitationLink: string;
}

/** `POST /workspaces/invitations/accept` body */
export interface AcceptInvitationPayload {
  token: string;
}

/** `POST /workspaces/invitations/decline` body */
export interface DeclineInvitationPayload {
  token: string;
}

/** `GET /workspaces/invitations` response `data` */
export interface WorkspaceInvitationPreview {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  role: InvitationRole;
  expiresAt: string;
  status: WorkspaceInvitationStatus;
}
