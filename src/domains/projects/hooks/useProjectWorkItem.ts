"use client";

import { getProjectWorkItem } from "@/domains/projects/api";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";
const MISSING_WORK_ITEM_ID = "__missing_work_item_id__";

export function useProjectWorkItem(projectId?: string, itemId?: string, initialData?: ProjectWorkItem) {
  const enabled = Boolean(projectId && itemId);

  return useApiQuery<ProjectWorkItem | undefined>({
    queryKey: QUERY_KEYS.project.workItemDetail(projectId ?? MISSING_PROJECT_ID, itemId ?? MISSING_WORK_ITEM_ID),
    queryFn: () =>
      enabled && projectId && itemId ? getProjectWorkItem(projectId, itemId) : Promise.resolve(undefined),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
