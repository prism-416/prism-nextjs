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
  },
  project: {
    all: ["project"] as const,
    lists: () => [...QUERY_KEYS.project.all, "list"] as const,
    list: (workspaceId: string) => ["project", "list", workspaceId] as const,
    listByWorkspaceSlug: (workspaceSlug: string) =>
      [...QUERY_KEYS.project.lists(), "workspace-slug", workspaceSlug] as const,
    detail: (id: string) => ["project", "detail", id] as const,
    detailByWorkspaceSlug: (workspaceSlug: string, projectSlug: string) =>
      [...QUERY_KEYS.project.all, "detail", "workspace-slug", workspaceSlug, projectSlug] as const,
    members: (id: string) => [...QUERY_KEYS.project.detail(id), "members"] as const,
    assignableMembers: (workspaceId: string) => [...QUERY_KEYS.project.all, "assignable-members", workspaceId] as const,
    workspaceJobs: (workspaceId: string) => [...QUERY_KEYS.project.all, "workspace-jobs", workspaceId] as const,
  },
} as const;
