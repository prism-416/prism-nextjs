"use client";

import { getProjectWorkItemChildren } from "@/domains/projects/api";
import type { ProjectWorkItem } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";
const MISSING_WORK_ITEM_ID = "__missing_work_item_id__";

export function useProjectWorkItemChildren(projectId?: string, itemId?: string, initialData?: ProjectWorkItem[]) {
  const enabled = Boolean(projectId && itemId);

  return useApiQuery<ProjectWorkItem[]>({
    queryKey: QUERY_KEYS.project.workItemChildren(projectId ?? MISSING_PROJECT_ID, itemId ?? MISSING_WORK_ITEM_ID),
    queryFn: () =>
      enabled && projectId && itemId ? getProjectWorkItemChildren(projectId, itemId) : Promise.resolve([]),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
