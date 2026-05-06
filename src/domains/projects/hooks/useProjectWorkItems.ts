"use client";

import { getProjectWorkItems } from "@/domains/projects/api";
import type { ProjectWorkItemSearchParams, ProjectWorkItemSearchResult } from "@/domains/projects/types";
import {
  getDefinedProjectWorkItemSearchParams,
  getEmptyProjectWorkItemSearchResult,
} from "@/domains/projects/utils/work-item";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";

export function useProjectWorkItems(
  projectId?: string,
  filters?: ProjectWorkItemSearchParams,
  initialData?: ProjectWorkItemSearchResult,
) {
  const searchParams = getDefinedProjectWorkItemSearchParams(filters);

  return useApiQuery<ProjectWorkItemSearchResult>({
    queryKey: QUERY_KEYS.project.workItemList(projectId ?? MISSING_PROJECT_ID, searchParams),
    queryFn: () =>
      projectId
        ? getProjectWorkItems(projectId, searchParams)
        : Promise.resolve(getEmptyProjectWorkItemSearchResult(searchParams)),
    enabled: Boolean(projectId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
