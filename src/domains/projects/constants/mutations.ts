export const PROJECT_MUTATION_KEYS = {
  workItems: {
    update: (projectId: string) => ["project", projectId, "work-items", "update"] as const,
    reorder: (projectId: string) => ["project", projectId, "work-items", "reorder"] as const,
  },
} as const;
