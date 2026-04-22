// --- Workspace domain types (Prizmatic API shapes) ---

/** `GET /workspaces/{workspaceId}` response `data` */
export interface Workspace {
  workspaceId: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

/** `GET /workspaces/{workspaceId}/members` response item */
export interface WorkspaceMember {
  userId: string;
  fullName: string;
  username: string;
  role: string;
  joinedAt: string;
  invitedAt: string;
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

/** `POST /workspaces/{workspaceId}/invitations` body */
export interface CreateInvitationPayload {
  receiverId: string;
  role: string;
}

/** `POST /workspaces/invitations/accept` body */
export interface AcceptInvitationPayload {
  token: string;
}
