"use client";

import { getProjectMembers } from "@/domains/projects/api";
import type { ProjectMemberListItem } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_PROJECT_ID = "__missing_project_id__";

export function useProjectMembers(projectId?: string, initialData?: ProjectMemberListItem[]) {
  return useApiQuery<ProjectMemberListItem[]>({
    queryKey: QUERY_KEYS.project.members(projectId ?? MISSING_PROJECT_ID),
    queryFn: () => (projectId ? getProjectMembers(projectId) : Promise.resolve([])),
    enabled: Boolean(projectId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
