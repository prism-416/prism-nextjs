export type SprintStatus = "planned" | "active" | "closed";

export interface Sprint {
  sprintId: string;
  workspaceId: string;
  name: string;
  goal: string | null;
  startsAt: string;
  endsAt: string;
  status: SprintStatus;
  createdAt: string;
}

export interface CreateSprintPayload {
  name?: string;
  goal?: string;
  startsAt: string;
  endsAt: string;
}

export type UpdateSprintPayload = Partial<CreateSprintPayload>;

export type SprintWorkItemPriority = "low" | "medium" | "high" | "urgent";

export type SprintWorkItemStatus = "todo" | "in_progress" | "in_review" | "done" | "archived";

export interface SprintWorkItem {
  itemId: string;
  workspaceId: string;
  projectId: string;
  parentId: string | null;
  /** Human-readable, unique work item code, e.g. "PRSM-001". */
  code: string;
  title: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  priority: SprintWorkItemPriority;
  status: SprintWorkItemStatus;
  statusChangedAt: string;
  createdAt: string;
  assigneeUsernames: string[];
  labelNames: string[];
}

export interface SprintWorkItemSearchParams {
  query?: string;
  parentId?: string;
  priority?: SprintWorkItemPriority;
  status?: SprintWorkItemStatus;
  assigneeUsername?: string;
  labelName?: string;
  limit?: number;
  offset?: number;
}

export interface SprintWorkItemSearchResult {
  items: SprintWorkItem[];
  total: number;
  limit: number;
  offset: number;
}
