"use client";

import { getWorkspaceSprints } from "@/domains/sprints/api";
import type { Sprint } from "@/domains/sprints/types";
import { QUERY_KEYS, useApiQuery } from "@/shared/query";

const MISSING_WORKSPACE_ID = "__missing_workspace_id__";

export function useWorkspaceSprints(workspaceId?: string, initialData?: Sprint[]) {
  return useApiQuery<Sprint[]>({
    queryKey: QUERY_KEYS.workspace.sprints(workspaceId ?? MISSING_WORKSPACE_ID),
    queryFn: () => (workspaceId ? getWorkspaceSprints(workspaceId) : Promise.resolve([])),
    enabled: Boolean(workspaceId),
    initialData: initialData ?? undefined,
    staleTime: 5 * 60 * 1000,
  });
}
