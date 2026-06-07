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
  jobIds: string[];
  jobNames: string[];
  joinedAt: string | null;
}

/** `GET /workspaces/{workspaceId}/jobs` response item */
export interface WorkspaceJob {
  jobId: string;
  workspaceId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export type InvitationRole = "admin" | "member" | "viewer";

export type WorkspaceMemberCandidateKind = "existing" | "external";

export type WorkspaceMemberCandidateSearchReason = "success" | "self" | "already_member" | "no_results";
export type WorkspaceInvitationStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";

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
  description?: string;
}

/** `POST /workspaces/{workspaceId}/jobs` body item */
export interface CreateWorkspaceJobPayload {
  name: string;
  description: string | null;
}

/** `POST /workspaces/{workspaceId}/jobs` body */
export interface CreateWorkspaceJobsPayload {
  jobs: CreateWorkspaceJobPayload[];
}

/** `PATCH /workspaces/{workspaceId}/jobs` body item */
export interface UpdateWorkspaceJobPayload {
  jobId: string;
  name: string;
  description: string | null;
}

/** `PATCH /workspaces/{workspaceId}/jobs` body */
export interface UpdateWorkspaceJobsPayload {
  jobs: UpdateWorkspaceJobPayload[];
}

/** `PUT /workspaces/{workspaceId}/members/{userId}/role` body */
export interface UpdateWorkspaceMemberRolePayload {
  role: InvitationRole;
}

/** `PUT /workspaces/{workspaceId}/members/{userId}/jobs` body */
export interface UpdateWorkspaceMemberJobsPayload {
  jobIds: string[];
}

/** `PUT /workspaces/{workspaceId}/owner` body */
export interface TransferWorkspaceOwnerPayload {
  ownerId: string;
}

/** `POST /workspaces/{workspaceId}/invitations` body */
export interface CreateInvitationPayload {
  receiverId?: string;
  email?: string;
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
  receiverId: string | null;
  receiverEmail: string;
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
  requiresSignup: boolean;
}

export type GithubRepositoryVisibility = "public" | "private" | "internal";

export interface WorkspaceRepositoryLink {
  linkId: string;
  workspaceId: string;
  githubInstallationId: string;
  githubRepositoryId: string;
  repositoryOwner: string;
  repositoryName: string;
  repositoryFullName: string;
  repositoryUrl: string;
  defaultBranch: string | null;
  visibility: GithubRepositoryVisibility | null;
  connectedByUserId: string | null;
  connectedAt: string;
}

export interface GithubInstallationAuthorization {
  authorizationUrl: string;
  state: string;
  expiresAt: string;
}

export interface GithubRepositoryOption {
  githubRepositoryId: string;
  nodeId: string | null;
  owner: string;
  name: string;
  fullName: string;
  htmlUrl: string;
  defaultBranch: string | null;
  visibility: GithubRepositoryVisibility | null;
  private: boolean;
  archived: boolean;
}

export interface CreateWorkspaceRepositoryLinkPayload {
  githubInstallationId: string;
  githubRepositoryId: string;
}

export * from "./notification";
