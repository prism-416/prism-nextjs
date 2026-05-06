"use client";

import { getProjectSprintWorkItems } from "@/domains/projects/api";
import type { ProjectWorkItemSearchParams, ProjectWorkItemSearchResult } from "@/domains/projects/types";
import {
  getDefinedProjectWorkItemSearchParams,
  getEmptyProjectWorkItemSearchResult,
} from "@/domains/projects/utils/work-item";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";
const MISSING_SPRINT_ID = "__missing_sprint_id__";

export function useProjectSprintWorkItems(
  projectId?: string,
  sprintId?: string,
  filters?: ProjectWorkItemSearchParams,
  initialData?: ProjectWorkItemSearchResult,
) {
  const searchParams = getDefinedProjectWorkItemSearchParams(filters);
  const enabled = Boolean(projectId && sprintId);

  return useApiQuery<ProjectWorkItemSearchResult>({
    queryKey: QUERY_KEYS.project.sprintWorkItems(
      projectId ?? MISSING_PROJECT_ID,
      sprintId ?? MISSING_SPRINT_ID,
      searchParams,
    ),
    queryFn: () =>
      enabled && projectId && sprintId
        ? getProjectSprintWorkItems(projectId, sprintId, searchParams)
        : Promise.resolve(getEmptyProjectWorkItemSearchResult(searchParams)),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
