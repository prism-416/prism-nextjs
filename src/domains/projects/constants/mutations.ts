export const PROJECT_MUTATION_KEYS = {
  workItems: {
    reorder: (projectId: string) => ["project", projectId, "work-items", "reorder"] as const,
  },
} as const;
