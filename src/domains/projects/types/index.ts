export interface ProjectSummary {
  projectId: string;
  workspaceId: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Project extends ProjectSummary {
  timezone: string;
  locale: string;
}

export interface CreateProjectPayload {
  workspaceId: string;
  name: string;
  description?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  timezone?: string;
  locale?: string;
}

export interface ProjectMemberListItem {
  memberId: string;
  workspaceId: string;
  projectId: string;
  userId: string;
  fullName: string;
  username: string;
  jobNames: string[];
  assignedAt: string;
}

export interface ProjectMember {
  memberId: string;
  workspaceId: string;
  projectId: string;
  userId: string;
  jobIds: string[];
  assignedAt: string;
}

export interface UpsertProjectMemberPayload {
  userId: string;
  jobIds: string[];
}

export interface UpsertProjectMembersPayload {
  members: UpsertProjectMemberPayload[];
}
