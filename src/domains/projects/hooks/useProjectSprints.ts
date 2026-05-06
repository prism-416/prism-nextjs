"use client";

import { getProjectSprints } from "@/domains/projects/api";
import type { ProjectSprint } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";

export function useProjectSprints(projectId?: string, initialData?: ProjectSprint[]) {
  return useApiQuery<ProjectSprint[]>({
    queryKey: QUERY_KEYS.project.sprints(projectId ?? MISSING_PROJECT_ID),
    queryFn: () => (projectId ? getProjectSprints(projectId) : Promise.resolve([])),
    enabled: Boolean(projectId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
