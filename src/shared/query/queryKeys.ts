/**
 * Centralized Query Key Factory
 *
 * Usage:
 * - QUERY_KEYS.user.detail()
 * - QUERY_KEYS.product.list({ category: 'something' })
 */

export const QUERY_KEYS = {
  auth: {
    all: ["auth"] as const,
    me: () => [...QUERY_KEYS.auth.all, "me"] as const,
  },
  workspace: {
    all: ["workspace"] as const,
    list: () => ["workspace", "list"] as const,
    detail: (id: string) => ["workspace", "detail", id] as const,
    members: (id: string) => ["workspace", "members", id] as const,
    jobs: (id: string) => ["workspace", "jobs", id] as const,
    sprints: (id: string) => [...QUERY_KEYS.workspace.detail(id), "sprints"] as const,
    sprintDetail: (id: string, sprintId: string) => [...QUERY_KEYS.workspace.sprints(id), "detail", sprintId] as const,
    sprintWorkItems: (id: string, sprintId: string, filters?: object) =>
      [...QUERY_KEYS.workspace.sprintDetail(id, sprintId), "work-items", filters ?? {}] as const,
    invitation: (token: string) => ["workspace", "invitation", token] as const,
  },
  project: {
    all: ["project"] as const,
    lists: () => [...QUERY_KEYS.project.all, "list"] as const,
    list: (workspaceId: string) => ["project", "list", workspaceId] as const,
    listByWorkspaceSlug: (workspaceSlug: string) =>
      [...QUERY_KEYS.project.lists(), "workspace-slug", workspaceSlug] as const,
    detail: (id: string) => ["project", "detail", id] as const,
    detailBySlug: (projectSlug: string) => [...QUERY_KEYS.project.all, "detail", "slug", projectSlug] as const,
    workItems: (projectId: string) => [...QUERY_KEYS.project.detail(projectId), "work-items"] as const,
    workItemList: (projectId: string, filters?: object) =>
      [...QUERY_KEYS.project.workItems(projectId), "list", filters ?? {}] as const,
    myTasks: (projectId: string, assigneeUsername: string, filters?: object) =>
      [...QUERY_KEYS.project.workItems(projectId), "my-tasks", assigneeUsername, filters ?? {}] as const,
    workItemDetail: (projectId: string, itemId: string) =>
      [...QUERY_KEYS.project.workItems(projectId), "detail", itemId] as const,
    workItemChildren: (projectId: string, itemId: string) =>
      [...QUERY_KEYS.project.workItemDetail(projectId, itemId), "children"] as const,
    workItemComments: (projectId: string, itemId: string) =>
      [...QUERY_KEYS.project.workItemDetail(projectId, itemId), "comments"] as const,
    workItemCommentList: (projectId: string, itemId: string, filters?: object) =>
      [...QUERY_KEYS.project.workItemComments(projectId, itemId), "list", filters ?? {}] as const,
  },
} as const;
