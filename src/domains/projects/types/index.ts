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

export interface TrashedProjectWorkItem extends ProjectWorkItem {
  deletedAt: string;
  descendantCount: number;
}

export interface TrashedProjectWorkItemSearchResult {
  items: TrashedProjectWorkItem[];
}

export interface ProjectWorkItemComment {
  commentId: string;
  projectId: string;
  itemId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
  updatedAt: string | null;
  attachments?: ProjectDocument[];
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
  files?: File[];
}

export interface UpdateProjectWorkItemCommentPayload {
  body: string;
}

export interface ProjectDocument {
  documentId: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string | null;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  storageETag: string | null;
  storageVersionId: string | null;
  sourceKind: "direct" | "work_item";
  sourceWorkItemId: string | null;
  sourceWorkItemIdSnapshot: string | null;
  sourceWorkItemTitle: string | null;
  sourceWorkItemTitleSnapshot: string | null;
  sourceCommentId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectDocumentSourceFilter = "direct" | "work_item";

export interface ProjectDocumentSourceGroup {
  kind: ProjectDocumentSourceFilter;
  workItemId: string | null;
  workItemIdSnapshot: string | null;
  title: string;
  count: number;
}

export interface ProjectDocumentSearchParams {
  query?: string;
  workItemId?: string;
  source?: ProjectDocumentSourceFilter;
  limit?: number;
  offset?: number;
}

export interface ProjectDocumentSearchResult {
  items: ProjectDocument[];
  total: number;
  limit: number;
  offset: number;
  groups: ProjectDocumentSourceGroup[];
}

export interface UploadProjectDocumentPayload {
  file: File;
  title?: string;
  description?: string;
  workItemId?: string;
  commentId?: string;
}

export type AgentRunStatus = "queued" | "running" | "waiting" | "completed" | "failed" | "cancelled";

export type AgentRunTriggerType = "manual" | "event" | "scheduled" | "webhook" | "recursive";

export interface AgentRun {
  runId: string;
  workspaceId: string;
  triggeredByUserId: string | null;
  workItemId: string | null;
  parentRunId: string | null;
  agentType: string;
  triggerType: AgentRunTriggerType;
  status: AgentRunStatus;
  objective: string;
  systemPromptVersion: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface AgentRunSearchParams {
  status?: AgentRunStatus;
  agentType?: string;
  workItemId?: string;
  limit?: number;
  offset?: number;
}

export interface AgentRunSearchResult {
  items: AgentRun[];
  total: number;
  limit: number;
  offset: number;
}

export type AgentStepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export interface AgentStep {
  stepId: string;
  runId: string;
  stepOrder: number;
  stepType: string;
  status: AgentStepStatus;
  title: string;
  inputObjectName: string | null;
  outputObjectName: string | null;
  inputSummary: string | null;
  outputSummary: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export type AgentRunStepsByRunId = Record<string, AgentStep[]>;

export type FeatureProvisioningRequestStatus = "pending" | "queued" | "dispatch_failed";

export interface FeatureProvisioningRequest {
  requestId: string;
  workspaceId: string;
  projectId: string;
  requestedByUserId: string | null;
  status: FeatureProvisioningRequestStatus;
  payloadObjectName: string;
  payloadVersionId: string | null;
  queueMessageId: string | null;
  errorMessage: string | null;
  dispatchedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureProvisioningRequestPayload {
  projectId: string;
  featureSpecification: string;
}
