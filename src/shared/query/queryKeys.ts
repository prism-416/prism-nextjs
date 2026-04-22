/**
 * Centralized Query Key Factory
 *
 * Usage:
 * - QUERY_KEYS.user.detail()
 * - QUERY_KEYS.product.list({ category: 'something' })
 */

export const QUERY_KEYS = {
  workspace: {
    all: ["workspace"] as const,
    list: () => ["workspace", "list"] as const,
    detail: (id: string) => ["workspace", "detail", id] as const,
    members: (id: string) => ["workspace", "members", id] as const,
  },
  project: {
    all: ["project"] as const,
    list: (workspaceId: string) => ["project", "list", workspaceId] as const,
    detail: (id: string) => ["project", "detail", id] as const,
  },
} as const;
