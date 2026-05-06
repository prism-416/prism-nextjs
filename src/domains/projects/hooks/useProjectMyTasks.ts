"use client";

import { getProjectWorkItems } from "@/domains/projects/api";
import type { ProjectWorkItemSearchParams, ProjectWorkItemSearchResult } from "@/domains/projects/types";
import {
  getDefinedProjectWorkItemSearchParams,
  getEmptyProjectWorkItemSearchResult,
} from "@/domains/projects/utils/work-item";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";
const MISSING_USERNAME = "__missing_username__";

type ProjectMyTasksSearchParams = Omit<ProjectWorkItemSearchParams, "assigneeUsername" | "type">;

export function useProjectMyTasks(
  projectId?: string,
  assigneeUsername?: string,
  filters?: ProjectMyTasksSearchParams,
  initialData?: ProjectWorkItemSearchResult,
) {
  const searchParams = getDefinedProjectWorkItemSearchParams({
    ...filters,
    type: "task",
    assigneeUsername,
  });
  const enabled = Boolean(projectId && assigneeUsername);

  return useApiQuery<ProjectWorkItemSearchResult>({
    queryKey: QUERY_KEYS.project.myTasks(
      projectId ?? MISSING_PROJECT_ID,
      assigneeUsername ?? MISSING_USERNAME,
      searchParams,
    ),
    queryFn: () =>
      enabled && projectId
        ? getProjectWorkItems(projectId, searchParams)
        : Promise.resolve(getEmptyProjectWorkItemSearchResult(searchParams)),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
