export interface ProjectSummary {
  projectId: string;
  workspaceId: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export type Project = ProjectSummary;

export interface CreateProjectPayload {
  workspaceSlug: string;
  name: string;
  description?: string;
}

export interface ProjectParticipant {
  userId: string;
  fullName: string;
  username: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
}

export type ProjectWorkItemPriority = "low" | "medium" | "high" | "urgent";

export type ProjectWorkItemStatus = "todo" | "in_progress" | "in_review" | "done" | "archived";

export interface ProjectWorkItem {
  itemId: string;
  workspaceId: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  priority: ProjectWorkItemPriority;
  status: ProjectWorkItemStatus;
  sortOrder: number;
  statusChangedAt: string;
  createdAt: string;
  assigneeUsernames: string[];
  labelNames: string[];
}

export interface ProjectWorkItemSearchParams {
  query?: string;
  parentId?: string;
  topLevel?: boolean;
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
  startDate?: string | null;
  dueDate?: string | null;
  priority?: ProjectWorkItemPriority;
  status?: ProjectWorkItemStatus;
  assigneeUsernames?: string[];
  labelNames?: string[];
}

export interface UpdateProjectWorkItemPayload {
  parentId?: string | null;
  title?: string;
  description?: string;
  startDate?: string | null;
  dueDate?: string | null;
  priority?: ProjectWorkItemPriority;
  status?: ProjectWorkItemStatus;
  assigneeUsernames?: string[];
  labelNames?: string[];
}

export interface ReorderProjectWorkItemsPayload {
  items: Array<{
    itemId: string;
    status: ProjectWorkItemStatus;
    sortOrder: number;
  }>;
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
