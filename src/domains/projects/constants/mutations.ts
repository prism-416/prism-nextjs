export const PROJECT_MUTATION_KEYS = {
  workItems: {
    update: (projectId: string) => ["project", projectId, "work-items", "update"] as const,
    reorder: (projectId: string) => ["project", projectId, "work-items", "reorder"] as const,
    bulkDelete: (projectId: string) => ["project", projectId, "work-items", "bulk-delete"] as const,
    restore: (projectId: string) => ["project", projectId, "work-items", "restore"] as const,
    permanentDelete: (projectId: string) => ["project", projectId, "work-items", "permanent-delete"] as const,
    bulkRestore: (projectId: string) => ["project", projectId, "work-items", "bulk-restore"] as const,
    bulkPermanentDelete: (projectId: string) => ["project", projectId, "work-items", "bulk-permanent-delete"] as const,
  },
} as const;
