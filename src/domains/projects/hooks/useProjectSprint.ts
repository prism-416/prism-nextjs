"use client";

import { getProjectSprint } from "@/domains/projects/api";
import type { ProjectSprint } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";
const MISSING_SPRINT_ID = "__missing_sprint_id__";

export function useProjectSprint(projectId?: string, sprintId?: string, initialData?: ProjectSprint) {
  const enabled = Boolean(projectId && sprintId);

  return useApiQuery<ProjectSprint | undefined>({
    queryKey: QUERY_KEYS.project.sprintDetail(projectId ?? MISSING_PROJECT_ID, sprintId ?? MISSING_SPRINT_ID),
    queryFn: () =>
      enabled && projectId && sprintId ? getProjectSprint(projectId, sprintId) : Promise.resolve(undefined),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
