"use client";

import { getProjectAssignableMembers } from "@/domains/projects/api";
import type { ProjectAssignableMember } from "@/domains/projects/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_WORKSPACE_ID = "__missing_workspace__";

export function useProjectAssignableMembers(workspaceId?: string, initialData?: ProjectAssignableMember[]) {
  return useApiQuery<ProjectAssignableMember[]>({
    queryKey: QUERY_KEYS.project.assignableMembers(workspaceId ?? MISSING_WORKSPACE_ID),
    queryFn: () => (workspaceId ? getProjectAssignableMembers(workspaceId) : Promise.resolve([])),
    enabled: Boolean(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
