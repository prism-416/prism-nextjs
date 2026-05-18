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
  workspaceSlug: string;
  name: string;
  description?: string;
}

export interface ProjectJob {
  jobId: string;
  workspaceId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface ProjectAssignableMember {
  userId: string;
  fullName: string;
  username: string;
}

export interface CreateProjectMemberSelection extends ProjectAssignableMember {
  jobIds: string[];
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

export type ProjectWorkItemType = "epic" | "story" | "task";

export type ProjectWorkItemPriority = "low" | "medium" | "high" | "urgent";

export type ProjectWorkItemStatus = "todo" | "in_progress" | "in_review" | "done";

export interface ProjectWorkItem {
  itemId: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string;
  type: ProjectWorkItemType;
  priority: ProjectWorkItemPriority;
  status: ProjectWorkItemStatus;
  statusChangedAt: string;
  createdAt: string;
  assigneeUsernames: string[];
  labelNames: string[];
}

export interface ProjectWorkItemSearchParams {
  query?: string;
  parentId?: string;
  type?: ProjectWorkItemType;
  priority?: ProjectWorkItemPriority;
  status?: ProjectWorkItemStatus;
  assigneeUsername?: string;
  labelName?: string;
  limit?: number;
  offset?: number;
}

export interface ProjectWorkItemSearchResult {
  items: ProjectWorkItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateProjectWorkItemPayload {
  parentId?: string;
  title: string;
  description: string;
  type: ProjectWorkItemType;
  priority?: ProjectWorkItemPriority;
  assigneeUsernames?: string[];
  labelNames?: string[];
}

export interface UpdateProjectWorkItemPayload {
  parentId?: string | null;
  title?: string;
  description?: string;
  type?: ProjectWorkItemType;
  priority?: ProjectWorkItemPriority;
  status?: ProjectWorkItemStatus;
  assigneeUsernames?: string[];
  labelNames?: string[];
}

export interface ProjectWorkItemComment {
  commentId: string;
  projectId: string;
  itemId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectWorkItemCommentSearchParams {
  limit?: number;
  offset?: number;
}

export interface ProjectWorkItemCommentSearchResult {
  comments: ProjectWorkItemComment[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateProjectWorkItemCommentPayload {
  body: string;
}

export type ProjectSprintStatus = "backlog" | "in_progress" | "done";

export interface ProjectSprint {
  sprintId: string;
  projectId: string;
  name: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  status: ProjectSprintStatus;
  createdAt: string;
}

export interface CreateProjectSprintPayload {
  name: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  status?: ProjectSprintStatus;
}

export interface UpdateProjectSprintPayload {
  name?: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  status?: ProjectSprintStatus;
}
