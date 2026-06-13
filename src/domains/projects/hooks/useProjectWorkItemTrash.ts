"use client";

import { getTrashedProjectWorkItems } from "@/domains/projects/api";
import type { TrashedProjectWorkItemSearchResult } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";

export function useProjectWorkItemTrash(projectId?: string, initialData?: TrashedProjectWorkItemSearchResult) {
  const enabled = Boolean(projectId);

  return useApiQuery<TrashedProjectWorkItemSearchResult>({
    queryKey: QUERY_KEYS.project.workItemTrash(projectId ?? MISSING_PROJECT_ID),
    queryFn: () => (projectId ? getTrashedProjectWorkItems(projectId) : Promise.resolve({ items: [] })),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 60 * 1000,
  });
}
