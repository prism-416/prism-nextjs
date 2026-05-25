"use client";

import { getWorkspaceSprint } from "@/domains/sprints/api";
import type { Sprint } from "@/domains/sprints/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_WORKSPACE_ID = "__missing_workspace_id__";
const MISSING_SPRINT_ID = "__missing_sprint_id__";

export function useWorkspaceSprint(workspaceId?: string, sprintId?: string, initialData?: Sprint) {
  const enabled = Boolean(workspaceId && sprintId);

  return useApiQuery<Sprint | undefined>({
    queryKey: QUERY_KEYS.workspace.sprintDetail(workspaceId ?? MISSING_WORKSPACE_ID, sprintId ?? MISSING_SPRINT_ID),
    queryFn: () =>
      enabled && workspaceId && sprintId ? getWorkspaceSprint(workspaceId, sprintId) : Promise.resolve(undefined),
    enabled,
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
